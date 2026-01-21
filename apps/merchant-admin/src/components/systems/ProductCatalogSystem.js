"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, Input, cn } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
export function ProductCatalogSystem({ onComplete, }) {
    const [step, setStep] = useState("create");
    const [product, setProduct] = useState({
        name: "",
        category: "Retail", // Should ideally come from business state
        description: "",
        type: "physical",
        hasVariants: false,
        variants: [{ group: "Size", options: ["S", "M", "L"] }], // Default example
        priceMode: "single",
        basePrice: "",
    });
    const handleNext = () => {
        if (step === "create") {
            if (product.hasVariants)
                setStep("variants");
            else
                setStep("pricing");
        }
        else if (step === "variants") {
            setStep("pricing");
        }
        else {
            // Finish
            onComplete();
        }
    };
    return (_jsxs("div", { className: "flex flex-col lg:flex-row gap-8 h-[600px]", children: [_jsxs("div", { className: "flex-1 overflow-y-auto pr-2", children: [_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "flex gap-2 mb-2", children: ["create", "variants", "pricing"].map((s, idx) => (_jsx("div", { className: cn("h-1 flex-1 rounded-full transition-colors", 
                                    // Complex logic for progress bar color
                                    step === s ||
                                        (step === "pricing" && s !== "pricing") ||
                                        (step === "variants" && s === "create")
                                        ? "bg-black"
                                        : "bg-gray-100") }, s))) }), _jsxs("h2", { className: "text-xl font-bold text-gray-900", children: [step === "create" && "Create your first product", step === "variants" && "Add product options", step === "pricing" && "Set your price"] })] }), step === "create" && (_jsxs("div", { className: "space-y-4 animate-in slide-in-from-right-4 fade-in", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "text-xs font-bold text-gray-500 uppercase", children: ["Product Name ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Input, { placeholder: "e.g. Classic White Tee", value: product.name, onChange: (e) => setProduct({ ...product, name: e.target.value }), autoFocus: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Product Type" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ["physical", "digital", "service"].map((t) => (_jsx(Button, { onClick: () => setProduct({ ...product, type: t }), variant: product.type === t ? "primary" : "outline", className: cn("capitalize transition-colors h-auto py-2", product.type === t
                                                ? "bg-black text-white border-black hover:bg-black/90"
                                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"), children: t }, t))) })] }), _jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100", children: [_jsxs("div", { children: [_jsx("span", { className: "font-bold text-sm block text-gray-900", children: "This product has options" }), _jsx("span", { className: "text-xs text-gray-500", children: "Like size, color, or material" })] }), _jsx(Switch, { checked: product.hasVariants, onCheckedChange: (c) => setProduct({ ...product, hasVariants: c }) })] })] })), step === "variants" && (_jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 fade-in", children: [product.variants.map((variant, idx) => (_jsxs("div", { className: "p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase", children: "Option Name" }), _jsx(Button, { variant: "link", size: "sm", className: "text-xs text-red-500 hover:text-red-600 hover:underline p-0 h-auto", children: "Remove" })] }), _jsx(Input, { value: variant.group, onChange: (e) => {
                                            const newV = [...product.variants];
                                            newV[idx].group = e.target.value;
                                            setProduct({ ...product, variants: newV });
                                        } }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase mb-1 block", children: "Values (comma separated)" }), _jsx(Input, { placeholder: "Small, Medium, Large", value: variant.options.join(", "), onChange: (e) => {
                                                    const newV = [...product.variants];
                                                    newV[idx].options = e.target.value
                                                        .split(",")
                                                        .map((s) => s.trim());
                                                    setProduct({ ...product, variants: newV });
                                                } })] })] }, idx))), _jsx(Button, { variant: "outline", className: "w-full border-dashed border-gray-300 text-gray-500", onClick: () => {
                                    setProduct({
                                        ...product,
                                        variants: [
                                            ...product.variants,
                                            { group: "New Option", options: [] },
                                        ],
                                    });
                                }, children: "+ Add another option" })] })), step === "pricing" && (_jsxs("div", { className: "space-y-6 animate-in slide-in-from-right-4 fade-in", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("label", { className: "text-xs font-bold text-gray-500 uppercase", children: ["Selling Price ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", children: "\u20A6" }), _jsx(Input, { className: "pl-8 text-lg font-mono", placeholder: "0.00", value: product.basePrice, onChange: (e) => setProduct({ ...product, basePrice: e.target.value }), autoFocus: true })] })] }), _jsxs("div", { className: "p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3", children: [_jsx(Icon, { name: "MessageCircle", className: "text-green-600 mt-1", size: 16 }), _jsxs("div", { className: "space-y-1", children: [_jsx("h4", { className: "font-bold text-green-900 text-sm", children: "WhatsApp Automation" }), _jsxs("p", { className: "text-xs text-green-700", children: ["When customers ask \"How much?\", our AI will reply: ", _jsx("br", {}), " ", "\"It's \u20A6", product.basePrice || "...", " per unit.\""] })] })] })] })), _jsx("div", { className: "mt-8 pt-4 border-t border-gray-100 flex justify-end", children: _jsx(Button, { onClick: handleNext, disabled: !product.name, className: "!bg-black text-white px-8 h-12 rounded-xl", children: step === "pricing" ? "Finish & Save" : "Next" }) })] }), _jsxs("div", { className: "w-[320px] bg-gray-100 rounded-3xl p-6 border border-gray-200 hidden lg:flex flex-col items-center justify-center relative", children: [_jsx("div", { className: "absolute top-4 left-0 w-full text-center", children: _jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider", children: "Customer View" }) }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl w-full overflow-hidden max-w-[260px] transform transition-all hover:scale-105 duration-300", children: [_jsxs("div", { className: "aspect-square bg-gray-200 flex items-center justify-center relative", children: [_jsx(Icon, { name: "Image", className: "text-gray-400", size: 32 }), product.type === "digital" && (_jsx("div", { className: "absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm", children: "DIGITAL" }))] }), _jsxs("div", { className: "p-4 space-y-2", children: [!product.name && (_jsx("div", { className: "h-4 w-3/4 bg-gray-100 rounded animate-pulse" })), product.name && (_jsx("h3", { className: "font-bold text-gray-900 leading-tight", children: product.name })), _jsxs("div", { className: "flex items-baseline gap-1", children: [_jsx("span", { className: "text-xs text-gray-500", children: "\u20A6" }), _jsx("span", { className: "text-lg font-bold text-black", children: product.basePrice || "0.00" })] }), product.hasVariants && (_jsxs("div", { className: "flex gap-1 flex-wrap pt-2", children: [product.variants[0]?.options.slice(0, 3).map((opt) => (_jsx("span", { className: "text-[10px] border border-gray-200 px-1.5 py-0.5 rounded text-gray-600", children: opt }, opt))), product.variants[0]?.options.length > 3 && (_jsx("span", { className: "text-[10px] text-gray-400", children: "+More" }))] }))] })] })] })] }));
}
