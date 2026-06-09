import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaTimes,
  FaLeaf,
  FaChevronDown,
} from "react-icons/fa";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

const Page = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const TopBar = styled.div`
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 40px;
  @media (max-width: 768px) {
    padding: 16px;
  }
`;
const TopInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;
const PageTitle = styled.h1`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 900;
  color: #0f172a;
`;
const Count = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  @media (max-width: 768px) {
    max-width: 100%;
    order: 3;
    width: 100%;
  }
`;
const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 11px 14px 11px 40px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #16a34a;
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const SortBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #16a34a;
    color: #16a34a;
  }
`;

const Layout = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 40px 60px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 28px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 16px 16px 40px;
  }
`;

/* Sidebar */
const Sidebar = styled.aside`
  @media (max-width: 900px) {
    display: none;
  }
`;
const FilterCard = styled.div`
  background: #fff;
  border: 1.5px solid #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
`;
const FilterTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #0f172a;
`;
const CatItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: ${({ $a }) => ($a ? "#dcfce7" : "transparent")};
  color: ${({ $a }) => ($a ? "#16a34a" : "#475569")};
  font-size: 13px;
  font-weight: ${({ $a }) => ($a ? "700" : "600")};
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 2px;
  &:hover {
    background: #f0fdf4;
  }
`;
const CatCount = styled.span`
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 999px;
`;

const PriceRange = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
const PriceInput = styled.input`
  width: 80px;
  padding: 8px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  outline: none;
  &:focus {
    border-color: #16a34a;
  }
`;

const RatingRow = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 7px 10px;
  border-radius: 8px;
  border: none;
  background: ${({ $a }) => ($a ? "#dcfce7" : "transparent")};
  cursor: pointer;
  margin-bottom: 2px;
  transition: all 0.15s;
  &:hover {
    background: #f0fdf4;
  }
`;
const Stars = styled.div`
  display: flex;
  gap: 2px;
  color: #fbbf24;
  font-size: 12px;
`;
const StarGray = styled.span`
  color: #e2e8f0;
`;

const ClearBtn = styled.button`
  width: 100%;
  padding: 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
`;

/* Mobile filter bar */
const MobileFilters = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const MobPill = styled.button`
  flex-shrink: 0;
  padding: 8px 16px;
  border: 1.5px solid ${({ $a }) => ($a ? "#16a34a" : "#e2e8f0")};
  background: ${({ $a }) => ($a ? "#16a34a" : "#fff")};
  color: ${({ $a }) => ($a ? "#fff" : "#374151")};
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

/* Grid */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 18px;
  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  grid-column: 1/-1;
`;
const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0fdf4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: #16a34a;
`;
const EmptyTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: #0f172a;
`;
const EmptyText = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
`;

const CATS = [
  { key: "all", label: "All Products" },
  { key: "fruits", label: "Fruits" },
  { key: "vegetables", label: "Vegetables" },
  { key: "pantry", label: "Pantry" },
  { key: "nuts", label: "Nuts & Seeds" },
  { key: "herbs", label: "Herbs" },
];

export default function Shop() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);

  const filtered = useMemo(() => {
    let res = [...products];
    if (cat !== "all") res = res.filter((p) => p.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (minPrice) res = res.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) res = res.filter((p) => p.price <= parseFloat(maxPrice));
    if (rating) res = res.filter((p) => p.rating >= rating);
    if (sort === "price-low") res.sort((a, b) => a.price - b.price);
    if (sort === "price-high") res.sort((a, b) => b.price - a.price);
    if (sort === "rating") res.sort((a, b) => b.rating - a.rating);
    return res;
  }, [search, cat, sort, minPrice, maxPrice, rating]);

  const hasFilters = cat !== "all" || minPrice || maxPrice || rating > 0;

  const clearFilters = () => {
    setCat("all");
    setMinPrice("");
    setMaxPrice("");
    setRating(0);
    setSearch("");
  };

  return (
    <Page>
      <TopBar>
        <TopInner>
          <div>
            <PageTitle>Shop</PageTitle>
            <Count>{filtered.length} products found</Count>
          </div>
          <SearchWrap>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrap>
          <SortBtn
            onClick={() =>
              setSort((s) =>
                s === "featured"
                  ? "price-low"
                  : s === "price-low"
                    ? "price-high"
                    : s === "price-high"
                      ? "rating"
                      : "featured",
              )
            }
          >
            <FaSort /> Sort:{" "}
            {sort === "featured"
              ? "Featured"
              : sort === "price-low"
                ? "Price: Low"
                : sort === "price-high"
                  ? "Price: High"
                  : "Top Rated"}
          </SortBtn>
        </TopInner>
      </TopBar>

      <Layout>
        <Sidebar>
          {hasFilters && (
            <ClearBtn onClick={clearFilters}>
              <FaTimes /> Clear Filters
            </ClearBtn>
          )}

          <FilterCard style={{ marginTop: hasFilters ? 16 : 0 }}>
            <FilterTitle>Categories</FilterTitle>
            {CATS.map((c) => (
              <CatItem
                key={c.key}
                $a={cat === c.key}
                onClick={() => setCat(c.key)}
              >
                {c.label}
                <CatCount>
                  {
                    products.filter((p) =>
                      c.key === "all" ? true : p.category === c.key,
                    ).length
                  }
                </CatCount>
              </CatItem>
            ))}
          </FilterCard>

          <FilterCard>
            <FilterTitle>Price Range</FilterTitle>
            <PriceRange>
              <PriceInput
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: "#94a3b8", fontWeight: 700 }}>—</span>
              <PriceInput
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </PriceRange>
          </FilterCard>

          <FilterCard>
            <FilterTitle>Minimum Rating</FilterTitle>
            {[4, 3, 2, 1].map((r) => (
              <RatingRow
                key={r}
                $a={rating === r}
                onClick={() => setRating(rating === r ? 0 : r)}
              >
                <Stars>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i}>{i <= r ? "★" : <StarGray>★</StarGray>}</span>
                  ))}
                </Stars>
                <span
                  style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}
                >
                  & Up
                </span>
              </RatingRow>
            ))}
          </FilterCard>
        </Sidebar>

        <div>
          <MobileFilters>
            {CATS.map((c) => (
              <MobPill
                key={c.key}
                $a={cat === c.key}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </MobPill>
            ))}
          </MobileFilters>

          <Grid>
            {filtered.length > 0 ? (
              filtered.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaLeaf />
                </EmptyIcon>
                <EmptyTitle>No products found</EmptyTitle>
                <EmptyText>
                  Try adjusting your filters or search query
                </EmptyText>
              </EmptyState>
            )}
          </Grid>
        </div>
      </Layout>
    </Page>
  );
}
