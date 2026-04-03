"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useFinanceStore } from "../store/financeStore";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Analytics", href: "/insights", icon: "insights" },
  // { name: "Portfolio", href: "#", icon: "account_balance_wallet" },
  { name: "Transactions", href: "/transactions", icon: "receipt_long" },
  // { name: "Settings", href: "#", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useFinanceStore();

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={clsx(
        "fixed left-0 top-0 h-screen w-64 bg-slate-50 dark:bg-[#0b1120] flex flex-col p-6 border-r border-slate-100 dark:border-slate-800 z-50 transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl editorial-gradient flex items-center justify-center text-white">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 tracking-tighter font-headline">
              Indigo Ledger
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              The Precision Curator
            </p>
          </div>
        </div>
        <button 
          className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
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
                  ? "bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 rounded-xl shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-300"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <button className="w-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5] hover:to-[#5c54e5] text-white font-headline font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#3525cd]/20 transition-all active:scale-95 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Report
        </button>
      </div>
    </aside>
    </>
  );
}
