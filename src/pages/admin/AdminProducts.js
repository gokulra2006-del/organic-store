import React, { useState, useMemo } from "react";
import { products as initialProducts } from "../../data/products";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  X,
  TrendingUp,
  Tag,
  IndianRupee,
  Star
} from "lucide-react";

export default function AdminProducts() {
  // Initialize with initialProducts enriched with stock numbers
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("organic_admin_products");
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return initialProducts.map((p, idx) => ({
      ...p,
      stock: p.stock ?? [48, 85, 62, 34, 28, 95, 40, 52, 30, 45, 60, 75][idx % 12],
      inStock: p.inStock ?? true,
    }));
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [toast, setToast] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for add / edit
  const [formData, setFormData] = useState({
    name: "",
    category: "fruits",
    price: "",
    originalPrice: "",
    stock: "50",
    weight: "1 kg",
    image: "",
    description: "",
  });

  // Save changes to localStorage
  const saveProducts = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem("organic_admin_products", JSON.stringify(updated));
    } catch (e) {}
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const inStockCount = products.filter((p) => p.stock > 0).length;
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 15).length;
    const categoriesCount = new Set(products.map((p) => p.category)).size;
    return { total, inStockCount, lowStockCount, categoriesCount };
  }, [products]);

  // Categories list
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(products.map((p) => p.category.toLowerCase()))];
    return cats;
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        String(p.id).includes(search);
      const matchesCat =
        selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "inStock" && p.stock > 0) ||
        (stockFilter === "lowStock" && p.stock > 0 && p.stock < 15) ||
        (stockFilter === "outOfStock" && p.stock <= 0);
      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, search, selectedCategory, stockFilter]);

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      name: "",
      category: "fruits",
      price: "",
      originalPrice: "",
      stock: "50",
      weight: "1 kg",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
      description: "Organically grown and freshly harvested.",
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      originalPrice: String(product.originalPrice || product.price),
      stock: String(product.stock),
      weight: product.weight || "1 kg",
      image: product.image,
      description: product.description || "",
    });
  };

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Please provide product name and price");
      return;
    }

    const newProd = {
      id: Date.now(),
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      stock: Number(formData.stock) || 0,
      inStock: Number(formData.stock) > 0,
      weight: formData.weight || "1 unit",
      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 1,
      badge: "Fresh",
      description: formData.description,
      tags: ["organic", "fresh"],
    };

    saveProducts([newProd, ...products]);
    setIsAddModalOpen(false);
    showToast(`Added "${newProd.name}" successfully!`);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => {
      if (p.id === editingProduct.id) {
        return {
          ...p,
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice || formData.price),
          stock: Number(formData.stock) || 0,
          inStock: Number(formData.stock) > 0,
          weight: formData.weight,
          image: formData.image.trim() || p.image,
          description: formData.description,
        };
      }
      return p;
    });

    saveProducts(updated);
    setEditingProduct(null);
    showToast(`Updated "${formData.name}" successfully!`);
  };

  // Handle Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from store catalog?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      showToast(`Removed "${name}" from catalog.`, "info");
    }
  };

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-stone-900 px-5 py-3 text-xs font-bold text-white shadow-2xl animate-fade-in border border-stone-800">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-[#153d2b] border border-emerald-200/60">
              <Package size={20} strokeWidth={2.5} />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Product Management
              </h1>
              <p className="text-xs font-medium text-stone-500 mt-0.5">
                Manage your store catalog listings, stock quantities, and pricing.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-900 text-white rounded-xl px-5 py-3 text-xs font-extrabold shadow-md shadow-emerald-950/20 hover:-translate-y-0.5 transition cursor-pointer shrink-0"
        >
          <Plus size={16} strokeWidth={2.8} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Key Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">Total Catalog</span>
            <Package size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{metrics.total}</p>
          <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 size={12} /> Active store items
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">In Stock</span>
            <TrendingUp size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800">{metrics.inStockCount}</p>
          <p className="text-[11px] font-semibold text-stone-400 mt-1">Ready for 10-min dispatch</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">Categories</span>
            <Layers size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{metrics.categoriesCount}</p>
          <p className="text-[11px] font-semibold text-stone-400 mt-1">Fruits, Veggies, Pantry, Dairy</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">Low Stock</span>
            <AlertTriangle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900">{metrics.lowStockCount}</p>
          <p className="text-[11px] font-semibold text-amber-600 mt-1">
            {metrics.lowStockCount > 0 ? "Requires restock replenishment" : "Inventory levels healthy"}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, category, or ID..."
              className="w-full h-11 bg-stone-50 hover:bg-stone-100/70 focus:bg-white rounded-xl pl-11 pr-4 text-xs font-bold text-stone-800 border border-stone-200 focus:border-[#153d2b] outline-none transition placeholder:text-stone-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-11 px-3 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] cursor-pointer"
            >
              <option value="all">All Inventory Status</option>
              <option value="inStock">In Stock (&gt; 0)</option>
              <option value="lowStock">Low Stock (&lt; 15)</option>
              <option value="outOfStock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#153d2b] text-white shadow-xs"
                  : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-black uppercase text-stone-500 tracking-wider">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Pricing</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4 text-center">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs font-bold text-stone-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                    <Package size={36} className="mx-auto mb-2 text-stone-300" />
                    <p className="text-sm font-bold text-stone-600">No products found</p>
                    <p className="text-xs text-stone-400 mt-1">Try adjusting your search or category filters.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-emerald-50/20 transition-colors">
                    {/* Item Image & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop";
                          }}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-stone-900 text-sm">{product.name}</p>
                            {product.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-[#153d2b]">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-medium mt-0.5">
                            <span>ID: #{product.id}</span>
                            <span>•</span>
                            <span>{product.weight || "1 unit"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-bold capitalize">
                        <Tag size={12} className="text-stone-400" />
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-stone-900">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] line-through text-stone-400 font-semibold">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs border">
                        {product.stock > 15 ? (
                          <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            In Stock ({product.stock})
                          </span>
                        ) : product.stock > 0 ? (
                          <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 border-amber-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-800 bg-rose-50 border-rose-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs font-bold">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{product.rating || "4.8"}</span>
                        <span className="text-[10px] text-amber-700/70 font-semibold">
                          ({product.reviews || 24})
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          title="Edit product"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white hover:border-[#153d2b] hover:bg-emerald-50 text-stone-600 hover:text-[#153d2b] transition cursor-pointer"
                        >
                          <Edit2 size={13} strokeWidth={2.4} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          title="Delete product"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50 text-stone-600 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 size={13} strokeWidth={2.4} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 bg-stone-50/70 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> catalog items
          </span>
          <span className="text-[11px] text-stone-400 font-medium">All organic certified</span>
        </div>
      </div>

      {/* ── MODAL: ADD PRODUCT ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-[#153d2b]">
                  <Plus size={18} strokeWidth={2.5} />
                </span>
                <h3 className="text-lg font-black text-stone-900">Add New Product</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4 text-xs font-bold text-stone-700">
              <div>
                <label className="block mb-1 text-stone-600">Product Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Organic Kashmiri Apples"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-stone-600">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] font-bold"
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="pantry">Pantry & Staples</option>
                    <option value="dairy">Dairy & Fresh</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">Unit / Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg or 500 g"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-stone-600">Selling Price (₹) *</label>
                  <input
                    required
                    type="number"
                    placeholder="199"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="249"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">Stock Units *</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-stone-600">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1 text-stone-600">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short product overview and freshness details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#153d2b] hover:bg-emerald-900 text-white font-extrabold shadow-sm transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT PRODUCT ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-50 text-[#153d2b]">
                  <Edit2 size={18} strokeWidth={2.5} />
                </span>
                <h3 className="text-lg font-black text-stone-900">Edit Product #{editingProduct.id}</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4 text-xs font-bold text-stone-700">
              <div>
                <label className="block mb-1 text-stone-600">Product Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-stone-600">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] font-bold"
                  >
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="pantry">Pantry & Staples</option>
                    <option value="dairy">Dairy & Fresh</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">Unit / Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-stone-600">Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-stone-600">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-stone-600">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full h-11 px-3.5 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:border-[#153d2b] text-stone-900 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#153d2b] hover:bg-emerald-900 text-white font-extrabold shadow-sm transition"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
