import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Target,
  List,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/income", label: "Income", icon: TrendingUp },
  { to: "/budget", label: "Budget", icon: Target },
  { to: "/transactions", label: "History", icon: List },
];

function MobileNav() {
  return (
    <nav className="mobile-nav">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;
