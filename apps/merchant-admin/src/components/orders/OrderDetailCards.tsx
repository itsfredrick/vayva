"use client";

import React from "react";
import { Order, OrderTimelineEvent } from "@/services/orders";
import { Icon, Button, cn } from "@vayva/ui";

// 1. Items Card
export const ItemsCard = ({ order }: { order: Order }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col gap-6">
    <h3 className="font-bold text-[#0B0B0B]">Order Items</h3>
    <div className="flex flex-col gap-4">
      {order.items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
            {item.image && (
              <img
                src={item.image}
                className="w-full h-full object-cover"
                alt={item.title}
              />
            )}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-[#0B0B0B]">{item.title}</h4>
            {item.variantId && (
              <p className="text-xs text-[#525252]">
                Variant: {item.variantId.split("-").pop()}
              </p>
            )}
          </div>
          <div className="text-right flex flex-col justify-center">
            <p className="text-sm font-bold text-[#0B0B0B]">
              ₦ {Number(item.price).toLocaleString()}
            </p>
            <p className="text-xs text-[#525252]">x {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Totals */}
    <div className="bg-gray-50 -mx-6 -mb-6 p-6 flex flex-col gap-2 text-sm">
      <div className="flex justify-between">
        <span className="text-[#525252]">Subtotal</span>
        <span className="font-medium">
          ₦ {Number(order.subtotal).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#525252]">Shipping</span>
        <span className="font-medium">
          ₦ {Number(order.shippingTotal).toLocaleString()}
        </span>
      </div>
      <div className="flex justify-between font-bold text-lg text-[#0B0B0B] pt-2 border-t border-gray-200 mt-2">
        <span>Total</span>
        <span>₦ {Number(order.total).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

// 2. Timeline Card
export const TimelineCard = ({ events }: { events: OrderTimelineEvent[] }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col gap-6">
    <h3 className="font-bold text-[#0B0B0B]">Timeline</h3>
    <div className="relative pl-4 border-l-2 border-gray-100 flex flex-col gap-8">
      {events.map((evt, i) => (
        <div key={evt.id} className="relative">
          <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-black ring-4 ring-white"></div>
          <h4 className="text-sm font-bold text-[#0B0B0B]">{evt.text}</h4>
          <span className="text-[10px] text-gray-400 mt-1 block">
            {new Date(evt.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// 3. Customer Card
export const CustomerCard = ({ customer }: { customer: Order["customer"] }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-[#0B0B0B]">Customer</h3>
      <Link
        href={`/dashboard/customers/${customer.id}`}
        className="text-xs text-blue-600 hover:underline"
      >
        View Profile
      </Link>
    </div>
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
          {customer.name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-[#0B0B0B]">{customer.name}</p>
          <p className="text-xs text-[#525252]">1 Order</p>
        </div>
      </div>
      <div className="pt-2 border-t border-gray-50 flex flex-col gap-2">
        <a
          href={`mailto:${customer.email}`}
          className="flex items-center gap-2 text-[#525252] hover:text-black"
        >
          <Icon name="Mail" size={14} /> {customer.email}
        </a>
        <a
          href={`tel:${customer.phone}`}
          className="flex items-center gap-2 text-[#525252] hover:text-black"
        >
          <Icon name="Phone" size={14} /> {customer.phone}
        </a>
      </div>
    </div>
  </div>
);

// 4. Delivery Card
export const DeliveryCard = ({
  order,
  onCreateTask,
}: {
  order: Order;
  onCreateTask: () => void;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 flex flex-col gap-4">
    <h3 className="font-bold text-[#0B0B0B]">Delivery</h3>

    <div className="text-sm text-[#525252]">
      <p className="font-bold text-[#0B0B0B] mb-1">Details</p>
      <p>
        Method:{" "}
        {order.timeline?.[0]?.metadata?.deliveryMethod || "Not specified"}
      </p>
      <p>Address: {order.timeline?.[0]?.metadata?.address || "N/A"}</p>
    </div>

    {order.deliveryTask ? (
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
        <p className="text-xs font-bold text-[#525252] mb-1">
          Delivery Task Status
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <span className="text-sm font-medium capitalize">
            {order.deliveryTask.status.replace("_", " ")}
          </span>
        </div>
        {order.deliveryTask.trackingUrl && (
          <a
            href={order.deliveryTask.trackingUrl}
            target="_blank"
            className="text-xs text-blue-600 hover:underline mt-1 block"
          >
            Track Delivery
          </a>
        )}
      </div>
    ) : (
      <Button
        variant="outline"
        className="w-full justify-center"
        onClick={onCreateTask}
      >
        Create Delivery Task
      </Button>
    )}
  </div>
);

import Link from "next/link";
