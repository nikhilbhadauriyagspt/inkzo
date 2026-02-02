import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, Shield, LogOut, Edit3, Save, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="bg-slate-50 min-h-screen py-24 lg:py-32 font-sans selection:bg-brand-100 selection:text-brand-600">
            <div className="container mx-auto px-6 max-w-6xl">
                
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* --- SIDEBAR --- */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 sticky top-32">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center relative group cursor-pointer overflow-hidden border-4 border-white shadow-xl">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-black text-slate-300">{user.name.charAt(0)}</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{user.role || 'Member'}</p>
                            </div>

                            <div className="space-y-2">
                                <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18} />} label="Personal Info" />
                                <NavButton active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} icon={<MapPin size={18} />} label="Addresses" />
                                <NavButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />} label="Security" />
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-50 transition-colors">
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[2.5rem] p-10 lg:p-16 border border-slate-100 shadow-sm min-h-[600px]">
                            
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Info</h2>
                                            <p className="text-slate-400 font-medium text-sm mt-1">Manage your identity details.</p>
                                        </div>
                                        <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 px-4 py-2 rounded-lg transition-all">
                                            {isEditing ? <><Save size={16}/> Save Changes</> : <><Edit3 size={16}/> Edit Profile</>}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <InfoField label="Full Name" value={user.name} isEditing={isEditing} />
                                        <InfoField label="Email Address" value={user.email} isEditing={isEditing} />
                                        <InfoField label="Phone Number" value={user.phone || '+91 98765 43210'} isEditing={isEditing} />
                                        <InfoField label="Date of Birth" value="Jan 01, 1990" isEditing={isEditing} />
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab (Placeholder) */}
                            {activeTab === 'addresses' && (
                                <div className="text-center py-20 animate-in fade-in">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MapPin size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">No Addresses Saved</h3>
                                    <p className="text-slate-400 text-sm mb-8">Add a shipping address for faster checkout.</p>
                                    <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-600 transition-all">Add New Address</button>
                                </div>
                            )}

                            {/* Security Tab (Placeholder) */}
                            {activeTab === 'security' && (
                                <div className="animate-in fade-in">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">Security</h2>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center p-6 border border-slate-100 rounded-2xl">
                                            <div>
                                                <h4 className="font-bold text-slate-900">Password</h4>
                                                <p className="text-xs text-slate-400">Last changed 3 months ago</p>
                                            </div>
                                            <button className="text-brand-600 font-bold text-sm">Update</button>
                                        </div>
                                        <div className="flex justify-between items-center p-6 border border-slate-100 rounded-2xl">
                                            <div>
                                                <h4 className="font-bold text-slate-900">Two-Factor Auth</h4>
                                                <p className="text-xs text-slate-400">Add an extra layer of security</p>
                                            </div>
                                            <button className="text-brand-600 font-bold text-sm">Enable</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const NavButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
            active 
            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`}
    >
        {icon} {label}
    </button>
);

const InfoField = ({ label, value, isEditing }) => (
    <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
        {isEditing ? (
            <input type="text" defaultValue={value} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brand-500" />
        ) : (
            <div className="p-3 bg-white border border-transparent font-bold text-slate-900 text-lg border-b-slate-100 rounded-none px-0">{value}</div>
        )}
    </div>
);

export default UserProfile;