"use client";

import {
  useFinanceStore,
  getTotalIncome,
  getTotalExpense,
  getHighestSpendingCategory,
} from "../../store/financeStore";

export default function InsightsPage() {
  const transactions = useFinanceStore((state) => state.transactions);

  const totalIncome = getTotalIncome(transactions);
  const totalExpense = getTotalExpense(transactions);
  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : "0";
  const highest = getHighestSpendingCategory(transactions);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Editorial Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-[#131b2e] dark:text-slate-100 leading-tight tracking-tight mb-2 font-headline">
          Intelligent Summaries
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Your financial precision, curated for the month of October.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-4 md:gap-8">
        {/* Highest Spending Category */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#0b1120] rounded-[2rem] p-5 md:p-8 custom-shadow dark:shadow-none border border-transparent dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 md:mb-12">
              <div>
                <span className="text-[11px] font-bold text-[#3525cd] dark:text-indigo-400 uppercase tracking-widest mb-2 block">
                  Highest Spending Category
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#131b2e] dark:text-slate-100 font-headline">
                  {highest.name}
                </h2>
              </div>
              <div className="bg-[#e2dfff] text-[#3323cc] px-4 py-2 rounded-full text-xs font-bold">
                {highest.percentage}% OF TOTAL
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-8">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#131b2e] dark:text-slate-100 tracking-tighter font-headline break-words">
                ${highest.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[#006e4b] font-semibold flex items-center sm:mb-2">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-sm">12.5% increase</span>
              </div>
            </div>
          </div>
          {/* Bar Chart Visual */}
          <div className="grid grid-cols-4 gap-4 h-32 items-end">
            <div className="bg-indigo-50 h-[40%] rounded-xl"></div>
            <div className="bg-indigo-100 h-[65%] rounded-xl"></div>
            <div className="bg-indigo-200 h-[85%] rounded-xl"></div>
            <div className="bg-[#3525cd] h-full rounded-xl shadow-lg shadow-indigo-200/50"></div>
          </div>
        </div>

        {/* Monthly Comparison + Precision Insight */}
        <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-8">
          <div className="bg-white dark:bg-[#0b1120] border border-transparent dark:border-slate-800 rounded-[2rem] p-5 md:p-8 custom-shadow dark:shadow-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 block">
              Monthly Comparison
            </span>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 dark:text-slate-400">September</span>
                <span className="font-bold text-[#131b2e] dark:text-slate-100">$12,450</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full w-[70%] rounded-full"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#131b2e] dark:text-slate-100 font-semibold">October</span>
                <span className="font-bold text-[#3525cd] dark:text-indigo-400">
                  ${totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#3525cd] h-full w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#3525cd] to-[#4f46e5] rounded-[2rem] p-5 md:p-8 custom-shadow text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="material-symbols-outlined text-3xl mb-4 block">auto_awesome</span>
              <h3 className="text-xl font-bold mb-2 font-headline">Precision Insight</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Your savings rate is <strong>{savingsRate}%</strong> this month. You&apos;ve optimized spending on subscriptions.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-20">
              <span className="material-symbols-outlined text-[120px]">savings</span>
            </div>
          </div>
        </div>

        {/* Savings Trend */}
        <div className="col-span-12 bg-[#f2f3ff] dark:bg-slate-900 rounded-[2.5rem] p-6 lg:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 md:items-center">
          <div className="w-full md:w-1/3">
            <span className="text-[11px] font-bold text-[#005338] dark:text-emerald-400 uppercase tracking-widest mb-2 block">
              Savings Trend
            </span>
            <h2 className="text-3xl font-bold text-[#131b2e] dark:text-slate-100 mb-4 font-headline">Steady Ascent</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Your emergency fund is now 85% complete. At this rate, you&apos;ll reach your goal in 45 days.
            </p>
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-[#131b2e] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
              View Trajectory
            </button>
          </div>
          <div className="flex-1 w-full h-48 flex items-end gap-3 lg:gap-4 overflow-x-auto pb-4">
            {["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"].map((month, i) => {
              const heights = ["20%", "35%", "30%", "55%", "70%", "85%"];
              const isLast = i === 5;
              return (
                <div
                  key={month}
                  className={`flex-1 rounded-2xl relative group ${isLast ? "bg-[#3525cd] shadow-xl shadow-indigo-200" : "bg-white"
                    }`}
                  style={{ height: heights[i] }}
                >
                  <div
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isLast ? "text-[#3525cd]" : "text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      }`}
                  >
                    {month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Insight Cards */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0b1120] border border-transparent dark:border-slate-800 rounded-3xl p-5 md:p-8 custom-shadow dark:shadow-none flex flex-col md:flex-row items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-[#3525cd] dark:text-indigo-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Asset Density</div>
            <div className="text-xl font-bold text-[#131b2e] dark:text-slate-100">92.4% Liquid</div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0b1120] rounded-3xl p-5 md:p-8 custom-shadow dark:shadow-none flex flex-col md:flex-row items-center gap-6 border-2 border-[#3525cd]/5 dark:border-slate-800">
          <div className="h-14 w-14 rounded-2xl bg-[#006e4b]/10 text-[#005338] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_with_heart
            </span>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Financial Health</div>
            <div className="text-xl font-bold text-[#131b2e] dark:text-slate-100">Optimal Range</div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-[#0b1120] border border-transparent dark:border-slate-800 rounded-3xl p-5 md:p-8 custom-shadow dark:shadow-none flex flex-col md:flex-row items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-[#ffdad6]/10 text-[#ba1a1a] dark:text-rose-400 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div className="text-center md:text-left">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription Drift</div>
            <div className="text-xl font-bold text-[#131b2e] dark:text-slate-100">+$42.00 Unplanned</div>
          </div>
        </div>
      </div>

      {/* Categorical Drift Table */}
      <div className="mt-10 md:mt-16 bg-white dark:bg-[#0b1120] border border-transparent dark:border-slate-800 rounded-[2.5rem] p-5 md:p-10 custom-shadow dark:shadow-none">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h3 className="text-2xl font-bold text-[#131b2e] dark:text-slate-100 font-headline">Categorical Drift</h3>
          <button className="text-sm font-bold text-[#3525cd] dark:text-indigo-400 hover:text-[#4f46e5] transition-colors">
            Download Detailed CSV
          </button>
        </div>
        <div className="space-y-4 md:space-y-2">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group text-center md:text-left gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#3525cd]/10 group-hover:text-[#3525cd] transition-colors">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div>
                <div className="font-bold text-[#131b2e] dark:text-slate-100">Dining &amp; Social</div>
                <div className="text-xs text-slate-400">14 transactions</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="font-bold text-[#131b2e] dark:text-slate-100">$1,240.50</div>
              <div className="text-xs text-[#006e4b] dark:text-emerald-400 font-bold">-4.2% vs last month</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group text-center md:text-left gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#3525cd]/10 group-hover:text-[#3525cd] transition-colors">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <div>
                <div className="font-bold text-[#131b2e] dark:text-slate-100">Essentials &amp; Retail</div>
                <div className="text-xs text-slate-400">32 transactions</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="font-bold text-[#131b2e] dark:text-slate-100">$845.20</div>
              <div className="text-xs text-slate-400 font-bold">+1.2% vs last month</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group text-center md:text-left gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-[#3525cd]/10 group-hover:text-[#3525cd] transition-colors">
                <span className="material-symbols-outlined">home_work</span>
              </div>
              <div>
                <div className="font-bold text-[#131b2e] dark:text-slate-100">Mortgage &amp; Utilities</div>
                <div className="text-xs text-slate-400">4 transactions</div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="font-bold text-[#131b2e] dark:text-slate-100">$3,100.00</div>
              <div className="text-xs text-slate-400 font-bold">Stable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
