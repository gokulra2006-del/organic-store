import React from "react";
import { BookOpen, Leaf, Plus, Edit } from "lucide-react";

export default function AdminContent() {
  const contents = [
    { title: "Farm Fresh in 10 Minutes", location: "Homepage Hero Banner", type: "Active Banner", detail: "Updated 2h ago" },
    { title: "5 ways to make greens last", location: "Healthy Living Blog", type: "Lifestyle Tip", detail: "Published Jun 8" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900">Content manager</h2>
          <p className="text-xs font-medium text-stone-500 mt-1">Keep promotional campaigns and stories fresh.</p>
        </div>
        <button
          onClick={() => alert("New article editor opened")}
          className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer"
        >
          <Plus size={16} />
          <span>New article</span>
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {contents.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-800 tracking-wider">
                  {item.type}
                </span>
                <h4 className="text-sm font-black text-stone-850 mt-2">{item.title}</h4>
                <p className="text-[10px] text-stone-400 font-bold mt-1">{item.location} · {item.detail}</p>
              </div>
              <span className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400">
                {item.type === "Active Banner" ? <Leaf size={18} /> : <BookOpen size={18} />}
              </span>
            </div>

            <button
              onClick={() => alert(`Edit editor for: ${item.title}`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-250 hover:border-emerald-300 hover:bg-emerald-50 text-stone-700 hover:text-[#153d2b] text-[10px] font-black transition cursor-pointer"
            >
              <Edit size={12} />
              <span>Edit content</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
