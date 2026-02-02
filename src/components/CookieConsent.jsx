import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent_choice');
        if (!consent) {
            // Show popup after a short delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleChoice = (choice) => {
        localStorage.setItem('cookie_consent_choice', choice);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 animate-in slide-in-from-bottom-full duration-700">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-slate-900 text-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-8 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        
                        <div className="flex items-center gap-5 text-center md:text-left">
                            <div className="w-14 h-14 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center shrink-0 hidden sm:flex">
                                <Cookie size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1 flex items-center justify-center md:justify-start gap-2">
                                    Cookie Privacy <ShieldCheck size={18} className="text-brand-400" />
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                                    We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking <strong>"Accept All"</strong>, you consent to our use of cookies. Read our <Link to="/pages/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => handleChoice('accepted')}
                                className="px-8 py-3.5 bg-brand-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <Check size={16} strokeWidth={3} /> Accept All
                            </button>
                            <button 
                                onClick={() => handleChoice('declined')}
                                className="px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center whitespace-nowrap"
                            >
                                Decline
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;