"use client";

import { useState, useEffect } from "react";
import { Button, Badge, Icon } from "@vayva/ui";
import { Plus, FileText, Building2, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/i18n";
import { format } from "date-fns";
import { toast } from "sonner";

interface Quote {
    id: string;
    quoteNumber: string;
    companyName: string;
    contactName: string;
    contactEmail: string;
    items: any[];
    total: number;
    status: string;
    validUntil: string;
    createdAt: string;
}

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchQuotes();
    }, [filter]);

    const fetchQuotes = async () => {
        try {
            const params = filter !== "all" ? `?status=${filter}` : "";
            const res = await fetch(`/api/quotes${params}`);
            if (res.ok) {
                const data = await res.json();
                setQuotes(data.quotes || []);
            }
        } catch (error) {
            console.error("Failed to fetch quotes:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/quotes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                toast.success(`Quote ${status.toLowerCase()}`);
                fetchQuotes();
            }
        } catch (error) {
            toast.error("Failed to update quote");
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "success" | "warning" | "error"> = {
            PENDING: "default",
            CONFIRMED: "success",
            CANCELLED: "error",
            COMPLETED: "success",
        };
        return <Badge variant={variants[status] || "default"}>{status}</Badge>;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Quotes & Orders</h1>
                    <p className="text-gray-500">Manage B2B quotes and purchase orders.</p>
                </div>
                <Button className="bg-vayva-green text-white">
                    <Plus className="mr-2 h-4 w-4" /> Create Quote
                </Button>
            </div>

            <div className="flex gap-2">
                {["all", "PENDING", "CONFIRMED", "COMPLETED"].map((s) => (
                    <Button
                        key={s}
                        variant={filter === s ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setFilter(s)}
                    >
                        {s === "all" ? "All" : s}
                    </Button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-black rounded-full mx-auto" />
                    </div>
                ) : quotes.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-semibold text-gray-900">No quotes yet</h3>
                        <p className="text-gray-500 text-sm mt-1">Create your first B2B quote to get started.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {quotes.map((quote) => (
                            <div key={quote.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">{quote.quoteNumber}</h3>
                                                {getStatusBadge(quote.status)}
                                            </div>
                                            <p className="text-sm text-gray-600">{quote.companyName}</p>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(quote.createdAt), "MMM d, yyyy")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {formatCurrency(quote.total, "NGN")}
                                                </span>
                                                <span>{quote.items?.length || 0} items</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {quote.status === "PENDING" && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateStatus(quote.id, "CONFIRMED")}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => updateStatus(quote.id, "CANCELLED")}
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
