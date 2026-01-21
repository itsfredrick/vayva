"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import Link from "next/link";
import { Button, Card, Icon } from "@vayva/ui";
import { usePathname } from "next/navigation";
export const ResourceListPage = ({ primaryObject, title }) => {
    const pathname = usePathname();
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/resources/list?type=${primaryObject}`)
            .then(res => res.json())
            .then(data => {
            if (Array.isArray(data))
                setItems(data);
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, [primaryObject]);
    if (loading)
        return _jsx("div", { className: "p-8", children: "Loading..." });
    return (_jsxs("div", { className: "max-w-6xl mx-auto py-6 px-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsx("h1", { className: "text-2xl font-bold", children: title }), _jsx(Link, { href: `${pathname}/new`, children: _jsxs(Button, { children: [_jsx(Icon, { name: "Plus", className: "mr-2", size: 18 }), "Add ", title.slice(0, -1)] }) })] }), items.length === 0 ? (_jsxs(Card, { className: "p-12 flex flex-col items-center justify-center text-center", children: [_jsx("div", { className: "h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400", children: _jsx(Icon, { name: "PackageOpen", size: 32 }) }), _jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: ["No ", title.toLowerCase(), " yet"] }), _jsx("p", { className: "text-gray-500 max-w-sm mb-6", children: "Get started by adding your first item. It will appear on your storefront immediately." }), _jsx(Link, { href: `${pathname}/new`, children: _jsxs(Button, { variant: "outline", children: ["Create ", title.slice(0, -1)] }) })] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((item) => (_jsx(Link, { href: `${pathname}/${item.id}`, children: _jsxs(Card, { className: "p-4 hover:border-black transition-colors cursor-pointer group", children: [_jsxs("div", { className: "aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative", children: [item.image ? (_jsx("img", { src: item.image, alt: item.name, className: "object-cover w-full h-full" })) : (_jsx("div", { className: "flex items-center justify-center h-full text-gray-300", children: _jsx(Icon, { name: "Image", size: 32 }) })), _jsx("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("span", { className: "bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold", children: "Edit" }) })] }), _jsx("h3", { className: "font-bold truncate", children: item.name }), _jsx("p", { className: "text-sm text-gray-500", children: item.price ? `$${item.price}` : 'Free' })] }) }, item.id))) }))] }));
};
