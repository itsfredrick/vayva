
'use client';

import React, { useState } from 'react';
import { Button, Drawer, Input, Badge, Card } from '@vayva/ui'; // Mock UI libs
import { Truck, Package, Send, CheckCircle, MapPin } from 'lucide-react';
import { FulfillmentAPI } from '@/services/fulfillment.service';

interface FulfillmentDrawerProps {
    order: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function FulfillmentDrawer({ order, isOpen, onClose, onUpdate }: FulfillmentDrawerProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'SUMMARY' | 'DISPATCH'>('SUMMARY');

    // Dispatch Form
    const [riderName, setRiderName] = useState('');
    const [riderPhone, setRiderPhone] = useState('');
    const [notes, setNotes] = useState('');

    const shipment = order?.shipment;
    const isReady = order?.fulfillmentStatus === 'PROCESSING'; // Simplified check

    const handleCreateShipment = async () => {
        setLoading(true);
        try {
            await FulfillmentAPI.createShipment({
                storeId: order.storeId,
                orderId: order.id,
                deliveryOptionType: 'MANUAL', // Default for now
                address: {
                    name: `${order.customer?.firstName} ${order.customer?.lastName}`,
                    phone: order.customer?.phone,
                    state: 'Lagos', // Should come from order address
                    city: 'Lekki',
                    line1: '123 Test St'
                },
                deliveryFee: order.shippingTotal
            });
            onUpdate();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async () => {
        if (!shipment) return;
        setLoading(true);
        try {
            await FulfillmentAPI.dispatchShipment({
                storeId: order.storeId,
                shipmentId: shipment.id,
                carrier: 'MANUAL', // Hardcoded for V1 UI demo
                carrierParams: {
                    pickup: {}, // Can start empty for manual
                    items: order.items.map((i: any) => ({ description: i.title, quantity: i.quantity })),
                    notes: notes,
                    riderName,
                    riderPhone
                }
            });
            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFulfill = async () => {
        // Stub for fulfillment confirmation
        console.log('Fulfillment confirmed');
        onClose();
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={`Fulfillment #${order?.orderNumber}`}>
            <div className="space-y-6 pt-4">
                {/* Status Card */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-semibold">{order?.fulfillmentStatus}</div>
                    </div>
                    {shipment && (
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Tracking</div>
                            <div className="font-mono text-sm">{shipment.trackingCode || 'N/A'}</div>
                        </div>
                    )}
                </div>

                {/* Main Action Area */}
                {!shipment ? (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h3 className="font-semibold mb-2">Ready to Fulfill?</h3>
                        <p className="text-sm text-muted-foreground mb-6">Create a shipment to start the delivery process.</p>
                        <Button onClick={handleCreateShipment} isLoading={loading} className="w-full">
                            Create Shipment
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shipment.status === 'PENDING' && (
                            <Card className="p-4 space-y-4 border-orange-200 bg-orange-50/30">
                                <h4 className="font-semibold flex items-center gap-2 text-orange-700">
                                    <Truck className="w-4 h-4" /> Dispatch Order
                                </h4>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground uppercase">Assign Rider (Manual)</label>
                                        <Input placeholder="Rider Name" value={riderName} onChange={e => setRiderName(e.target.value)} className="mt-1" />
                                    </div>
                                    <div>
                                        <Input placeholder="Rider Phone" value={riderPhone} onChange={e => setRiderPhone(e.target.value)} />
                                    </div>
                                    <div>
                                        <Input placeholder="Notes (e.g. Call on arrival)" value={notes} onChange={e => setNotes(e.target.value)} />
                                    </div>
                                </div>

                                <Button onClick={handleDispatch} isLoading={loading} className="w-full">
                                    Mark as Dispatched
                                </Button>
                            </Card>
                        )}

                        {shipment.status === 'DISPATCHED' && (
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg bg-green-50/50 flex flex-col items-center text-center space-y-2">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                    <div>
                                        <div className="font-semibold text-green-900">Order is In Transit</div>
                                        <div className="text-sm text-green-700">Rider: {riderName || 'Assigned'}</div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">
                                    <Send className="w-4 h-4 mr-2" /> Send Tracking via WhatsApp
                                </Button>
                                <Button className="w-full" onClick={handleFulfill} isLoading={loading}>
                                    Confirm Fulfillment
                                </Button>
                                <Button variant="secondary" className="w-full">
                                    Mark Delivered
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Drawer>
    );
}
