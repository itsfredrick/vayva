"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Store, Mail, Phone, Globe, Camera, Loader2, Save, Smartphone, Clock, Lock, Unlock } from "lucide-react";
import { Button } from "@vayva/ui";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export default function StoreSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        fetchProfile();
    }, []);
    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/account/store");
            if (!res.ok)
                throw new Error("Failed to load store profile");
            const data = await res.json();
            setProfile(data);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load store profile");
        }
        finally {
            setLoading(false);
        }
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!profile)
            return;
        setSaving(true);
        try {
            const res = await fetch("/api/account/store", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to update profile");
            }
            toast.success("Store profile updated successfully");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex h-[400px] items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-slate-400" }) }));
    }
    if (!profile)
        return null;
    return (_jsxs("div", { className: "max-w-4xl space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Store Settings" }), _jsx("p", { className: "text-slate-500", children: "Manage your public store profile and contact information." })] }), _jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(Store, { className: "h-5 w-5 text-indigo-600" }), "Branding & Identity"] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsxs("div", { className: "flex-shrink-0", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Store Logo" }), _jsxs("div", { className: "relative h-24 w-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group", children: [profile.logoUrl ? (_jsx("img", { src: profile.logoUrl, alt: "Logo", className: "h-full w-full object-contain" })) : (_jsx(Camera, { className: "h-8 w-8 text-slate-300" })), _jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer", children: _jsx("span", { className: "text-[10px] text-white font-bold", children: "CHANGE" }) })] })] }), _jsxs("div", { className: "flex-grow grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { htmlFor: "store-name", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Store Name" }), _jsx("input", { id: "store-name", type: "text", placeholder: "Enter your store name", value: profile.name, onChange: e => setProfile({ ...profile, name: e.target.value }), className: "w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Store URL Slug" }), _jsxs("div", { className: "flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 text-slate-500 text-sm", children: [_jsx(Globe, { className: "h-4 w-4" }), _jsx("span", { children: "vayva.store/" }), _jsx("span", { className: "font-medium text-slate-900", children: profile.slug })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "store-category", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Business Category" }), _jsxs("select", { id: "store-category", value: profile.businessType, onChange: e => setProfile({ ...profile, businessType: e.target.value }), className: "w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900", children: [_jsx("option", { value: "fashion", children: "Fashion & Apparel" }), _jsx("option", { value: "electronics", children: "Electronics" }), _jsx("option", { value: "beauty", children: "Beauty & Personal Care" }), _jsx("option", { value: "food", children: "Food & Groceries" }), _jsx("option", { value: "services", children: "Professional Services" }), _jsx("option", { value: "general", children: "General Retail" })] })] })] })] }), _jsxs("div", { className: "mt-6", children: [_jsx("label", { htmlFor: "store-description", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Short Description" }), _jsx("textarea", { id: "store-description", value: profile.description, onChange: e => setProfile({ ...profile, description: e.target.value }), rows: 3, placeholder: "A brief bio that appears on your store profile...", className: "w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(Mail, { className: "h-5 w-5 text-indigo-600" }), "Support & Communication"] }), _jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "support-email", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Support Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), _jsx("input", { id: "support-email", type: "email", placeholder: "support@yourstore.com", value: profile.supportEmail, onChange: e => setProfile({ ...profile, supportEmail: e.target.value }), className: "w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "support-phone", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Support Phone" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), _jsx("input", { id: "support-phone", type: "tel", placeholder: "+234...", value: profile.supportPhone, onChange: e => setProfile({ ...profile, supportPhone: e.target.value }), className: "w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" })] })] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx("label", { htmlFor: "whatsapp-number", className: "block text-sm font-medium text-slate-700 mb-1.5 text-left", children: "Official WhatsApp Number (E.164)" }), _jsxs("div", { className: "relative", children: [_jsx(Smartphone, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-400" }), _jsx("input", { id: "whatsapp-number", type: "text", placeholder: "+234...", value: profile.whatsappNumber, onChange: e => setProfile({ ...profile, whatsappNumber: e.target.value }), className: "w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-mono" }), _jsx("p", { className: "mt-1 text-xs text-slate-400", children: "This number will be used for AI Agent responses and customer contact." })] })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2", children: [profile.isActive ? _jsx(Unlock, { className: "h-5 w-5 text-green-600" }) : _jsx(Lock, { className: "h-5 w-5 text-red-600" }), "Store Status"] }), _jsxs("div", { className: "flex items-center justify-between p-4 bg-slate-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-slate-900", children: profile.isActive ? "Store is Open" : "Store is Closed (Maintenance Mode)" }), _jsx("p", { className: "text-sm text-slate-500", children: profile.isActive
                                                    ? "Customers can see your products and place orders."
                                                    : "Customers cannot place orders, but can still browse (if enabled)." })] }), _jsx(Button, { type: "button", variant: profile.isActive ? "outline" : "primary", onClick: () => setProfile({ ...profile, isActive: !profile.isActive }), className: profile.isActive ? "border-red-200 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700", children: profile.isActive ? "Stop Orders" : "Resume Orders" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm", children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-indigo-600" }), "Operating Hours"] }), _jsx("div", { className: "space-y-4", children: DAYS.map(day => {
                                    const hours = profile.operatingHours[day] || { isClosed: false, open: "08:00", close: "18:00" };
                                    return (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 border-b border-slate-50 last:border-0", children: [_jsx("div", { className: "w-24 font-medium text-slate-700", children: day }), _jsxs("div", { className: "flex items-center gap-4 flex-grow sm:justify-end", children: [_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: hours.isClosed, onChange: e => {
                                                                    const newHours = { ...profile.operatingHours };
                                                                    newHours[day] = { ...hours, isClosed: e.target.checked };
                                                                    setProfile({ ...profile, operatingHours: newHours });
                                                                }, className: "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" }), _jsx("span", { className: "text-sm text-slate-500", children: "Closed" })] }), !hours.isClosed && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "time", value: hours.open || "08:00", "aria-label": `${day} opening time`, onChange: e => {
                                                                    const newHours = { ...profile.operatingHours };
                                                                    newHours[day] = { ...hours, open: e.target.value };
                                                                    setProfile({ ...profile, operatingHours: newHours });
                                                                }, className: "px-2 py-1 rounded border border-slate-300 text-sm outline-none focus:ring-1 focus:ring-indigo-500" }), _jsx("span", { className: "text-slate-400", children: "-" }), _jsx("input", { type: "time", value: hours.close || "18:00", "aria-label": `${day} closing time`, onChange: e => {
                                                                    const newHours = { ...profile.operatingHours };
                                                                    newHours[day] = { ...hours, close: e.target.value };
                                                                    setProfile({ ...profile, operatingHours: newHours });
                                                                }, className: "px-2 py-1 rounded border border-slate-300 text-sm outline-none focus:ring-1 focus:ring-indigo-500" })] }))] })] }, day));
                                }) })] }), _jsx("div", { className: "flex justify-end pt-4 border-t border-slate-200", children: _jsxs(Button, { type: "submit", disabled: saving, className: "bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-8", children: [saving ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin" })) : (_jsx(Save, { className: "h-4 w-4" })), "Save Changes"] }) })] })] }));
}
