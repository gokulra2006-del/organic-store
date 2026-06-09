import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLeaf, FaTruck, FaHeart, FaShieldAlt } from 'react-icons/fa';
import Hero from '../components/HeroSlider';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';
import Banner from '../components/PromoBanners.js';
import Newsletter from '../components/Newsletter';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const Page = styled.div`
  display: grid;
  gap: 42px;
`;

const Section = styled.section`
  display: grid;
  gap: 30px;
`;

const SectionHeader = styled.div`
  display: grid;
  gap: 12px;
  text-align: center;
`;

const SmallTitle = styled.span`
  color: #2d6a4f;
  font-weight: 800;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #1b4332;
  font-size: clamp(2.4rem, 3vw, 3.6rem);
`;

const Subtext = styled.p`
  margin: 0 auto;
  max-width: 760px;
  color: #475569;
  line-height: 1.8;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const TabButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  background: ${({ active }) => (active ? '#8bc34a' : '#f3f7f2')};
  color: ${({ active }) => (active ? '#ffffff' : '#475569')};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? '#7aaa3d' : '#e6ede6')};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  background: ${({ highlighted }) => (highlighted ? '#82b74b' : '#ffffff')};
  color: ${({ highlighted }) => (highlighted ? '#ffffff' : '#1f2937')};
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(15, 48, 22, 0.08);
  min-height: 180px;
`;

const FeatureIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 18px;
  background: ${({ highlighted }) => (highlighted ? 'rgba(255,255,255,0.18)' : '#eff8ef')};
  display: grid;
  place-items: center;
  color: ${({ highlighted }) => (highlighted ? '#ffffff' : '#2d6a4f')};
  font-size: 1.2rem;
`;

const FeatureTitle = styled.h3`
  margin: 18px 0 10px;
  font-size: 1.35rem;
`;

const FeatureText = styled.p`
  margin: 0;
  color: ${({ highlighted }) => (highlighted ? 'rgba(255,255,255,0.9)' : '#64748b')};
  line-height: 1.8;
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const NewsCard = styled.article`
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(15, 48, 22, 0.08);
  display: grid;
`;

const NewsImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

const NewsBody = styled.div`
  padding: 22px;
  display: grid;
  gap: 14px;
`;

const NewsMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #94a3b8;
  font-size: 0.95rem;
`;

const NewsTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: #1b4332;
`;

const NewsText = styled.p`
  margin: 0;
  color: #64748b;
  line-height: 1.8;
`;

const NewsLink = styled(Link)`
  color: #2d6a4f;
  font-weight: 700;
  text-decoration: none;
`;

const ProfilesGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.article`
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(15, 48, 22, 0.08);
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
`;

const ProfileBody = styled.div`
  padding: 24px;
`;

const ProfileName = styled.h4`
  margin: 0;
  color: #1b4332;
`;

const ProfileRole = styled.p`
  margin: 8px 0 0;
  color: #2d6a4f;
  font-weight: 700;
`;

const ProfileText = styled.p`
  margin: 14px 0 0;
  color: #64748b;
  line-height: 1.8;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled.article`
  background: #d8f1d8;
  border-radius: 28px;
  padding: 30px 26px;
  display: grid;
  gap: 18px;
`;

const TestimonialQuote = styled.p`
  margin: 0;
  color: #000000;
  line-height: 1.9;
  font-style: italic;
`;

const TestimonialProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 6px;
`;

const ProfileNameSmall = styled.span`
  color: #000000;
  font-weight: 800;
`;

const ProfileRoleSmall = styled.span`
  color: #000000;
  font-size: 0.95rem;
  font-weight: 500;
`;

const news = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506808547685-e2ba962dedf7?auto=format&fit=crop&w=900&q=80',
    category: 'Healthy',
    date: '21st Aug, 2015',
    comments: 26,
    title: 'You should add 5 things in your daily meals.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80',
    category: 'Nutrition',
    date: '21st Aug, 2015',
    comments: 18,
    title: 'Natural food choices for better health.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    category: 'Wellness',
    date: '21st Aug, 2015',
    comments: 22,
    title: 'Organic lifestyle tips for every day.',
  },
];

const farmers = [
  {
    id: 1,
    name: 'Rebecca Garzany',
    role: 'Pastoral Farmer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'George William',
    role: 'Arable Farmer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'Giana Fernando',
    role: 'Farm Manager',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Mark Antony',
    role: 'Designer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    text: 'Who do not know how to pursue an sed pleasure rationally encounter that are extremely win painful nor again is there anyone who loves or pursues or desires obtain pain itself circumstances.',
  },
  {
    id: 2,
    name: 'William Border',
    role: 'Designer',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    text: 'Who do not know how to pursue an sed pleasure rationally encounter that are extremely win painful nor again is there anyone who loves or pursues or desires obtain pain itself circumstances.',
  },
  {
    id: 3,
    name: 'Jessy Federar',
    role: 'Cor.Manager',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    text: 'Who do not know how to pursue an sed pleasure rationally encounter that are extremely win painful nor again is there anyone who loves or pursues or desires obtain pain itself circumstances.',
  },
];

const categories = ['All Products', 'Fruits', 'Vegetables', 'Beauty', 'Others'];

export default function Home() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState('All Products');

  const filteredProducts = useMemo(() => {
    if (activeTab === 'All Products') return products;
    return products.filter((product) => product.category === activeTab);
  }, [activeTab]);

  return (
    <Page>
      <Hero />

      <CategorySection />

      <Section style={{padding:'20px'}}>
        <SectionHeader>
          <SmallTitle>Featured Products</SmallTitle>
          <Title>Top selling products</Title>
          <Subtext>Choose from our best-selling organic groceries, beauty and wellness essentials.</Subtext>
        </SectionHeader>
        <Tabs>
          {categories.map((tab) => (
            <TabButton key={tab} type="button" active={activeTab === tab} onClick={() => setActiveTab(tab)}>
              {tab}
            </TabButton>
          ))}
        </Tabs>
        <ProductGrid products={filteredProducts} onAdd={addItem} />
      </Section>

      <Section style={{ padding: '20px'}}>
        <SectionHeader>
          <SmallTitle>Why choose us</SmallTitle>
          <Title>We provide the best organic products</Title>
          <Subtext>
            There are many variations of passages of lorem ipsum available, but the majority have suffered alteration in some
            form, by injected humour.
          </Subtext>
        </SectionHeader>
        <FeatureGrid>
          <FeatureCard highlighted>
            <FeatureIcon highlighted>
              <FaLeaf />
            </FeatureIcon>
            <FeatureTitle>100% Organic Products</FeatureTitle>
            <FeatureText highlighted>
              Duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaTruck />
            </FeatureIcon>
            <FeatureTitle>Any Time, Anywhere Delivery</FeatureTitle>
            <FeatureText>
              Duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaHeart />
            </FeatureIcon>
            <FeatureTitle>Keeps Your Family Healthy</FeatureTitle>
            <FeatureText>
              Duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </FeatureText>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <FaShieldAlt />
            </FeatureIcon>
            <FeatureTitle>Clean, Fresh and Safety</FeatureTitle>
            <FeatureText>
              Duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </FeatureText>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section style={{ padding: '20px' }}>
        <SectionHeader>
          <SmallTitle>Our latest news</SmallTitle>
          <Title>News & blog articles</Title>
        </SectionHeader>
        <NewsGrid>
          {news.map((item) => (
            <NewsCard key={item.id}>
              <NewsImage src={item.image} alt={item.title} />
              <NewsBody>
                <NewsMeta>
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                  <span>•</span>
                  <span>{item.comments}</span>
                </NewsMeta>
                <NewsTitle>{item.title}</NewsTitle>
                <NewsText>As more and more people are turning to organic lifestyles & trying improve their health...</NewsText>
                <NewsLink to="/">Read more →</NewsLink>
              </NewsBody>
            </NewsCard>
          ))}
        </NewsGrid>
      </Section>

      <Section style={{ padding: '20px' }}>
        <SectionHeader>
          <SmallTitle>Our farmers</SmallTitle>
          <Title>Meet our trusted partners</Title>
        </SectionHeader>
        <ProfilesGrid>
          {farmers.map((person) => (
            <ProfileCard key={person.id}>
              <ProfileImage src={person.image} alt={person.name} />
              <ProfileBody>
                <ProfileName>{person.name}</ProfileName>
                <ProfileRole>{person.role}</ProfileRole>
                <ProfileText>Praising pain was born and I will give you a complete account of the system.</ProfileText>
              </ProfileBody>
            </ProfileCard>
          ))}
        </ProfilesGrid>
      </Section>

      <Section style={{ padding: '20px' }}>
        <SectionHeader>
          <SmallTitle>Testimonials</SmallTitle>
          <Title>What our customers say</Title>
        </SectionHeader>
        <TestimonialsGrid>
          {testimonials.map((item) => (
            <TestimonialCard key={item.id}>
              <TestimonialQuote>{item.text}</TestimonialQuote>
              <TestimonialProfile>
                <Avatar src={item.image} alt={item.name} />
                <ProfileInfo>
                  <ProfileNameSmall>{item.name}</ProfileNameSmall>
                  <ProfileRoleSmall>{item.role}</ProfileRoleSmall>
                </ProfileInfo>
              </TestimonialProfile>
            </TestimonialCard>
          ))}
        </TestimonialsGrid>
      </Section>

      <Banner />
      <Newsletter />
    </Page>
  );
}
