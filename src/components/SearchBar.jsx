import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, Package, TrendingUp, History, ArrowRight } from 'lucide-react';
import api from '../api/api';

const SearchBar = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setSuggestions([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length > 1) {
                setLoading(true);
                try {
                    const res = await api.get(`/products?search=${query}`);
                    setSuggestions(res.data.slice(0, 6));
                } catch (error) {
                    console.error("Search error");
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleSearch = (e) => {
        e?.preventDefault();
        if (query.trim()) {
            onClose();
            navigate(`/products?search=${encodeURIComponent(query.trim())}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Header Area */}
            <div className="border-b border-slate-100 px-6 py-4 md:py-6">
                <div className="container mx-auto flex items-center gap-4">
                    <Search className="w-6 h-6 text-brand-600" />
                    <form onSubmit={handleSearch} className="flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for products, brands and more..."
                            className="w-full text-xl md:text-3xl font-medium outline-none placeholder:text-slate-300 text-slate-900"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
                    >
                        <X className="w-8 h-8 text-slate-400 group-hover:text-slate-900" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Left: Quick Suggestions & Results */}
                        <div className="lg:col-span-8">
                            {query.length > 1 ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                            {loading ? 'Searching...' : `Results for "${query}"`}
                                        </h3>
                                        {suggestions.length > 0 && (
                                            <button onClick={handleSearch} className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                                View all results <ArrowRight size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {suggestions.map((item) => (
                                            <Link 
                                                key={item.id} 
                                                to={`/product/${item.slug}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all group"
                                            >
                                                <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                                                    <img 
                                                        src={item.image_url?.startsWith('http') ? item.image_url : `/products/${item.image_url}`} 
                                                        alt={item.name}
                                                        className="max-h-full object-contain mix-blend-multiply"
                                                        onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=PR'}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{item.name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{item.category_name}</p>
                                                    <p className="mt-1 font-black text-brand-600">${item.price}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    
                                    {!loading && suggestions.length === 0 && (
                                        <div className="text-center py-20">
                                            <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-500 font-medium">No products found matching your search.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <TrendingUp className="w-5 h-5 text-brand-500" />
                                            <h3 className="text-lg font-bold text-slate-900">Popular Searches</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {['Wireless Printers', 'Ink Tank', 'LaserJet Pro', '3D Filament', 'Photo Paper', 'Gaming Mouse'].map(tag => (
                                                <button 
                                                    key={tag}
                                                    onClick={() => { setQuery(tag); }}
                                                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-all"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Promotions or Categories */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="bg-brand-600 rounded-3xl p-8 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">Season Sale</span>
                                    <h4 className="text-2xl font-bold mt-2 mb-4">Get up to 40% OFF on All Printers</h4>
                                    <Link 
                                        to="/products" 
                                        onClick={onClose}
                                        className="inline-block bg-white text-brand-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                                    >
                                        Shop Deals
                                    </Link>
                                </div>
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-8 text-white">
                                <h4 className="text-lg font-bold mb-4">Need help choosing?</h4>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Our experts are available to guide you to the perfect printing solution.</p>
                                <Link 
                                    to="/contact"
                                    onClick={onClose}
                                    className="block w-full py-3 border border-slate-700 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors text-center"
                                >
                                    Talk to Expert
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
