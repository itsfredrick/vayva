
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FulfillmentAPI } from '@/services/fulfillment.service';
import { Button, Input, Card, Badge, Drawer } from '@vayva/ui'; // Assuming these exist or standard
import { Plus, Truck, MapPin, X } from 'lucide-react';

export default function DeliverySettingsPage() {
    const { merchant } = useAuth();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isZoneDrawerOpen, setIsZoneDrawerOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

    // Zone Form State
    const [zoneName, setZoneName] = useState('');
    const [zoneStates, setZoneStates] = useState<string>(''); // Comma sep for v1
    const [zoneFee, setZoneFee] = useState('0');

    useEffect(() => {
        if (merchant?.storeId) {
            loadProfiles();
        }
    }, [merchant]);

    const loadProfiles = async () => {
        if (!merchant?.storeId) return;
        setLoading(true);
        try {
            const data = await FulfillmentAPI.getProfiles(merchant.storeId);
            setProfiles(data);
            // Auto select default if none
            if (!selectedProfileId && data.length > 0) {
                setSelectedProfileId(data[0].id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddZone = async () => {
        if (!selectedProfileId || !merchant?.storeId) return;
        try {
            await FulfillmentAPI.createZone({
                storeId: merchant.storeId,
                profileId: selectedProfileId,
                name: zoneName,
                states: zoneStates.split(',').map(s => s.trim()),
                cities: [],
                feeType: 'FLAT',
                feeAmount: parseFloat(zoneFee),
                freeOverAmount: null
            });
            setIsZoneDrawerOpen(false);
            setZoneName('');
            setZoneStates('');
            await loadProfiles();
        } catch (err) {
            alert('Failed to create zone');
        }
    };

    const activeProfile = profiles.find(p => p.id === selectedProfileId);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Delivery & Fulfillment</h1>
                    <p className="text-muted-foreground mt-1">Manage delivery areas, fees, and carrier integrations.</p>
                </div>
                <Button>Create Profile</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Carriers */}
                <Card className="p-6 md:col-span-1 space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Carriers
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">K</div>
                                <div>
                                    <div className="font-medium text-sm">Kwik Delivery</div>
                                    <div className="text-xs text-muted-foreground">Local & Express</div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">M</div>
                                <div>
                                    <div className="font-medium text-sm">Manual / Self</div>
                                    <div className="text-xs text-muted-foreground">Your own fleet</div>
                                </div>
                            </div>
                            <Badge variant="success">Active</Badge>
                        </div>
                    </div>
                </Card>

                {/* Right: Zones & Fees */}
                <Card className="p-6 md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Zones & Fees (General Profile)
                        </h3>
                        <Button size="sm" variant="outline" onClick={() => setIsZoneDrawerOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Add Zone
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Zone Name</th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">States / Regions</th>
                                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Delivery Fee</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeProfile?.zones.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                            No zones configured. Add a zone to define delivery fees.
                                        </td>
                                    </tr>
                                )}
                                {activeProfile?.zones.map((zone: any) => (
                                    <tr key={zone.id} className="border-b last:border-0 hover:bg-gray-50/50">
                                        <td className="py-3 px-4 font-medium">{zone.name}</td>
                                        <td className="py-3 px-4 text-muted-foreground truncate max-w-[200px]">
                                            {zone.states.join(', ')}
                                        </td>
                                        <td className="py-3 px-4 text-right">₦{zone.feeAmount}</td>
                                        <td className="py-3 px-4">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><X className="w-4 h-4 text-muted-foreground" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Zone Drawer Stub */}
            {isZoneDrawerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <Card className="w-[400px] p-6 space-y-4 shadow-xl">
                        <h3 className="font-bold text-lg">Add Delivery Zone</h3>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Zone Name</label>
                            <Input placeholder="e.g. Lagos Island" value={zoneName} onChange={e => setZoneName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">States (comma separated)</label>
                            <Input placeholder="Lagos, Ogun" value={zoneStates} onChange={e => setZoneStates(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Fee (₦)</label>
                            <Input type="number" placeholder="2000" value={zoneFee} onChange={e => setZoneFee(e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsZoneDrawerOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddZone}>Save Zone</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
