import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, ChevronRight } from 'lucide-react';

const BlogDetails = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // Fetch current blog
                const res = await api.get(`/blogs/${slug}`);
                setBlog(res.data);

                // Fetch other blogs for "Read Next" (simulated by fetching all and filtering)
                const allBlogsRes = await api.get('/blogs');
                const others = allBlogsRes.data
                    .filter(b => b.slug !== slug)
                    .slice(0, 2);
                setRelatedBlogs(others);

            } catch (error) {
                console.error("Failed to fetch article data");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Article...</p>
        </div>
    );

    if (!blog) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-4">404</h1>
            <p className="text-slate-500 mb-8">Article not found.</p>
            <Link to="/" className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-brand-700 transition-all">
                Go Home
            </Link>
        </div>
    );

    const heroImage = blog.image_url?.startsWith('http') ? blog.image_url : `/blogs/${blog.image_url}`;

    return (
        <div className="bg-slate-50 min-h-screen pb-32">
            <SEO 
                pageName={`blog_${blog.id}`}
                fallbackTitle={`${blog.meta_title || blog.title} | inkzo Insights`}
                fallbackDesc={blog.meta_description || blog.description}
            />
            <SchemaMarkup type="blog" data={blog} />

            {/* --- IMMERSIVE HERO HEADER --- */}
            <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-slate-900">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img 
                        src={heroImage} 
                        alt={blog.title} 
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => e.target.src = "https://via.placeholder.com/1600x900?text=Tech+Insight"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                </div>

                {/* Navbar Placeholder/Back Button */}
                <div className="absolute top-0 left-0 w-full p-8 z-20">
                    <div className="container mx-auto">
                        <Link to="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors backdrop-blur-md bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>
                    </div>
                </div>

                {/* Title Content */}
                <div className="absolute bottom-0 left-0 w-full z-10 pb-24 md:pb-32 px-6">
                    <div className="container mx-auto max-w-4xl text-center">
                        <div className="inline-flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md">
                                Tech Insight
                            </span>
                            <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                <Calendar size={12} /> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {blog.title}
                        </h1>

                        {blog.description && (
                            <p className="text-lg md:text-xl text-slate-200 font-medium mb-8 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                                {blog.description}
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-8 text-white/80 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-900">
                                    <User size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Written by</p>
                                    <p className="text-sm font-bold text-white">{blog.author || 'inkzo Editorial'}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                            <div className="hidden sm:flex items-center gap-2">
                                <Clock size={18} className="text-brand-400" />
                                <span className="font-medium">5 Min Read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT CARD --- */}
            <div className="container mx-auto px-4 relative z-20 -mt-20">
                <article className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16 lg:p-20 overflow-hidden">
                    
                    {/* Share & Save Toolbar */}
                    <div className="flex justify-between items-center mb-12 pb-8 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors font-bold text-xs uppercase tracking-widest">
                                <Share2 size={16} /> Share
                            </button>
                            <button className="flex items-center gap-2 text-slate-400 hover:text-brand-600 transition-colors font-bold text-xs uppercase tracking-widest">
                                <Bookmark size={16} /> Save
                            </button>
                        </div>
                        <div className="text-slate-300 text-xs font-mono">
                            ID: #{blog.id.toString().padStart(4, '0')}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div 
                        className="prose prose-lg md:prose-xl max-w-none text-slate-600 prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-xl prose-blockquote:border-l-brand-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    ></div>

                    {/* Footer / Tags */}
                    <div className="mt-16 pt-10 border-t border-slate-100">
                        <div className="flex flex-wrap gap-2">
                            {['Technology', 'Innovation', 'Guide'].map(tag => (
                                <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-xs font-bold hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                </article>
            </div>

            {/* --- READ NEXT SECTION --- */}
            {relatedBlogs.length > 0 && (
                <div className="container mx-auto px-6 mt-24 max-w-5xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900">Read Next</h3>
                        <Link to="/blogs" className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {relatedBlogs.map((item) => (
                            <Link key={item.id} to={`/blog/${item.slug}`} className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-brand-200 transition-all cursor-pointer">
                                <div className="flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                                        <img 
                                            src={item.image_url?.startsWith('http') ? item.image_url : `/blogs/${item.image_url}`} 
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" 
                                            alt={item.title} 
                                            onError={(e) => e.target.src='https://via.placeholder.com/150'} 
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-1 block">Related</span>
                                        <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h4>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default BlogDetails;