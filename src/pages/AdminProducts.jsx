import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Edit, Trash2, Search, X, Check, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const initialFormState = {
        name: '',
        slug: '',
        description: '',
        price: '',
        mrp: '',
        stock: 100,
        low_stock_threshold: 10,
        image_url: '',
        category_id: '',
        is_featured: false,
        is_best_selling: false,
        status: true,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories'); 
            setCategories(res.data);
        } catch (error) {
            console.warn("Categories endpoint error", error);
        }
    };

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            slug: product.slug || '',
            description: product.description || '',
            price: product.price,
            mrp: product.mrp || '',
            stock: product.stock,
            low_stock_threshold: product.low_stock_threshold || 10,
            image_url: product.image_url || '',
            category_id: product.category_id || '',
            is_featured: !!product.is_featured,
            is_best_selling: !!product.is_best_selling,
            status: !!product.status,
            meta_title: product.meta_title || '',
            meta_description: product.meta_description || '',
            meta_keywords: product.meta_keywords || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                toast.success('Product updated');
            } else {
                await api.post('/products', formData);
                toast.success('Product created');
            }
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your inventory items</p>
                </div>
                <button onClick={openAddModal} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-bold text-sm shadow-lg shadow-brand-500/20">
                    <Plus className="w-4 h-4" /> Add New Product
                </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative max-w-md group">
                <Search className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 transition-all text-sm font-medium shadow-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="p-6">Product</th>
                                <th className="p-6">Category</th>
                                <th className="p-6">Price</th>
                                <th className="p-6">Stock</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-20 text-center font-bold text-slate-200 animate-pulse">SYNCING DATA...</td></tr>
                            ) : filteredProducts.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden p-2">
                                            {p.image_url ? (
                                                <img src={p.image_url.startsWith('http') ? p.image_url : `/products/${p.image_url}`} alt="" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-slate-200" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm line-clamp-1 w-64" title={p.name}>{p.name}</p>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">ID: {p.id}</p>
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs font-bold text-slate-500 uppercase tracking-tight">{p.category_name || 'N/A'}</td>
                                    <td className="p-6 text-sm font-black text-slate-900">${p.price}</td>
                                    <td className="p-6 text-xs font-bold text-slate-500">{p.stock} Units</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {p.status ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(p)} className="p-2.5 text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-all">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                                    <input type="text" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Selling Price ($)</label>
                                    <input type="number" step="0.01" required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">MRP ($)</label>
                                    <input type="number" step="0.01" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all" value={formData.mrp} onChange={e => setFormData({...formData, mrp: e.target.value})} />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                                    <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all appearance-none" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Units</label>
                                    <input type="number" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                                    <input type="text" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-600 transition-all h-32 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                </div>

                                <div className="col-span-2 flex gap-8 pt-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-brand-600 focus:ring-brand-600 transition-all" checked={formData.status} onChange={e => setFormData({...formData, status: e.target.checked})} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">Visible</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-brand-600 focus:ring-brand-600 transition-all" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">Featured</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-4 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl">
                                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
