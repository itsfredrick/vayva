"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Shield, Plus, Copy, Check } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function TeamPage() {
    const { data: team, isLoading, refetch } = useOpsQuery(["ops-team"], () => fetch("/api/ops/admin/team").then(res => res.json().then(j => j.data)));
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", role: "OPS_SUPPORT" });
    const [createdCreds, setCreatedCreds] = useState(null);
    const handleInvite = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/ops/admin/team", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("User created successfully");
                setCreatedCreds({ email: formData.email, tempPassword: json.tempPassword });
                setIsInviteOpen(false);
                setFormData({ name: "", email: "", role: "OPS_SUPPORT" });
                refetch();
            }
            else {
                toast.error(json.error || "Failed to invite");
            }
        }
        catch (err) {
            toast.error("Network error");
        }
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(Shield, { className: "w-8 h-8 text-indigo-600" }), "Team Management"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage Ops Console access and roles." })] }), _jsxs(Button, { onClick: () => setIsInviteOpen(!isInviteOpen), className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-medium h-auto", "aria-label": "Invite a new team member", children: [_jsx(Plus, { size: 16 }), " Invite Member"] })] }), createdCreds && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-6 relative", children: [_jsx(Button, { variant: "ghost", onClick: () => setCreatedCreds(null), className: "absolute top-4 right-4 text-green-700 hover:text-green-900 h-auto p-2", "aria-label": "Close credentials popup", children: "Close" }), _jsxs("h3", { className: "font-bold text-green-800 text-lg mb-2 flex items-center gap-2", children: [_jsx(Check, { size: 20 }), " User Created Successfully"] }), _jsx("p", { className: "text-green-700 mb-4", children: "Please copy these temporary credentials immediately. They will not be shown again." }), _jsxs("div", { className: "bg-white border border-green-200 rounded-lg p-4 space-y-2 font-mono text-sm max-w-md", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-500", children: "Email:" }), _jsx("span", { className: "font-bold select-all", children: createdCreds.email })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-gray-500", children: "Temp Password:" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-bold select-all bg-gray-100 px-2 py-0.5 rounded", children: createdCreds.tempPassword }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => copyToClipboard(createdCreds.tempPassword), className: "text-gray-400 hover:text-gray-600 h-8 w-8", "aria-label": "Copy temporary password to clipboard", children: _jsx(Copy, { size: 14 }) })] })] })] })] })), isInviteOpen && (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-lg", children: [_jsx("h3", { className: "font-bold text-lg mb-4", children: "Invite New Team Member" }), _jsxs("form", { onSubmit: handleInvite, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx("input", { required: true, className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), placeholder: "e.g. Jane Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email Address" }), _jsx("input", { required: true, type: "email", className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), placeholder: "jane@vayva.ng" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Role" }), _jsxs("select", { className: "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500", value: formData.role, onChange: e => setFormData({ ...formData, role: e.target.value }), "aria-label": "Select member role", children: [_jsx("option", { value: "OPS_SUPPORT", children: "Support Agent (L1)" }), _jsx("option", { value: "OPS_ADMIN", children: "Admin (L2)" }), _jsx("option", { value: "OPS_OWNER", children: "Owner (Full Access)" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => setIsInviteOpen(false), className: "px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium h-auto", "aria-label": "Cancel invitation", children: "Cancel" }), _jsx(Button, { type: "submit", className: "px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium h-auto", "aria-label": "Send invitation email", children: "Send Invite" })] })] })] })), _jsx("div", { className: "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-medium", children: "Name" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Role" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Last Login" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "p-12 text-center text-gray-400", children: "Loading team..." }) })) : !team?.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "p-12 text-center text-gray-400", children: "No team members found." }) })) : (team.map((u) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: u.name }), _jsx("div", { className: "text-xs text-gray-500", children: u.email })] }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${u.role === 'OPS_OWNER' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'OPS_ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-blue-100 text-blue-700'}`, children: u.role.replace("OPS_", "") }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-bold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`, children: u.isActive ? "Active" : "Disabled" }) }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never" })] }, u.id)))) })] }) })] }));
}
