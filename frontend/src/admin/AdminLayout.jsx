import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, BookOpen, Package, Tags } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/books", label: "Books", icon: BookOpen },
  { to: "/admin/orders", label: "Orders", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
];

const AdminLayout = () => (
  <div className="page-container grid gap-8 py-8 md:grid-cols-[220px_1fr]">
    <aside>
      <p className="mb-3 font-serif text-lg font-semibold text-ink">Admin panel</p>
      <nav className="card flex flex-col gap-0.5 p-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium ${
                isActive ? "bg-ink text-paper" : "text-ink hover:bg-paper"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
    <div>
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
