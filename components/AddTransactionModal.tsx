"use client";

import { useState } from "react";
import { useFinanceStore } from "../store/financeStore";

const iconOptions = [
  { value: "cloud", label: "Cloud", bg: "bg-indigo-50", color: "text-indigo-600" },
  { value: "payments", label: "Payments", bg: "bg-emerald-50", color: "text-emerald-600" },
  { value: "work", label: "Work", bg: "bg-slate-100", color: "text-slate-600" },
  { value: "draw", label: "Design", bg: "bg-orange-50", color: "text-orange-600" },
  { value: "ads_click", label: "Marketing", bg: "bg-purple-50", color: "text-purple-600" },
  { value: "shopping_bag", label: "Shopping", bg: "bg-blue-50", color: "text-blue-600" },
  { value: "account_balance", label: "Banking", bg: "bg-emerald-50", color: "text-emerald-600" },
  { value: "home_work", label: "Housing", bg: "bg-amber-50", color: "text-amber-600" },
  { value: "restaurant", label: "Dining", bg: "bg-rose-50", color: "text-rose-600" },
];

const categoryOptions = [
  "Infrastructure",
  "Income",
  "Housing",
  "SaaS Subscriptions",
  "Marketing",
  "Electronics",
  "Food & Dining",
  "Leisure",
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
}: AddTransactionModalProps) {
  const addTransaction = useFinanceStore((state) => state.addTransaction);

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("Infrastructure");
  const [selectedIcon, setSelectedIcon] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const icon = iconOptions[selectedIcon];
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    addTransaction({
      merchant,
      category,
      subcategory: category,
      amount: parseFloat(amount),
      type,
      date: dateStr,
      time: timeStr,
      icon: icon.value,
      iconBg: icon.bg,
      iconColor: icon.color,
      status: "Success",
    });

    // Reset form
    setMerchant("");
    setAmount("");
    setType("expense");
    setCategory("Infrastructure");
    setSelectedIcon(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#131b2e]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in">
        {/* Header */}
        <div className="editorial-gradient px-8 py-6 text-white">
          <h3 className="font-headline text-xl font-bold">Add Transaction</h3>
          <p className="text-indigo-200 text-sm mt-1">
            Record a new financial entry
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Type Toggle */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Transaction Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  type === "expense"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : "bg-[#f2f3ff] text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  arrow_upward
                </span>
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  type === "income"
                    ? "bg-[#6ffbbe]/20 text-[#006e4b]"
                    : "bg-[#f2f3ff] text-slate-500 hover:bg-slate-200"
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  arrow_downward
                </span>
                Income
              </button>
            </div>
          </div>

          {/* Merchant */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Merchant / Description
            </label>
            <input
              type="text"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="e.g. Amazon Web Services"
              required
              className="w-full bg-[#f2f3ff] border-none rounded-xl text-sm font-medium py-3 px-4 outline-none focus:ring-2 focus:ring-[#3525cd]/20 placeholder:text-slate-400"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-[#f2f3ff] border-none rounded-xl text-sm font-medium py-3 pl-8 pr-4 outline-none focus:ring-2 focus:ring-[#3525cd]/20 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f2f3ff] border-none rounded-xl text-sm font-medium py-3 px-4 outline-none focus:ring-2 focus:ring-[#3525cd]/20 cursor-pointer"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {iconOptions.map((icon, i) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setSelectedIcon(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    selectedIcon === i
                      ? "ring-2 ring-[#3525cd] scale-110 " + icon.bg + " " + icon.color
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                  title={icon.label}
                >
                  <span className="material-symbols-outlined text-lg">
                    {icon.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-[#131b2e] font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl editorial-gradient text-white font-bold text-sm shadow-lg shadow-[#3525cd]/20 transition-transform active:scale-95"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
