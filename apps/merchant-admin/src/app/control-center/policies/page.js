"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PolicyEditor } from "@/components/policies/PolicyEditor";
// Test fetch
const fetchPolicies = async () => {
    const res = await fetch("/api/store/policies");
    return res.json();
};
const savePolicies = async (data) => {
    await fetch("/api/store/policies", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
};
function PoliciesContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "returns"; // default to returns
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchPolicies().then((data) => {
            setStoreData(data);
            setLoading(false);
        });
    }, []);
    const handleSave = async (content) => {
        const field = tab === "returns"
            ? "returnsMarkdown"
            : tab === "shipping"
                ? "shippingMarkdown"
                : tab === "privacy"
                    ? "privacyMarkdown"
                    : "termsMarkdown";
        await savePolicies({ [field]: content });
        // Optimistic update
        setStoreData({ ...storeData, [field]: content });
    };
    if (loading)
        return (_jsx("div", { className: "p-12 text-center text-gray-400", children: "Loading editor..." }));
    const content = tab === "returns"
        ? storeData.returnsMarkdown
        : tab === "shipping"
            ? storeData.shippingMarkdown
            : tab === "privacy"
                ? storeData.privacyMarkdown
                : storeData.termsMarkdown;
    return (_jsx(PolicyEditor, { type: tab, initialContent: content, onSave: handleSave, storeSlug: storeData.slug || "demo-store" }, tab));
}
export default function PoliciesPage() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "p-12 text-center text-gray-400", children: "Loading..." }), children: _jsx(PoliciesContent, {}) }));
}
