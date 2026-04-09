import { useState } from "react";
import AppShell from "../components/layout/AppShell";

function PreferencesPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState(true);
  const [compactDashboard, setCompactDashboard] = useState(true);
  const [message, setMessage] = useState("");

  const savePreferences = (event) => {
    event.preventDefault();
    setMessage("Preferences saved for this session");
  };

  return (
    <AppShell title="Preferences">
      <section className="surface">
        <h3>App Preferences</h3>
        <form onSubmit={savePreferences}>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />{" "}
              Enable email alerts
            </label>
          </div>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={monthlySummary}
                onChange={(e) => setMonthlySummary(e.target.checked)}
              />{" "}
              Receive monthly summary
            </label>
          </div>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={compactDashboard}
                onChange={(e) => setCompactDashboard(e.target.checked)}
              />{" "}
              Keep dashboard compact
            </label>
          </div>
          <div className="btn-row mtop">
            <button className="btn btn-primary" type="submit">Save Preferences</button>
          </div>
        </form>
        {message ? <p className="message success">{message}</p> : null}
      </section>
    </AppShell>
  );
}

export default PreferencesPage;
