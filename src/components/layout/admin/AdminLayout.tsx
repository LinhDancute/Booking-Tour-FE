"use client";
import { Outlet } from "react-router-dom";
import Sidebar from "./SideBar";
// import "./AdminLayout.scss";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
      {/* Sidebar cố định */}
      <aside className="w-64 border-r border-gray-800 bg-[var(--background-secondary)]">
        <Sidebar />
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

