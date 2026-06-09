import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCreditCard, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const CheckoutLayout = styled.section`
  padding: 40px 24px;
  display: grid;
  gap: 40px;
  grid-template-columns: 1.35fr 0.85fr;
  max-width: 1400px;
  margin: 0 auto;
  align-items: start;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e7e5e4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e7e5e4;

  h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #1b4332;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.3rem;
    }
  }
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  color: #1b4332;
  font-size: 1.3rem;
  font-weight: 700;
`;

const Description = styled.p`
  margin: 0 0 24px 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const FormGrid = styled.form`
  display: grid;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.cols || '1fr'};
  gap: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1b4332;
  margin-bottom: 6px;
`;

const Field = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid #d1d5db;
  outline: none;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: #fafaf9;

  &:focus {
    border-color: #16a34a;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
  }

  &::placeholder {
    color: #a8a29e;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  color: #ffffff;
  padding: 14px 24px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 24px;
  font-size: 0.95rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(22, 163, 74, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #16a34a;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 16px;
  transition: all 0.2s;

  &:hover {
    gap: 12px;
    color: #15803d;
  }
`;

const SummaryWrapper = styled.div`
  align-self: start;
  position: sticky;
  top: 20px;
  height: fit-content;

  @media (max-width: 920px) {
    position: relative;
    top: auto;
  }
`;

const SummaryCard = styled(Card)`
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
  border: 2px solid #bbf7d0;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.08);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(186, 247, 208, 0.3);
  color: #1b4332;
  font-weight: 600;
  font-size: 0.95rem;

  &:last-of-type {
    border-bottom: 2px solid #16a34a;
    font-size: 1.1rem;
    color: #16a34a;
    padding: 14px 0;
    margin-top: 8px;
  }
`;

const EmptyCheckout = styled.div`
  text-align: center;
  padding: 60px 24px;
  background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 2px dashed #bbf7d0;
  grid-column: 1 / -1;

  h1 {
    margin: 0 0 16px 0;
    font-size: 1.8rem;
    color: #1b4332;
  }

  p {
    margin: 0 0 32px 0;
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.6;
  }

  a {
    display: inline-block;
    padding: 12px 32px;
    background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: 700;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
    }
  }
`;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, total, placeOrder } = useCart();
  const [order, setOrder] = useState({ name: '', email: '', address: '', city: '', zip: '' });

  const handleChange = (field, value) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!order.name || !order.email || !order.address) {
      alert('Please fill in all required fields');
      return;
    }
    // 🔥 Save order to history before clearing cart
    placeOrder(total);
    alert('✓ Order placed successfully! Thank you for shopping with Organic Store.');
    navigate('/account');
  };

  if (items.length === 0) {
    return (
      <CheckoutLayout>
        <EmptyCheckout>
          <h1>No items to checkout</h1>
          <p>Your cart is empty. Add products before proceeding to checkout.</p>
          <Link to="/shop">Browse Products</Link>
        </EmptyCheckout>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <Card>
        <HeaderSection>
          <h1>
            <FaCreditCard /> Checkout
          </h1>
        </HeaderSection>
        <Description>
          Enter your shipping details to complete your order securely.
        </Description>
        <FormGrid onSubmit={handleSubmit}>
          <div>
            <Label>Full Name *</Label>
            <Field
              value={order.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label>Email Address *</Label>
            <Field
              value={order.email}
              onChange={(event) => handleChange('email', event.target.value)}
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <Label>Shipping Address *</Label>
            <Field
              value={order.address}
              onChange={(event) => handleChange('address', event.target.value)}
              placeholder="123 Main Street"
              required
            />
          </div>
          <FieldGroup cols="1fr 1fr">
            <div>
              <Label>City</Label>
              <Field
                value={order.city}
                onChange={(event) => handleChange('city', event.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <Label>ZIP / Postal Code</Label>
              <Field
                value={order.zip}
                onChange={(event) => handleChange('zip', event.target.value)}
                placeholder="10001"
              />
            </div>
          </FieldGroup>
          <SubmitButton type="submit">
            <FaCheckCircle size={18} />
            Place Order for ${total.toFixed(2)}
          </SubmitButton>
        </FormGrid>
        <BackLink to="/cart">
          <FaArrowLeft size={14} />
          Back to Cart
        </BackLink>
      </Card>

      <SummaryWrapper>
        <SummaryCard>
          <Title>Order Summary</Title>
          <Description>
            {items.length} item{items.length !== 1 ? 's' : ''} ready to ship
          </Description>
          <SummaryRow>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow style={{ fontWeight: 500, color: '#64748b', borderBottom: '1px solid rgba(186, 247, 208, 0.3)' }}>
            <span>Shipping</span>
            <span>$5.00</span>
          </SummaryRow>
          <SummaryRow>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </SummaryRow>
        </SummaryCard>
      </SummaryWrapper>
    </CheckoutLayout>
  );
}