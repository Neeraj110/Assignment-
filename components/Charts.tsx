"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const balanceData = [
  { name: "Oct 01", balance: 420000 },
  { name: "Oct 08", balance: 425000 },
  { name: "Oct 15", balance: 422000 },
  { name: "Oct 22", balance: 426000 },
  { name: "Oct 31", balance: 428940 },
];

export function BalanceChart() {
  return (
    <div className="h-64 relative mt-4 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={balanceData}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3525cd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Balance"]}
          />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: "#505f76", fontWeight: "bold" }}
            dy={10} 
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#3525cd"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorBalance)"
            activeDot={{ r: 6, fill: "#3525cd", stroke: "white", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const expenseData = [
  { name: "Housing", value: 45, color: "#3525cd" },
  { name: "Food & Dining", value: 25, color: "#4f46e5" },
  { name: "Leisure", value: 15, color: "#dae2fd" },
];

export function ExpenseDonutChart() {
  return (
    <div className="relative w-48 h-48 flex items-center justify-center mb-8 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            stroke="none"
            paddingAngle={0}
            dataKey="value"
          >
            {expenseData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
            formatter={(value: any) => [`${value}%`, "Share"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute text-center pointer-events-none">
        <span className="block font-headline text-2xl font-bold text-[#131b2e]">$12,890</span>
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total</span>
      </div>
    </div>
  );
}
