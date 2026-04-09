const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://your-render-app.onrender.com";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function authFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

export const get = (endpoint) => authFetch(endpoint, { method: "GET" });
export const post = (endpoint, body) =>
  authFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
export const put = (endpoint, body) =>
  authFetch(endpoint, { method: "PUT", body: JSON.stringify(body) });
export const del = (endpoint) => authFetch(endpoint, { method: "DELETE" });

export { BASE_URL };
