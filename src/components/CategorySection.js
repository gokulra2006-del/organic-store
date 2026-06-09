import React from 'react';
import styled from 'styled-components';
import { FaAppleAlt, FaBreadSlice, FaCarrot, FaSeedling } from 'react-icons/fa';

const Section = styled.section`
  background: #ffffff;
  border-radius: 36px;
  padding: 42px 32px;
  box-shadow: 0 22px 60px rgba(15, 48, 22, 0.06);
  margin-top: 40px;
`;

const Header = styled.div`
  display: grid;
  gap: 12px;
  margin-bottom: 34px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  color: #1b4332;
`;

const Description = styled.p`
  margin: 0;
  max-width: 720px;
  color: #475569;
  line-height: 1.8;
`;

const CategoriesGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.article`
  background: linear-gradient(180deg, #f5fbf5 0%, #ffffff 100%);
  border: 1px solid rgba(45, 106, 79, 0.12);
  border-radius: 28px;
  padding: 30px;
  display: grid;
  gap: 18px;
  min-height: 220px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 22px 60px rgba(15, 48, 22, 0.1);
  }
`;

const CategoryIcon = styled.div`
  width: 62px;
  height: 62px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: #ebf8ed;
  color: #2d6a4f;
  font-size: 1.4rem;
`;

const CategoryName = styled.h3`
  margin: 0;
  font-size: 1.35rem;
  color: #1b4332;
`;

const CategoryText = styled.p`
  margin: 0;
  color: #475569;
  line-height: 1.8;
`;

const categories = [
  {
    icon: FaAppleAlt,
    title: 'Fresh Fruits',
    description: 'Premium fruit blends and seasonal berries packed with nutrients.',
  },
  {
    icon: FaCarrot,
    title: 'Vegetables',
    description: 'Fresh leafy greens, roots, and vibrant vegetables for balanced plates.',
  },
  {
    icon: FaSeedling,
    title: 'Wellness',
    description: 'Organic wellness essentials for body care, supplements, and lifestyle.',
  },
  {
    icon: FaBreadSlice,
    title: 'Pantry Staples',
    description: 'Whole grains, nuts, oils, and pantry favorites for daily cooking.',
  },
];

export default function CategorySection() {
  return (
    <Section>
      <Header>
        <Title>Shop by category</Title>
        <Description>
          Discover organic collections designed to support nourishing meals, home cooking, and sustainable living.
        </Description>
      </Header>
      <CategoriesGrid>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <CategoryCard key={category.title}>
              <CategoryIcon>
                <Icon />
              </CategoryIcon>
              <CategoryName>{category.title}</CategoryName>
              <CategoryText>{category.description}</CategoryText>
            </CategoryCard>
          );
        })}
      </CategoriesGrid>
    </Section>
  );
}
