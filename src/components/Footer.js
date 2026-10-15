import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaPinterestP, FaLeaf, FaArrowRight } from 'react-icons/fa';

const FooterWrap = styled.footer`
  background:#0f172a;
  color:#cbd5e1;
  font-size:14px;
`;

const TopBar = styled.div`
  background:linear-gradient(90deg,#16a34a,#22c55e);
  padding:16px 40px;
  @media(max-width:768px){padding:16px;}
`;
const TopInner = styled.div`
  max-width:1200px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:16px;
  flex-wrap:wrap;
`;
const TopText = styled.p`
  margin:0;
  color:#fff;
  font-weight:700;
  font-size:14px;
  display:flex;
  align-items:center;
  gap:8px;
`;
const TopLink = styled(Link)`
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:8px 18px;
  background:rgba(255,255,255,0.2);
  color:#fff;
  border-radius:8px;
  font-size:13px;
  font-weight:800;
  text-decoration:none;
  transition:all 0.2s;
  &:hover{background:rgba(255,255,255,0.3);}
`;

const Main = styled.div`
  max-width:1200px;
  margin:0 auto;
  padding:56px 40px 32px;
  display:grid;
  grid-template-columns:1.3fr 1fr 1fr 1fr;
  gap:40px;
  @media(max-width:960px){grid-template-columns:1fr 1fr;}
  @media(max-width:500px){grid-template-columns:1fr;padding:40px 16px 24px;}
`;

const Col = styled.div``;
const Logo = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:16px;
  font-size:1.3rem;
  font-weight:900;
  color:#fff;
`;
const LogoIcon = styled.div`
  width:36px;
  height:36px;
  border-radius:10px;
  background:linear-gradient(135deg,#16a34a,#22c55e);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  font-size:16px;
`;
const Desc = styled.p`
  margin:0 0 20px;
  line-height:1.8;
  color:#94a3b8;
  font-size:13px;
`;

const ContactItem = styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:10px;
  font-size:13px;
  color:#94a3b8;
`;
const ContactIcon = styled.div`
  width:28px;
  height:28px;
  border-radius:8px;
  background:rgba(255,255,255,0.05);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#22c55e;
  font-size:12px;
  flex-shrink:0;
`;

const ColTitle = styled.h4`
  margin:0 0 18px;
  font-size:13px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:1px;
  color:#fff;
`;
const LinkList = styled.ul`
  list-style:none;
  margin:0;
  padding:0;
`;
const LinkItem = styled.li`
  margin-bottom:10px;
`;
const FooterLink = styled(Link)`
  color:#94a3b8;
  text-decoration:none;
  font-size:13px;
  font-weight:600;
  transition:color 0.2s;
  display:flex;
  align-items:center;
  gap:6px;
  &:hover{color:#22c55e;}
`;

const Socials = styled.div`
  display:flex;
  gap:8px;
  margin-top:16px;
`;
const SocialBtn = styled.a`
  width:34px;
  height:34px;
  border-radius:8px;
  background:rgba(255,255,255,0.05);
  display:flex;
  align-items:center;
  justify-content:center;
  color:#94a3b8;
  font-size:13px;
  transition:all 0.2s;
  text-decoration:none;
  &:hover{background:#16a34a;color:#fff;}
`;

const Bottom = styled.div`
  border-top:1px solid rgba(255,255,255,0.06);
  padding:20px 40px;
  @media(max-width:768px){padding:16px;}
`;
const BottomInner = styled.div`
  max-width:1200px;
  margin:0 auto;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
`;
const Copyright = styled.p`
  margin:0;
  font-size:12px;
  color:#64748b;
`;
const BottomLinks = styled.div`
  display:flex;
  gap:20px;
`;
const BottomLink = styled(Link)`
  font-size:12px;
  color:#64748b;
  text-decoration:none;
  font-weight:600;
  transition:color 0.2s;
  &:hover{color:#22c55e;}
`;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <FooterWrap>
      <TopBar>
        <TopInner>
          <TopText><FaLeaf/> Fresh organic produce delivered in 10 minutes</TopText>
          <TopLink to="/shop">Shop Now <FaArrowRight size={11}/></TopLink>
        </TopInner>
      </TopBar>

      <Main>
        <Col>
          <Logo>
            <LogoIcon><FaLeaf/></LogoIcon>
            Organic Store
          </Logo>
          <Desc>Your trusted source for 100% organic groceries. Fresh from certified farms, delivered to your doorstep with care.</Desc>
          <ContactItem>
            <ContactIcon><FaPhone/></ContactIcon>
            +1 (555) 123-4567
          </ContactItem>
          <ContactItem>
            <ContactIcon><FaEnvelope/></ContactIcon>
            hello@organicstore.com
          </ContactItem>
          <ContactItem>
            <ContactIcon><FaMapMarkerAlt/></ContactIcon>
            123 Green Street, Eco City
          </ContactItem>
          <Socials>
            <SocialBtn href="#"><FaFacebookF/></SocialBtn>
            <SocialBtn href="#"><FaTwitter/></SocialBtn>
            <SocialBtn href="#"><FaInstagram/></SocialBtn>
            <SocialBtn href="#"><FaPinterestP/></SocialBtn>
          </Socials>
        </Col>

        <Col>
          <ColTitle>Quick Links</ColTitle>
          <LinkList>
            <LinkItem><FooterLink to="/">Home</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/shop">Shop</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/about">About Us</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/contact">Contact</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/cart">My Cart</FooterLink></LinkItem>
          </LinkList>
        </Col>

        <Col>
          <ColTitle>Categories</ColTitle>
          <LinkList>
            <LinkItem><FooterLink to="/shop">Fresh Fruits</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/shop">Vegetables</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/shop">Pantry Staples</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/shop">Nuts & Seeds</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/shop">Herbs</FooterLink></LinkItem>
          </LinkList>
        </Col>

        <Col>
          <ColTitle>Support</ColTitle>
          <LinkList>
            <LinkItem><FooterLink to="/">FAQ</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/">Shipping Info</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/">Returns</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/">Privacy Policy</FooterLink></LinkItem>
            <LinkItem><FooterLink to="/">Terms of Service</FooterLink></LinkItem>
          </LinkList>
        </Col>
      </Main>

      <Bottom>
        <BottomInner>
          <Copyright>© {year} Organic Store. All rights reserved.</Copyright>
          <BottomLinks>
            <BottomLink to="/">Privacy</BottomLink>
            <BottomLink to="/">Terms</BottomLink>
            <BottomLink to="/">Cookies</BottomLink>
          </BottomLinks>
        </BottomInner>
      </Bottom>
    </FooterWrap>
  );
}