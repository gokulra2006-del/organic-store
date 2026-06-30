import React, { createContext, useContext, useState, useEffect } from 'react';

const ReviewContext = createContext();

const initialReviews = [
  { id: 1, author: "Anita S.", rating: 5, text: "The apples were super fresh! Delivered within 8 minutes. Incredible!", status: "pending" },
  { id: 2, author: "David L.", rating: 4, text: "Very good service. The honey jar is amazing, but spinach had some wilted leaves.", status: "pending" },
  { id: 3, author: "Priya N.", rating: 5, text: "Organic Honey is authentic and delicious. Customer for life!", status: "approved" }
];

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem('organic_reviews');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading organic_reviews from localStorage:', e);
    }
    localStorage.setItem('organic_reviews', JSON.stringify(initialReviews));
    return initialReviews;
  });

  useEffect(() => {
    localStorage.setItem('organic_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const approveReview = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  };

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const submitReview = (newReview) => {
    setReviews((prev) => [
      {
        ...newReview,
        id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1,
        status: 'pending'
      },
      ...prev
    ]);
  };

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        approvedReviews,
        approveReview,
        deleteReview,
        submitReview
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
