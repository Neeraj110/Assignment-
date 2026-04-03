"use client";

import clsx from "clsx";

interface SummaryCardProps {
  title: string;
  amount: string;
  percentageChange: string;
  isHero?: boolean;
  icon?: string;
  iconBgClass?: string;
  iconColorClass?: string;
  percentagePos?: boolean;
}

export default function SummaryCard({
  title,
  amount,
  percentageChange,
  isHero = false,
  icon,
  iconBgClass,
  iconColorClass,
  percentagePos = true,
}: SummaryCardProps) {
  if (isHero) {
    return (
      <div className="col-span-12 lg:col-span-4 balance-gradient p-8 rounded-xl editorial-shadow text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="font-label text-label-sm uppercase tracking-widest opacity-80 mb-4">
            {title}
          </p>
          <h3 className="font-headline text-[3rem] font-bold leading-none mb-6">
            {amount}
          </h3>
          <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <span className="material-symbols-outlined text-xs">
              {percentagePos ? "trending_up" : "trending_down"}
            </span>
            <span className="text-xs font-semibold">
              {percentageChange} vs last month
            </span>
          </div>
        </div>
        {/* Abstract Texture */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="col-span-6 lg:col-span-4 bg-white p-8 rounded-xl editorial-shadow group hover:bg-[#faf8ff] transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div
          className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            iconBgClass,
            iconColorClass
          )}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span
          className={clsx(
            "font-semibold text-sm",
            percentagePos ? "text-green-600" : "text-red-600"
          )}
        >
          {percentageChange}
        </span>
      </div>
      <p className="font-label text-label-sm uppercase tracking-widest text-slate-500 mb-1">
        {title}
      </p>
      <h3 className="font-headline text-headline-md font-bold text-[#131b2e]">
        {amount}
      </h3>
    </div>
  );
}
