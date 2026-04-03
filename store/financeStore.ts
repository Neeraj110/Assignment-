import { create } from "zustand";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  subcategory: string;
  amount: number;
  type: TransactionType;
  date: string;
  time: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  status: "Success" | "Pending";
}

type Role = "admin" | "viewer";
type SortOrder = "newest" | "oldest" | "amount-high" | "amount-low";

interface FinanceState {
  // Data
  transactions: Transaction[];
  role: Role;
  theme: "light" | "dark";

  // Navigation
  isSidebarOpen: boolean;

  // Filters
  search: string;
  filterType: "all" | "income" | "expense";
  filterCategory: string;
  sortOrder: SortOrder;

  // Actions
  setRole: (role: Role) => void;
  setSearch: (search: string) => void;
  setFilterType: (type: "all" | "income" | "expense") => void;
  setFilterCategory: (category: string) => void;
  setSortOrder: (order: SortOrder) => void;
  setTheme: (theme: "light" | "dark") => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

// Default transaction data
const defaultTransactions: Transaction[] = [
  {
    id: "t1",
    merchant: "Amazon Web Services",
    category: "Infrastructure",
    subcategory: "Infrastructure & Hosting",
    amount: 1240.5,
    type: "expense",
    date: "Oct 24, 2023",
    time: "14:32 PM",
    icon: "cloud",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    status: "Success",
  },
  {
    id: "t2",
    merchant: "Stripe Payout",
    category: "Income",
    subcategory: "Platform Revenue",
    amount: 12450.0,
    type: "income",
    date: "Oct 22, 2023",
    time: "09:15 AM",
    icon: "payments",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    status: "Success",
  },
  {
    id: "t3",
    merchant: "WeWork Global",
    category: "Housing",
    subcategory: "Office Rent",
    amount: 4200.0,
    type: "expense",
    date: "Oct 21, 2023",
    time: "18:45 PM",
    icon: "work",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    status: "Success",
  },
  {
    id: "t4",
    merchant: "Figma Inc.",
    category: "SaaS Subscriptions",
    subcategory: "Software Subscriptions",
    amount: 45.0,
    type: "expense",
    date: "Oct 20, 2023",
    time: "11:20 AM",
    icon: "draw",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    status: "Success",
  },
  {
    id: "t5",
    merchant: "Google Ads",
    category: "Marketing",
    subcategory: "Marketing & Growth",
    amount: 2800.0,
    type: "expense",
    date: "Oct 19, 2023",
    time: "15:00 PM",
    icon: "ads_click",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    status: "Success",
  },
  {
    id: "t6",
    merchant: "Apple Store Soho",
    category: "Electronics",
    subcategory: "Retail & Electronics",
    amount: 1299.0,
    type: "expense",
    date: "Oct 18, 2023",
    time: "16:22 PM",
    icon: "shopping_bag",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    status: "Pending",
  },
  {
    id: "t7",
    merchant: "Client Payment - Zenith Corp",
    category: "Income",
    subcategory: "Consulting Revenue",
    amount: 8500.0,
    type: "income",
    date: "Oct 16, 2023",
    time: "10:30 AM",
    icon: "account_balance",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    status: "Success",
  },
  {
    id: "t8",
    merchant: "Greenwich Rent",
    category: "Housing",
    subcategory: "Housing & Utilities",
    amount: 3200.0,
    type: "expense",
    date: "Oct 15, 2023",
    time: "08:00 AM",
    icon: "home_work",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    status: "Success",
  },
  {
    id: "t9",
    merchant: "Salary Deposit",
    category: "Income",
    subcategory: "Employment",
    amount: 12500.0,
    type: "income",
    date: "Oct 01, 2023",
    time: "09:00 AM",
    icon: "payments",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    status: "Success",
  },
];

// Helpers
export function getTotalIncome(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpense(transactions: Transaction[]) {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalBalance(transactions: Transaction[]) {
  return getTotalIncome(transactions) - getTotalExpense(transactions);
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  const catMap: Record<string, number> = {};
  expenses.forEach((t) => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  return Object.entries(catMap)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getHighestSpendingCategory(transactions: Transaction[]) {
  const breakdown = getCategoryBreakdown(transactions);
  return breakdown[0] || { name: "N/A", value: 0, percentage: 0 };
}

// Store
export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: defaultTransactions,
  role: "admin",
  theme: "light",
  isSidebarOpen: false,
  search: "",
  filterType: "all",
  filterCategory: "all",
  sortOrder: "newest",

  setRole: (role) => set({ role }),
  setSearch: (search) => set({ search }),
  setFilterType: (filterType) => set({ filterType }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => {
      const newTheme: "light" | "dark" =
        state.theme === "light" ? "dark" : "light";
      return { theme: newTheme };
    }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        { ...transaction, id: `t${Date.now()}` },
        ...state.transactions,
      ],
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));
