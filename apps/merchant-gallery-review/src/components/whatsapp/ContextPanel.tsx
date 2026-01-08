import React from "react";
import { WhatsAppConversation, WhatsAppLinkedEntityType } from "@vayva/shared";
import { Icon, cn } from "@vayva/ui";

interface ContextPanelProps {
  conversation: WhatsAppConversation | null;
}

export const ContextPanel = ({ conversation }: ContextPanelProps) => {
  if (!conversation) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col items-center justify-center text-center p-6 text-gray-400">
        <Icon name="Info" size={32} className="mb-2 opacity-20" />
        <p className="text-sm">Select a conversation to view details</p>
      </div>
    );
  }

  const linked = conversation.linkedEntity;
  const hasOrder = linked?.type === WhatsAppLinkedEntityType.ORDER;
  const hasBooking = linked?.type === WhatsAppLinkedEntityType.BOOKING;

  const handleLinkEntity = async (type: WhatsAppLinkedEntityType) => {
    // In a real app, this would open a picker modal.
    // For "Every Button Works", we'll prompt for an ID or generate a test one.
    const id = window.prompt(`Enter ${type} ID to link:`, "ord_123");
    if (!id) return;

    try {
      await fetch(`/api/whatsapp/conversations/${conversation.id}/link`, {
        method: "POST",
        body: JSON.stringify({
          linked_type: type,
          linked_id: id,
        }),
      });
      // Force reload or optimistic update (omitted for brevity)
      alert(`${type} linked successfully!`);
    } catch (e) {
      console.error(e);
      alert("Failed to link");
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
      {/* Customer Profile Mini */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center bg-gray-50/50">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 flex items-center justify-center text-2xl font-bold text-gray-500">
          {conversation.customerName
            ? conversation.customerName.charAt(0)
            : "?"}
        </div>
        <h2 className="font-bold text-lg text-gray-900">
          {conversation.customerName || "Unknown Customer"}
        </h2>
        <p className="text-sm text-gray-500 font-mono mt-1">
          {conversation.customerPhone}
        </p>

        <div className="flex gap-3 mt-4 w-full">
          <button className="flex-1 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">
            View Profile
          </button>
        </div>
      </div>

      {/* Context Card */}
      <div className="p-6 flex-1">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Current Context
        </h3>

        {hasOrder && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                  <Icon name="ShoppingBag" size={14} />
                </div>
                <span className="font-bold text-sm text-gray-900">
                  Order #{linked?.id.replace("ord_", "")}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                PROCESSING
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-medium text-gray-900">₦25,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="text-gray-900">3 items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="text-green-600 font-medium text-xs bg-green-50 px-1.5 rounded">
                  PAID
                </span>
              </div>
            </div>

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button className="col-span-2 text-xs py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
                View Order Details
              </button>
              <button className="text-xs py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 text-gray-700">
                Send Update
              </button>
              <button className="text-xs py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 text-gray-700">
                Invoice
              </button>
            </div>
          </div>
        )}

        {hasBooking && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md">
                  <Icon name="Calendar" size={14} />
                </div>
                <span className="font-bold text-sm text-gray-900">Booking</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                CONFIRMED
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-900 text-right">
                  Full Glam Makeup
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-900">Tue, 24 Dec</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-900">2:00 PM</span>
              </div>
            </div>

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button className="col-span-2 text-xs py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
                Manage Booking
              </button>
              <button className="text-xs py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 text-gray-700">
                Reschedule
              </button>
              <button className="text-xs py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        {!hasOrder && !hasBooking && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center space-y-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto text-gray-400 shadow-sm">
              <Icon name="Link" size={16} />
            </div>
            <p className="text-sm text-gray-500">
              This conversation is not linked to an active order or booking.
            </p>
            <div className="grid gap-2">
              <button
                onClick={() => handleLinkEntity(WhatsAppLinkedEntityType.ORDER)}
                className="text-xs py-2 w-full bg-white border border-gray-200 rounded-lg font-medium shadow-sm hover:shadow text-gray-700"
              >
                Link to Order
              </button>
              <button
                onClick={() =>
                  handleLinkEntity(WhatsAppLinkedEntityType.BOOKING)
                }
                className="text-xs py-2 w-full bg-white border border-gray-200 rounded-lg font-medium shadow-sm hover:shadow text-gray-700"
              >
                Link to Booking
              </button>
            </div>
          </div>
        )}

        {/* Automation Log */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            Activity Log
            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
              Visible to you only
            </span>
          </h3>
          <div className="border-l-2 border-gray-100 pl-4 space-y-6 relative">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-200 border-2 border-white"></div>
              <p className="text-xs font-medium text-gray-900">
                Order #1024 Confirmation Sent
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Automated • 10:24 AM
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-green-200 border-2 border-white"></div>
              <p className="text-xs font-medium text-gray-900">
                Conversation started
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Customer • 10:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
