"use client";

import React from "react";
import { Search, Globe, Truck, ShieldCheck } from "lucide-react";
import { useStorefrontStore } from "@/hooks/storefront/useStorefront";

interface BulkTradeHomeProps {
    storeName?: string;
    storeSlug?: string;
}

export default function BulkTradeHome({
    storeName: initialStoreName,
    storeSlug,
}: BulkTradeHomeProps) {
    const { store } = useStorefrontStore(storeSlug);
    const displayName = store?.name || initialStoreName || "Global Trade Co.";

    const products = [
        { id: 1, name: "Industrial Steel Pipes", minOrder: "5 Tons", price: "₦450,000 / Ton" },
        { id: 2, name: "Solar Panels (Commercial)", minOrder: "100 Units", price: "₦85,000 / Unit" },
        { id: 3, name: "Heavy Duty Generators", minOrder: "5 Units", price: "₦12,500,000 / Unit" },
        { id: 4, name: "Construction Cement (Grade 42)", minOrder: "500 Bags", price: "₦5,200 / Bag" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Top Bar */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 flex justify-between">
                <span>Premium B2B Supplier • Verified Partner</span>
                <span>Global Logistics Available</span>
            </div>

            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <div className="text-2xl font-black uppercase tracking-wider text-blue-900">
                            {displayName}
                        </div>
                        <div className="hidden md:flex gap-6 text-sm font-bold text-slate-600">
                            <a href="#">Catalog</a>
                            <a href="#">Industries</a>
                            <a href="#">Logistics</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-sm font-bold text-blue-900">Sign In</button>
                        <button className="bg-blue-900 text-white px-5 py-2 rounded font-bold text-sm">Request Access</button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-blue-900 text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Wholesale Sourcing Simplified.</h1>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Access direct manufacturer pricing. Minimum Order Quantities apply. Verified quality assurance.</p>
                    <div className="bg-white p-2 rounded flex max-w-2xl mx-auto">
                        <input type="text" placeholder="Search by SKU, Product Name or Category..." className="flex-1 px-4 py-3 text-slate-900 outline-none" />
                        <button className="bg-orange-500 text-white px-8 font-bold rounded hover:bg-orange-600">Search</button>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-slate-600">
                    <div className="flex flex-col items-center gap-2">
                        <Globe className="w-8 h-8 text-blue-900" />
                        <span className="font-bold">Global Shipping</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-900 flex items-center justify-center font-bold text-blue-900">✓</div>
                        <span className="font-bold">Verified Suppliers</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Truck className="w-8 h-8 text-blue-900" />
                        <span className="font-bold">Logistics Support</span>
                    </div>
                </div>
            </div>

            {/* Wholesale Table */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-bold mb-8 text-slate-900">Featured Commodities</h2>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">MOQ (Min Order)</th>
                                <th className="px-6 py-4">Wholesale Price</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 font-bold text-blue-900">{p.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{p.minOrder}</td>
                                    <td className="px-6 py-4 font-mono text-slate-800">{p.price}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-bold text-blue-600 hover:underline">Request Quote</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
