"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Icon } from "@vayva/ui";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
// import { IndustrySlug } from "@/lib/templates/types";
import { UnifiedOrder } from "@vayva/shared";

import { FilterBar } from "@/components/orders/FilterBar";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { RetailOrdersView } from "@/components/orders/RetailOrdersView";
import { FoodOrdersKanban } from "@/components/orders/FoodOrdersKanban";
import { ServiceBookingsView } from "@/components/orders/ServiceBookingsView";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { ZeroOrdersState } from "@/components/orders/ZeroOrdersState";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function OrdersPage() {
    const { merchant } = useAuth();
    const { store } = useStore();
    const router = useRouter();

    const [filters, setFilters] = useState<any>({});
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);

    // Build API URL with filters
    const queryParams = new URLSearchParams();
    if (filters.status && filters.status !== "ALL") queryParams.append("status", filters.status);
    if (filters.paymentStatus && filters.paymentStatus !== "ALL") queryParams.append("paymentStatus", filters.paymentStatus);
    if (debouncedSearch) queryParams.append("q", debouncedSearch);

    const { data: response, error: _error, mutate, isLoading } = useSWR(
        `/api/orders?${queryParams.toString()}`,
        fetcher
    );

    const industrySlug = (store?.industrySlug as string) || (merchant?.industrySlug as string) || "retail";
    const orders: UnifiedOrder[] = response?.data || [];

    const isFiltered = !!(filters.status && filters.status !== "ALL") || !!search;

    const handleRefresh = () => {
        mutate();
        toast.success("Orders refreshed");
    };

    const handleSelectOrder = (order: UnifiedOrder) => {
        // Navigation to detail page or open drawer?
        // For mobile/desktop consistency, let's go to detail page
        router.push(`/dashboard/orders/${order.id}`);
    };

    const renderIndustryView = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium font-inter">Loading orders...</p>
                </div>
            );
        }

        if (orders.length === 0 && !isFiltered) {
            return <ZeroOrdersState />;
        }

        switch (industrySlug) {
            case "food":
                return <FoodOrdersKanban orders={orders} onSelect={handleSelectOrder} />;
            case "service":
            case "stays":
            case "creative":
                return <ServiceBookingsView orders={orders} onSelect={handleSelectOrder} />;
            default:
                return <RetailOrdersView orders={orders} onSelect={handleSelectOrder} />;
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <OrdersHeader />

            {/* Filter Bar */}
            <FilterBar
                onFilterChange={setFilters}
                onSearch={setSearch}
                onRefresh={handleRefresh}
            />

            {/* Industry Specific View */}
            <div className="min-h-[400px]">
                {renderIndustryView()}
            </div>

            {/* Selection Drawer (Optional if navigation is preferred) */}
            {selectedOrder && (
                <OrderDetailsDrawer
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}
