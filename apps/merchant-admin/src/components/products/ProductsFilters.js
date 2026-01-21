"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { SearchInput } from "@/components/SearchInput";
export function ProductsFilters({ search, onSearch }) {
    return (_jsx("div", { className: "mb-6", children: _jsx(SearchInput, { value: search, onChange: onSearch, placeholder: "Search products by name...", className: "max-w-md" }) }));
}
