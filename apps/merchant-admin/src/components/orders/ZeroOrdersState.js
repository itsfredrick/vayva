"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import { Button, Icon } from "@vayva/ui";
import { toast } from "sonner";
export const ZeroOrdersState = () => {
    const handleShare = async () => {
        const url = window.location.origin;
        const text = "Check out my store on Vayva! 🛍️";
        const shareData = { title: "My Vayva Store", text, url };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            }
            catch (err) {
                // Share cancelled
            }
        }
        else {
            try {
                await navigator.clipboard.writeText(`${text} ${url}`);
                toast.success("Store link copied!");
            }
            catch (e) {
                toast.error("Failed to copy link");
            }
        }
    };
    return (_jsx("div", { className: "flex flex-col items-center justify-center py-16 px-4", children: _jsxs("div", { className: "max-w-2xl w-full text-center space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6", children: _jsx(Icon, { name: "Rocket", size: 40, className: "text-primary" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900", children: "Roadmap to your First Sale" }), _jsx("p", { className: "text-gray-500 max-w-md mx-auto", children: "Your store is live! Follow these proven steps to get your first customer today." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-left", children: [_jsxs("div", { className: "p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm", children: "1" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Add Products" })] }), _jsx("p", { className: "text-sm text-gray-500 mb-6 min-h-[40px]", children: "Stock up your virtual shelves with what you're selling." }), _jsx(Link, { href: "/dashboard/products/new", children: _jsx(Button, { variant: "outline", className: "w-full group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200", children: "Add Product" }) })] }), _jsxs("div", { className: "p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm", children: "2" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Customize" })] }), _jsx("p", { className: "text-sm text-gray-500 mb-6 min-h-[40px]", children: "Make your store look professional with a theme." }), _jsx(Link, { href: "/dashboard/store/themes", children: _jsx(Button, { variant: "outline", className: "w-full group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-200", children: "Edit Theme" }) })] }), _jsxs("div", { className: "p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group ring-2 ring-primary/5", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm", children: "3" }), _jsx("h3", { className: "font-bold text-gray-900", children: "Share Link" })] }), _jsx("p", { className: "text-sm text-gray-500 mb-6 min-h-[40px]", children: "Send your store link to friends and family." }), _jsxs(Button, { onClick: handleShare, className: "w-full bg-green-600 hover:bg-green-700 text-white", children: [_jsx(Icon, { name: "Share2", size: 16, className: "mr-2" }), " Share Now"] })] })] })] }) }));
};
