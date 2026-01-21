import { jsx as _jsx } from "react/jsx-runtime";
import { PDPSkeleton } from "@/components/Skeletons";
export default function Loading() {
    return (_jsx("div", { className: "bg-white", children: _jsx(PDPSkeleton, {}) }));
}
