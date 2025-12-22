'use client';

import React, { useState } from 'react';
import { Button, Icon } from '@vayva/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/services/orders';

// --- Delivery Task Modal ---
interface DeliveryTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

export const DeliveryTaskModal = ({ isOpen, onClose, order }: DeliveryTaskModalProps) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        onClose();
        alert('Delivery Task Created!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-[#0B0B0B]">Create Delivery Task</h3>
                    <button onClick={onClose}><Icon name="X" size={18} /></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
                        <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
                        <p>This will assign a rider to pick up from your store location.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-[#525252]">Pickup Address</label>
                            <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden">
                                Store Onboarding Address (Mock)<br />
                                123 Merchant Road<br />
                                Lagos
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-[#525252]">Delivery Address</label>
                            <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden">
                                {order.shippingAddress ? (
                                    <>
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state}
                                    </>
                                ) : (
                                    <span className="text-gray-400 italic">No shipping address provided</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-[#525252]">Rider Preference</label>
                        <select className="h-10 border border-gray-200 rounded-lg px-2 bg-white">
                            <option>Standard Bike (Next Available)</option>
                            <option>Express (Priority)</option>
                        </select>
                    </div>

                    <Button className="w-full mt-2" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Requesting Rider...' : 'Create Task'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

// --- Refund Modal ---
interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
}

export const RefundModal = ({ isOpen, onClose, order }: RefundModalProps) => {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(order.total.toString());
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        onClose();
        alert('Refund Initiated!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-[#0B0B0B]">Initiate Refund</h3>
                    <button onClick={onClose}><Icon name="X" size={18} /></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-[#525252]">Refund Amount (₦)</label>
                        <input
                            type="number"
                            className="h-10 border border-gray-200 rounded-lg px-3 focus:ring-2 focus:ring-black/5 outline-none"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <p className="text-xs text-gray-400">Max refundable: ₦ {order.total.toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-[#525252]">Reason</label>
                        <select
                            className="h-10 border border-gray-200 rounded-lg px-2 bg-white"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">Select a reason</option>
                            <option value="cancelled">Order Cancelled</option>
                            <option value="returned">Item Returned</option>
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="fraud">Fraudulent</option>
                        </select>
                    </div>

                    <Button variant="outline" className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300" onClick={handleSubmit} disabled={loading || !reason}>
                        {loading ? 'Processing...' : 'Confirm Refund'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
