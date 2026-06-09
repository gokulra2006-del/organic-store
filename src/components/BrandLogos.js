import React from 'react';

const brands = [
  { name: 'OrganicLand', color: '#4a7c59' },
  { name: 'TrueFoods', color: '#6b8e23' },
  { name: 'be.Leaf', color: '#8fbc8f' },
  { name: 'SweetLeaf', color: '#556b2f' },
];

const BrandLogos = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {brands.map((brand, index) => (
            <div key={index} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              <svg width="30" height="30" viewBox="0 0 30 30" className="text-primary-500">
                <path d="M15 5 Q20 0 25 5 Q20 10 15 5 M15 5 L15 25" fill="currentColor" />
                <circle cx="15" cy="15" r="3" fill="currentColor" />
              </svg>
              <span className="text-xl font-display italic" style={{ color: brand.color }}>
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;