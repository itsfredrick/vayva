import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, Button } from "@vayva/ui";
export const puckConfig = {
    components: {
        Hero: {
            fields: {
                title: { type: "text" },
                description: { type: "textarea" },
                imageUrl: { type: "text" },
            },
            render: ({ title, description, imageUrl }) => (_jsxs("div", { className: "py-20 bg-gray-50 flex flex-col items-center justify-center text-center px-4 rounded-3xl overflow-hidden relative", children: [imageUrl && (_jsx("div", { className: "absolute inset-0 z-0 opactiy-10", children: _jsx("img", { src: imageUrl, alt: "", className: "w-full h-full object-cover" }) })), _jsxs("div", { className: "relative z-10 max-w-2xl", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-black text-gray-900 mb-6", children: title }), _jsx("p", { className: "text-xl text-gray-600 mb-8", children: description }), _jsx(Button, { className: "rounded-full font-bold shadow-xl hover:scale-105 transition-transform size-lg bg-black text-white px-8 py-4", children: "Shop Now" })] })] })),
        },
        ProductGrid: {
            fields: {
                title: { type: "text" },
                limit: { type: "number" },
            },
            render: ({ title, limit }) => (_jsxs("div", { className: "py-12 space-y-8", children: [_jsxs("div", { className: "flex justify-between items-end px-2", children: [_jsx("h2", { className: "text-2xl font-black text-gray-900", children: title }), _jsx("span", { className: "text-sm font-bold text-gray-400 uppercase tracking-widest", children: "View All" })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [...Array(limit || 4)].map((_, i) => (_jsxs("div", { className: "space-y-3 group cursor-pointer", children: [_jsx("div", { className: "aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 relative shadow-sm group-hover:shadow-xl transition-all", children: _jsx("div", { className: "absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm", children: _jsx(Icon, { name: "Heart", size: 16, className: "text-gray-400" }) }) }), _jsxs("div", { children: [_jsx("div", { className: "h-4 w-3/4 bg-gray-100 rounded animate-pulse" }), _jsx("div", { className: "mt-2 h-4 w-1/4 bg-gray-50 rounded animate-pulse" })] })] }, i))) })] })),
        },
        CollectionList: {
            fields: {
                title: { type: "text" },
            },
            render: ({ title }) => (_jsxs("div", { className: "py-12 space-y-8", children: [_jsx("h2", { className: "text-2xl font-black text-gray-900 px-2", children: title }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => (_jsxs("div", { className: "h-48 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group cursor-pointer relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" }), _jsxs("span", { className: "relative z-10 text-lg font-black text-gray-900 shadow-sm", children: ["Collection ", i] })] }, i))) })] })),
        },
        TextBlock: {
            fields: {
                text: { type: "textarea" },
                align: {
                    type: "select",
                    options: [
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                    ],
                },
            },
            render: ({ text, align }) => (_jsx("div", { className: `py-12 px-4 ${align === "center" ? "text-center" :
                    align === "right" ? "text-right" :
                        "text-left"}`, children: _jsxs("p", { className: "text-2xl md:text-3xl font-bold leading-relaxed text-gray-800 max-w-4xl mx-auto italic", children: ["\"", text, "\""] }) })),
        },
    },
};
