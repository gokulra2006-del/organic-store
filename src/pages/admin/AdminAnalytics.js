import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminAnalytics() {
  const data = [
    { name: "Mon", sales: 2400 },
    { name: "Tue", sales: 1398 },
    { name: "Wed", sales: 9800 },
    { name: "Thu", sales: 3908 },
    { name: "Fri", sales: 4800 },
    { name: "Sat", sales: 3800 },
    { name: "Sun", sales: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Analytics Dashboard</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Review shop metrics, revenue gains, and conversions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-stone-850">Weekly Sales Graph ($)</h3>
        <div className="h-[300px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#153d2b" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
