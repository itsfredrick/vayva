
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

    // State for manual updates
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [manualNote, setManualNote] = useState('');
    const [courierName, setCourierName] = useState('');
    const [courierPhone, setCourierPhone] = useState('');

    const shipment = order?.shipment;

    // Strict Dispatch (POST /api/orders/[id]/delivery/dispatch)
    const handleDispatch = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${order.id}/delivery/dispatch`, { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Dispatch Failed');
            } else {
                onUpdate?.();
            }
        } catch (err) {
            console.error(err);
            alert('Failed to dispatch');
        } finally {
            setLoading(false);
        }
    };

    // Strict Manual Status (POST /api/orders/[id]/delivery/manual-status)
    const handleManualStatus = async (status: string) => {
        setLoading(true);
        try {
            const payload = {
                status,
                note: manualNote || undefined,
                courierName: courierName || undefined,
                courierPhone: courierPhone || undefined
            };
            const res = await fetch(`/api/orders/${order.id}/delivery/manual-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.error || 'Update Failed');
            } else {
                onUpdate?.();
                setManualModalOpen(false);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const hasShipment = !!shipment;
    const isCustom = shipment?.provider === 'CUSTOM';
    const isKwik = shipment?.provider === 'KWIK';
    const status = shipment?.status || 'DRAFT';

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={`Fulfillment #${order?.orderNumber}`}>
            <div className="space-y-6 pt-4">
                {/* 1. Dispatch CTA (If no shipment or DRAFT) */}
                {(!hasShipment || status === 'DRAFT') && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="w-8 h-8 text-black" />
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    {hasShipment ? 'Confirm Dispatch' : 'Ready to Deliver?'}
                                    {hasShipment && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 rounded-full border border-yellow-200">Pending Confirmation</span>}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {hasShipment
                                        ? 'Auto-dispatch paused. Review and confirm to send.'
                                        : 'Dispatch via your active provider.'}
                                </p>
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleDispatch} isLoading={loading}>
                            {hasShipment ? 'Confirm & Dispatch' : 'Dispatch Delivery'}
                        </Button>
                    </div>
                )}

                {/* 2. Active Shipment Card */}
                {hasShipment && (
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                {isKwik ? 'KWIK DELIVERY' : 'CUSTOM COURIER'}
                            </span>
                            <Badge variant={status === 'DELIVERED' ? 'success' : 'default'}>{status}</Badge>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Tracking Info (Kwik or Custom if URL provided) */}
                            {(shipment.trackingUrl || shipment.externalId) && (
                                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 space-y-2">
                                    {shipment.externalId && (
                                        <div className="flex justify-between items-center text-xs text-blue-700">
                                            <span className="font-semibold">Job ID:</span>
                                            <span className="font-mono bg-white px-1 rounded">{shipment.externalId}</span>
                                        </div>
                                    )}

                                    {shipment.trackingUrl && (
                                        <a
                                            href={shipment.trackingUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full p-2 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            Track Delivery
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Manual Actions for Custom Courier */}
                            {isCustom && status !== 'DELIVERED' && status !== 'CANCELED' && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold">Update Status</h4>

                                    {/* Transitions */}
                                    {status === 'REQUESTED' && (
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleManualStatus('ACCEPTED')}>
                                            Mark Accepted
                                        </Button>
                                    )}
                                    {status === 'ACCEPTED' && (
                                        <div className="space-y-2">
                                            <Input placeholder="Courier Name" value={courierName} onChange={e => setCourierName(e.target.value)} className="text-sm" />
                                            <Input placeholder="Courier Phone" value={courierPhone} onChange={e => setCourierPhone(e.target.value)} className="text-sm" />
                                            <Button size="sm" className="w-full" onClick={() => handleManualStatus('PICKED_UP')}>
                                                Confirm Pickup
                                            </Button>
                                        </div>
                                    )}
                                    {status === 'PICKED_UP' && (
                                        <Button size="sm" className="w-full" onClick={() => handleManualStatus('IN_TRANSIT')}>
                                            Mark In Transit
                                        </Button>
                                    )}
                                    {status === 'IN_TRANSIT' && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button size="sm" variant="outline" className="text-green-600 border-green-200" onClick={() => handleManualStatus('DELIVERED')}>
                                                Mark Delivered
                                            </Button>
                                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleManualStatus('FAILED')}>
                                                Mark Failed
                                            </Button>
                                        </div>
                                    )}

                                    {/* Cancel */}
                                    <div className="pt-2 border-t mt-2">
                                        <button className="text-xs text-red-500 hover:underline" onClick={() => handleManualStatus('CANCELED')}>
                                            Cancel Delivery
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Address Snapshot Display */}
                            <div className="text-xs text-gray-500 mt-4">
                                <div>To: {shipment.recipientName || 'Customer'}</div>
                                <div className="truncate">{shipment.addressLine1 || 'No Address'}, {shipment.addressCity}</div>
                                <div className="mt-2 text-xs text-gray-400">Tracking: {shipment.trackingCode || 'N/A'}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
}
