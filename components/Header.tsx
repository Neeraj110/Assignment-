"use client";

import RoleToggle from "./RoleToggle";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex justify-between items-center px-8 z-40">
      {/* Left: Search + Role Toggle */}
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            className="w-full bg-slate-50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 outline-none"
            placeholder="Search transactions, tags, or vendors..."
            type="text"
            readOnly
          />
        </div>
        <RoleToggle />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-[#3525cd] transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 text-slate-500 hover:text-[#3525cd] transition-colors">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
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
