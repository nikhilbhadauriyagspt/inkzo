import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/banner/banner-1.jpg',
    subtitle: 'Spring Collection 2026',
    title: 'Minimalist',
    highlight: 'Elegance.',
    desc: 'Discover our latest arrival of premium accessories and electronics designed for the modern professional.',
    link: '/products'
  },
  {
    id: 2,
    image: '/banner/banner-2.jpg',
    subtitle: 'New Arrivals',
    title: 'Modern',
    highlight: 'Workspace.',
    desc: 'Upgrade your desk setup with our curated selection of high-performance peripherals and sleek organizers.',
    link: '/products?category=accessories'
  },
  {
    id: 3,
    image: '/banner/banner-3.jpg',
    subtitle: 'Exclusive Deals',
    title: 'Premium',
    highlight: 'Tech.',
    desc: 'Limited time offers on top-tier gadgets. Experience innovation without compromise.',
    link: '/products?category=electronics'
  }
];

const HeroModern = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[600px] md:h-[800px] overflow-hidden bg-gray-50 group">
      
      {/* Slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                src={slide.image} 
                alt={slide.title} 
                className={`w-full h-full object-cover object-center transition-transform duration-[5000ms] ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-6 h-full flex items-center justify-start md:justify-start">
                <div className={`max-w-xl pl-0 md:pl-12 transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <span className="block text-sm md:text-base font-bold tracking-[0.2em] uppercase text-gray-500 mb-4">
                    {slide.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl font-light text-gray-900 leading-[1.1] mb-8 tracking-tight">
                    {slide.title} <br />
                    <span className="font-bold text-black">{slide.highlight}</span>
                </h1>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md font-light">
                    {slide.desc}
                </p>
                <Link 
                    to={slide.link} 
                    className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all duration-300 shadow-xl shadow-black/5"
                >
                    Shop Now <ArrowRight size={16} />
                </Link>
                </div>
            </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-12 right-12 flex gap-4 z-20 hidden md:flex">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white/50 backdrop-blur-sm"
          >
              <ArrowRight className="rotate-180" size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all bg-white/50 backdrop-blur-sm"
          >
              <ArrowRight size={20} />
          </button>
      </div>

      {/* Mobile Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 md:hidden z-20">
          {slides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-black w-6' : 'bg-black/20'}`}
              />
          ))}
      </div>
    </section>
  );
};

export default HeroModern;