"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Globe, Plus, Trash2, Map, Package, Settings, Save } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";
export default function ShippingSettingsPage() {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeZoneId, setActiveZoneId] = useState(null);
    const [isAddRateOpen, setIsAddRateOpen] = useState(false);
    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await fetch("/api/settings/shipping");
                if (!res.ok)
                    throw new Error("Failed to load shipping settings");
                const data = await res.json();
                setZones(data);
            }
            catch (error) {
                console.error(error);
                toast.error("Could not load shipping zones");
            }
            finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, []);
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings/shipping", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(zones)
            });
            if (!res.ok)
                throw new Error("Failed to save settings");
            toast.success("Shipping settings saved successfully");
        }
        catch (error) {
            console.error(error);
            toast.error("Could not save settings");
        }
        finally {
            setSaving(false);
        }
    };
    const deleteRate = (zoneId, rateId) => {
        setZones(zones.map(z => {
            if (z.id !== zoneId)
                return z;
            return { ...z, rates: z.rates.filter(r => r.id !== rateId) };
        }));
        toast.info("Click Save to persist changes");
    };
    const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
    const [zoneFormData, setZoneFormData] = useState({ id: "", name: "", regions: [] });
    const handleOpenCreateZone = () => {
        setZoneFormData({ id: "", name: "", regions: [] });
        setIsZoneModalOpen(true);
    };
    const handleOpenEditZone = (zone) => {
        setZoneFormData({ ...zone });
        setIsZoneModalOpen(true);
    };
    const handleSaveZone = () => {
        if (!zoneFormData.name)
            return toast.error("Name is required");
        if (zoneFormData.id) {
            // Edit
            setZones(zones.map(z => z.id === zoneFormData.id ? { ...z, ...zoneFormData, regions: zoneFormData.regions } : z));
        }
        else {
            // Create
            setZones([...zones, {
                    id: Date.now().toString(),
                    name: zoneFormData.name,
                    regions: zoneFormData.regions,
                    rates: []
                }]);
        }
        setIsZoneModalOpen(false);
    };
    const handleAddRate = (rate) => {
        if (!activeZoneId)
            return;
        setZones(zones.map(z => {
            if (z.id !== activeZoneId)
                return z;
            return {
                ...z,
                rates: [...z.rates, { ...rate, id: Date.now().toString() }]
            };
        }));
        setIsAddRateOpen(false);
        setActiveZoneId(null);
        toast.info("Rate added. Click Save to persist.");
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Shipping & Delivery" }), _jsx("p", { className: "text-slate-500", children: "Manage how you ship orders to customers." })] }), _jsxs(Button, { onClick: handleSave, disabled: saving || loading, className: "inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50", children: [_jsx(Save, { className: "h-4 w-4" }), saving ? "Saving..." : "Save Changes"] })] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: _jsxs("div", { className: "p-6 border-b border-slate-100 flex justify-between items-start", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "p-3 bg-indigo-50 text-indigo-600 rounded-lg h-fit", children: _jsx(Globe, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900 text-lg", children: "General Shipping Profile" }), _jsx("p", { className: "text-slate-500 text-sm mt-1", children: "Default rates for all products unless specified otherwise." })] })] }), _jsx(Button, { variant: "link", className: "text-sm text-indigo-600 font-medium hover:underline p-0 h-auto", children: "Manage Products" })] }) }), _jsx("div", { className: "divide-y divide-slate-100", children: zones.map((zone) => (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Map, { className: "h-5 w-5 text-slate-400" }), _jsx("h4", { className: "font-medium text-slate-900", children: zone.name }), _jsxs("span", { className: "text-slate-400 text-sm", children: ["(", zone.regions.length, " regions)"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenEditZone(zone), className: "text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1 rounded hover:bg-slate-50 transition-colors h-auto", children: "Edit Zone" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => {
                                                setActiveZoneId(zone.id);
                                                setIsAddRateOpen(true);
                                            }, className: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 border-transparent", children: "Add Rate" })] })] }), _jsx("div", { className: "bg-slate-50 rounded-lg border border-slate-200 overflow-hidden", children: zone.rates.length === 0 ? (_jsx("div", { className: "p-4 text-center text-slate-500 text-sm", children: "No rates added for this zone. Customers in this region won't be able to checkout." })) : (_jsx("table", { className: "w-full text-sm text-left", children: _jsx("tbody", { className: "divide-y divide-slate-200 border-t border-slate-200", children: zone.rates.map((rate) => (_jsxs("tr", { className: "group", children: [_jsx("td", { className: "px-4 py-3 font-medium text-slate-700", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Package, { className: "h-4 w-4 text-slate-400" }), rate.name] }) }), _jsxs("td", { className: "px-4 py-3 text-slate-500", children: [rate.minDays, "-", rate.maxDays, " business days"] }), _jsx("td", { className: "px-4 py-3 font-medium text-slate-900 text-right", children: formatCurrency(rate.amount) }), _jsx("td", { className: "px-4 py-3 w-10 text-right", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => deleteRate(zone.id, rate.id), className: "text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 h-8 w-8", title: "Remove Rate", children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, rate.id))) }) })) })] }, zone.id))) }), _jsx("div", { className: "p-4 bg-slate-50 border-t border-slate-200", children: _jsxs(Button, { variant: "outline", onClick: handleOpenCreateZone, className: "w-full py-2 flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300 h-auto", children: [_jsx(Plus, { className: "h-4 w-4" }), "Create New Shipping Zone"] }) }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4", children: [_jsx("div", { className: "p-3 bg-amber-50 text-amber-600 rounded-lg", children: _jsx(Settings, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-slate-900 mb-1", children: "Local Delivery Preferences" }), _jsx("p", { className: "text-slate-500 text-sm mb-4", children: "Configure pickup options and local delivery radius." }), _jsx("p", { className: "text-slate-500 text-sm mb-4", children: "Configure pickup options and local delivery radius." }), _jsx(Button, { variant: "link", className: "text-indigo-600 font-medium text-sm hover:underline p-0 h-auto", children: "Manage Local Delivery" })] })] }), _jsx(AddRateDialog, { open: isAddRateOpen, onOpenChange: setIsAddRateOpen, onAdd: handleAddRate }), _jsx(Dialog, { open: isZoneModalOpen, onOpenChange: setIsZoneModalOpen, children: _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: zoneFormData.id ? "Edit Zone" : "Create Zone" }) }), _jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Zone Name" }), _jsx(Input, { value: zoneFormData.name, onChange: (e) => setZoneFormData({ ...zoneFormData, name: e.target.value }), placeholder: "e.g. Lagos Island" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsx(Label, { children: "Regions (comma separated)" }), _jsx(Input, { value: zoneFormData.regions.join(", "), onChange: (e) => setZoneFormData({ ...zoneFormData, regions: e.target.value.split(",").map((s) => s.trim()) }), placeholder: "e.g. Lekki, VI, Ikoyi" })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { onClick: handleSaveZone, children: "Save Zone" }) })] }) })] }));
}
function AddRateDialog({ open, onOpenChange, onAdd }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("1500");
    const [minDays, setMinDays] = useState("2");
    const [maxDays, setMaxDays] = useState("5");
    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            name,
            amount: Number(amount),
            minDays: Number(minDays),
            maxDays: Number(maxDays)
        });
        setName("");
        setAmount("1500");
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "sm:max-w-[425px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Add Shipping Rate" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "grid gap-4 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "name", className: "text-right", children: "Name" }), _jsx(Input, { id: "name", value: name, onChange: (e) => setName(e.target.value), placeholder: "Standard Shipping", className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "amount", className: "text-right", children: "Price (NGN)" }), _jsx(Input, { id: "amount", type: "number", value: amount, onChange: (e) => setAmount(e.target.value), className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "minDays", className: "text-right", children: "Min Days" }), _jsx(Input, { id: "minDays", type: "number", value: minDays, onChange: (e) => setMinDays(e.target.value), className: "col-span-3", required: true })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { htmlFor: "maxDays", className: "text-right", children: "Max Days" }), _jsx(Input, { id: "maxDays", type: "number", value: maxDays, onChange: (e) => setMaxDays(e.target.value), className: "col-span-3", required: true })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: "Add Rate" }) })] })] }) }));
}
