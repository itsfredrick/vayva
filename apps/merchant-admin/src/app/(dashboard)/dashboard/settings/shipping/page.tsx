"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Globe, Plus, Trash2, Map, Package, Settings, Save, X } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button, Input } from "@vayva/ui";
import { Label } from "@/components/ui/label";

interface ShippingRate {
    id: string;
    name: string;
    amount: number;
    minDays: number;
    maxDays: number;
}

interface ShippingZone {
    id: string;
    name: string;
    regions: string[];
    rates: ShippingRate[];
}

export default function ShippingSettingsPage() {
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
    const [isAddRateOpen, setIsAddRateOpen] = useState(false);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const res = await fetch("/api/settings/shipping");
                if (!res.ok) throw new Error("Failed to load shipping settings");
                const data = await res.json();
                setZones(data);
            } catch (error) {
                console.error(error);
                toast.error("Could not load shipping zones");
            } finally {
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

            if (!res.ok) throw new Error("Failed to save settings");
            toast.success("Shipping settings saved successfully");
        } catch (error) {
            console.error(error);
            toast.error("Could not save settings");
        } finally {
            setSaving(false);
        }
    };

    const deleteRate = (zoneId: string, rateId: string) => {
        setZones(zones.map(z => {
            if (z.id !== zoneId) return z;
            return { ...z, rates: z.rates.filter(r => r.id !== rateId) };
        }));
        toast.info("Click Save to persist changes");
    };

    const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
    const [zoneFormData, setZoneFormData] = useState({ id: "", name: "", regions: [] as string[] });

    const handleOpenCreateZone = () => {
        setZoneFormData({ id: "", name: "", regions: [] });
        setIsZoneModalOpen(true);
    };

    const handleOpenEditZone = (zone: ShippingZone) => {
        setZoneFormData({ ...zone });
        setIsZoneModalOpen(true);
    };

    const handleSaveZone = () => {
        if (!zoneFormData.name) return toast.error("Name is required");

        if (zoneFormData.id) {
            // Edit
            setZones(zones.map(z => z.id === zoneFormData.id ? { ...z, ...zoneFormData, regions: zoneFormData.regions } : z));
        } else {
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

    const handleAddRate = (rate: Omit<ShippingRate, "id">) => {
        if (!activeZoneId) return;

        setZones(zones.map(z => {
            if (z.id !== activeZoneId) return z;
            return {
                ...z,
                rates: [...z.rates, { ...rate, id: Date.now().toString() }]
            };
        }));
        setIsAddRateOpen(false);
        setActiveZoneId(null);
        toast.info("Rate added. Click Save to persist.");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipping & Delivery</h1>
                    <p className="text-slate-500">Manage how you ship orders to customers.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            {/* General Profile */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg h-fit">
                            <Globe className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 text-lg">General Shipping Profile</h3>
                            <p className="text-slate-500 text-sm mt-1">Default rates for all products unless specified otherwise.</p>
                        </div>
                    </div>
                    <Button variant="link" className="text-sm text-indigo-600 font-medium hover:underline p-0 h-auto">Manage Products</Button>
                </div>
            </div>

            <div className="divide-y divide-slate-100">
                {zones.map((zone) => (
                    <div key={zone.id} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Map className="h-5 w-5 text-slate-400" />
                                <h4 className="font-medium text-slate-900">{zone.name}</h4>
                                <span className="text-slate-400 text-sm">({zone.regions.length} regions)</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenEditZone(zone)}
                                    className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1 rounded hover:bg-slate-50 transition-colors h-auto"
                                >
                                    Edit Zone
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setActiveZoneId(zone.id);
                                        setIsAddRateOpen(true);
                                    }}
                                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 border-transparent"
                                >
                                    Add Rate
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                            {zone.rates.length === 0 ? (
                                <div className="p-4 text-center text-slate-500 text-sm">No rates added for this zone. Customers in this region won't be able to checkout.</div>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-slate-200 border-t border-slate-200">
                                        {zone.rates.map((rate) => (
                                            <tr key={rate.id} className="group">
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-slate-400" />
                                                        {rate.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500">
                                                    {rate.minDays}-{rate.maxDays} business days
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900 text-right">
                                                    {formatCurrency(rate.amount)}
                                                </td>
                                                <td className="px-4 py-3 w-10 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => deleteRate(zone.id, rate.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 h-8 w-8"
                                                        title="Remove Rate"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <Button
                    variant="outline"
                    onClick={handleOpenCreateZone}
                    className="w-full py-2 flex items-center justify-center gap-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors border border-dashed border-slate-300 h-auto"
                >
                    <Plus className="h-4 w-4" />
                    Create New Shipping Zone
                </Button>
            </div>


            {/* Local Delivery Settings Box */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Settings className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Local Delivery Preferences</h3>
                    <p className="text-slate-500 text-sm mb-4">Configure pickup options and local delivery radius.</p>
                    <p className="text-slate-500 text-sm mb-4">Configure pickup options and local delivery radius.</p>
                    <Button variant="link" className="text-indigo-600 font-medium text-sm hover:underline p-0 h-auto">Manage Local Delivery</Button>
                </div>
            </div>

            <AddRateDialog
                open={isAddRateOpen}
                onOpenChange={setIsAddRateOpen}
                onAdd={handleAddRate}
            />

            <Dialog open={isZoneModalOpen} onOpenChange={setIsZoneModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{zoneFormData.id ? "Edit Zone" : "Create Zone"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Zone Name</Label>
                            <Input
                                value={zoneFormData.name}
                                onChange={(e: any) => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                                placeholder="e.g. Lagos Island"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Regions (comma separated)</Label>
                            <Input
                                value={zoneFormData.regions.join(", ")}
                                onChange={(e: any) => setZoneFormData({ ...zoneFormData, regions: e.target.value.split(",").map((s: any) => s.trim()) })}
                                placeholder="e.g. Lekki, VI, Ikoyi"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveZone}>Save Zone</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}

function AddRateDialog({ open, onOpenChange, onAdd }: { open: boolean, onOpenChange: (open: boolean) => void, onAdd: (rate: Omit<ShippingRate, "id">) => void }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("1500");
    const [minDays, setMinDays] = useState("2");
    const [maxDays, setMaxDays] = useState("5");

    const handleSubmit = (e: React.FormEvent) => {
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Shipping Rate</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Standard Shipping" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Price (NGN)</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minDays" className="text-right">Min Days</Label>
                        <Input id="minDays" type="number" value={minDays} onChange={(e: any) => setMinDays(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxDays" className="text-right">Max Days</Label>
                        <Input id="maxDays" type="number" value={maxDays} onChange={(e: any) => setMaxDays(e.target.value)} className="col-span-3" required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Rate</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
