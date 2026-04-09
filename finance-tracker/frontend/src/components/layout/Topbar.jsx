import { LogOut, Menu, Settings, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Topbar({
  title,
  userName,
  onToggleMobile,
  menuOpen,
  onLogout,
}) {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    const onEscape = (event) => {
      if (event.key === "Escape") setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEscape);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEscape);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const goTo = (path) => {
    navigate(path);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    onLogout();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className={`hamburger ${menuOpen ? "is-open" : ""}`}
          type="button"
          onClick={onToggleMobile}
          aria-label="Toggle desktop sidebar"
          aria-expanded={menuOpen ? "true" : "false"}
        >
          <Menu size={18} />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="profile-menu-wrap" ref={profileMenuRef}>
        <button
          className={`btn btn-ghost profile-menu-trigger ${profileMenuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setProfileMenuOpen((prev) => !prev)}
          aria-label="Open profile options"
          aria-expanded={profileMenuOpen ? "true" : "false"}
        >
          <UserCircle2 size={16} />
          <span>Profile</span>
        </button>

        {profileMenuOpen ? (
          <>
            <button
              type="button"
              className="profile-menu-backdrop"
              aria-label="Close profile options"
              onClick={() => setProfileMenuOpen(false)}
            />
            <div className={`profile-menu-panel ${isMobile ? "mobile-sheet" : "desktop-dropdown"}`}>
              {isMobile ? <p className="profile-menu-title">Account</p> : null}
              <button className="profile-menu-item" type="button" onClick={() => goTo("/profile")}>
                <UserCircle2 size={15} />
                <span>Profile</span>
              </button>
              <button className="profile-menu-item" type="button" onClick={() => goTo("/preferences")}>
                <Settings size={15} />
                <span>Preferences</span>
              </button>
              <button className="profile-menu-item danger" type="button" onClick={handleLogout}>
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}

export default Topbar;
