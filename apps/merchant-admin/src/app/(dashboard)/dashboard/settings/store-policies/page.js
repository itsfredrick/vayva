"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Input } from "@vayva/ui";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
const POLICY_TYPES = [
    { type: "terms", label: "Store Terms" },
    { type: "privacy", label: "Privacy Notice" },
    { type: "returns", label: "Returns Policy" },
    { type: "refunds", label: "Refund Policy" },
    { type: "shipping_delivery", label: "Shipping & Delivery" },
];
export default function StorePoliciesPage() {
    const [policies, setPolicies] = useState([]);
    const [selectedType, setSelectedType] = useState("terms");
    const [currentPolicy, setCurrentPolicy] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        loadPolicies();
    }, []);
    useEffect(() => {
        if (selectedType) {
            loadPolicy(selectedType);
        }
    }, [selectedType]);
    async function loadPolicies() {
        try {
            const res = await fetch("/api/merchant/policies");
            const data = await res.json();
            setPolicies(data.policies || []);
        }
        catch (error) {
            console.error("Error loading policies:", error);
        }
    }
    async function loadPolicy(type) {
        setLoading(true);
        try {
            const res = await fetch(`/api/merchant/policies/${type}`);
            if (res.ok) {
                const data = await res.json();
                setCurrentPolicy(data.policy);
                setTitle(data.policy.title);
                setContent(data.policy.contentMd);
            }
            else {
                setCurrentPolicy(null);
                setTitle("");
                setContent("");
            }
        }
        catch (error) {
            console.error("Error loading policy:", error);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleGenerate() {
        if (!confirm("Generate default policies? This will overwrite any existing drafts."))
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/merchant/policies/generate", {
                method: "POST",
            });
            if (res.ok) {
                await loadPolicies();
                await loadPolicy(selectedType);
                alert("Policies generated successfully!");
            }
        }
        catch (error) {
            console.error("Error generating policies:", error);
            alert("Failed to generate policies");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch(`/api/merchant/policies/${selectedType}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, contentMd: content }),
            });
            if (res.ok) {
                await loadPolicies();
                await loadPolicy(selectedType);
                alert("Policy saved!");
            }
        }
        catch (error) {
            console.error("Error saving policy:", error);
            alert("Failed to save policy");
        }
        finally {
            setSaving(false);
        }
    }
    async function handlePublish() {
        if (!confirm("Publish this policy? It will be visible on your storefront."))
            return;
        setSaving(true);
        try {
            const res = await fetch(`/api/merchant/policies/${selectedType}/publish`, { method: "POST" });
            if (res.ok) {
                await loadPolicies();
                await loadPolicy(selectedType);
                alert("Policy published!");
            }
        }
        catch (error) {
            console.error("Error publishing policy:", error);
            alert("Failed to publish policy");
        }
        finally {
            setSaving(false);
        }
    }
    const selectedPolicyData = policies.find((p) => p.type === selectedType);
    return (_jsxs("div", { className: "p-6 max-w-7xl mx-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Store Policies" }), _jsx("p", { className: "text-slate-600 mt-1", children: "Manage your storefront policies" })] }), _jsx(Card, { className: "bg-amber-50 border-amber-200 p-4 mb-6", children: _jsxs("p", { className: "text-sm text-amber-900", children: [_jsx("strong", { children: "Note:" }), " These are templates. Review and customize them to match your business before publishing."] }) }), policies.length === 0 && (_jsx("div", { className: "mb-6", children: _jsx(Button, { onClick: handleGenerate, disabled: loading, children: "Generate Default Policies" }) })), _jsxs("div", { className: "grid lg:grid-cols-[240px_1fr] gap-6", children: [_jsx("div", { className: "space-y-2", children: POLICY_TYPES.map(({ type, label }) => {
                            const policy = policies.find((p) => p.type === type);
                            const isSelected = selectedType === type;
                            return (_jsx(Button, { variant: "ghost", onClick: () => setSelectedType(type), className: `w-full justify-start h-auto px-4 py-3 rounded-lg transition-colors font-normal hover:bg-slate-100 text-slate-700 ${isSelected
                                    ? "bg-[#22C55E]/10 text-[#22C55E] font-medium hover:bg-[#22C55E]/20 hover:text-[#22C55E]"
                                    : ""}`, children: _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsx("span", { className: "text-sm", children: label }), policy && (_jsx(Badge, { variant: (policy.status === "PUBLISHED"
                                                ? "default"
                                                : "secondary"), children: policy.status === "PUBLISHED" ? "Published" : "Draft" }))] }) }, type));
                        }) }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "text-center py-12 text-slate-500", children: "Loading..." })) : currentPolicy ? (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Title" }), _jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Policy Title" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Content (Markdown)" }), _jsx(Textarea, { value: content, onChange: (e) => setContent(e.target.value), placeholder: "Policy content in markdown...", rows: 20, className: "font-mono text-sm" })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: handleSave, disabled: saving, children: saving ? "Saving..." : "Save Draft" }), _jsx(Button, { onClick: handlePublish, disabled: saving, variant: "primary", children: "Publish" })] }), selectedPolicyData?.lastUpdatedLabel && (_jsxs("p", { className: "text-sm text-slate-500", children: ["Last published: ", selectedPolicyData.lastUpdatedLabel] }))] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-slate-500 mb-4", children: "No policy found" }), _jsx(Button, { onClick: handleGenerate, children: "Generate Policies" })] })) })] })] }));
}
