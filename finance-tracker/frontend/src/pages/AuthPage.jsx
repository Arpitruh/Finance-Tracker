import { useEffect, useState } from "react";
import { ChartNoAxesColumn, Eye, EyeOff, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken, post, setToken, setUser } from "../services/api";

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (getToken()) navigate("/dashboard");
  }, [navigate]);

  const showMessage = (text, type = "") => {
    setMessage(text);
    setMessageType(type);
  };

  const onRegister = async (event) => {
    event.preventDefault();
    if (registerData.password.length < 6) {
      showMessage("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);
    showMessage("Creating account...");
    try {
      await post("/api/auth/register", registerData);
      showMessage("Account created. Please login.", "success");
      setRegisterData({ name: "", email: "", password: "" });
      setTab("login");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    showMessage("Signing in...");
    try {
      const result = await post("/api/auth/login", loginData);
      setToken(result.token);
      setUser(result.user);
      navigate("/dashboard");
    } catch (error) {
      showMessage(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-shell">
        <section className="auth-card">
          <div className="auth-header">
            <p className="auth-badge" aria-label="Personal Finance Tracker">
              <span className="auth-badge-desktop">Personal Finance Tracker</span>
              <span className="auth-badge-mobile" aria-hidden="true">
                <Wallet size={14} />
              </span>
            </p>
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Manage expenses, income and budgets in one place.</p>
            <div className="auth-highlights">
              <span className="auth-highlight-item">
                <ShieldCheck size={14} />
                Secure access
              </span>
              <span className="auth-highlight-item">
                <Wallet size={14} />
                Budget smart
              </span>
              <span className="auth-highlight-item">
                <ChartNoAxesColumn size={14} />
                Track growth
              </span>
            </div>
          </div>

          <div className="tabs">
            <button
              type="button"
              className={`tab-btn ${tab === "login" ? "active" : ""}`}
              onClick={() => setTab("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={`tab-btn ${tab === "register" ? "active" : ""}`}
              onClick={() => setTab("register")}
            >
              Register
            </button>
          </div>

          <form className={`form-grid ${tab !== "login" ? "hidden-auth-form" : ""}`} onSubmit={onLogin}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="password-wrap">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowLoginPassword((p) => !p)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <form className={`form-grid ${tab !== "register" ? "hidden-auth-form" : ""}`} onSubmit={onRegister}>
            <div className="field">
              <label>Name</label>
              <input
                type="text"
                required
                value={registerData.name}
                onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Password</label>
              <div className="password-wrap">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={registerData.password}
                  onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowRegisterPassword((p) => !p)}
                  aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                >
                  {showRegisterPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <small className="muted">Must be at least 6 characters.</small>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <small>Secure login with encrypted passwords and JWT sessions.</small>
          </div>
          <p className={`message ${messageType}`}>{message}</p>
        </section>

        <aside className="auth-visual">
          <div className="auth-visual-card">
            <p className="auth-visual-chip">Secure Access</p>
            <h2>Track your money with confidence.</h2>
            <p>All your financial activity in one private, protected dashboard.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default AuthPage;
