import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import HeroModern from '../components/HeroModern';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import {
    Heart, ShoppingBag, ArrowRight, MoveRight, 
    Zap, ShieldCheck, Truck, Headphones, Search
} from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState('New Arrivals');
    const [deal, setDeal] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { addToCart } = useCart();

    // Timer Logic
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            // Target: End of current day
            const target = new Date();
            target.setHours(23, 59, 59, 999);

            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft(); // Initial call

        return () => clearInterval(timer);
    }, []);
    
    // Loading states
    const [isProductsLoading, setIsProductsLoading] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchFastData = async () => {
            try {
                const [catRes, dealRes, blogRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/settings/deal'),
                    api.get('/blogs')
                ]);
                setCategories(catRes.data);
                setDeal(dealRes.data);
                setBlogs(blogRes.data);
            } catch (error) {
                console.error("Error fetching fast data:", error);
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchFastData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getTabProducts = () => {
        if (activeTab === 'New Arrivals') return [...products].sort((a, b) => b.id - a.id).slice(0, 8);
        if (activeTab === 'Best Sellers') return products.filter(p => p.is_best_selling).slice(0, 8);
        if (activeTab === 'On Sale') return products.filter(p => parseFloat(p.mrp) > parseFloat(p.price)).slice(0, 8);
        return products.slice(0, 8);
    };

    const tabProducts = getTabProducts();

    return (
        <div className="bg-white min-h-screen font-sans text-black">
            <SEO pageName="home" fallbackTitle="Home - inkzo" fallbackDesc="Shop premium technology." />

            <HeroModern />

            {/* --- SECTION 1: CATEGORIES (Clean Grid) --- */}
            <section className="py-24 container mx-auto px-6">
                <div className="text-center mb-16">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Shop Collections</p>
                    <h2 className="text-4xl font-light text-black">Browse Categories</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isInitialLoading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[400px] w-full" />) : (
                        categories.slice(0, 3).map((cat) => (
                            <Link 
                                key={cat.id} 
                                to={`/products?category=${cat.slug}`}
                                className="group relative block overflow-hidden h-[400px] bg-gray-50"
                            >
                                <img
                                    src={cat.image?.startsWith('http') ? cat.image : `/category/${cat.image}`}
                                    alt={cat.name}
                                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                                    <h3 className="text-3xl font-light mb-2">{cat.name}</h3>
                                    <span className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Shop Now
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* --- SECTION 2: PRODUCTS (Minimalist Tabs) --- */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center mb-16 space-y-6">
                        <h2 className="text-4xl font-light text-black">Trending Now</h2>
                        
                        <div className="flex gap-8 border-b border-gray-100 pb-1">
                            {['New Arrivals', 'Best Sellers', 'On Sale'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                                        ? 'text-black border-b-2 border-black'
                                        : 'text-gray-400 hover:text-black'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {isProductsLoading ? Array(8).fill(0).map((_, i) => (
                             <div key={i}>
                                <Skeleton className="w-full aspect-[4/5] mb-4" />
                                <Skeleton className="w-2/3 h-4 mb-2" />
                                <Skeleton className="w-1/3 h-4" />
                             </div>
                        )) : (
                            tabProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                    
                    <div className="mt-20 text-center">
                         <Link to="/products" className="inline-block px-10 py-4 border border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">
                             View All Products
                         </Link>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: DEAL (Minimalist Split Feature) --- */}
            {deal && (
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            
                            {/* Left: Image (Styled like ProductCard) */}
                            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                <Link to={`/product/${deal.slug}`} className="block w-full h-full p-12 flex items-center justify-center">
                                    <img
                                        src={deal.image_url?.startsWith('http') ? deal.image_url : `/products/${deal.image_url}`}
                                        alt={deal.name}
                                        className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105 mix-blend-multiply"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                                    />
                                </Link>
                                <span className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                                    Deal of the Day
                                </span>
                            </div>

                            {/* Right: Content */}
                            <div className="flex flex-col items-start text-left">
                                <span className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-4">Limited Time Offer</span>
                                <h2 className="text-4xl md:text-5xl font-light text-black mb-6 leading-tight">{deal.name}</h2>
                                <p className="text-gray-500 text-base mb-8 font-light leading-relaxed line-clamp-3">
                                    {deal.description}
                                </p>
                                
                                {/* Dynamic Timer */}
                                <div className="flex gap-4 mb-10">
                                    {[
                                        { label: 'Days', value: timeLeft.days },
                                        { label: 'Hrs', value: timeLeft.hours },
                                        { label: 'Mins', value: timeLeft.minutes },
                                        { label: 'Secs', value: timeLeft.seconds }
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className="text-2xl font-bold text-black leading-none mb-1">
                                                {item.value.toString().padStart(2, '0')}
                                            </span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        {parseFloat(deal.mrp) > parseFloat(deal.price) && (
                                            <span className="text-gray-400 line-through text-sm">${deal.mrp}</span>
                                        )}
                                        <span className="text-3xl font-medium text-black">${deal.price}</span>
                                    </div>
                                    <div className="h-10 w-px bg-gray-200 mx-4"></div>
                                    <button 
                                        onClick={() => addToCart(deal)}
                                        className="px-10 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            )}

            {/* --- SECTION 4: FEATURES (Icons) --- */}
            <section className="py-24 border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
                        <FeatureItem icon={<Truck size={32} strokeWidth={1} />} title="Free Shipping" desc="On all orders over $200" />
                        <FeatureItem icon={<ShieldCheck size={32} strokeWidth={1} />} title="Secure Payment" desc="100% secure payment" />
                        <FeatureItem icon={<Zap size={32} strokeWidth={1} />} title="Fast Delivery" desc="With 24h dispatch" />
                        <FeatureItem icon={<Headphones size={32} strokeWidth={1} />} title="24/7 Support" desc="Dedicated support" />
                    </div>
                </div>
            </section>

            {/* --- SECTION 5: BLOGS --- */}
            {blogs.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block">Read Our Blog</span>
                            <h2 className="text-4xl font-light text-black">Latest News</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {blogs.slice(0, 3).map((blog) => (
                                <Link key={blog.id} to={`/blog/${blog.slug}`} className="group block">
                                    <div className="overflow-hidden mb-6 aspect-[4/3] bg-gray-50 relative">
                                        <img 
                                            src={blog.image_url || "https://via.placeholder.com/800x500"} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-black">
                                            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-medium text-black mb-2 group-hover:text-gray-600 transition-colors">{blog.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-light">{blog.description}</p>
                                    <span className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 group-hover:border-gray-400 transition-all">Read More</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center group">
        <div className="mb-6 text-black group-hover:text-gray-600 transition-colors duration-300 transform group-hover:-translate-y-2">
            {icon}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-2">{title}</h3>
        <p className="text-gray-500 text-xs">{desc}</p>
    </div>
);

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const activeWishlist = isInWishlist(product.id);
    const imageUrl = product.image_url?.startsWith('http') ? product.image_url : `/products/${product.image_url}`;

    return (
        <div className="group relative">
            {/* Image Wrapper */}
            <div className="relative overflow-hidden bg-gray-50 mb-4 aspect-[3/4]">
                 {parseFloat(product.mrp) > parseFloat(product.price) && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-10">
                        - {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                    </span>
                 )}
                 
                 <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain transition-transform duration-700 p-3 rounded-2xl group-hover:scale-105"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                    />
                 </Link>

                 {/* Hover Actions (Lezada Style: Slide up or appear on right) */}
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                     <button 
                        onClick={() => addToCart(product)}
                        className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg"
                        title="Add to Cart"
                     >
                         <ShoppingBag size={18} strokeWidth={1.5} />
                     </button>
                     <button 
                        onClick={() => toggleWishlist(product)}
                        className={`w-10 h-10 flex items-center justify-center shadow-lg transition-colors ${activeWishlist ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                        title="Wishlist"
                     >
                         <Heart size={18} fill={activeWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
                     </button>
                     <Link 
                        to={`/product/${product.slug}`}
                        className="w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg"
                        title="Quick View"
                     >
                         <Search size={18} strokeWidth={1.5} />
                     </Link>
                 </div>
            </div>

            {/* Info */}
            <div className="text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category_name}</p>
                <Link to={`/product/${product.slug}`}>
                    <h3 className="text-sm font-medium text-black hover:text-gray-600 transition-colors mb-1 line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex items-center justify-center gap-2 text-sm">
                    {parseFloat(product.mrp) > parseFloat(product.price) && (
                        <span className="text-gray-400 line-through">${product.mrp}</span>
                    )}
                    <span className="font-bold text-black">${product.price}</span>
                </div>
            </div>
        </div>
    );
};

export default Home;