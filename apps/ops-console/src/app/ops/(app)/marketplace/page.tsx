"use client";

import React, { useState } from "react";
import { ShoppingBag, Star, Tag, RefreshCw, Edit2, Eye, EyeOff } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";

export default function MarketplacePage() {
    const { data: templates, isLoading, refetch } = useOpsQuery(
        ["templates-list"],
        () => fetch("/api/ops/marketplace/templates").then(res => res.json().then(j => j.data))
    );

    const toggleFeatured = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/ops/marketplace/templates/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ isFeatured: !current })
            });
            toast.success("Updated template");
            refetch();
        } catch (e) {
            toast.error("Update failed");
        }
    };

    const toggleActive = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/ops/marketplace/templates/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !current })
            });
            toast.success("Updated status");
            refetch();
        } catch (e) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-indigo-600" />
                        Marketplace Manager
                    </h1>
                    <p className="text-gray-500 mt-1">Curate templates available to merchants.</p>
                </div>
                <button onClick={() => refetch()} className="p-2 hover:bg-gray-100 rounded-full">
                    <RefreshCw className={`w-5 h-5 text-gray-500 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && <p className="text-gray-400">Loading templates...</p>}
                {templates?.map((t: any) => (
                    <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900">{t.name}</h3>
                            {t.isFeatured && (
                                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                    <Star size={10} /> Featured
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{t.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {t.tags.map((tag: string) => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className="text-xs font-medium text-gray-600">{t.isActive ? "Active" : "Hidden"}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleActive(t.id, t.isActive)}
                                    className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                                    title={t.isActive ? "Hide Template" : "Show Template"}
                                >
                                    {t.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <button
                                    onClick={() => toggleFeatured(t.id, t.isFeatured)}
                                    className={`p-1.5 rounded ${t.isFeatured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                    title="Toggle Featured"
                                >
                                    <Star size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
