"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Analytics", href: "/insights", icon: "insights" },
  // { name: "Portfolio", href: "#", icon: "account_balance_wallet" },
  { name: "Transactions", href: "/transactions", icon: "receipt_long" },
  // { name: "Settings", href: "#", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-50 flex flex-col p-6 border-r border-slate-100 z-50">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl editorial-gradient flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-700 tracking-tighter font-headline">
              Indigo Ledger
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              The Precision Curator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/" && item.name === "Dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 transition-all duration-200 active:scale-[0.98] font-['Manrope'] font-semibold tracking-tight",
                isActive
                  ? "bg-white text-indigo-700 rounded-xl shadow-sm"
                  : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="mt-auto pt-6 border-t border-slate-100">
        <button className="w-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5] text-white font-headline font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#3525cd]/20 transition-transform active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Report
        </button>
      </div>
    </aside>
  );
}
