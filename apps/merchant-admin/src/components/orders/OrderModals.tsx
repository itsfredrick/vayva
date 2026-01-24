"use client";

import React, { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
// import { Order } from "@/services/orders";
type Order = any; // Quick fix for missing export
import { useToast } from "@/components/ui/use-toast";

// --- Delivery Task Modal ---
interface DeliveryTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const DeliveryTaskModal = ({
  isOpen,
  onClose,
  order,
}: DeliveryTaskModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/delivery/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create shipment");

      toast({
        title: "Success",
        description: "Delivery Task Created & Order Fulfilled!",
      });
      onClose();
      // Ideally trigger refresh of order details here
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create delivery task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-black">Create Delivery Task</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8">
            <Icon name="X" size={18} />
          </Button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 shrink-0" />
            <p>This will assign a rider to pick up from your store location.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#525252]">
                Pickup Address
              </label>
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden">
                Store Onboarding Address (Test)
                <br />
                123 Merchant Road
                <br />
                Lagos
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#525252]">
                Delivery Address
              </label>
              <div className="p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 h-24 overflow-hidden">
                {order.shippingAddress ? (
                  <>
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </>
                ) : (
                  <span className="text-gray-400 italic">
                    No shipping address provided
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]" htmlFor="rider-pref">
              Rider Preference
            </label>
            <select id="rider-pref" aria-label="Rider Preference" className="h-10 border border-gray-200 rounded-lg px-2 bg-white">
              <option>Standard Bike (Next Available)</option>
              <option>Express (Priority)</option>
            </select>
          </div>

          <Button
            className="w-full mt-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Requesting Rider..." : "Create Task"}
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(order.total.toString());
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    onClose();
    toast({
      title: "Refund Initiated",
      description: "The refund process has started.",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-black">Initiate Refund</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="h-8 w-8">
            <Icon name="X" size={18} />
          </Button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]" htmlFor="refund-amount">
              Refund Amount (₦)
            </label>
            <input
              id="refund-amount"
              type="number"
              className="h-10 border border-gray-200 rounded-lg px-3 focus:ring-2 focus:ring-black/5 outline-none"
              value={(amount as any)}
              onChange={(e: any) => setAmount(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Max refundable: ₦ {order.total.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#525252]" htmlFor="refund-reason">Reason</label>
            <select
              id="refund-reason"
              aria-label="Refund Reason"
              className="h-10 border border-gray-200 rounded-lg px-2 bg-white"
              value={(reason as any)}
              onChange={(e: any) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="cancelled">Order Cancelled</option>
              <option value="returned">Item Returned</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="fraud">Fraudulent</option>
            </select>
          </div>

          <Button
            variant="outline"
            className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            onClick={handleSubmit}
            disabled={loading || !reason}
          >
            {loading ? "Processing..." : "Confirm Refund"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
