
"use client";

import React, { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Icon, Input } from "@vayva/ui";

export default function ProfilePage() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [newAddress, setNewAddress] = useState({ street: "", city: "Lagos", phone: "" });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        fetch("/api/market/account/addresses")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setAddresses(data); });
    }, []);

    const handleSave = async () => {
        await fetch("/api/market/account/addresses", {
            method: "POST",
            body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 })
        });
        setShowAdd(false);
        // Refresh
        const res = await fetch("/api/market/account/addresses");
        setAddresses(await res.json());
    };

    return (
        <MarketShell>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Profile & Settings</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Info */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl h-fit">
                        <h3 className="text-lg font-bold text-white mb-4">Personal Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400">Full Name</label>
                                <Input defaultValue="Fred Rick" className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Email</label>
                                <Input defaultValue="fred@123.design" disabled className="bg-black/50 border-white/10 text-gray-500" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Phone</label>
                                <Input defaultValue="08012345678" className="bg-black/50 border-white/10 text-white" />
                            </div>
                            <Button className="w-full">Update Profile</Button>
                        </div>
                    </div>

                    {/* Address Book */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Saved Addresses</h3>
                            <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}>
                                {showAdd ? "Cancel" : "Add New"}
                            </Button>
                        </div>

                        {showAdd && (
                            <div className="bg-black/30 p-4 rounded mb-4 space-y-3 border border-white/10">
                                <Input
                                    placeholder="Street Address"
                                    value={newAddress.street}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                    className="bg-black/50 border-white/10 text-white"
                                />
                                <Input
                                    placeholder="Phone for Delivery"
                                    value={newAddress.phone}
                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    className="bg-black/50 border-white/10 text-white"
                                />
                                <Button onClick={handleSave} className="w-full">Save Address</Button>
                            </div>
                        )}

                        <div className="space-y-3">
                            {addresses.map(addr => (
                                <div key={addr.id} className="p-3 border border-white/10 rounded flex justify-between items-center">
                                    <div>
                                        <div className="text-white text-sm font-bold">{addr.street}</div>
                                        <div className="text-gray-400 text-xs">{addr.city}, {addr.state} • {addr.phone}</div>
                                    </div>
                                    {addr.isDefault && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">Default</span>}
                                </div>
                            ))}
                            {addresses.length === 0 && !showAdd && (
                                <div className="text-gray-500 text-sm text-center py-4">No addresses saved.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MarketShell>
    );
}
