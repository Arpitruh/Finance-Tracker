import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { getUser, put, setUser } from "../services/api";

function ProfilePage() {
  const user = useMemo(() => getUser(), []);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const saveProfile = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setUser({ ...(user || {}), name: trimmedName, email });
    setMessage("Profile updated locally");
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Confirm password does not match");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const result = await put("/api/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage(result.message || "Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <AppShell title="Profile">
      <section className="surface profile-compact-section">
        <h3>Profile Information</h3>
        <form className="form-grid profile-compact-grid" onSubmit={saveProfile}>
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={email} disabled />
          </div>
          <div className="btn-row profile-compact-actions">
            <button className="btn btn-primary" type="submit">Save Profile</button>
          </div>
        </form>
        {message ? <p className="message success">{message}</p> : null}
      </section>

      <section className="surface mtop profile-compact-section">
        <h3>Update Password</h3>
        <form className="form-grid profile-compact-grid" onSubmit={updatePassword}>
          <div className="field">
            <label>Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="field">
            <label>Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
          </div>
          <div className="btn-row profile-compact-actions">
            <button className="btn btn-primary" type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
        {passwordMessage ? <p className="message success">{passwordMessage}</p> : null}
        {passwordError ? <p className="message error">{passwordError}</p> : null}
      </section>
    </AppShell>
  );
}

export default ProfilePage;
