"use client";

import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PublicStatusPage() {
  const [health, setHealth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/public/status");
      const data = await res.json();
      setHealth(data.health);
    } catch (error) {
      console.error("Failed to fetch public status");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIndicator = ({ status }: { status: string }) => {
    switch (status) {
      case "OK":
        return (
          <span className="text-green-500 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Operational
          </span>
        );
      case "WARNING":
        return (
          <span className="text-amber-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Degraded Performance
          </span>
        );
      case "FAIL":
        return (
          <span className="text-red-500 font-bold flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Service Outage
          </span>
        );
      default:
        return <span className="text-slate-400 font-bold">Checking...</span>;
    }
  };

  const isPlatformDown =
    health && Object.values(health).some((v: any) => v.status === "FAIL");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center p-6 md:p-12">
      <div className="max-w-2xl w-full space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <HeartPulse className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase italic">
              Vayva Status
            </h1>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">
              Live updates on our system performance and critical
              infrastructure.
            </p>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${
            isPlatformDown
              ? "bg-red-50 border-red-200 text-red-900"
              : health &&
                  Object.values(health).some((v: any) => v.status === "WARNING")
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-slate-900 border-slate-800 text-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-full ${isPlatformDown ? "bg-red-500" : "bg-green-500"} animate-pulse`}
            />
            <h2 className="text-lg font-bold uppercase tracking-tight">
              {isPlatformDown
                ? "Platform Major Outage"
                : "All Systems Operational"}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex gap-2 opacity-70 hover:opacity-100"
            onClick={fetchHealth}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
            />{" "}
            Update
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-2">
            Core Infrastructure
          </h3>
          <Card className="divide-y rounded-2xl overflow-hidden shadow-sm">
            {[
              {
                name: "Payment Processing",
                key: "paystack",
                desc: "Settlements & Charges",
              },
              {
                name: "Delivery Integrations",
                key: "delivery",
                desc: "Shipment Tracking & Labels",
              },
              {
                name: "WhatsApp Business API",
                key: "whatsapp",
                desc: "System Notifications",
              },
              {
                name: "Store Frontends",
                key: "platform",
                desc: "Merchant & Public Dashboards",
              },
            ].map((service) => (
              <div
                key={service.name}
                className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm tracking-tight">
                    {service.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                    {service.desc}
                  </p>
                </div>
                <div className="text-xs">
                  <StatusIndicator
                    status={health?.[service.key]?.status || "OK"}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-2">
            Incident History
          </h3>
          <div className="space-y-3">
            <div className="p-6 border border-dashed rounded-2xl bg-white flex flex-col items-center text-center gap-2">
              <Clock className="w-5 h-5 text-slate-300" />
              <p className="text-xs text-slate-400 font-medium italic">
                No incidents reported in the last 30 days.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Powered by
            </p>
            <h3 className="text-xl font-black italic tracking-tighter opacity-20">
              VAYVA CLOUD
            </h3>
          </div>
          <div className="flex gap-4">
            <Link href="https://twitter.com/vayva_status">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold rounded-full"
              >
                Twitter Status
              </Button>
            </Link>
            <Link href="/admin/help">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs font-bold rounded-full"
              >
                Merchant Help
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
