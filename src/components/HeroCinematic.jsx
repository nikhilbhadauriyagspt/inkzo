import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ChevronLeft, ChevronRight, Pause, Phone } from 'lucide-react';

const HeroCinematic = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const slides = [
        {
            id: 1,
            image: "/banner/banner-2.jpg",
            subtitle: "PREMIUM OFFICE SOLUTIONS",
            title: "Performance.",
            highlight: "Without Limits",
            description: "Transform your workspace with our enterprise-grade Laser series. Engineered for high-speed precision and heavy-duty reliability.",
            cta: "Shop Laser Series"
        },
        {
            id: 2,
            image: "/banner/banner-1.jpg",
            subtitle: "PROFESSIONAL PHOTOGRAPHY",
            title: "Color.",
            highlight: "Perfected",
            description: "Bring your vision to life with 99% color accuracy. The gold standard for photographers, designers, and creative agencies.",
            cta: "Shop Inkjet Pro"
        },
        {
            id: 3,
            image: "/banner/banner-3.jpg",
            subtitle: "ECO-FRIENDLY INNOVATION",
            title: "Efficiency.",
            highlight: "Mastered",
            description: "Cut your printing costs by 90% without losing quality. Our SuperTank technology is the smartest choice for the modern home office.",
            cta: "Discover SuperTank"
        }
    ];

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 6000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, slides.length]);

    return (
        <div className="relative w-full h-screen min-h-[700px] bg-slate-900 overflow-hidden group lg:-mt-[150px] -mt-[76px]">

            {/* --- BACKGROUND SLIDES --- */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Image with Parallax Effect */}
                    <div className="absolute inset-0 transform scale-110 transition-transform duration-[10000ms] ease-linear"
                        style={{ transform: currentSlide === index ? 'scale(100%)' : 'scale(110%)' }}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Gradient Overlay - Cinematic Fade */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
                </div>
            ))}

            {/* --- CONTENT CONTAINER --- */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-20 container mx-auto h-full">
                <div className="max-w-4xl pt-20 lg:pt-32">

                    {/* Animated Text Content */}
                    <div key={currentSlide} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-[2px] bg-brand-500 shadow-[0_0_15px_rgba(13,148,136,0.5)]"></span>
                            <p className="text-brand-400 font-bold uppercase tracking-[0.3em] text-xs">
                                {slides[currentSlide].subtitle}
                            </p>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8">
                            {slides[currentSlide].title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
                                {slides[currentSlide].highlight}
                            </span>
                        </h1>

                        <p className="text-slate-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-12 opacity-80">
                            {slides[currentSlide].description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6">
                            <Link
                                to="/products"
                                className="group relative px-10 py-5 bg-white text-slate-950 overflow-hidden rounded-full font-black text-xs uppercase tracking-widest hover:text-white transition-colors duration-300"
                            >
                                <span className="absolute inset-0 w-full h-full bg-brand-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></span>
                                <span className="relative z-10 flex items-center gap-3">
                                    {slides[currentSlide].cta} <ArrowRight size={16} />
                                </span>
                            </Link>

                            <Link
                                to="/contact"
                                className="px-10 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                            >
                                <Phone size={16} className="text-brand-400" /> Contact Expert
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- BOTTOM CONTROLS BAR --- */}
            <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
                <div className="container mx-auto px-8 md:px-20 h-24 flex items-center justify-between">

                    {/* Left: Slide Indicators */}
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-2 text-white/50 font-mono text-xs">
                            <span className="text-white font-bold">0{currentSlide + 1}</span>
                            <div className="w-20 h-[2px] bg-white/10 rounded-full overflow-hidden">
                                <div key={currentSlide} className="h-full bg-brand-500 animate-[progress_6s_linear]"></div>
                            </div>
                            <span>0{slides.length}</span>
                        </div>

                        <div className="hidden md:flex gap-8">
                            {slides.map((slide, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`text-xs font-bold uppercase tracking-widest transition-colors ${currentSlide === idx ? 'text-white' : 'text-white/30 hover:text-white'
                                        }`}
                                >
                                    {slide.highlight}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Navigation Arrows */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        >
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <div className="h-8 w-px bg-white/10 mx-2"></div>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                            className="group p-4 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} className="text-white group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                            className="group p-4 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ChevronRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Global Keyframes for Progress Bar */}
            <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default HeroCinematic;