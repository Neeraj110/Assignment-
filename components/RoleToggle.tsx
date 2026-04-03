"use client";

import { useFinanceStore } from "../store/financeStore";

export default function RoleToggle() {
  const role = useFinanceStore((state) => state.role);
  const setRole = useFinanceStore((state) => state.setRole);

  return (
    <nav className="flex gap-6 text-sm font-medium">
      <button
        onClick={() => setRole("admin")}
        className={`pb-1 transition-transform scale-95 active:opacity-80 ${
          role === "admin"
            ? "text-indigo-700 border-b-2 border-indigo-600"
            : "text-slate-500 hover:text-indigo-600"
        }`}
      >
        Admin
      </button>
      <button
        onClick={() => setRole("viewer")}
        className={`pb-1 transition-transform scale-95 active:opacity-80 ${
          role === "viewer"
            ? "text-indigo-700 border-b-2 border-indigo-600"
            : "text-slate-500 hover:text-indigo-600"
        }`}
      >
        Viewer
      </button>
    </nav>
  );
}
