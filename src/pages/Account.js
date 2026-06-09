import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaEnvelope,
  FaEdit, FaCheckCircle, FaClock, FaTruck, FaBox, FaArrowRight,
  FaCalendarAlt, FaDollarSign, FaSignOutAlt, FaHome, FaChevronRight,
  FaReceipt, FaRedo, FaLeaf
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Page = styled.div`
  min-height: 100vh;
  background: #f3f4f6;
  padding: 16px;
  @media(min-width: 768px) { padding: 24px; }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

/* ── Breadcrumb ── */
const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #6b7280;
  a { color: #16a34a; text-decoration: none; font-weight: 600; &:hover { text-decoration: underline; } }
  @media(min-width: 768px) { margin-bottom: 20px; font-size: 13px; }
`;

/* ── Header Card ── */
const HeaderCard = styled.div`
  background: linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%);
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  box-shadow: 0 10px 40px rgba(22, 163, 74, 0.2);
  @media(min-width: 768px) { 
    border-radius: 20px; 
    padding: 32px; 
    margin-bottom: 24px; 
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  @media(min-width: 768px) { gap: 20px; }
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #fff;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  @media(min-width: 768px) { 
    width: 72px; 
    height: 72px; 
    font-size: 28px; 
    border-width: 3px; 
  }
`;

const HeaderInfo = styled.div``;

const WelcomeText = styled.div`
  font-size: 11px;
  opacity: 0.9;
  margin-bottom: 2px;
  font-weight: 500;
  @media(min-width: 768px) { font-size: 13px; margin-bottom: 4px; }
`;

const UserName = styled.h1`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 900;
  @media(min-width: 768px) { font-size: 1.6rem; }
`;

const UserEmail = styled.div`
  font-size: 11px;
  opacity: 0.8;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  @media(min-width: 768px) { font-size: 13px; margin-top: 4px; }
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
  }
  @media(min-width: 768px) { padding: 10px 20px; font-size: 13px; }
`;

/* ── Stats Grid 2x2 on Mobile ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  @media(min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  @media(min-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  @media(min-width: 768px) { width: 48px; height: 48px; font-size: 20px; }
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #111827;
  @media(min-width: 768px) { font-size: 1.4rem; }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  margin-top: 2px;
  @media(min-width: 768px) { font-size: 12px; }
`;

/* ── Quick Links Horizontal on Mobile ── */
const QuickLinksScroll = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 4px;
  &::-webkit-scrollbar { display: none; }
  @media(min-width: 900px) { display: none; }
`;

const QuickPill = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1.5px solid ${({ $active }) => $active ? '#16a34a' : '#e5e7eb'};
  background: ${({ $active }) => $active ? '#f0fdf4' : '#fff'};
  color: ${({ $active }) => $active ? '#16a34a' : '#374151'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  &:active { transform: scale(0.97); }
`;

const QuickIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${({ $color }) => $color};
`;

/* ── Main Layout ── */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  @media(min-width: 900px) {
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }
`;

/* ── Sidebar (Desktop only) ── */
const Sidebar = styled.aside`
  display: none;
  @media(min-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;

const SideCard = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const SideHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SideItem = styled.div`
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border-left: 3px solid transparent;
  ${({ $active }) => $active && `
    background: #f0fdf4;
    color: #16a34a;
    border-left-color: #16a34a;
  `}
  &:hover {
    background: ${({ $active }) => $active ? '#f0fdf4' : '#f9fafb'};
  }
`;

const SideIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg || '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: ${({ $color }) => $color || '#6b7280'};
  flex-shrink: 0;
`;

/* ── Content Area ── */
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media(min-width: 768px) { gap: 20px; }
`;

const ContentCard = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  @media(min-width: 768px) { border-radius: 16px; }
`;

const ContentHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  @media(min-width: 768px) { padding: 20px 24px; }
`;

const ContentTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
  @media(min-width: 768px) { font-size: 1.1rem; }
`;

const ContentBody = styled.div`
  padding: 0;
`;

/* ── Order Card ── */
const OrderCard = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
  @media(min-width: 768px) { padding: 24px; }
`;

const OrderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
  @media(min-width: 768px) { margin-bottom: 16px; }
`;

const OrderMeta = styled.div``;

const OrderId = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  @media(min-width: 768px) { font-size: 13px; }
`;

const OrderDate = styled.div`
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
  @media(min-width: 768px) { font-size: 12px; }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $status }) =>
    $status === 'delivered' ? '#dcfce7' :
    $status === 'shipped' ? '#dbeafe' :
    $status === 'processing' ? '#fef3c7' : '#f3f4f6'};
  color: ${({ $status }) =>
    $status === 'delivered' ? '#16a34a' :
    $status === 'shipped' ? '#2563eb' :
    $status === 'processing' ? '#d97706' : '#6b7280'};
  @media(min-width: 768px) { padding: 6px 14px; font-size: 11px; }
`;

const OrderItems = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  @media(min-width: 768px) { 
    flex-wrap: wrap; 
    overflow-x: visible; 
    margin-bottom: 16px; 
  }
`;

const ItemBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #f3f4f6;
  flex-shrink: 0;
  @media(min-width: 768px) { padding: 10px 14px; }
`;

const ItemThumb = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  @media(min-width: 768px) { width: 48px; height: 48px; }
`;

const ItemInfo = styled.div``;

const ItemName = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 2px;
  @media(min-width: 768px) { font-size: 13px; }
`;

const ItemQty = styled.div`
  font-size: 10px;
  color: #6b7280;
  font-weight: 600;
  @media(min-width: 768px) { font-size: 11px; }
`;

const OrderFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e5e7eb;
  @media(min-width: 768px) { padding-top: 12px; gap: 12px; }
`;

const OrderTotal = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
  @media(min-width: 768px) { font-size: 15px; }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 6px;
  @media(min-width: 768px) { gap: 8px; }
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: ${({ $primary }) => $primary ? 'none' : '1.5px solid #e5e7eb'};
  background: ${({ $primary }) => $primary ? '#16a34a' : '#fff'};
  color: ${({ $primary }) => $primary ? '#fff' : '#374151'};
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $primary }) => $primary ? '0 4px 12px rgba(22,163,74,0.25)' : '0 2px 8px rgba(0,0,0,0.06)'};
  }
  @media(min-width: 768px) { padding: 8px 16px; font-size: 12px; }
`;

/* ── Address Card ── */
const AddressBody = styled.div`
  padding: 16px;
  @media(min-width: 768px) { padding: 20px 24px; }
`;

const AddressRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  &:last-child { margin-bottom: 0; }
`;

const AddressIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 14px;
  flex-shrink: 0;
`;

/* ── Empty State ── */
const EmptyBox = styled.div`
  text-align: center;
  padding: 40px 20px;
  @media(min-width: 768px) { padding: 48px 24px; }
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 24px;
  color: #16a34a;
  @media(min-width: 768px) { width: 80px; height: 80px; font-size: 28px; margin-bottom: 16px; }
`;

const EmptyTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1rem;
  color: #111827;
  font-weight: 800;
  @media(min-width: 768px) { font-size: 1.1rem; }
`;

const EmptyText = styled.p`
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 12px;
  @media(min-width: 768px) { font-size: 13px; margin-bottom: 20px; }
`;

const ShopBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: #16a34a;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
  }
  @media(min-width: 768px) { padding: 11px 24px; font-size: 13px; }
`;

const mockOrders = [
  {
    id: 'ORD-2026-001',
    date: '2026-06-05',
    status: 'delivered',
    total: 24.97,
    items: [
      { id: 1, name: 'Organic Red Apples', qty: 2, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop' },
      { id: 2, name: 'Fresh Bananas', qty: 1, image: 'https://images.unsplash.com/photo-1571771894821-ce9f6f7c1d77?w=100&h=100&fit=crop' },
    ]
  },
  {
    id: 'ORD-2026-002',
    date: '2026-06-03',
    status: 'shipped',
    total: 18.49,
    items: [
      { id: 3, name: 'Organic Almonds', qty: 1, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=100&h=100&fit=crop' },
    ]
  },
  {
    id: 'ORD-2026-003',
    date: '2026-06-01',
    status: 'processing',
    total: 32.95,
    items: [
      { id: 4, name: 'Fresh Spinach', qty: 2, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop' },
      { id: 5, name: 'Organic Honey', qty: 1, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=100&h=100&fit=crop' },
    ]
  }
];

export default function Account() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); }
      catch { setOrders(mockOrders); }
    } else {
      setOrders(mockOrders);
    }
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const statusConfig = {
    delivered: { icon: <FaCheckCircle />, label: 'Delivered' },
    shipped: { icon: <FaTruck />, label: 'Shipped' },
    processing: { icon: <FaClock />, label: 'Processing' },
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <Page>
        <Inner>
          <EmptyBox>
            <EmptyIcon><FaLeaf /></EmptyIcon>
            <EmptyTitle>Please Sign In</EmptyTitle>
            <EmptyText>Sign in to view your account, orders, and saved addresses.</EmptyText>
            <ShopBtn to="/login">Sign In Now <FaArrowRight size={11} /></ShopBtn>
          </EmptyBox>
        </Inner>
      </Page>
    );
  }

  return (
    <Page>
      <Inner>
        <Breadcrumb>
          <Link to="/"><FaHome size={12} /> Home</Link>
          <FaChevronRight size={10} />
          <span>My Account</span>
        </Breadcrumb>

        {/* Header Card */}
        <HeaderCard>
          <HeaderLeft>
            <Avatar><FaUser /></Avatar>
            <HeaderInfo>
              <WelcomeText>Welcome back,</WelcomeText>
              <UserName>{user?.name || 'User'}</UserName>
              <UserEmail><FaEnvelope size={11} /> {user?.email || 'user@example.com'}</UserEmail>
            </HeaderInfo>
          </HeaderLeft>
          <LogoutBtn onClick={handleLogout}>
            <FaSignOutAlt /> Sign Out
          </LogoutBtn>
        </HeaderCard>

        {/* Stats Grid - 2x2 on Mobile, 4x1 on Desktop */}
        <StatsGrid>
          <StatCard>
            <StatIcon $bg="#dcfce7" $color="#16a34a"><FaReceipt /></StatIcon>
            <StatContent>
              <StatValue>{orders.length}</StatValue>
              <StatLabel>Total Orders</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $bg="#dbeafe" $color="#2563eb"><FaCheckCircle /></StatIcon>
            <StatContent>
              <StatValue>{deliveredCount}</StatValue>
              <StatLabel>Delivered</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $bg="#fef3c7" $color="#d97706"><FaDollarSign /></StatIcon>
            <StatContent>
              <StatValue>${totalSpent.toFixed(0)}</StatValue>
              <StatLabel>Total Spent</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $bg="#fce7f3" $color="#db2777"><FaHeart /></StatIcon>
            <StatContent>
              <StatValue>0</StatValue>
              <StatLabel>Wishlist</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Quick Links - Horizontal Scroll on Mobile */}
        <QuickLinksScroll>
          <QuickPill $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            <QuickIcon $bg="#dcfce7" $color="#16a34a"><FaShoppingBag /></QuickIcon>
            My Orders
          </QuickPill>
          <QuickPill $active={activeTab === 'address'} onClick={() => setActiveTab('address')}>
            <QuickIcon $bg="#dbeafe" $color="#2563eb"><FaMapMarkerAlt /></QuickIcon>
            Addresses
          </QuickPill>
          <QuickPill $active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')}>
            <QuickIcon $bg="#fce7f3" $color="#db2777"><FaHeart /></QuickIcon>
            Wishlist
          </QuickPill>
        </QuickLinksScroll>

        <MainGrid>
          {/* Sidebar - Desktop Only */}
          <Sidebar>
            <SideCard>
              <SideHeader><FaUser size={14} /> Quick Links</SideHeader>
              <SideItem $active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                <SideIcon $bg="#dcfce7" $color="#16a34a"><FaShoppingBag /></SideIcon>
                My Orders
              </SideItem>
              <SideItem $active={activeTab === 'address'} onClick={() => setActiveTab('address')}>
                <SideIcon $bg="#dbeafe" $color="#2563eb"><FaMapMarkerAlt /></SideIcon>
                Addresses
              </SideItem>
              <SideItem $active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')}>
                <SideIcon $bg="#fce7f3" $color="#db2777"><FaHeart /></SideIcon>
                Wishlist
              </SideItem>
            </SideCard>

            <SideCard>
              <SideHeader><FaLeaf size={14} /> Account Settings</SideHeader>
              <SideItem onClick={() => navigate('/login')}>
                <SideIcon><FaEdit /></SideIcon>
                Edit Profile
              </SideItem>
              <SideItem onClick={handleLogout}>
                <SideIcon $bg="#fef2f2" $color="#ef4444"><FaSignOutAlt /></SideIcon>
                Sign Out
              </SideItem>
            </SideCard>
          </Sidebar>

          {/* Content */}
          <Content>
            {activeTab === 'orders' && (
              <ContentCard>
                <ContentHeader>
                  <ContentTitle><FaShoppingBag color="#16a34a" /> Recent Orders</ContentTitle>
                  <Link to="/shop" style={{ fontSize: 13, color: '#16a34a', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Shop More <FaArrowRight size={11} />
                  </Link>
                </ContentHeader>
                <ContentBody>
                  {orders.length === 0 ? (
                    <EmptyBox>
                      <EmptyIcon><FaBox /></EmptyIcon>
                      <EmptyTitle>No Orders Yet</EmptyTitle>
                      <EmptyText>Start shopping to see your orders here.</EmptyText>
                      <ShopBtn to="/shop">Browse Products <FaArrowRight size={11} /></ShopBtn>
                    </EmptyBox>
                  ) : (
                    orders.map(order => (
                      <OrderCard key={order.id}>
                        <OrderTop>
                          <OrderMeta>
                            <OrderId>
                              <FaReceipt size={12} color="#16a34a" />
                              {order.id}
                            </OrderId>
                            <OrderDate>
                              <FaCalendarAlt size={11} />
                              {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </OrderDate>
                          </OrderMeta>
                          <StatusBadge $status={order.status}>
                            {statusConfig[order.status].icon}
                            {statusConfig[order.status].label}
                          </StatusBadge>
                        </OrderTop>

                        <OrderItems>
                          {order.items.map(item => (
                            <ItemBox key={item.id}>
                              <ItemThumb src={item.image} alt={item.name} />
                              <ItemInfo>
                                <ItemName>{item.name}</ItemName>
                                <ItemQty>Qty: {item.qty}</ItemQty>
                              </ItemInfo>
                            </ItemBox>
                          ))}
                        </OrderItems>

                        <OrderFooter>
                          <OrderTotal>
                            <FaDollarSign size={14} color="#16a34a" />
                            Total: ${order.total.toFixed(2)}
                          </OrderTotal>
                          <OrderActions>
                            <ActionBtn><FaReceipt size={11} /> Invoice</ActionBtn>
                            <ActionBtn $primary><FaRedo size={11} /> Reorder</ActionBtn>
                          </OrderActions>
                        </OrderFooter>
                      </OrderCard>
                    ))
                  )}
                </ContentBody>
              </ContentCard>
            )}

            {activeTab === 'address' && (
              <ContentCard>
                <ContentHeader>
                  <ContentTitle><FaMapMarkerAlt color="#ef4444" /> Saved Addresses</ContentTitle>
                </ContentHeader>
                <AddressBody>
                  <AddressRow>
                    <AddressIcon><FaHome /></AddressIcon>
                    <div>
                      <strong style={{ color: '#111827', fontSize: 14 }}>Home</strong>
                      <div>{user?.address || '123 Main Street, Apt 4B'}</div>
                      <div style={{ marginTop: 4, color: '#6b7280' }}>{user?.phone || '+1 (555) 123-4567'}</div>
                    </div>
                  </AddressRow>
                  <AddressRow>
                    <AddressIcon><FaMapMarkerAlt /></AddressIcon>
                    <div>
                      <strong style={{ color: '#111827', fontSize: 14 }}>Work</strong>
                      <div>456 Office Blvd, Suite 200</div>
                      <div style={{ marginTop: 4, color: '#6b7280' }}>+1 (555) 987-6543</div>
                    </div>
                  </AddressRow>
                </AddressBody>
              </ContentCard>
            )}

            {activeTab === 'wishlist' && (
              <ContentCard>
                <ContentHeader>
                  <ContentTitle><FaHeart color="#ef4444" /> My Wishlist</ContentTitle>
                  <Link to="/wishlist" style={{ fontSize: 13, color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>
                    View All →
                  </Link>
                </ContentHeader>
                <EmptyBox>
                  <EmptyIcon><FaHeart /></EmptyIcon>
                  <EmptyTitle>Your Wishlist is Empty</EmptyTitle>
                  <EmptyText>Save items you love for quick access later.</EmptyText>
                  <ShopBtn to="/shop">Browse Products <FaArrowRight size={11} /></ShopBtn>
                </EmptyBox>
              </ContentCard>
            )}
          </Content>
        </MainGrid>
      </Inner>
    </Page>
  );
}
