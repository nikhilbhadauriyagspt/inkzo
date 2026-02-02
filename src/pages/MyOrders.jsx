import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ShoppingBag, MapPin, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
                const res = await api.get('/orders/user', {
                    params: { website_id: websiteId }
                });
                
                // Handle different response formats (Direct array or nested in data/orders)
                const orderData = Array.isArray(res.data) ? res.data : (res.data.orders || res.data.data || []);
                setOrders(orderData);
            } catch (error) {
                console.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <User size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Required</h2>
                    <p className="text-slate-500 mb-8 font-medium">Please log in to manage your orders.</p>
                    <Link to="/login" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-600 transition-all">Login Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-24 lg:py-32 font-sans selection:bg-brand-100 selection:text-brand-600">
            <div className="container mx-auto px-6 max-w-5xl">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-10 h-[2px] bg-brand-600"></span>
                            <span className="text-brand-600 font-black tracking-[0.3em] uppercase text-[10px]">History</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">My Orders</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Orders</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">{orders.length}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="group bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl hover:shadow-brand-900/5 hover:border-brand-100 transition-all duration-300">
                                
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-lg font-black text-slate-900 tracking-tight">#{order.id.toString().padStart(6, '0')}</span>
                                            <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.created_at).toLocaleDateString()}</span>
                                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                            <span>{order.items_count || 1} Items</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Paid</p>
                                        <p className="text-xl font-black text-slate-900 tracking-tight">${Number(order.total_amount).toFixed(2)}</p>
                                    </div>
                                    <Link 
                                        to={`/track?id=${order.id}`} 
                                        className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 transition-all shadow-lg hover:translate-x-1"
                                    >
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No orders found</h3>
                        <p className="text-slate-400 text-sm font-medium mb-8">Looks like you haven't made any purchases yet.</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;