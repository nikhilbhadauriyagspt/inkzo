import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import SEO from '../components/SEO';
import { ChevronRight } from 'lucide-react';

const PolicyPage = () => {
    const { type } = useParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultCookiesPolicy = `
        <h2>Cookie Policy for inkzo</h2>
        <p>At inkzo, we believe in being clear and open about how we collect and use data related to you. In the spirit of transparency, this policy provides detailed information about how and when we use cookies on our Website.</p>
        
        <h3>What is a cookie?</h3>
        <p>A cookie is a small file placed onto your device that enables inkzo features and functionality. For example, cookies enable us to identify your device, secure your access to our site, and even help us know if someone attempts to access your account from a different device.</p>
        
        <h3>How we use cookies</h3>
        <p>We use cookies to enhance your experience, including keeping you logged in, remembering your cart items, and understanding how you use our site to improve our service.</p>
        
        <h3>Types of cookies we use</h3>
        <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function correctly (e.g., login, cart).</li>
            <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with the website.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
        </ul>
        
        <h3>Managing Cookies</h3>
        <p>Most browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.</p>
    `;

    useEffect(() => {
        const fetchPolicy = async () => {
            const websiteId = import.meta.env.VITE_WEBSITE_ID || 1;
            try {
                setLoading(true);
                const res = await api.get(`/policies`, { params: { website_id: websiteId } });
                if (res.data && res.data[type]) {
                    setPolicy(res.data[type]);
                } else if (type === 'cookies') {
                    // Fallback for cookies if not found in DB
                    setPolicy({
                        content: defaultCookiesPolicy,
                        meta_title: 'Cookie Policy | inkzo',
                        meta_description: 'Information about how inkzo uses cookies on its website.'
                    });
                } else {
                    setPolicy(null);
                }
            } catch (error) {
                console.error(`Failed to fetch policy: ${type}`, error);
                if (type === 'cookies') {
                    setPolicy({
                        content: defaultCookiesPolicy,
                        meta_title: 'Cookie Policy | inkzo',
                        meta_description: 'Information about how inkzo uses cookies on its website.'
                    });
                } else {
                    setPolicy(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
        window.scrollTo(0, 0);
    }, [type]);

    const pageTitle = policy?.meta_title || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center italic text-gray-400">Loading Page...</div>;
    }

    if (!policy) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                <p className="text-gray-500">The page you are looking for does not exist or could not be loaded.</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <SEO
                pageName={`policy_${type}`}
                fallbackTitle={pageTitle}
                fallbackDesc={policy.meta_description}
            />

            {/* Header and Breadcrumb */}
            <div className="bg-gray-50 pt-10 pb-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-4">
                        <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-bold">{pageTitle}</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-16 overflow-hidden">
                <div
                    className="prose prose-slate prose-sm md:prose-lg w-full mx-auto break-words [&>img]:max-w-full [&>img]:h-auto"
                    dangerouslySetInnerHTML={{ __html: policy.content }}
                />
            </div>
        </div>
    );

};

export default PolicyPage;
