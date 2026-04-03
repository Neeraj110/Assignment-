"use client";

import {
  useFinanceStore,
  getTotalIncome,
  getTotalExpense,
  getTotalBalance,
} from "../../store/financeStore";
import { BalanceChart, ExpenseDonutChart } from "../../components/Charts";

export default function Dashboard() {
  const transactions = useFinanceStore((state) => state.transactions);
  const role = useFinanceStore((state) => state.role);

  const totalBalance = getTotalBalance(transactions);
  const totalIncome = getTotalIncome(transactions);
  const totalExpense = getTotalExpense(transactions);

  const recentTransactions = transactions.slice(0, 3);

  return (
    <>
      {/* Page Header */}
      <header className="mb-12">
        <h2 className="font-headline text-4xl font-bold text-[#131b2e] leading-tight tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 mt-2">
          Welcome back, Curator. Here is your financial snapshot for October.
          {role === "viewer" && (
            <span className="ml-2 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
              View Only
            </span>
          )}
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total Balance */}
        <div className="editorial-gradient rounded-2xl p-8 text-white relative overflow-hidden ">
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Total Balance
            </p>
            <h3 className="font-headline text-[3rem] font-bold leading-none mb-6 text-[#131b2e]">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span className="text-xs font-semibold text-[#131b2e]">+12.5% vs last month</span>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl p-8 custom-shadow group hover:bg-[#faf8ff] transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-[#6ffbbe]/20 rounded-xl flex items-center justify-center text-[#006e4b]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[#006e4b] font-semibold text-sm">+8.2%</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Total Income
          </p>
          <h3 className="font-headline text-2xl font-bold text-[#131b2e]">
            ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-8 custom-shadow group hover:bg-[#faf8ff] transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-[#ffdad6] rounded-xl flex items-center justify-center text-[#ba1a1a]">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-[#ba1a1a] font-semibold text-sm">-3.1%</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Total Expenses
          </p>
          <h3 className="font-headline text-2xl font-bold text-[#131b2e]">
            ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Balance Trends */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl custom-shadow">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="font-headline text-xl font-bold text-[#131b2e]">
                Balance Trends
              </h4>
              <p className="text-sm text-slate-500">October 2023 Performance</p>
            </div>
            <select className="bg-[#f2f3ff] border-none rounded-lg text-xs font-semibold px-4 py-2 focus:ring-[#3525cd] text-slate-500 outline-none cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <BalanceChart />
        </div>

        {/* Spending Breakdown */}
        <div className="lg:col-span-4 bg-white p-8 rounded-2xl custom-shadow">
          <h4 className="font-headline text-xl font-bold text-[#131b2e] mb-2">
            Spending Breakdown
          </h4>
          <p className="text-sm text-slate-500 mb-8">
            Top categories this month
          </p>
          <div className="flex flex-col items-center">
            <ExpenseDonutChart />
            {/* Legend */}
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#3525cd]"></span>
                  <span className="text-sm font-medium text-slate-500">Housing</span>
                </div>
                <span className="text-sm font-bold text-[#131b2e]">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#4f46e5]"></span>
                  <span className="text-sm font-medium text-slate-500">Food &amp; Dining</span>
                </div>
                <span className="text-sm font-bold text-[#131b2e]">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#dae2fd]"></span>
                  <span className="text-sm font-medium text-slate-500">Leisure</span>
                </div>
                <span className="text-sm font-bold text-[#131b2e]">15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h4 className="font-headline text-xl font-bold text-[#131b2e]">Recent Activity</h4>
            <p className="text-sm text-slate-500">Your latest ledger updates</p>
          </div>
          <button className="text-[#3525cd] font-bold text-sm hover:underline">View All Records</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-white p-6 rounded-xl custom-shadow flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer group"
              >
                <div className={`w-12 h-12 ${t.iconBg} rounded-lg flex items-center justify-center group-hover:bg-[#e2dfff] transition-colors`}>
                  <span className={`material-symbols-outlined ${t.iconColor}`}>{t.icon}</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-[#131b2e]">{t.merchant}</h5>
                  <p className="text-xs text-slate-500">{t.category} • {t.time}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.type === "income" ? "text-[#006e4b]" : "text-[#ba1a1a]"}`}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === "Pending"
                    ? "bg-[#ffdad6] text-[#93000a]"
                    : "bg-[#6ffbbe]/20 text-[#006e4b]"
                    }`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-slate-500">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">receipt_long</span>
              No transactions yet.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
