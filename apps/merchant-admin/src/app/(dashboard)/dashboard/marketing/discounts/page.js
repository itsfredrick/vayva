import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DiscountList } from "@/components/marketing/DiscountList";
import { Button } from "@vayva/ui";
import { Plus } from "lucide-react";
import Link from "next/link";
export default function DiscountsPage() {
    return (_jsxs("div", { className: "space-y-6 max-w-5xl mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Discounts" }), _jsx("p", { className: "text-muted-foreground", children: "Manage automatic discounts and coupon codes." })] }), _jsx(Link, { href: "/dashboard/marketing/discounts/new", children: _jsxs(Button, { children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Create Discount"] }) })] }), _jsx(DiscountList, {})] }));
}
