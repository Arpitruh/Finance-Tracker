import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  List,
} from "lucide-react";

const mainItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/budget", label: "Budget", icon: Target },
];

function Sidebar({ collapsed }) {
  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        data-tooltip={item.label}
      >
        <span className="nav-icon"><Icon size={18} /></span>
        <span className="nav-label">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
    >
      <p className="sidebar-section">MAIN</p>
      {mainItems.map(renderNavItem)}

      {collapsed ? (
        <NavLink
          to="/transactions"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          data-tooltip="History"
        >
          <span className="nav-icon"><List size={18} /></span>
          <span className="nav-label">History</span>
        </NavLink>
      ) : (
        <div className="sidebar-group" data-tooltip="Transactions">
          <button className="nav-link nav-group-btn" type="button">
            <span className="nav-icon"><List size={18} /></span>
            <span className="nav-label">Transactions</span>
            <span className="nav-caret"><ChevronDown size={14} /></span>
          </button>
          <div className="sidebar-submenu">
            <NavLink
              to="/transactions"
              className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-label">History</span>
            </NavLink>
          </div>
        </div>
      )}

    </aside>
  );
}

export default Sidebar;
