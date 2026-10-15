import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useCart } from "../context/CartContext";
import { productAPI, reviewAPI, orderAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaHeart, FaStar, FaPlus, FaMinus, FaCheck } from "react-icons/fa";

/* ─── Page ─────────────────────────────────────────────────── */
const Page = styled.section`
  background: #f4f6fb;
  min-height: 100vh;
  padding: 18px 24px 40px;
  @media (max-width: 768px) { padding: 12px 12px 32px; }
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 14px;
  a {
    color: #94a3b8;
    text-decoration: none;
    &:hover { color: #153d2b; }
  }
`;

const Sep = styled.span` color: #cbd5e1; `;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 18px;
  max-width: 1000px;
  margin: 0 auto;
  align-items: start;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

/* ─── LEFT: Image Card ─────────────────────────────────────── */
const ImageCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #eef0f7;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BadgeStack = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 2;
`;

const Pill = styled.span`
  padding: 3px 9px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  background: ${({ v }) =>
    v === "stock"   ? "#dcfce7" :
    v === "nostock" ? "#fee2e2" : "#fff7ed"};
  color: ${({ v }) =>
    v === "stock"   ? "#15803d" :
    v === "nostock" ? "#dc2626" : "#c2410c"};
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

/* ─── RIGHT: Details Card ──────────────────────────────────── */
const DetailsCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #eef0f7;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const CatTag = styled.span`
  width: fit-content;
  padding: 4px 12px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.55rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.2;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GreenBadge = styled.span`
  background: #166534;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 5px;
  letter-spacing: 0.3px;
`;

const StarRow = styled.span`
  display: flex;
  gap: 1px;
  font-size: 13px;
`;

const RevText = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

const Hr = styled.hr`
  border: none;
  border-top: 1.5px solid #f1f5f9;
  margin: 0;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
`;

const BigPrice = styled.span`
  font-size: 1.85rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
`;

const StrikePrice = styled.span`
  font-size: 0.95rem;
  color: #b0b8cc;
  text-decoration: line-through;
`;

const OffBadge = styled.span`
  background: #fff7ed;
  color: #c2410c;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 5px;
`;

const Desc = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 13.5px;
  line-height: 1.75;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const MetaBox = styled.div`
  background: #f8faff;
  border: 1px solid #eef0f7;
  border-radius: 10px;
  padding: 10px 13px;
`;

const ML = styled.div`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 3px;
`;

const MV = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
`;

const DeliveryStrip = styled.div`
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #166534;
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8faff;
  border: 1px solid #eef0f7;
  border-radius: 10px;
  padding: 9px 14px;
`;

const QtyLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  background: #fff;
`;

const QtyBtn = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 18px;
  font-weight: 800;
  color: #153d2b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #f1f5f9; }
`;

const QtyNum = styled.span`
  min-width: 36px;
  text-align: center;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
  border-left: 1.5px solid #e2e8f0;
  border-right: 1.5px solid #e2e8f0;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BtnGroup = styled.div`
  display: grid;
  gap: 9px;
`;

const CartBtn = styled.button`
  width: 100%;
  border: none;
  border-radius: 12px;
  background: #153d2b;
  color: #fff;
  padding: 13px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #1f583e; }
  &:disabled { background: #94a3b8; cursor: not-allowed; }
`;

const BuyBtn = styled.button`
  width: 100%;
  border: 2px solid #153d2b;
  border-radius: 12px;
  background: #fff;
  color: #153d2b;
  padding: 11px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s;
  &:hover { background: #153d2b; color: #fff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const BackBtn = styled(Link)`
  text-align: center;
  display: block;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  &:hover { color: #153d2b; }
`;

/* ─── Reviews Styled Components ────────────────────────────── */
const ReviewsCard = styled.div`
  max-width: 1000px;
  margin: 20px auto 0;
  background: #fff;
  border-radius: 16px;
  border: 1.5px solid #eef0f7;
  padding: 24px;
`;

const ReviewItem = styled.div`
  border-bottom: 1px solid #f1f5f9;
  padding: 16px 0;
  &:last-child { border-bottom: none; }
`;

const Form = styled.form`
  background: #f8faff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 16px;
  margin-top: 14px;
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #166534;
  color: #fff;
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  z-index: 9999;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
`;

function Stars({ r }) {
  return (
    <StarRow>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(r) ? "#f59e0b" : "#e2e8f0" }}>★</span>
      ))}
    </StarRow>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState("");
  const { addToCart, cart, updateQuantity } = useCart();
  
  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [verifiedOrder, setVerifiedOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productAPI.getProduct(id);
      if (res?.data) {
        setProduct(res.data);
        
        // Fetch reviews
        const revRes = await reviewAPI.getReviews(res.data._id || res.data.id);
        if (revRes?.data) {
          setReviews(revRes.data);
        }
        
        // Check if user has a delivered order for this product
        if (isLoggedIn) {
          try {
            const ordersRes = await orderAPI.getMyOrders();
            if (ordersRes?.data?.orders) {
              const matched = ordersRes.data.orders.find(o => 
                o.status === 'delivered' && 
                o.items.some(item => String(item.product) === String(res.data._id || res.data.id))
              );
              if (matched) {
                setVerifiedOrder(matched);
              }
            }
          } catch (oErr) {
            console.error('Error fetching user orders for reviews:', oErr);
          }
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    showToast(`Added ${qty} × ${product.name} to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    navigate("/cart");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const reviewPayload = {
        productId: product._id || product.id,
        orderId: verifiedOrder?._id || verifiedOrder?.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      };
      
      await reviewAPI.submitReview(reviewPayload);
      showToast("Review submitted successfully!");
      setReviewComment("");
      setReviewTitle("");
      
      // Reload reviews
      const revRes = await reviewAPI.getReviews(product._id || product.id);
      if (revRes?.data) setReviews(revRes.data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to submit review. Verified purchase required.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <Page>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-800"></div>
        <p className="text-stone-500 font-bold mt-4">Loading product details...</p>
      </div>
    </Page>
  );

  if (error || !product) return (
    <Page>
      <div className="text-center py-20 bg-white border border-stone-200 rounded-[20px] shadow-sm max-w-lg mx-auto">
        <p className="text-red-500 font-black text-lg">{error || "Product not found"}</p>
        <BackBtn to="/shop" className="mt-4 inline-block text-emerald-800 font-bold">← Back to shop</BackBtn>
      </div>
    </Page>
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const inCart = cart.find(item => item.id === (product._id || product.id));

  return (
    <Page>
      <Breadcrumb>
        <Link to="/">Home</Link><Sep>/</Sep>
        <Link to="/shop">Shop</Link><Sep>/</Sep>
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{product.name}</span>
      </Breadcrumb>

      <Wrapper>
        {/* Image view */}
        <ImageCard>
          <BadgeStack>
            <Pill v={product.inStock ? "stock" : "nostock"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Pill>
            {discount && <Pill v="sale">{discount}% OFF</Pill>}
          </BadgeStack>
          <MainImage src={product.image} alt={product.name} />
        </ImageCard>

        {/* Details card */}
        <DetailsCard>
          <CatTag>{product.category}</CatTag>
          <Title>{product.name}</Title>

          <RatingRow>
            <GreenBadge>{product.rating.toFixed(1)} ★</GreenBadge>
            <Stars r={product.rating} />
            <RevText>{product.reviews} reviews</RevText>
          </RatingRow>

          <Hr />

          <PriceRow>
            <BigPrice>₹{product.price}</BigPrice>
            {product.originalPrice && (
              <>
                <StrikePrice>₹{product.originalPrice}</StrikePrice>
                {discount && <OffBadge>{discount}% off</OffBadge>}
              </>
            )}
          </PriceRow>

          <Desc>{product.description}</Desc>

          <MetaGrid>
            <MetaBox><ML>Origin</ML><MV>Organic Farm</MV></MetaBox>
            <MetaBox>
              <ML>Availability</ML>
              <MV style={{ color: product.inStock ? "#15803d" : "#dc2626" }}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </MV>
            </MetaBox>
            <MetaBox><ML>Weight</ML><MV>{product.weight || "—"}</MV></MetaBox>
            <MetaBox><ML>Rating</ML><MV>{product.rating.toFixed(1)} / 5</MV></MetaBox>
          </MetaGrid>

          <DeliveryStrip>
            🚚 Free delivery in <strong style={{ marginLeft: 3 }}>10 minutes</strong>
          </DeliveryStrip>

          <QtyRow>
            <QtyLabel>Quantity</QtyLabel>
            <QtyControls>
              <QtyBtn type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</QtyBtn>
              <QtyNum>{qty}</QtyNum>
              <QtyBtn type="button" onClick={() => setQty(q => q + 1)}>+</QtyBtn>
            </QtyControls>
          </QtyRow>

          <BtnGroup>
            <CartBtn type="button" disabled={!product.inStock} onClick={handleAddToCart}>
              🛒 Add to Cart
            </CartBtn>
            <BuyBtn type="button" disabled={!product.inStock} onClick={handleBuyNow}>
              ⚡ Buy Now
            </BuyBtn>
            <BackBtn to="/shop">← Continue shopping</BackBtn>
          </BtnGroup>
        </DetailsCard>
      </Wrapper>

      {/* Reviews Card */}
      <ReviewsCard>
        <h3 className="text-lg font-black text-stone-900 mb-4">Customer Reviews</h3>
        
        {/* List reviews */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((r, idx) => (
              <ReviewItem key={idx}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-stone-800">{r.user?.fullName || 'Anonymous'}</span>
                    {r.isVerifiedPurchase && (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-emerald-100">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400 font-bold">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Stars r={r.rating} />
                  {r.title && <span className="font-black text-stone-900 text-sm">{r.title}</span>}
                </div>
                <p className="text-xs text-stone-500 font-medium leading-relaxed mt-2">{r.comment}</p>
              </ReviewItem>
            ))
          ) : (
            <p className="text-sm text-stone-400 font-medium py-4">No reviews yet for this product. Be the first to leave one!</p>
          )}
        </div>

        {/* Review form */}
        {isLoggedIn && verifiedOrder ? (
          <Form onSubmit={handleReviewSubmit}>
            <h4 className="text-sm font-black text-stone-800 mb-2">Write a Review</h4>
            <p className="text-xs text-stone-500 font-medium mb-4">You purchased this product in order {verifiedOrder.orderNumber}</p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Rating</label>
                <select 
                  value={reviewRating} 
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs font-bold outline-none"
                >
                  <option value="5">5 Stars — Excellent</option>
                  <option value="4">4 Stars — Very Good</option>
                  <option value="3">3 Stars — Average</option>
                  <option value="2">2 Stars — Poor</option>
                  <option value="1">1 Star — Terrible</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={reviewTitle} 
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Crisp and delicious!"
                  className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1">Comment</label>
                <textarea 
                  rows="3" 
                  value={reviewComment} 
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-xs font-semibold outline-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-[#153d2b] hover:bg-emerald-800 text-white font-extrabold text-xs transition cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </Form>
        ) : isLoggedIn ? (
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs font-bold text-stone-500">
            🔒 Only verified purchases of this product can submit a review.
          </div>
        ) : (
          <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-center text-xs font-bold text-stone-500">
            Please <Link to="/login" className="text-emerald-800 hover:underline">sign in</Link> to write a review.
          </div>
        )}
      </ReviewsCard>

      {toast && (
        <Toast>✅ {toast}</Toast>
      )}
    </Page>
  );
}