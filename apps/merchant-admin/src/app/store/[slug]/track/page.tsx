"use client";

import React from "react";
import { StoreShell } from "@/components/storefront/store-shell";
import { Button, Icon } from "@vayva/ui";

export default function TrackOrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  return (
    <StoreShell slug={slug}>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Track Your Order
          </h1>
          <p className="text-text-secondary">
            Enter your order ID and phone number to see the status.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/5 p-8 mb-8">
          <form className="space-y-4">
            <div>
              <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                Order Reference
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="e.g. VV-12345"
              />
            </div>
            <div>
              <label className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2 block">
                Phone Number
              </label>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary placeholder:text-text-secondary/50"
                placeholder="+234..."
              />
            </div>
            <Button className="w-full h-12 rounded-full bg-primary text-black hover:bg-primary/90 font-bold">
              Find Order
            </Button>
          </form>
        </div>

        {/* Test Result (Hidden in real form init state, shown here for demo) */}
        <div className="border border-white/10 rounded-2xl p-6 bg-[#0b141a]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">Order #VV-90123</h3>
              <p className="text-sm text-text-secondary">
                Placed on Dec 14, 2025
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              Out for Delivery
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-white/10 space-y-8 my-8">
            {[
              {
                title: "Out for Delivery",
                time: "Today, 8:30 AM",
                active: true,
              },
              {
                title: "Arrived at Lagos Hub",
                time: "Yesterday, 6:00 PM",
                active: false,
              },
              {
                title: "Order Confirmed",
                time: "Dec 14, 10:00 AM",
                active: false,
              },
            ].map((event, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 ${event.active ? "bg-primary border-primary" : "bg-[#0b141a] border-white/30"}`}
                />
                <div
                  className={`font-bold ${event.active ? "text-white" : "text-text-secondary"}`}
                >
                  {event.title}
                </div>
                <div className="text-xs text-text-secondary">{event.time}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <Icon name={"HelpCircle" as any} size={16} />
              Need help with this order?{" "}
              <a href="#" className="underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
