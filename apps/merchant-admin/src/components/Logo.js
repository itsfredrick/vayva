import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Image from "next/image";
import Link from "next/link";
const sizeMap = {
    sm: { width: 48, height: 48, text: "text-lg" },
    md: { width: 64, height: 64, text: "text-2xl" },
    lg: { width: 80, height: 80, text: "text-3xl" },
};
export function Logo({ size = "md", showText = true, href = "/", className = "", }) {
    const { width, height, text } = sizeMap[size];
    const content = (_jsxs("div", { className: `flex items-center gap-2 ${className}`, children: [_jsx(Image, { src: "/brand-logo.png", alt: "Vayva Logo", width: width, height: height, className: "object-contain", priority: true }), showText && (_jsx("span", { className: `font-bold tracking-tight text-black ${text}`, children: "Vayva" }))] }));
    if (href) {
        return (_jsx(Link, { href: href, className: "flex items-center", children: content }));
    }
    return content;
}
