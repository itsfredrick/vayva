"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@vayva/ui";
import { Image as ImageIcon, Lock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
export function ProjectCard({ project }) {
    const imageCount = Array.isArray(project.images) ? project.images.length : 0;
    const coverImage = imageCount > 0 ? project.images[0].url : null;
    return (_jsx(Card, { className: "overflow-hidden group hover:shadow-md transition-shadow", children: _jsxs(Link, { href: `/dashboard/portfolio/${project.id}`, children: [_jsxs("div", { className: "aspect-[4/3] bg-gray-100 relative", children: [coverImage ? (_jsx("img", { src: coverImage, alt: project.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full flex items-center justify-center text-gray-400", children: _jsx(ImageIcon, { size: 32, strokeWidth: 1.5 }) })), project.clientMode && (_jsxs("div", { className: "absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1", children: [_jsx(Lock, { size: 10 }), " Private"] }))] }), _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "flex justify-between items-start", children: _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate pr-2", children: project.title }), _jsx("p", { className: "text-sm text-gray-500 line-clamp-1", children: project.description || "No description" })] }) }), _jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-gray-400 border-t pt-3", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ImageIcon, { size: 12 }), " ", imageCount, " images"] }), _jsxs("span", { children: ["Last updated ", format(new Date(project.updatedAt), "MMM d, yyyy")] })] })] })] }) }));
}
