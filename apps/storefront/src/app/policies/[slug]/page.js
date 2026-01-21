"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
// Public endpoint for storefront to fetch policies
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export default function PublicPolicyPage({ params }) {
    const { slug } = useParams();
    const [policy, setPolicy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                // Assuming slug maps to key like 'privacy'
                const res = await axios.get(`${API_URL}/compliance/policies/${slug}`);
                setPolicy(res.data);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPolicy();
    }, [slug]);
    if (isLoading)
        return _jsx("div", { className: "p-12 text-center text-gray-400", children: "Loading..." });
    if (!policy)
        return (_jsx("div", { className: "p-12 text-center text-gray-400", children: "Policy not found." }));
    return (_jsxs("div", { className: "max-w-3xl mx-auto py-16 px-6 sm:px-8", children: [_jsx("h1", { className: "text-3xl font-bold text-[#0B1220] mb-8", children: policy.title }), _jsx("div", { className: "prose prose-slate max-w-none leading-relaxed text-[#525252]", dangerouslySetInnerHTML: { __html: policy.content } }), _jsxs("div", { className: "mt-12 pt-8 border-t border-gray-100 text-sm text-gray-400 italic", children: ["Last updated: ", new Date(policy.updatedAt).toLocaleDateString()] })] }));
}
