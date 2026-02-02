import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MoveRight, Zap, ShieldCheck, Headphones, CreditCard, ChevronDown, MousePointer2 } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "/banner/banner-1.jpg",
      tag: "NEW RELEASE 2026",
      title: "ULTRA FAST",
      subTitle: "ENTERPRISE PRO",
      desc: "Revolutionary laser technology designed for high-performance business workflows. Experience precision engineered for perfection.",
    },
    {
      image: "/banner/banner-2.jpg",
      tag: "SMART SOLUTIONS",
      title: "PREMIUM",
      subTitle: "ECO-TANK SERIES",
      desc: "Sustainable printing with high-yield ink tanks. Seamless connectivity for the modern remote professional.",
    },
    {
      image: "/banner/banner-3.jpg",
      tag: "CREATIVE STUDIO",
      title: "STUDIO",
      subTitle: "PRECISION SCANNERS",
      desc: "High-resolution scanning for architects and designers. Capture every detail with stunning color accuracy.",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-white min-h-[90vh] flex items-center pt-20 overflow-hidden">
      
      {/* Right Side Subtle Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 z-0 hidden lg:block"></div>

      {/* --- LEFT SIDE: SCROLL TO EXPLORE --- */}
      <div className="absolute left-6 bottom-12 hidden xl:flex flex-col items-center gap-6 z-30">
        <div className="flex flex-col items-center gap-4 animate-bounce duration-[2000ms]">
          <p className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black tracking-[0.4em] uppercase text-slate-400">
            Scroll to explore
          </p>
          <div className="w-[1px] h-12 bg-slate-200"></div>
          <ChevronDown size={14} className="text-brand-600" />
        </div>
      </div>

      {/* RIGHT SIDE NAVIGATION DOTS */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="group flex items-center justify-end gap-4"
          >
            <span className={`text-[10px] font-black tracking-widest transition-all ${
              currentSlide === idx ? 'text-brand-600 opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100'
            }`}>
              {idx === 0 ? 'INTRO' : idx === 1 ? 'SMART' : 'STUDIO'}
            </span>
            <div className={`h-1.5 rounded-full transition-all duration-500 ${
              currentSlide === idx ? 'w-10 bg-brand-600' : 'w-2 bg-slate-200 group-hover:bg-slate-300'
            }`} />
          </button>
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* CONTENT SECTION */}
          <div className="w-full lg:w-[55%] text-center lg:text-left">
            <div className="max-w-2xl mx-auto lg:mx-0">
              <p className="text-[11px] font-black tracking-[0.3em] text-brand-600 mb-6 uppercase animate-in fade-in slide-in-from-bottom-4 duration-500">
                {slides[currentSlide].tag}
              </p>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-slate-950 mb-8 animate-in fade-in slide-in-from-left-8 duration-700">
                {slides[currentSlide].title} <br />
                <span className="text-slate-400">{slides[currentSlide].subTitle}</span>
              </h1>

              <p className="text-slate-500 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-in fade-in slide-in-from-left-12 duration-1000">
                {slides[currentSlide].desc}
              </p>

              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <Link 
                  to="/products" 
                  className="px-10 py-5 bg-slate-950 text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3"
                >
                  Explore Collection <MoveRight size={16} />
                </Link>

                <Link 
                  to="/contact"
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
                >
                  Contact Expert <MousePointer2 size={16} />
                </Link>
              </div>

              {/* Minimal Trust Bar */}
              <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-slate-100">
                <TrustPoint icon={<ShieldCheck size={18}/>} text="2 YEAR WARRANTY" />
                <TrustPoint icon={<Zap size={18}/>} text="FAST DELIVERY" />
                <TrustPoint icon={<Headphones size={18}/>} text="EXPERT SUPPORT" />
                <TrustPoint icon={<CreditCard size={18}/>} text="SECURE PAYMENT" />
              </div>
            </div>
          </div>

          {/* VISUAL SECTION */}
          <div className="w-full lg:w-[45%]">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-square group">
              <img 
                src={slides[currentSlide].image} 
                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105"
                alt="Product"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/20 to-transparent"></div>
              
              {/* Overlay Nav */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                 <button 
                  onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
                  className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all shadow-lg"
                 >
                   <MoveRight className="rotate-180" size={20} />
                 </button>
                 <button 
                  onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                  className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all shadow-lg"
                 >
                   <MoveRight size={20} />
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const TrustPoint = ({ icon, text }) => (
  <div className="flex flex-col items-center lg:items-start gap-3">
    <div className="text-brand-600">{icon}</div>
    <span className="text-[9px] font-black tracking-widest text-slate-900 uppercase">{text}</span>
  </div>
);

export default Hero;