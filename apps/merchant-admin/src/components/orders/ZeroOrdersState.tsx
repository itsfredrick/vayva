"use client";

import React from "react";
import Link from "next/link";
import { Button, GlassPanel, Icon } from "@vayva/ui";
import { toast } from "sonner";

export const ZeroOrdersState = () => {
    const handleShare = async () => {
        const url = window.location.origin;
        const text = "Check out my store on Vayva! 🛍️";
        const shareData = { title: "My Vayva Store", text, url };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // Share cancelled
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${text} ${url}`);
                toast.success("Store link copied!");
            } catch (e) {
                toast.error("Failed to copy link");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Hero Section */}
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Icon name="Rocket" size={40} className="text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Roadmap to your First Sale</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Your store is live! Follow these proven steps to get your first customer today.
                    </p>
                </div>

                {/* Roadmap Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">

                    {/* Step 1 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="font-bold text-gray-900">Add Products</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                            Stock up your virtual shelves with what you're selling.
                        </p>
                        <Link href="/dashboard/products/new">
                            <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200">
                                Add Product
                            </Button>
                        </Link>
                    </div>

                    {/* Step 2 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h3 className="font-bold text-gray-900">Customize</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                            Make your store look professional with a theme.
                        </p>
                        <Link href="/dashboard/store/themes">
                            <Button variant="outline" className="w-full group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-200">
                                Edit Theme
                            </Button>
                        </Link>
                    </div>

                    {/* Step 3 */}
                    <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary/20 hover:shadow-md transition-all group ring-2 ring-primary/5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">3</div>
                            <h3 className="font-bold text-gray-900">Share Link</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                            Send your store link to friends and family.
                        </p>
                        <Button onClick={handleShare} className="w-full bg-green-600 hover:bg-green-700 text-white">
                            <Icon name="Share2" size={16} className="mr-2" /> Share Now
                        </Button>
                    </div>

                </div>

            </div>
        </div>
    );
};
