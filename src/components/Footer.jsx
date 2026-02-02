import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import Skeleton from './Skeleton';
import { 
    Mail, Phone, MapPin, Zap, 
    ArrowRight, Globe, ShieldCheck
} from 'lucide-react';

const Footer = () => {
    const [branding, setBranding] = useState(null);
    const [email, setEmail] = useState('');

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
                const [brandingRes, catRes] = await Promise.all([
                    api.get(`/websites/${websiteId}`),
                    api.get('/categories')
                ]);
                setBranding({
                    ...brandingRes.data,
                    logo_url: brandingRes.data.logo_url || '/logo/logo.jpg'
                });
                setCategories(catRes.data.slice(0, 5)); // Take first 5 categories
            } catch (error) {
                console.error("Footer data fetch error", error);
            }
        };
        fetchData();
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address.");
            return;
        }
        toast.success("Successfully Subscribed!");
        setEmail('');
    };

    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900 font-sans">
            <div className="container mx-auto px-6 lg:px-12">
                
                {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20 border-b border-gray-900 pb-20">
                    <div className="max-w-md">
                        <Link to="/" className="block mb-6">
                            {branding ? (
                                branding.logo_url ? (
                                    <img 
                                        src={branding.logo_url} 
                                        alt={branding.name} 
                                        className="h-8 w-auto object-contain"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold tracking-tight uppercase">
                                        {branding.name}
                                    </span>
                                )
                            ) : (
                                <Skeleton className="h-8 w-32 bg-gray-800" />
                            )}
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Subscribe to our newsletter to receive news on update.
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="w-full sm:w-80 bg-transparent border-b border-gray-700 px-0 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder-gray-500 rounded-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="uppercase text-xs font-bold tracking-widest text-white border-b border-transparent hover:border-white transition-all pb-3 text-left sm:text-center w-fit">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- MIDDLE SECTION: LINKS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    <FooterColumn title="Shop" links={
                        categories.length > 0 
                        ? categories.map(cat => ({ label: cat.name, to: `/products?category=${cat.slug}` }))
                        : [
                            { label: 'New Arrivals', to: '/products' },
                            { label: 'Best Sellers', to: '/products' },
                            { label: 'Sale', to: '/products' },
                        ]
                    } />
                    <FooterColumn title="Company" links={[
                        { label: 'About Us', to: '/about' },
                        { label: 'Contact', to: '/contact' }
                    ]} />
                    <FooterColumn title="Support" links={[
                        { label: 'FAQs', to: '/faq' },
                        { label: 'Shipping Policy', to: '/pages/shipping' },
                        { label: 'Returns', to: '/pages/refund' },
                        { label: 'Privacy Policy', to: '/pages/privacy' },
                        { label: 'Terms & Conditions', to: '/pages/terms' }
                    ]} />
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">Contact</h4>
                        {branding ? (
                            <div className="space-y-4 text-sm text-gray-400">
                                <p>{branding.contact_address}</p>
                                <p className="text-white">{branding.phone}</p>
                                <p className="text-white hover:underline cursor-pointer">{branding.contact_email}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full bg-gray-800" />
                                <Skeleton className="h-4 w-2/3 bg-gray-800" />
                                <Skeleton className="h-4 w-1/2 bg-gray-800" />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- BOTTOM SECTION: COPYRIGHT --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-900">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                        © 2026 {branding ? branding.name : 'inkzo'}. • A subsidiary of PrimeFix Solutions LLC • All Rights Reserved All Rights Reserved.
                    </p>
                    {/* <div className="flex gap-4">
                        <SocialLink href="#" label="FB" />
                        <SocialLink href="#" label="TW" />
                        <SocialLink href="#" label="IG" />
                        <SocialLink href="#" label="PI" />
                    </div> */}
                </div>

            </div>
        </footer>
    );
};

// --- HELPER COMPONENTS ---

const FooterColumn = ({ title, links }) => (
    <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">{title}</h4>
        <ul className="space-y-3">
            {links.map((link, i) => (
                <li key={i}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialLink = ({ href, label }) => (
    <a href={href} className="text-xs font-bold text-white hover:text-gray-400 transition-colors">
        {label}
    </a>
);

export default Footer;