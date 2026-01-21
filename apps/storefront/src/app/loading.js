import { jsx as _jsx } from "react/jsx-runtime";
import { ProductGridSkeleton } from "@/components/Skeletons";
export default function Loading() {
    return (_jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10", children: _jsx(ProductGridSkeleton, {}) }));
}
