"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StoreShell } from "@/components/StoreShell";
import { useStore } from "@/context/StoreContext";
import { useParams } from "next/navigation";
export default function PolicyPage({ params }) {
    const { store } = useStore();
    const { slug } = useParams();
    if (!store)
        return null;
    let title = "";
    let content = "";
    switch (slug) {
        case "about":
            title = "About Us";
            content =
                store.tagline || "Welcome to our store. We provide quality products.";
            break;
        case "contact":
            title = "Contact Us";
            content = `Email: ${store.contact.email || "N/A"}\nPhone: ${store.contact.phone || "N/A"}`;
            break;
        case "shipping":
            title = "Shipping Policy";
            content = store.policies.shipping || "No shipping policy defined.";
            break;
        case "returns":
            title = "Returns Policy";
            content = store.policies.returns || "No returns policy defined.";
            break;
        case "privacy":
            title = "Privacy Policy";
            content = store.policies.privacy || "No privacy policy defined.";
            break;
        default:
            return (_jsx(StoreShell, { children: _jsx("div", { className: "py-20 text-center", children: _jsx("h1", { className: "text-2xl font-bold", children: "Page Not Found" }) }) }));
    }
    return (_jsx(StoreShell, { children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 py-20", children: [_jsx("h1", { className: "text-4xl font-bold mb-8", children: title }), _jsx("div", { className: "prose prose-lg whitespace-pre-wrap text-gray-600", children: content })] }) }));
}
