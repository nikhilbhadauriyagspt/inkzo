import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { 
    Search, Heart, ShoppingBag, X, 
    CheckCircle2, ChevronDown, SlidersHorizontal 
} from 'lucide-react';

// Custom debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const Shop = () => {
    const location = useLocation();
    
    // State
    const [priceRange, setPriceRange] = useState(100000);
    const debouncedPriceRange = useDebounce(priceRange, 500); // Debounce price

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorySEO, setCategorySEO] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Filters State
    const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(new URLSearchParams(location.search).get('category') || 'All');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        if (selectedCategory !== 'All') {
            const cat = categories.find(c => c.name === selectedCategory);
            if (cat) setCategorySEO(cat);
        } else {
            setCategorySEO(null);
        }
    }, [selectedCategory, categories]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (selectedCategory !== 'All') params.append('category', selectedCategory);
                if (searchTerm) params.append('search', searchTerm);
                
                // Use debounced price range
                if (debouncedPriceRange < 100000) params.append('maxPrice', debouncedPriceRange);
                
                if (sortBy) params.append('sort', sortBy);
                
                const res = await api.get(`/products?${params.toString()}`);
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, searchTerm, debouncedPriceRange, sortBy]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catRes = await api.get('/categories');
                setCategories(catRes.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchTerm(queryParams.get('search') || '');
        setSelectedCategory(queryParams.get('category') || 'All');
    }, [location.search]);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange(100000);
        setSortBy('newest');
    };

    return (
        <div className="bg-white min-h-screen pb-20 font-sans text-black">
            {categorySEO ? (
                <Helmet>
                    <title>{categorySEO.meta_title || `${categorySEO.name} | inkzo`}</title>
                    <meta name="description" content={categorySEO.meta_description || `Shop our best collection of ${categorySEO.name}.`} />
                </Helmet>
            ) : (
                <SEO pageName="shop" fallbackTitle="Shop Premium Tech - inkzo" fallbackDesc="Browse our curated selection of printers and office tech." />
            )}

            {/* --- HERO HEADER --- */}
            <div className="pt-32 pb-12 lg:pt-40 lg:pb-20 container mx-auto px-6 text-center">
                <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Official Store</span>
                <h1 className="text-5xl md:text-6xl font-light text-black tracking-tight leading-none mb-4">
                    {selectedCategory !== 'All' ? selectedCategory : 'All Collections'}
                </h1>
                <p className="text-gray-500 text-sm">
                    Showing {products.length} results
                </p>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* --- SIDEBAR FILTERS (Sticky) --- */}
                    <div className={`fixed inset-0 z-[100] lg:sticky lg:top-32 lg:z-0 lg:w-64 lg:h-auto bg-white lg:bg-transparent lg:inset-auto transition-all duration-300 lg:block ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}`}>
                        <div className="h-full overflow-y-auto lg:overflow-visible bg-white lg:bg-transparent p-8 lg:p-0">
                            
                            {/* Mobile Header */}
                            <div className="flex lg:hidden justify-between items-center mb-8">
                                <h3 className="text-xl font-bold">Filters</h3>
                                <button onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
                            </div>

                            {/* Search */}
                            <div className="mb-10">
                                <div className="relative group border-b border-gray-200 focus-within:border-black transition-colors">
                                    <input 
                                        type="text" 
                                        placeholder="Search..." 
                                        className="w-full bg-transparent px-0 py-3 text-sm font-medium outline-none placeholder-gray-400 text-black"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-12">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-6">Categories</h4>
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => setSelectedCategory('All')}
                                        className={`block w-full text-left text-sm transition-colors ${selectedCategory === 'All' ? 'text-black font-bold underline underline-offset-4' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        All Products
                                    </button>
                                    {categories.map((cat) => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`block w-full text-left text-sm transition-colors ${selectedCategory === cat.slug ? 'text-black font-bold underline underline-offset-4' : 'text-gray-500 hover:text-black'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div className="mb-12">
                                <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-6">Price</h4>
                                <input 
                                    type="range" min="0" max="100000" step="1000"
                                    value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black mb-4"
                                />
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>$0</span>
                                    <span className="text-black">Max: ${priceRange.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Clear Button */}
                            <button onClick={clearAllFilters} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-b border-gray-200 hover:border-black pb-1">
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* --- MAIN GRID --- */}
                    <div className="flex-1 w-full">
                        
                        {/* Toolbar (Mobile & Desktop Sort) */}
                        <div className="flex justify-between items-center mb-10">
                             <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="flex lg:hidden items-center gap-2 text-xs font-bold uppercase tracking-widest text-black"
                            >
                                <SlidersHorizontal size={16}/> Filter
                            </button>

                            <div className="hidden lg:block"></div> {/* Spacer */}

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Sort:</span>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent border-none text-xs font-bold uppercase tracking-widest text-black focus:ring-0 cursor-pointer p-0"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low - High</option>
                                    <option value="price-high">Price: High - Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="bg-gray-100 aspect-[3/4] mb-4"></div>
                                        <div className="bg-gray-100 h-4 w-3/4 mb-2"></div>
                                        <div className="bg-gray-100 h-4 w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12">
                                {products.map((product) => (
                                    <ShopProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <h3 className="text-2xl font-light text-black mb-2">No Products Found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters.</p>
                                <button onClick={clearAllFilters} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600">Reset Filters</button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

const ShopProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isHovered, setIsHovered] = useState(false);
    const activeWishlist = isInWishlist(product.id);
    const imageUrl = product.image_url?.startsWith('http') ? product.image_url : `/products/${product.image_url}`;

    return (
        <div 
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Wrapper */}
            <div className="relative overflow-hidden bg-gray-50 mb-4 aspect-[3/4]">
                 {parseFloat(product.mrp) > parseFloat(product.price) && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 z-10">
                        Sale
                    </span>
                 )}
                 
                 <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400'}
                    />
                 </Link>

                 {/* Hover Actions */}
                 <div className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
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

export default Shop;