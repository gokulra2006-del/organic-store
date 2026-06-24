import React from "react";
import { Activity, User } from "lucide-react";

export default function AdminActivity() {
  const logs = [
    { time: "Just now", action: "Assigned RIDER-01 to order #1024", type: "system", user: "Gokul R." },
    { time: "10 mins ago", action: "Approved review #12 by Priya N.", type: "review", user: "Gokul R." },
    { time: "1 hour ago", action: "Updated stock for Organic Honey to 4 items", type: "catalog", user: "David Miller" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Activity Log</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Audit trail for store configurations and operations.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
        {logs.map((log, i) => (
          <div key={i} className="p-4 flex items-start gap-4 hover:bg-stone-50/45 transition">
            <span className="h-9 w-9 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 shrink-0">
              <Activity size={16} />
            </span>
            <div className="space-y-1">
              <p className="text-xs font-black text-stone-850">{log.action}</p>
              <div className="flex items-center gap-3 text-[10px] text-stone-400 font-bold">
                <span className="flex items-center gap-1">
                  <User size={10} />
                  <span>By: {log.user}</span>
                </span>
                <span>•</span>
                <span>{log.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
