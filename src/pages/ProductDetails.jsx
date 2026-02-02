import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import toast from 'react-hot-toast';
import { 
    Star, ShoppingBag, Heart, ShieldCheck, Truck, 
    Minus, Plus, ChevronRight, Share2, Zap, RotateCcw
} from 'lucide-react';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist: checkWishlist } = useWishlist();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const productRes = await api.get(`/products/slug/${slug}`);
                setProduct(productRes.data);

                // Fetch Related Products (Robust Fallback)
                const relRes = await api.get('/products');
                const allProducts = relRes.data;
                const related = allProducts
                    .filter(p => p.category_name === productRes.data.category_name && p.id !== productRes.data.id)
                    .slice(0, 4);
                
                // If no exact category match, just show random other products
                if (related.length === 0) {
                     setRelatedProducts(allProducts.filter(p => p.id !== productRes.data.id).slice(0, 4));
                } else {
                     setRelatedProducts(related);
                }

            } catch (error) {
                console.error("Failed to fetch product data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0);
    }, [slug]);

    const activeWishlist = product ? checkWishlist(product.id) : false;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`Added ${product.name} to cart`);
    };

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
            <h1 className="text-3xl font-light text-black mb-4">Product Not Found</h1>
            <Link to="/products" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">Back to Shop</Link>
        </div>
    );

    const imageUrl = product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `/products/${product.image_url}`) : 'https://via.placeholder.com/800';

    return (
        <div className="bg-white min-h-screen pb-20 font-sans text-black">
            <SEO pageName={`prod_${product.id}`} fallbackTitle={product.name} fallbackDesc={product.description} image={imageUrl} type="product" />
            <SchemaMarkup type="product" data={product} />

            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-8 pt-32">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link to="/products" className="hover:text-black transition-colors">Shop</Link>
                    <ChevronRight size={12} />
                    <span className="text-black truncate max-w-[200px]">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24">
                    
                    {/* --- IMAGE SECTION (Left) --- */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-gray-50 p-8 lg:p-16 flex items-center justify-center relative aspect-square">
                            <img 
                                src={imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-700" 
                            />
                            {parseFloat(product.mrp) > parseFloat(product.price) && (
                                <span className="absolute top-6 left-6 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                                    Sale
                                </span>
                            )}
                        </div>
                    </div>

                    {/* --- DETAILS SECTION (Right) --- */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-8">
                            <span className="block text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{product.category_name}</span>
                            <h1 className="text-4xl lg:text-5xl font-light text-black leading-tight mb-6">{product.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl font-medium text-black">${product.price}</span>
                                {parseFloat(product.mrp) > parseFloat(product.price) && (
                                    <span className="text-xl text-gray-400 line-through">${product.mrp}</span>
                                )}
                            </div>
                            
                            <p className="text-gray-500 leading-relaxed mb-8 font-light text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-6 pb-12 border-b border-gray-100">
                            {/* Quantity & Cart */}
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center border border-gray-200 h-14 w-32">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-black transition-colors"><Minus size={16}/></button>
                                    <span className="flex-1 text-center font-bold text-black">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-black transition-colors"><Plus size={16}/></button>
                                </div>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                    className="flex-1 h-14 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-8"
                                >
                                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                                <button 
                                    onClick={() => toggleWishlist(product)} 
                                    className={`w-14 h-14 flex items-center justify-center border transition-all ${activeWishlist ? 'bg-red-500 border-red-500 text-white' : 'border-gray-200 text-black hover:border-black'}`}
                                >
                                    <Heart size={20} className={activeWishlist ? 'fill-current' : ''} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Buy Now */}
                            {product.stock > 0 && (
                                <button 
                                    onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                                    className="w-full h-14 border border-black text-black font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                                >
                                    Buy It Now
                                </button>
                            )}
                        </div>

                        {/* Meta Info */}
                        <div className="pt-8 space-y-3 text-sm">
                            <div className="flex gap-2">
                                <span className="font-bold text-black uppercase tracking-wider text-xs w-24">SKU:</span>
                                <span className="text-gray-500">PRD-{product.id}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-bold text-black uppercase tracking-wider text-xs w-24">Category:</span>
                                <span className="text-gray-500">{product.category_name}</span>
                            </div>
                             <div className="flex gap-2 items-center">
                                <span className="font-bold text-black uppercase tracking-wider text-xs w-24">Share:</span>
                                <button onClick={handleShare} className="text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                                    <Share2 size={16} /> <span className="underline">Copy Link</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABS SECTION --- */}
                <div className="border-t border-gray-100 pt-16 mb-24">
                    <div className="flex justify-center gap-12 mb-12 border-b border-gray-100">
                        {['Description', 'Additional Info', 'Reviews'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '_'))}
                                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                                    activeTab === tab.toLowerCase().replace(' ', '_')
                                    ? 'text-black after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black' 
                                    : 'text-gray-400 hover:text-black'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    
                    <div className="max-w-3xl mx-auto text-center">
                        {activeTab === 'description' && (
                            <div className="animate-fade-in">
                                <p className="text-gray-500 leading-loose text-lg font-light mb-6">{product.description}</p>
                                <p className="text-gray-500 leading-loose">
                                    Designed with precision and crafted for performance, the {product.name} stands as a testament to modern engineering. 
                                    Whether for professional use or personal setups, it delivers reliability and style in equal measure.
                                </p>
                            </div>
                        )}
                        {activeTab === 'additional_info' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto animate-fade-in">
                                <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-bold text-xs uppercase tracking-wider">Weight</span> <span className="text-gray-500">1.2 kg</span></div>
                                <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-bold text-xs uppercase tracking-wider">Dimensions</span> <span className="text-gray-500">24 x 12 x 5 cm</span></div>
                                <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-bold text-xs uppercase tracking-wider">Color</span> <span className="text-gray-500">Matte Black</span></div>
                                <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-bold text-xs uppercase tracking-wider">Material</span> <span className="text-gray-500">Aluminum Alloy</span></div>
                             </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="py-12 bg-gray-50 animate-fade-in">
                                <p className="text-black font-bold uppercase tracking-widest text-xs mb-2">No reviews yet</p>
                                <p className="text-gray-500 text-sm">Be the first to review this product.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- RELATED PRODUCTS --- */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-20">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-light text-black mb-4">You Might Also Like</h3>
                            <Link to="/products" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">View All Collections</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {relatedProducts.map((relProduct) => (
                                <RelatedProductCard key={relProduct.id} product={relProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const RelatedProductCard = ({ product }) => {
    const imageUrl = product.image_url?.startsWith('http') ? product.image_url : `/products/${product.image_url}`;
    
    return (
        <div className="group">
             <div className="relative aspect-[3/4] bg-gray-50 mb-4 overflow-hidden">
                <Link to={`/product/${product.slug}`} className="block w-full h-full p-8">
                     <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>
             </div>
             <div className="text-center">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{product.category_name}</p>
                 <Link to={`/product/${product.slug}`}>
                     <h4 className="text-sm font-medium text-black hover:text-gray-600 transition-colors mb-1 truncate">{product.name}</h4>
                 </Link>
                 <p className="text-black font-bold text-sm">${product.price}</p>
             </div>
        </div>
    );
};

export default ProductDetails;