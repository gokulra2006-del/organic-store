import React, { useState } from "react";
import { BookOpen, Leaf, Plus, Edit, X, Trash2 } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export default function AdminContent() {
  const { contents, addContent, updateContent, deleteContent } = useContent();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState("Blog Story");
  const [formLocation, setFormLocation] = useState("");
  const [formTag, setFormTag] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formImage, setFormImage] = useState("");

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormType("Blog Story");
    setFormLocation("");
    setFormTag("");
    setFormDate("5 min read");
    setFormImage("");
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    const newContent = {
      title: formTitle,
      type: formType,
      location: formLocation,
      tag: formTag,
      date: formDate,
      image: formImage || "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=82"
    };
    addContent(newContent);
    setShowAddModal(false);
  };

  const handleOpenEdit = (item) => {
    setSelectedContent(item);
    setFormTitle(item.title || "");
    setFormType(item.type || "Blog Story");
    setFormLocation(item.location || "");
    setFormTag(item.tag || "");
    setFormDate(item.date || "");
    setFormImage(item.image || "");
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please enter a title");
      return;
    }
    updateContent(selectedContent.id, {
      title: formTitle,
      type: formType,
      location: formLocation,
      tag: formTag,
      date: formDate,
      image: formImage
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900">Content manager</h2>
          <p className="text-xs font-medium text-stone-500 mt-1">Keep promotional campaigns and stories fresh.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-[#153d2b] hover:bg-emerald-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer"
        >
          <Plus size={16} />
          <span>New article</span>
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {contents.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  item.type === "Active Banner" ? "bg-emerald-50 text-emerald-800" :
                  item.type === "Lifestyle Tip" ? "bg-blue-50 text-blue-800" : "bg-purple-50 text-purple-800"
                }`}>
                  {item.type}
                </span>
                <h4 className="text-sm font-black text-stone-850 mt-2">{item.title}</h4>
                {item.type === "Blog Story" ? (
                  <p className="text-[10px] text-stone-400 font-bold mt-1">
                    Tag: {item.tag} · {item.date}
                  </p>
                ) : (
                  <p className="text-[10px] text-stone-400 font-bold mt-1">
                    {item.location} · {item.detail}
                  </p>
                )}
              </div>
              <span className="h-10 w-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 shrink-0">
                {item.type === "Active Banner" ? <Leaf size={18} /> : <BookOpen size={18} />}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleOpenEdit(item)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-250 hover:border-emerald-300 hover:bg-emerald-50 text-stone-700 hover:text-[#153d2b] text-[10px] font-black transition cursor-pointer"
              >
                <Edit size={12} />
                <span>Edit content</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this content?")) {
                    deleteContent(item.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-250 hover:border-red-300 hover:bg-red-50 text-stone-500 hover:text-red-700 text-[10px] font-black transition cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD CONTENT MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-black text-stone-900">Create New Content</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Content Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full h-11 border border-stone-200 bg-white rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="Blog Story">Blog Story (Stories list)</option>
                  <option value="Active Banner">Active Banner (Hero area)</option>
                  <option value="Lifestyle Tip">Lifestyle Tip (Health tips)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farm Fresh in 10 Minutes"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              {formType === "Blog Story" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400">Blog Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Kitchen notes"
                        value={formTag}
                        onChange={(e) => setFormTag(e.target.value)}
                        className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400">Reading Time / Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 min read"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Display Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Homepage Hero Banner"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Display Detail</label>
                    <input
                      type="text"
                      placeholder="e.g. Updated 2h ago"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 h-11 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-extrabold text-stone-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#153d2b] hover:bg-emerald-800 text-white text-xs font-extrabold transition shadow-lg"
                >
                  Create Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT CONTENT MODAL ── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-black text-stone-900">Edit Content Info</h3>
              <button onClick={() => setShowEditModal(false)} className="text-stone-400 hover:text-stone-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Content Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full h-11 border border-stone-200 bg-white rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                >
                  <option value="Blog Story">Blog Story (Stories list)</option>
                  <option value="Active Banner">Active Banner (Hero area)</option>
                  <option value="Lifestyle Tip">Lifestyle Tip (Health tips)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                />
              </div>

              {formType === "Blog Story" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400">Blog Tag</label>
                      <input
                        type="text"
                        value={formTag}
                        onChange={(e) => setFormTag(e.target.value)}
                        className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-stone-400">Reading Time / Date</label>
                      <input
                        type="text"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Image URL</label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Display Location</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-stone-400">Display Detail</label>
                    <input
                      type="text"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full h-11 border border-stone-200 rounded-xl px-3 text-xs font-semibold outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-11 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-extrabold text-stone-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#153d2b] hover:bg-emerald-800 text-white text-xs font-extrabold transition shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
