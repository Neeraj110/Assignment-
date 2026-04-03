"use client";

import { useFinanceStore } from "../../store/financeStore";
import { useState, useMemo } from "react";
import clsx from "clsx";
import AddTransactionModal from "../../components/AddTransactionModal";

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    transactions,
    role,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterCategory,
    setFilterCategory,
    sortOrder,
    setSortOrder,
    deleteTransaction,
  } = useFinanceStore();

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return ["all", ...Array.from(cats)];
  }, [transactions]);

  // Derived: filter + sort
  const filtered = useMemo(() => {
    let result = transactions;

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortOrder) {
        case "oldest":
          return a.id.localeCompare(b.id);
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        default: // newest
          return b.id.localeCompare(a.id);
      }
    });

    return result;
  }, [transactions, search, filterType, filterCategory, sortOrder]);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 md:mb-12">
        <div>
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-[#131b2e] dark:text-slate-100 leading-none mb-2">
            Transactions
          </h2>
          <p className="text-slate-500">
            Managing {transactions.length} entries across 4 active accounts
          </p>
        </div>

        {/* Admin-only actions */}
        {role === "admin" ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="w-full sm:w-auto bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-[#131b2e] dark:text-slate-100 font-headline font-semibold py-3 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">file_download</span>
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-[#3525cd] to-[#4f46e5] text-white font-headline font-bold py-3 px-6 md:px-8 rounded-xl shadow-lg shadow-[#3525cd]/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        ) : (
          <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
            Read-Only Access
          </span>
        )}
      </div>

      {/* Filters and Summary */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 mb-8">
        {/* Filter Bar */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-[#0b1120] p-4 md:p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Search
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Vendors, categories..."
                className="w-full bg-[#f2f3ff] dark:bg-slate-900 border-none rounded-lg text-sm font-medium py-2 pl-9 pr-3 outline-none focus:ring-[#3525cd]/20 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] sm:min-w-[160px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#f2f3ff] dark:bg-slate-900 border-none rounded-lg text-sm font-medium focus:ring-[#3525cd]/20 py-2 outline-none cursor-pointer dark:text-slate-100"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] sm:min-w-[150px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Type
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() =>
                  setFilterType(filterType === "income" ? "all" : "income")
                }
                className={clsx(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  filterType === "income"
                    ? "bg-[#e2dfff] text-[#3323cc]"
                    : "bg-[#f2f3ff] dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                Income
              </button>
              <button
                onClick={() =>
                  setFilterType(filterType === "expense" ? "all" : "expense")
                }
                className={clsx(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  filterType === "expense"
                    ? "bg-[#e2dfff] text-[#3323cc]"
                    : "bg-[#f2f3ff] dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                )}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] sm:min-w-[150px]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sort By
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-[#f2f3ff] dark:bg-slate-900 dark:text-slate-100 border-none rounded-lg text-sm font-medium focus:ring-[#3525cd]/20 py-2 outline-none cursor-pointer"
            >
              <option value="newest">Date: Newest</option>
              <option value="oldest">Date: Oldest</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="amount-low">Amount: Low to High</option>
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-12 lg:col-span-4 glass-card dark:bg-slate-900/80 p-6 rounded-xl border border-white/50 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
              Monthly Burn
            </span>
            <span className="text-[#006e4b] font-bold text-xs bg-[#006e4b]/10 px-2 py-0.5 rounded-full">
              -12.5%
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-headline font-bold text-[#3525cd]">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Average daily expense: ${Math.round(totalExpenses / 30).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-[#0b1120] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#f2f3ff]/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Date
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Vendor &amp; Category
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Type
                </th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">
                  Amount
                </th>
                {role === "admin" && <th className="px-8 py-5"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-[#131b2e] dark:text-slate-200">
                        {t.date}
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">
                        {t.time}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={clsx(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            t.iconBg,
                            t.iconColor
                          )}
                        >
                          <span className="material-symbols-outlined">
                            {t.icon}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#131b2e] dark:text-slate-100">
                            {t.merchant}
                          </span>
                          <p className="text-xs text-slate-500 font-medium">
                            {t.subcategory}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={clsx(
                          "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                          t.type === "expense"
                            ? "bg-[#ffdad6]/20 text-[#ba1a1a]"
                            : "bg-[#006e4b]/10 text-[#005338]"
                        )}
                      >
                        {t.type === "expense" ? "Expense" : "Income"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className={clsx(
                          "text-sm font-bold",
                          t.type === "expense"
                            ? "text-[#ba1a1a]"
                            : "text-[#006e4b]"
                        )}
                      >
                        {t.type === "expense" ? "-" : "+"}$
                        {t.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 text-slate-400 hover:text-[#ba1a1a] transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "admin" ? 5 : 4}
                    className="px-8 py-16 text-center"
                  >
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                      search_off
                    </span>
                    <p className="text-slate-500 text-sm">
                      No transactions found matching your filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-8 py-6 bg-[#f2f3ff]/30 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Showing {filtered.length} of {transactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3525cd] text-white font-bold text-xs">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition-colors font-bold text-xs">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
