import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SearchBar from './SearchBar';
import api from '../api/api';
import Skeleton from './Skeleton';
import {
    ShoppingCart,
    User,
    Heart,
    Menu,
    X,
    Search,
    LogOut,
    Package,
    LayoutDashboard,
    Zap,
    Store,
    ArrowRight,
    Home,
    Phone,
    Info,
    HelpCircle
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [branding, setBranding] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    // Navbar is transparent only on Home Page when not scrolled
    const isTransparent = isHomePage && !isScrolled;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
        api.get(`/websites/${websiteId}`)
            .then(res => setBranding({ 
                ...res.data, 
                logo_url: res.data.logo_url || '/logo/logo.jpg' 
            }))
            .catch(() => { });
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Sidebar Navigation */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>
                <div className={`absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            {branding ? (
                                <span className="text-xl font-bold tracking-tight text-black">{branding.name}</span>
                            ) : (
                                <Skeleton className="h-6 w-24" />
                            )}
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                            {navLinks.map(link => (
                                <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-800 hover:text-black">
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-gray-100 my-4"></div>
                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-black">My Orders</Link>
                            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block text-gray-600 hover:text-black">Wishlist</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <header className={`sticky top-0 z-[60] w-full transition-all duration-300 bg-white border-b border-gray-100 py-4`}>
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between">

                        {/* 1. LEFT: Logo */}
                        <div className="flex items-center gap-4">
                             {/* Mobile Hamburger */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className={`lg:hidden p-1 text-black`}
                            >
                                <Menu size={24} strokeWidth={1.5} />
                            </button>

                            <Link to="/" className="flex items-center gap-2 group">
                                {branding ? (
                                    branding.logo_url ? (
                                        <img
                                            src={branding.logo_url}
                                            alt={branding.name}
                                            className="h-8 md:h-10 w-auto object-contain"
                                        />
                                    ) : (
                                        <span className={`font-bold tracking-tight text-2xl text-black`}>
                                            {branding.name}.
                                        </span>
                                    )
                                ) : (
                                    <Skeleton className="h-8 w-24 md:w-32" />
                                )}
                            </Link>
                        </div>

                        {/* 2. CENTER: Desktop Links */}
                        <nav className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    to={link.path} 
                                    className={`text-sm font-medium uppercase tracking-widest text-gray-600 hover:text-black hover:underline underline-offset-4 decoration-2`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* 3. RIGHT: Actions */}
                        <div className="flex items-center gap-4 md:gap-6">
                            <button 
                                onClick={() => setIsSearchOpen(true)}
                                className={`text-gray-600 hover:text-black transition-colors`}
                            >
                                <Search size={22} strokeWidth={1.5} />
                            </button>

                            <Link to="/wishlist" className={`hidden sm:block relative text-gray-600 hover:text-black transition-colors`}>
                                <Heart size={22} strokeWidth={1.5} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </Link>

                            <Link to="/cart" className={`relative text-gray-600 hover:text-black transition-colors`}>
                                <ShoppingCart size={22} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`text-gray-600 hover:text-black transition-colors`}
                                >
                                    <User size={22} strokeWidth={1.5} />
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                        <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            {user ? (
                                                <div className="p-2">
                                                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                                        <p className="text-sm font-bold text-black truncate">Hi, {user.name}</p>
                                                        <Link to="/profile" className="text-xs text-gray-500 hover:text-black">View Profile</Link>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <DropdownItem to="/orders" icon={<Package size={16} />} text="My Orders" />
                                                        <DropdownItem to="/wishlist" icon={<Heart size={16} />} text="Wishlist" />
                                                        {user.role === 'admin' && (
                                                            <DropdownItem to="/admin" icon={<LayoutDashboard size={16} />} text="Admin Panel" />
                                                        )}
                                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-md transition-all">
                                                            <LogOut size={16} /> Sign Out
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center">
                                                    <p className="text-xs font-medium text-gray-500 mb-4">Login to manage your orders.</p>
                                                    <div className="flex flex-col gap-2">
                                                        <Link to="/login" className="py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-md hover:bg-gray-800">Login</Link>
                                                        <Link to="/register" className="py-2 border border-black text-black text-xs font-bold uppercase tracking-widest rounded-md hover:bg-gray-50">Register</Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

const DropdownItem = ({ to, icon, text }) => (
    <Link to={to} className="flex items-center gap-3 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-black rounded-md transition-all font-medium">
        <span className="text-gray-400">{icon}</span>
        {text}
    </Link>
);

export default Navbar;