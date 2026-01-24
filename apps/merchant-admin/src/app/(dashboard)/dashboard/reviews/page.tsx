"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Star, MessageSquare, Check, X, Archive, Loader2, ThumbsUp } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Button, cn } from "@vayva/ui";

interface Review {
    id: string;
    rating: number;
    title: string;
    status: string;
    customerName: string;
    product: string;
    createdAt: string;
}

export default function ReviewsPage() {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeTab, setActiveTab] = useState("ALL");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (!res.ok) throw new Error("Failed to load reviews");
            const result = await res.json();
            setReviews(result.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error("Could not load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = (action: string, id: string) => {
        toast.success(`Review ${action} successfully`);
        // Optimistic update would go here
    };

    const filteredReviews = activeTab === "ALL"
        ? reviews
        : reviews.filter(r => r.status === activeTab);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reviews & Ratings</h1>
                <p className="text-slate-500">Manage customer feedback and moderate product reviews.</p>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200">
                {["ALL", "PENDING", "PUBLISHED", "ARCHIVED"].map((tab: any) => (
                    <Button
                        key={tab}
                        variant="ghost"
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "pb-3 px-1 text-sm font-medium border-b-2 rounded-none transition-colors flex items-center gap-2 h-auto hover:bg-transparent",
                            activeTab === tab
                                ? "border-indigo-600 text-indigo-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                    </Button>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center">
                        <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4">
                            <Star className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No reviews found</h3>
                        <p className="text-slate-500 max-w-sm">
                            {activeTab === "ALL"
                                ? "Customer reviews will appear here once you start receiving them."
                                : `There are no ${activeTab.toLowerCase()} reviews at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Rating</th>
                                    <th className="px-6 py-3">Review</th>
                                    <th className="px-6 py-3">Product</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredReviews.map((review: any) => (
                                    <tr key={review.id} className="hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4 align-top w-32">
                                            <div className="flex text-amber-400">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                                                ))}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">{formatDate(review.createdAt)}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top max-w-sm">
                                            <div className="font-medium text-slate-900 mb-0.5">{review.title || "No Title"}</div>
                                            <div className="text-slate-500 line-clamp-2 text-xs mb-1">by {review.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top text-slate-600">
                                            {review.product}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${review.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                                                review.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {review.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleAction('published', review.id)}
                                                    aria-label="Approve"
                                                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleAction('archived', review.id)}
                                                    aria-label="Archive"
                                                    className="h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                    title="Archive"
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
