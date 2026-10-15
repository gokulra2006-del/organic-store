import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEye, FaShoppingCart, FaHeart, FaStar, FaCheck, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Card = styled.div`
  background: #fff;
  border: 1px solid #e7e5e4;
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
  position: relative;
  display: flex;
  flex-direction: column;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 45px rgba(21, 61, 43, 0.11);
    border-color: #bbf7d0;
  }
`;

const ImageWrap = styled.div`
  position: relative;
  padding: 16px 16px 0;
`;

const Image = styled.img`
  width: 100%;
  height: 190px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
  background: #f8fafc;
`;

const Badge = styled.div`
  position: absolute;
  top: 24px;
  left: 24px;
  background: ${({ $type }) => $type === 'sale' ? '#ef4444' : $type === 'new' ? '#16a34a' : '#f59e0b'};
  color: #fff;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 999px;
  z-index: 2;
`;

const WishBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: ${({ $liked }) => $liked ? '#ef4444' : '#94a3b8'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  z-index: 2;
  &:hover {
    transform: scale(1.1);
    color: #ef4444;
  }
`;

const QuickView = styled(Link)`
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  opacity: 0;
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 999px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s;
  z-index: 2;
  ${Card}:hover & {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const Body = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Category = styled.div`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #16a34a;
  margin-bottom: 6px;
`;

const Name = styled(Link)`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  &:hover {
    color: #16a34a;
  }
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
`;

const Stars = styled.div`
  display: flex;
  gap: 1px;
  color: #fbbf24;
  font-size: 11px;
`;

const ReviewCount = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  margin-top: auto;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const OldPrice = styled.span`
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 600;
`;

const Discount = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: #ef4444;
  background: #fef2f2;
  padding: 2px 6px;
  border-radius: 4px;
`;

const CartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 48px;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: ${({ $added }) => $added ? '#16a34a' : '#0f172a'};
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ $added }) => $added ? '#15803d' : '#1e293b'};
    transform: scale(1.02);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const QtyControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  flex: 1;
`;

const QtyBtn = styled.button`
  width: 44px;
  height: 48px;
  border: none;
  background: #fff;
  color: #475569;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover {
    background: #f8fafc;
  }
  &:active {
    background: #f1f5f9;
  }
`;

const QtyVal = styled.div`
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  min-width: 28px;
`;

export default function ProductCard({ product }) {
  const { addToCart, cart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [liked, setLiked] = useState(isWishlisted(product.id));

  // Sync like state when wishlist context updates
  useEffect(() => {
    setLiked(isWishlisted(product.id));
  }, [cart, isWishlisted, product.id]);

  const prodId = product._id || product.id;
  const inCart = Array.isArray(cart) ? cart.find(item => String(item.id || item._id) === String(prodId)) : null;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Card>
      <ImageWrap>
        <Image src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <Badge $type={product.badgeType || 'sale'}>{product.badge}</Badge>}
        <WishBtn $liked={liked} onClick={() => toggleWishlist(product)}>
          <FaHeart />
        </WishBtn>
        <QuickView to={`/product/${product.id}`}>
          <FaEye size={11} /> Quick View
        </QuickView>
      </ImageWrap>

      <Body>
        <Category>{product.category}</Category>
        <Name to={`/product/${product.id}`}>{product.name}</Name>

        <RatingRow>
          <Stars>
            {[1, 2, 3, 4, 5].map(i => (
              <FaStar key={i} style={{ opacity: i <= Math.round(product.rating) ? 1 : 0.3 }} />
            ))}
          </Stars>
          <ReviewCount>({product.reviews})</ReviewCount>
        </RatingRow>

        <PriceRow>
          <Price>₹{product.price}</Price>
          {product.originalPrice && (
            <>
              <OldPrice>₹{product.originalPrice}</OldPrice>
              {discount > 0 && <Discount>-{discount}%</Discount>}
            </>
          )}
        </PriceRow>

        <CartSection style={{ marginTop: 'auto' }}>
          {!inCart ? (
            <AddBtn 
              $added={false} 
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, 1);
              }}
              style={{ background: '#fff', border: '1.5px solid #16a34a', color: '#16a34a', minHeight: '40px', padding: '6px 12px', width: '100%' }}
            >
              <span className="flex items-center gap-1.5 font-black text-sm">
                ADD <FaPlus size={9} />
              </span>
            </AddBtn>
          ) : (
            <div className="flex items-center justify-between bg-[#16a34a] border border-[#16a34a] rounded-xl overflow-hidden flex-1 text-white h-10 shadow-sm shadow-emerald-700/10 w-full">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  updateQuantity(prodId, inCart.quantity - 1);
                }} 
                className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition"
                aria-label="Decrease quantity"
              >
                <FaMinus size={11} />
              </button>
              <span className="font-extrabold text-sm select-none">{inCart.quantity}</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  updateQuantity(prodId, inCart.quantity + 1);
                }} 
                className="w-10 h-full flex items-center justify-center hover:bg-emerald-800 active:scale-95 transition"
                aria-label="Increase quantity"
              >
                <FaPlus size={11} />
              </button>
            </div>
          )}
        </CartSection>
      </Body>
    </Card>
  );
}
