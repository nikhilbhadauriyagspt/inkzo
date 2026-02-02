import React, { useState, useEffect } from 'react';
import api from '../api/api';
import SEO from '../components/SEO';
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
                const res = await api.get('/faqs', { params: { website_id: websiteId } });
                setFaqs(res.data);
                setFilteredFaqs(res.data);
            } catch (error) {
                console.error("Failed to fetch FAQs");
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredFaqs(faqs);
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredFaqs(faqs.filter(faq => 
                faq.question.toLowerCase().includes(lower) || 
                faq.answer.toLowerCase().includes(lower)
            ));
        }
    }, [searchTerm, faqs]);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-sans selection:bg-brand-100 selection:text-brand-600">
            <SEO 
                pageName="faq" 
                fallbackTitle="Help Center - NovaStore" 
                fallbackDesc="Find answers to common questions about our products and services." 
            />

            {/* --- BREADCRUMB & HEADER --- */}
            <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-8">
                        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-slate-900 font-bold">Help Center</span>
                    </div>

                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full mb-6 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse"></span>
                            <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px]">Support</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            How can we help you?
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                            Search our knowledge base for answers to common questions regarding orders, shipping, and product support.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-lg mx-auto">
                            <input 
                                type="text" 
                                placeholder="Search for answers..." 
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-lg shadow-slate-200/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FAQ LIST --- */}
            <div className="container mx-auto px-6 py-20 max-w-3xl">
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={faq.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-brand-100">
                                <button 
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                                >
                                    <span className={`font-bold text-lg pr-8 transition-colors ${activeIndex === index ? 'text-brand-600' : 'text-slate-900'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeIndex === index ? 'bg-brand-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>
                                
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-8 pt-0 text-slate-500 leading-relaxed font-medium">
                                        <div className="pt-6 border-t border-slate-50">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <HelpCircle size={48} className="text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                            <p className="text-slate-500 text-sm">Try using different keywords or contact support.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CTA SECTION --- */}
            <div className="container mx-auto px-6 pb-24">
                <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-8 border border-white/10">
                            <MessageCircle size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Still have questions?</h2>
                        <p className="text-slate-400 mb-10 text-lg">Can't find the answer you're looking for? Our team is here to help.</p>
                        <div className="flex justify-center gap-4">
                            <Link to="/contact" className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-lg">
                                Contact Support
                            </Link>
                            <Link to="/" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                                Back Home
                            </Link>
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                </div>
            </div>

        </div>
    );
};

export default FAQ;