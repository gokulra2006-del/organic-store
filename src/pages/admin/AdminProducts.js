import React, { useState } from "react";
import { products as initialProducts } from "../../data/products";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

export default function AdminProducts() {
  const [products] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900">Product management</h2>
          <p className="text-xs font-medium text-stone-500 mt-1">Manage catalog listings and current stock levels.</p>
        </div>
        <button
          onClick={() => alert("Add product feature coming soon!")}
          className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add product</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-sm">
        <Search size={18} className="absolute left-4 text-stone-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name..."
          className="w-full h-11 bg-transparent pl-12 pr-4 text-xs font-bold text-stone-800 outline-none placeholder:text-stone-400"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50 text-[10px] font-black uppercase text-stone-400 tracking-wider">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-xs font-bold text-stone-700">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50/40">
                <td className="px-6 py-4 flex items-center gap-3">
                  <span className="text-xl">{product.emoji || "📦"}</span>
                  <div>
                    <p className="font-extrabold text-stone-900">{product.name}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">ID: {product.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize text-stone-500">{product.category}</td>
                <td className="px-6 py-4 text-stone-900">${product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                    product.stock > 10 ? "bg-emerald-50 text-emerald-700" :
                    product.stock > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  }`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => alert(`Edit feature for: ${product.name}`)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 hover:border-emerald-200 text-stone-500 hover:text-[#153d2b] transition"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => alert(`Delete feature for: ${product.name}`)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 hover:border-red-200 text-stone-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
