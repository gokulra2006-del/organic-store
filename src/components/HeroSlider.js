import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&h=700&fit=crop',
    subtitle: '100% Organic & Natural',
    title: 'Fresh from Farm',
    description: 'Premium organic products delivered to your doorstep',
    cta: 'Shop Now'
  },
  {
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&h=700&fit=crop',
    subtitle: 'Healthy Living Starts Here',
    title: 'Natural Foods',
    description: 'Nourish your body with the finest organic ingredients',
    cta: 'Explore Collection'
  },
  {
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1600&h=700&fit=crop',
    subtitle: 'Pure & Organic Beauty',
    title: 'Organic Cosmetics',
    description: 'Natural skincare and beauty products for a radiant you',
    cta: 'View Products'
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };
  
  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 md:px-8">
            {/* Subtitle */}
            <p className={`text-sm md:text-base font-semibold text-primary-300 mb-4 letter-spacing tracking-widest transition-all duration-700 ${
              index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              ✨ {slide.subtitle}
            </p>
            
            {/* Main Title */}
            <h1 className={`font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-center leading-tight transition-all duration-700 ${
              index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {slide.title}
            </h1>
            
            {/* Description */}
            <p className={`text-lg md:text-xl text-white/90 mb-8 max-w-2xl text-center transition-all duration-700 delay-100 ${
              index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {slide.description}
            </p>
            
            {/* CTA Button */}
            <Link 
              to="/shop"
              className={`btn-primary px-8 md:px-10 py-4 rounded-xl text-base md:text-lg font-semibold transition-all duration-700 delay-200 ${
                index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {slide.cta} →
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
      >
        <FaChevronLeft size={24} />
      </button>
      
      <button
        onClick={next}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === current 
                ? 'w-8 h-3 bg-primary-500' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;