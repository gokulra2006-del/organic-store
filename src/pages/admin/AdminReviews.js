import React, { useState } from "react";
import { Star, CheckCircle, Trash2 } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([
    { id: 1, author: "Anita S.", rating: 5, text: "The apples were super fresh! Delivered within 8 minutes. Incredible!", status: "pending" },
    { id: 2, author: "David L.", rating: 4, text: "Very good service. The honey jar is amazing, but spinach had some wilted leaves.", status: "pending" },
    { id: 3, author: "Priya N.", rating: 5, text: "Organic Honey is authentic and delicious. Customer for life!", status: "approved" },
  ]);

  const handleApprove = (id) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
  };

  const handleDelete = (id) => {
    setReviews(reviews.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-stone-900">Customer Reviews</h2>
        <p className="text-xs font-medium text-stone-500 mt-1">Review feedback and manage public testimonials.</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-stone-900">{review.author}</p>
                <div className="flex gap-0.5 text-amber-400 mt-1">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                review.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {review.status}
              </span>
            </div>

            <p className="text-xs text-stone-600 font-bold leading-relaxed">{review.text}</p>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              {review.status === "pending" && (
                <button
                  onClick={() => handleApprove(review.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#153d2b] text-[10px] font-black transition cursor-pointer"
                >
                  <CheckCircle size={12} />
                  <span>Approve</span>
                </button>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black transition cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
