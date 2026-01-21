"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Button, cn } from "@vayva/ui";

const CATEGORIES = [
    { label: "All", slug: "all" },
    { label: "Food", slug: "food" },
    { label: "Vehicles", slug: "vehicles" },
    { label: "Property", slug: "property" },
    { label: "Electronics", slug: "electronics" },
    { label: "Fashion", slug: "fashion" },
];

export function MobileCategoryHeader({ title, activeSubcategory = "All" }: { title: string, activeSubcategory?: string }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
            {/* Top Bar with Back and Title */}
            <div className="flex items-center justify-between px-4 h-14">
                <Button
                    onClick={() => router.back()}
                    variant="ghost"
                    size="icon"
                    className="-ml-2 rounded-full"
                    aria-label="Go back"
                    title="Go back"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="font-bold text-lg flex items-center gap-1">
                    {title}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="-mr-2 rounded-full"
                    aria-label="Filter"
                    title="Filter"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                </Button>
            </div>

            {/* Sub-Category Horizontal Scroll (Pills) */}
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <Button
                        key={cat.slug}
                        onClick={() => router.push(`/category/${cat.slug}`)}
                        variant={pathname.includes(cat.slug) || (title.toLowerCase() === cat.label.toLowerCase()) ? "primary" : "secondary"}
                        size="sm"
                        className="rounded-full text-xs whitespace-nowrap"
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
