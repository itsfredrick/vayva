"use client";

import { SearchInput } from "@/components/SearchInput";

interface ProductsFiltersProps {
    search: string;
    onSearch: (value: string) => void;
}

export function ProductsFilters({ search, onSearch }: ProductsFiltersProps) {
    return (
        <div className="mb-6">
            <SearchInput
                value={(search as any)}
                onChange={onSearch}
                placeholder="Search products by name..."
                className="max-w-md"
            />
        </div>
    );
}
