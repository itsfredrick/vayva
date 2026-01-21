"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Loader2, Package } from "lucide-react";
import { Checkbox, Input } from "@vayva/ui";
import { formatCurrency } from "@/lib/format";
export function ProductPicker({ selectedIds, onSelectionChange }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        fetchProducts();
    }, []);
    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products/items?status=active");
            if (!res.ok)
                throw new Error("Failed to load products");
            const data = await res.json();
            setProducts(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    const toggleProduct = (id) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter((pid) => pid !== id));
        }
        else {
            onSelectionChange([...selectedIds, id]);
        }
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" }), _jsx(Input, { placeholder: "Search products...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9" })] }), _jsx("div", { className: "border border-slate-200 rounded-lg max-h-64 overflow-y-auto", children: loading ? (_jsx("div", { className: "p-8 flex justify-center", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-slate-400" }) })) : filteredProducts.length === 0 ? (_jsxs("div", { className: "p-8 text-center text-slate-500 text-sm", children: [_jsx(Package, { className: "h-8 w-8 mx-auto mb-2 text-slate-300" }), search ? "No products match your search" : "No active products found"] })) : (_jsx("div", { className: "divide-y divide-slate-100", children: filteredProducts.map((product) => (_jsxs("label", { className: "flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors", children: [_jsx(Checkbox, { checked: selectedIds.includes(product.id), onCheckedChange: () => toggleProduct(product.id) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium text-sm text-slate-900 truncate", children: product.name }), _jsxs("div", { className: "text-xs text-slate-500", children: [formatCurrency(product.price), " \u2022 ", product.inventory, " in stock"] })] })] }, product.id))) })) }), selectedIds.length > 0 && (_jsxs("div", { className: "text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded", children: [selectedIds.length, " product", selectedIds.length !== 1 ? "s" : "", " selected"] }))] }));
}
