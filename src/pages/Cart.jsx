import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const subtotal = getCartTotal();
    const shipping = subtotal > 500 ? 0 : 49;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white px-4 font-sans">
                <ShoppingBag size={64} strokeWidth={1} className="text-gray-300 mb-6" />
                <h2 className="text-4xl font-light text-black mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-20 font-sans text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center mb-16">
                    <h1 className="text-5xl font-light text-black mb-4">Shopping Cart</h1>
                    <div className="h-1 w-20 bg-black"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Cart Table (Desktop) */}
                    <div className="flex-1">
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-[40%]">Product</th>
                                        <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-[20%]">Price</th>
                                        <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-[20%]">Quantity</th>
                                        <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-500 w-[15%] text-right">Total</th>
                                        <th className="py-4 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 group">
                                            <td className="py-8">
                                                <div className="flex items-center gap-6">
                                                    <Link to={`/product/${item.slug}`} className="w-24 h-32 bg-gray-50 flex items-center justify-center shrink-0">
                                                        <img 
                                                            src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/100'} 
                                                            alt={item.name} 
                                                            className="w-full h-full object-cover mix-blend-multiply" 
                                                        />
                                                    </Link>
                                                    <div>
                                                        <Link to={`/product/${item.slug}`} className="text-lg font-medium text-black hover:text-gray-600 transition-colors">
                                                            {item.name}
                                                        </Link>
                                                        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{item.category_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 text-black font-medium">
                                                ${item.price}
                                            </td>
                                            <td className="py-8">
                                                <div className="inline-flex items-center border border-gray-200 px-3 py-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="text-gray-500 hover:text-black"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="mx-4 text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="text-gray-500 hover:text-black"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-8 text-right font-bold text-black text-lg">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="py-8 text-right">
                                                <button 
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-300 hover:text-black transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile List View */}
                        <div className="md:hidden space-y-8">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                                    <div className="w-24 h-32 bg-gray-50 shrink-0">
                                         <img 
                                            src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `/products/${item.image_url}`) : 'https://via.placeholder.com/100'} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover mix-blend-multiply" 
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-base font-medium text-black">{item.name}</h3>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-300">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">${item.price}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                             <div className="inline-flex items-center border border-gray-200 px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                                                <span className="mx-3 text-xs font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                                            </div>
                                            <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                             <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-gray-600 transition-colors">
                                <ArrowLeft size={16} /> Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-gray-50 p-8 lg:p-10">
                            <h2 className="text-xl font-medium text-black mb-8 border-b border-gray-200 pb-4">Cart Totals</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 uppercase tracking-wider font-bold">Subtotal</span>
                                    <span className="text-black font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 uppercase tracking-wider font-bold">Shipping</span>
                                    <span className="text-black font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg pt-4 border-t border-gray-200 mt-4">
                                    <span className="font-bold text-black">Total</span>
                                    <span className="font-bold text-black">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-black text-white py-4 font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
