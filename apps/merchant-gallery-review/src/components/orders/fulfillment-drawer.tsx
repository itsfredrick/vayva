"use client";

import React, { useState } from "react";
import { Button, Drawer, Input, Badge, SuccessState } from "@vayva/ui";
import { Truck, MapPin } from "lucide-react";

interface FulfillmentDrawerProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function FulfillmentDrawer({
  order,
  isOpen,
  onClose,
  onUpdate,
}: FulfillmentDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for manual updates
  const [courierName, setCourierName] = useState("");
  const [courierPhone, setCourierPhone] = useState("");

  const shipment = order?.shipment;

  // Strict Dispatch (POST /api/orders/[id]/delivery/dispatch)
  const handleDispatch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/delivery/dispatch`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Dispatch Failed");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          onUpdate?.();
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to dispatch");
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
        courierName: courierName || undefined,
        courierPhone: courierPhone || undefined,
      };
      const res = await fetch(
        `/api/orders/${order.id}/delivery/manual-status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Update Failed");
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          onUpdate?.();
          setIsSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const hasShipment = !!shipment;
  const isCustom = shipment?.provider === "CUSTOM";
  const isKwik = shipment?.provider === "KWIK";
  const status = shipment?.status || "DRAFT";

  if (isSuccess) {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Success"
      >
        <div className="h-full flex items-center justify-center -mt-12">
          <SuccessState
            title="Delivery Scheduled"
            description="Your delivery has been successfully dispatched. The customer will receive tracking updates shortly."
            icon="truck"
            action={
              <Button onClick={onClose} variant="outline" className="px-8">
                Close
              </Button>
            }
          />
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Fulfillment #${order?.orderNumber || order?.refCode}`}
    >
      <div className="space-y-6 pt-4">
        {/* 1. Dispatch CTA (If no shipment or DRAFT) */}
        {(!hasShipment || status === "DRAFT") && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {hasShipment ? "Confirm Dispatch" : "Ready to Deliver?"}
                </h3>
                <p className="text-xs text-gray-500">
                  Dispatch via your active provider.
                </p>
              </div>
            </div>
            <Button
              className="w-full h-12 rounded-xl"
              onClick={handleDispatch}
              isLoading={loading}
            >
              {hasShipment ? "Confirm & Dispatch" : "Dispatch Delivery"}
            </Button>
          </div>
        )}

        {/* 2. Active Shipment Card */}
        {hasShipment && (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {isKwik ? "KWIK DELIVERY" : "CUSTOM COURIER"}
              </span>
              <Badge variant={status === "DELIVERED" ? "success" : "default"}>
                {status}
              </Badge>
            </div>

            <div className="p-6 space-y-6">
              {/* Tracking Info */}
              {(shipment.trackingUrl || shipment.trackingCode) && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-4">
                  {shipment.trackingCode && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-indigo-900/40 uppercase tracking-widest text-[9px]">Tracking Code</span>
                      <span className="font-mono font-bold text-indigo-600">
                        {shipment.trackingCode}
                      </span>
                    </div>
                  )}

                  {shipment.trackingUrl && (
                    <a
                      href={shipment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-10 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      Track Real-time
                    </a>
                  )}
                </div>
              )}

              {/* Manual Actions for Custom Courier */}
              {isCustom && status !== "DELIVERED" && status !== "CANCELED" && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Update Progress</h4>

                  {status === "REQUESTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-11 rounded-xl"
                      onClick={() => handleManualStatus("ACCEPTED")}
                    >
                      Mark Accepted
                    </Button>
                  )}
                  {status === "ACCEPTED" && (
                    <div className="space-y-3">
                      <Input
                        placeholder="Courier Name"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                      <Input
                        placeholder="Courier Phone"
                        value={courierPhone}
                        onChange={(e) => setCourierPhone(e.target.value)}
                        className="h-11 rounded-xl"
                      />
                      <Button
                        size="sm"
                        className="w-full h-11 rounded-xl"
                        onClick={() => handleManualStatus("PICKED_UP")}
                        disabled={!courierName}
                      >
                        Confirm Pickup
                      </Button>
                    </div>
                  )}
                  {status === "PICKED_UP" && (
                    <Button
                      size="sm"
                      className="w-full h-11 rounded-xl"
                      onClick={() => handleManualStatus("IN_TRANSIT")}
                    >
                      Mark In Transit
                    </Button>
                  )}
                  {status === "IN_TRANSIT" && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 rounded-xl text-green-600 border-green-100 hover:bg-green-50 hover:border-green-200"
                        onClick={() => handleManualStatus("DELIVERED")}
                      >
                        Delivered
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 rounded-xl text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200"
                        onClick={() => handleManualStatus("FAILED")}
                      >
                        Failed
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Address Snapshot Display */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ship to</p>
                <div className="text-sm font-bold text-gray-900">{shipment.recipientName || order.customer?.name || "Customer"}</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  {shipment.addressLine1 || "No Address Address Specified"}
                  <br />
                  {shipment.addressCity}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

