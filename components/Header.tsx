"use client";

import { useEffect } from "react";
import RoleToggle from "./RoleToggle";
import { useFinanceStore } from "../store/financeStore";

export default function Header() {
  const { theme, setTheme, toggleTheme, toggleSidebar } = useFinanceStore();

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("finance-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    window.localStorage.setItem("finance-theme", theme);
  }, [theme]);

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-16 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex justify-between items-center px-3 sm:px-4 md:px-8 z-40 transition-all">
      {/* Left: Search + Role Toggle */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-8 flex-1 min-w-0">
        <button onClick={toggleSidebar} className="md:hidden p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 placeholder:text-slate-400 outline-none transition-colors"
            placeholder="Search transactions, tags, or vendors..."
            type="text"
            readOnly
          />
        </div>
        <div className="hidden sm:block">
          <RoleToggle />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
        <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#3525cd] dark:hover:text-indigo-400 transition-colors">
          <span className="material-symbols-outlined">{theme === "dark" ? "light_mode" : "dark_mode"}</span>
        </button>
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#3525cd] dark:hover:text-indigo-400 transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#3525cd] dark:hover:text-indigo-400 transition-colors hidden sm:block">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2 hidden sm:block"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="User Profile Avatar"
          className="w-8 h-8 rounded-full border border-slate-200"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLtpo0NhMzQdx4kP4qji89CVt4HzS0a6wAxHX4-JJTKiA310v8GTddR6IfPKL9q32eyvBX6ZdpfDfuE1nSq_5XskOuYN3Hvj5qBQ2R3c3piyu5evuv5i3SVrXR9Bewmx6nBS7oE6bh-W1jHj7Nk4tt7y3Z-K1Yp510iDKmiT_BNHtGpan86Zcb_t-G5--VAs617uOT22FhOkdQqfITekClbJM4U4UC_EA2JckVO-PeMnpYz0Yj1PVe1BE4Yev_UdbCpcbY4vUWNgEe"
        />
      </div>
    </header>
  );
}
