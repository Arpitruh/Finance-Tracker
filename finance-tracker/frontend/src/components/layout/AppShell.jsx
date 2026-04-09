import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./MobileNav";
import { clearAuth, getUser } from "../../services/api";

function AppShell({ title, children }) {
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []);
  const [desktopCollapsed, setDesktopCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "1"
  );

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const handleMenuToggle = () => {
    if (window.innerWidth < 768) return;
    setDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarCollapsed", next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="app-shell">
      <Topbar
        title={title}
        userName={user?.name}
        onToggleMobile={handleMenuToggle}
        menuOpen={desktopCollapsed}
        onLogout={handleLogout}
      />
      <div className="shell-content">
        <Sidebar collapsed={desktopCollapsed} />
        <main className="page">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

export default AppShell;
