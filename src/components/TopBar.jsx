import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { Phone, Mail, HelpCircle, Truck, ChevronDown, MapPin, Sparkles } from 'lucide-react';

const TopBar = () => {
      const [branding, setBranding] = useState({
          contact_email: 'support@inkzo.com'
      });
  useEffect(() => {
    const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
    const fetchBranding = async () => {
      try {
        const res = await api.get(`/websites/${websiteId}`);
        setBranding(res.data);
      } catch (error) {
        console.error("Failed to fetch topbar data");
      }
    };
    fetchBranding();
  }, []);

  return (
    <div className="hidden md:block bg-gradient-to-r from-slate-50 via-white to-slate-50 text-slate-600 border-b border-slate-100 py-2 relative z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-8">
          
          {/* Left: Contact Info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5">
              <a href={`tel:${branding.phone}`} className="group flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase hover:text-brand-600 transition-colors">
                {/* <span className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-brand-500 group-hover:scale-110 group-hover:border-brand-200 transition-all shadow-sm">
                    <Phone size={10} strokeWidth={2.5} />
                </span> */}
                <span>{branding.phone}</span>
              </a>
              <a href={`mailto:${branding.contact_email}`} className="group flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase hover:text-brand-600 transition-colors">
                 <span className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-brand-500 group-hover:scale-110 group-hover:border-brand-200 transition-all shadow-sm">
                    <Mail size={10} strokeWidth={2.5} />
                </span>
                <span>Email Us</span>
              </a>
            </div>
          </div>

          {/* Center: Ticker/Message */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50/50 border border-brand-100/50">
              <Sparkles size={12} className="text-brand-500 animate-pulse" />
              <p className="text-[10px] font-bold tracking-wider uppercase text-brand-700">
                Flash Sale: <span className="font-black">20% OFF</span> Laser Printers • Ends in 12 Hours
              </p>
            </div>
          </div>

          {/* Right: Utilities & Socials */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/track" className="flex items-center gap-2 hover:text-brand-600 transition-colors text-[10px] font-bold tracking-widest uppercase">
                <span>Track Order</span>
              </Link>
              <div className="h-3 w-px bg-slate-200"></div>
              <Link to="/faq" className="flex items-center gap-2 hover:text-brand-600 transition-colors text-[10px] font-bold tracking-widest uppercase">
                <span>Help</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;
