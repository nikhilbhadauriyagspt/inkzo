import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import { ShieldCheck, Truck, Users, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

const AboutUs = () => {
      const [branding, setBranding] = useState({ name: 'inkzo' });
  useEffect(() => {
      const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
      api.get(`/websites/${websiteId}`).then(res => setBranding(res.data)).catch(() => {});
  }, []);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-brand-100 selection:text-brand-600">
      <SEO 
        pageName="about" 
        fallbackTitle={`About ${branding.name}`} 
        fallbackDesc={`Learn more about ${branding.name} and our mission.`} 
      />

      {/* --- BREADCRUMB & HEADER --- */}
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-20">
        <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6">
                <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
                <ChevronRight size={12} />
                <span className="text-slate-900 font-bold">About Us</span>
            </div>
            
            <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse"></span>
                    <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px]">Our Story</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                    Building the future of <br/> <span className="text-brand-600">business technology.</span>
                </h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
                    {branding.name} is your trusted partner for high-performance printing solutions and office automation. We bridge the gap between innovation and reliability.
                </p>
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Split) --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute top-8 -right-8 w-full h-full bg-slate-100 rounded-[3rem] -z-10 group-hover:bg-brand-50 transition-colors duration-500"></div>
              <img 
                src="/about-us.jpg" 
                alt="About Us" 
                className="w-full rounded-[3rem] shadow-2xl shadow-slate-200/50"
              />
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Driving Efficiency Since 2015</h2>
              <p className="text-slate-500 leading-relaxed mb-6 font-medium">
                At <strong>{branding.name}</strong>, we don't just sell hardware. We provide solutions that keep your business running smoothly. From small home offices to large enterprise networks, our mission is to deliver technology that works as hard as you do.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                We partner directly with global leaders like HP, Canon, and Epson to ensure authenticity and performance. Every product in our catalog is curated for quality, durability, and cost-efficiency.
              </p>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {['100% Authentic', 'Fast Delivery', 'Expert Support', 'Top Rated'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={14} />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">{item}</span>
                    </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="p-4 border-r border-white/10 last:border-0">
              <p className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">10k+</p>
              <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Products Sold</p>
            </div>
            <div className="p-4 border-r border-white/10 last:border-0">
              <p className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">500+</p>
              <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Enterprise Clients</p>
            </div>
            <div className="p-4 border-r border-white/10 last:border-0">
              <p className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">99%</p>
              <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Satisfaction</p>
            </div>
            <div className="p-4">
              <p className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">24/7</p>
              <p className="text-brand-400 text-[10px] font-bold uppercase tracking-widest">Expert Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- OUR VALUES --- */}
      <section className="py-24 border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-brand-600 font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block">Our Core DNA</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">The Values That Drive Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-slate-50 text-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:bg-brand-50">
                <ShieldCheck size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Integrity First</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">We believe in transparent pricing and 100% genuine products without compromises.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-slate-50 text-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:bg-brand-50">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Customer Focus</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">Our success is measured by your satisfaction and the success of your business operations.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-slate-50 text-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110 group-hover:bg-brand-50">
                <Award size={36} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">Excellence</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">We only curate top-tier technology from global leaders to ensure maximum efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BRAND PARTNERS --- */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-12">Trusted by Global Industry Leaders</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['HP', 'CANON', 'EPSON', 'BROTHER', 'XEROX', 'RICOH'].map((brand) => (
                <span key={brand} className="text-3xl md:text-4xl font-black tracking-tighter cursor-default text-slate-900 hover:text-brand-600 transition-colors">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 text-center container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Ready to upgrade your infrastructure?</h2>
            <div className="flex justify-center gap-4">
            <Link to="/products" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl hover:shadow-brand-500/20">
                Shop Products
            </Link>
            <Link to="/contact" className="px-10 py-4 border border-slate-200 text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
                Contact Sales
            </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;