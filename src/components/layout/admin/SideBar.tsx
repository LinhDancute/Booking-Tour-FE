import { Link, NavLink } from "react-router-dom";
// import "./SideBar.scss";
import {
  BaggageClaim,
  LayoutDashboard,
  User,
  Map,
  Calendar,
  ChartNoAxesColumn,
  CircleUserRound,
  LogOut,
} from "lucide-react";

export default function SideBar() {
  const navigation = [
    {
      name: "overview",
      href: "/admin/overview",
      icon: <LayoutDashboard size={20} />,
      title: "Tổng quan",
    },
    {
      name: "users",
      href: "/admin/managementUsers",
      icon: <User size={20} />,
      title: "Quản lí người dùng",
    },
    {
      name: "tours",
      href: "/admin/managementTours",
      icon: <Map size={20} />,
      title: "Quản lí tour",
    },
    {
      name: "bookings",
      href: "/admin/managementBookings",
      icon: <Calendar size={20} />,
      title: "Quản lí đặt chỗ",
    },
    {
      name: "reports",
      href: "/admin/managementReports",
      icon: <ChartNoAxesColumn size={20} />,
      title: "Thống kê",
    },
  ];

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 h-20">
        <div className="flex items-center gap-3">
          <BaggageClaim className="h-7 w-7 text-[var(--accent)]" />
          <span className="text-2xl font-semibold tracking-wide">
            Tour<span className="text-[var(--accent)]">Admin</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
              ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-md"
                  : "text-[var(--text-muted)] hover:bg-gray-800 hover:text-[var(--accent-hover)]"
              }`
            }
          >
            {item.icon}
            <span className="capitalize">{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 h-20 flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <CircleUserRound
            size={40}
            color="#60a5fa"
            strokeWidth={1.75}
            className="p-1 bg-gray-800 rounded-full"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-medium text-[var(--text-primary)]">
              Admin user
            </span>
            <span className="text-xs text-[var(--text-muted)]">admin</span>
          </div>
        </div>

        <Link to={"/login"}>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <LogOut className="h-5 w-5 text-[var(--text-muted)] hover:text-[var(--accent-hover)]" />
          </button>
        </Link>
      </div>
    </div>
  );
}
