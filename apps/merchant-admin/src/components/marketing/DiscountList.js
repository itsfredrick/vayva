"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button, EmptyState } from "@vayva/ui";
import { Trash, Tag, Percent, DollarSign, Edit2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function DiscountList() {
    const router = useRouter();
    const { data: discounts, error } = useSWR("/api/marketing/discounts", fetcher);
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this discount?"))
            return;
        try {
            await fetch(`/api/marketing/discounts/${id}`, { method: "DELETE" });
            toast.success("Discount deleted");
            mutate("/api/marketing/discounts");
        }
        catch (err) {
            toast.error("Failed to delete");
        }
    };
    if (error)
        return _jsx("div", { className: "text-red-500", children: "Failed to load discounts" });
    if (!discounts)
        return _jsx("div", { className: "p-8 text-center text-gray-500", children: "Loading..." });
    if (discounts.length === 0) {
        return (_jsx(EmptyState, { title: "No Discounts Yet", description: "Create your first discount to drive sales.", action: _jsx(Link, { href: "/dashboard/marketing/discounts/new", children: _jsx(Button, { children: "Create Discount" }) }) }));
    }
    return (_jsx("div", { className: "border rounded-md bg-white overflow-hidden", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Title" }), _jsx(TableHead, { children: "Type" }), _jsx(TableHead, { children: "Value" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Schedule" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: discounts.map((d) => {
                        const status = (!d.endsAt || new Date(d.endsAt) > new Date()) ? "Active" : "Expired";
                        return (_jsxs(TableRow, { children: [_jsxs(TableCell, { children: [_jsx("div", { className: "font-medium", children: d.name }), d.code && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-blue-600 mt-1", children: [_jsx(Tag, { size: 12 }), _jsx("span", { className: "font-mono bg-blue-50 px-1 rounded", children: d.code })] }))] }), _jsx(TableCell, { children: _jsx(Badge, { variant: "secondary", children: d.requiresCoupon ? "Coupon" : "Automatic" }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center gap-1", children: [d.type === "PERCENTAGE" ? _jsx(Percent, { size: 14 }) : _jsx(DollarSign, { size: 14 }), _jsx("span", { children: d.type === "PERCENTAGE"
                                                    ? `${d.valuePercent}%`
                                                    : `₦${d.valueAmount}` })] }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: status === "Active" ? "default" : "secondary", children: status }) }), _jsxs(TableCell, { className: "text-sm text-gray-500", children: [format(new Date(d.startsAt), "MMM d"), d.endsAt ? ` - ${format(new Date(d.endsAt), "MMM d, yyyy")}` : " (No expiry)"] }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", className: "text-gray-400 hover:text-indigo-600", onClick: () => router.push(`/dashboard/marketing/discounts/${d.id}`), children: _jsx(Edit2, { size: 16 }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-gray-400 hover:text-red-500", onClick: () => handleDelete(d.id), children: _jsx(Trash, { size: 16 }) })] }) })] }, d.id));
                    }) })] }) }));
}
