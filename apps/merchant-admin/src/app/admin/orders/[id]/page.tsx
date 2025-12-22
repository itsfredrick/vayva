'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { OrdersService, Order } from '@/services/orders';
import { ItemsCard, TimelineCard, CustomerCard, DeliveryCard } from '@/components/orders/OrderDetailCards';
import { DeliveryTaskModal, RefundModal } from '@/components/orders/OrderModals';
import { Button, Icon, cn } from '@vayva/ui';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                const data = await OrdersService.getOrder(params.id);
                setOrder(data);
            } catch (err) {
                console.error('Fetch order detail error', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrder();
    }, [params.id]);

    if (isLoading) return <AdminShell title="Order Loading..."><div className="p-12 text-center text-gray-400">Loading Order...</div></AdminShell>;
    if (!order) return <AdminShell title="Not Found"><div className="p-12 text-center text-gray-400">Order not found.</div></AdminShell>;

    return (
        <AdminShell title={`Order ${order.refCode}`} breadcrumb="Orders">
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-[#0B0B0B]">Order {order.refCode}</h1>
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-bold uppercase">{order.status.replace('_', ' ')}</span>
                        </div>
                        <p className="text-[#525252] text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><Icon name={"Printer" as any} size={16} /></Button>
                        <Button variant="outline" onClick={() => setShowRefundModal(true)}>Refund</Button>
                        <Button onClick={() => setShowDeliveryModal(true)}>Fulfil Order</Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column (Items & Timeline) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <ItemsCard order={order} />
                        <TimelineCard events={order.timeline} />
                    </div>

                    {/* Right Column (Customer, Delivery, Payment) */}
                    <div className="flex flex-col gap-6">
                        <CustomerCard customer={order.customer} />
                        <DeliveryCard order={order} onCreateTask={() => setShowDeliveryModal(true)} />

                        {/* Payment Card */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col gap-4">
                            <h3 className="font-bold text-[#0B0B0B]">Payment</h3>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#525252]">Status</span>
                                <span className={cn("font-bold uppercase", order.paymentStatus === 'SUCCESS' ? 'text-green-600' : 'text-orange-600')}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#525252]">Method</span>
                                <span>{order.paymentMethod || 'Paystack'}</span>
                            </div>
                            {order.transactionReference && (
                                <div className="pt-2 border-t border-gray-50">
                                    <p className="text-xs text-[#525252]">Ref: {order.transactionReference}</p>
                                    <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 hover:text-blue-700">View in Wallet</Button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>

            {/* Modals */}
            <DeliveryTaskModal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} order={order} />
            <RefundModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} order={order} />

        </AdminShell>
    );
}

