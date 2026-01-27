"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button, cn } from "@vayva/ui";
import { Sparkles, TimerReset, Truck, ShieldCheck } from "lucide-react";

export interface DealHeroProps {
  className?: string;
}

function formatTimer(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function DealHero({ className }: DealHeroProps): React.JSX.Element {
  const [msLeft, setMsLeft] = useState(1000 * 60 * 60 * 4 + 1000 * 60 * 21 + 1000 * 12);

  useEffect(() => {
    const t = window.setInterval(() => {
      setMsLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  const perks = useMemo(
    () => [
      { label: "Escrow protected", icon: ShieldCheck },
      { label: "Fast dispatch", icon: Truck },
      { label: "Daily deals", icon: Sparkles },
    ],
    [],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-primary/10 via-white to-white p-5 md:p-7",
        className,
      )}
    >
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold text-gray-900 shadow-sm ring-1 ring-black/5">
            <Sparkles className="h-4 w-4 text-primary" />
            Today's steals
          </div>

          <div className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Shop retail deals, or source factory pricing.
          </div>
          <div className="mt-2 text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
            A marketplace built for everyday buyers and serious wholesale importers—with trust signals, verified suppliers, and buyer protection.
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/search" className="inline-flex">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button className="h-11 rounded-xl px-5 font-extrabold glow-primary">
                  Shop now
                </Button>
              </motion.div>
            </Link>
            <Link href="/sourcing" className="inline-flex">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="h-11 rounded-xl px-5 font-extrabold">
                  Request a quote
                </Button>
              </motion.div>
            </Link>

            <div className="ml-auto flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-gray-900 shadow-sm ring-1 ring-black/5">
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <TimerReset className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-gray-500">Deals end in</div>
                <div className="tracking-widest">{formatTimer(msLeft)}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-black/5"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {p.label}
                </div>
              );
            })}
          </div>
        </div>

        <motion.div
          whileHover={{ rotate: -1, y: -2 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative"
        >
          <div className="rounded-3xl bg-gray-900 p-4 md:p-5 shadow-elevated">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-white">Flash deals</div>
              <div className="text-[11px] font-bold text-white/70">Up to 60% off</div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Phones", "Fashion", "Home"].map((c) => (
                <div key={c} className="rounded-2xl bg-white/5 p-3">
                  <div className="text-xs font-extrabold text-white">{c}</div>
                  <div className="mt-1 text-[11px] text-white/60">Hot picks</div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: "20%" }}
                      animate={{ width: ["20%", "85%", "35%", "70%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-primary/60 to-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-2xl bg-white/5 p-3">
              <div className="text-xs font-extrabold text-white">Wholesale mode</div>
              <div className="mt-1 text-[11px] text-white/60">
                MOQ + tier pricing—request quote in one click
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
