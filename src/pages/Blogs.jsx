import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/blogs');
                setBlogs(res.data);
            } catch (error) {
                console.error("Failed to fetch blogs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <SEO pageName="blogs" fallbackTitle="Tech Insights - inkzo" fallbackDesc="Read the latest news, tips, and reviews from inkzo experts." />

            {/* Header */}
            <div className="bg-slate-900 py-20 px-6">
                <div className="container mx-auto text-center">
                    <span className="text-brand-500 font-bold uppercase tracking-widest text-xs mb-4 block">Our Blog</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Insights & News</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Stay updated with the latest trends in printing technology and office productivity.</p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 -mt-10 relative z-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link key={blog.id} to={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                                    <img 
                                        src={blog.image_url?.startsWith('http') ? blog.image_url : `/blogs/${blog.image_url}`} 
                                        alt={blog.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/800x500?text=No+Image'}
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        News
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {blog.author || 'Admin'}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">
                                        {blog.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                        Read More <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {!loading && blogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 text-lg">No articles found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;