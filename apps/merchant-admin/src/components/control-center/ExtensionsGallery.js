"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Icon, cn } from "@vayva/ui";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export const ExtensionsGallery = () => {
    const [extensions, setExtensions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(null);
    useEffect(() => {
        fetchExtensions();
    }, []);
    const fetchExtensions = async () => {
        try {
            const res = await fetch("/api/control-center/extensions");
            const data = await res.json();
            setExtensions(data);
        }
        catch (e) {
            toast.error("Failed to load extensions");
        }
        finally {
            setLoading(false);
        }
    };
    const handleToggle = async (ext) => {
        setToggling(ext.id);
        try {
            const res = await fetch("/api/control-center/extensions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ extensionId: ext.id, enabled: !ext.isEnabled })
            });
            if (res.ok) {
                toast.success(`${ext.name} ${ext.isEnabled ? 'disabled' : 'enabled'}`);
                setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, isEnabled: !e.isEnabled } : e));
                // Refresh Sidebar (Simple page reload for now to reflect sidebar changes)
                // In production, we'd use a state manager or router.refresh()
                setTimeout(() => window.location.reload(), 1000);
            }
        }
        catch (e) {
            toast.error("Failed to update extension");
        }
        finally {
            setToggling(null);
        }
    };
    if (loading)
        return (_jsx("div", { className: "flex items-center justify-center p-12", children: _jsx(Loader2, { className: "animate-spin w-8 h-8 text-gray-200" }) }));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: extensions.map((ext) => (_jsxs("div", { className: cn("bg-white border rounded-2xl p-6 transition-all relative overflow-hidden group hover:shadow-md", ext.isEnabled ? "border-black/5 ring-1 ring-black/5" : "border-gray-200"), children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("div", { className: cn("p-3 rounded-xl", ext.isEnabled ? "bg-black text-white" : "bg-gray-100 text-gray-400"), children: _jsx(Icon, { name: ext.icon, size: 20 }) }), _jsx("div", { className: cn("text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full", ext.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"), children: ext.isEnabled ? "Enabled" : "Available" })] }), _jsx("h3", { className: "font-bold text-gray-900 mb-1", children: ext.name }), _jsx("p", { className: "text-xs text-gray-500 leading-relaxed mb-6", children: ext.description }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-50", children: [_jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: ext.category }), _jsx(Button, { variant: ext.isEnabled ? "outline" : "primary", size: "sm", onClick: () => handleToggle(ext), disabled: toggling === ext.id, className: "h-8 py-0", children: toggling === ext.id ? (_jsx(Loader2, { className: "w-3 h-3 animate-spin" })) : (ext.isEnabled ? "Manage" : "Install") })] }), _jsx("div", { className: "absolute -bottom-2 -right-2 opacity-5 pointer-events-none group-hover:scale-110 transition-transform", children: _jsx(Icon, { name: ext.icon, size: 80 }) })] }, ext.id))) }), extensions.length === 0 && (_jsx("div", { className: "text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl", children: _jsx("p", { className: "text-gray-400", children: "No extensions found." }) }))] }));
};
