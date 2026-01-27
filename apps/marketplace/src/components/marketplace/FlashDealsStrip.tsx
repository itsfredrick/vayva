"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, cn } from "@vayva/ui";
import { TimerReset } from "lucide-react";

export interface FlashDeal {
  id: string;
  label: string;
  query: string;
  discountText: string;
}

export interface FlashDealsStripProps {
  className?: string;
  deals?: FlashDeal[];
}

function formatTimer(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function FlashDealsStrip({ deals, className }: FlashDealsStripProps): React.JSX.Element {
  const data = useMemo<FlashDeal[]>(
    () =>
      deals ?? [
        { id: "phones", label: "Phones", query: "iphone", discountText: "Up to 40% off" },
        { id: "fashion", label: "Fashion", query: "fashion", discountText: "Hot deals" },
        { id: "electronics", label: "Electronics", query: "electronics", discountText: "Best price" },
        { id: "home", label: "Home", query: "home", discountText: "Bundle offers" },
        { id: "china", label: "China Bulk", query: "", discountText: "Wholesale" },
      ],
    [deals],
  );

  const [msLeft, setMsLeft] = useState(1000 * 60 * 60 * 6 + 1000 * 60 * 12 + 1000 * 34);

  useEffect(() => {
    const t = window.setInterval(() => {
      setMsLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <TimerReset className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900">Flash Deals</div>
            <div className="text-xs text-gray-500">New deals rotate all day</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning" className="rounded-md">
            Ends in {formatTimer(msLeft)}
          </Badge>
          <a href="/search" className="hidden sm:inline-flex">
            <Button variant="outline" className="h-9 rounded-lg text-xs font-bold">
              View all
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {data.map((d) => {
          const href = d.id === "china" ? "/search?chinaBulk=true" : `/search?q=${encodeURIComponent(d.query)}`;
          return (
            <a key={d.id} href={href} className="shrink-0">
              <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 hover:bg-gray-100 transition-colors">
                <div className="text-xs font-extrabold text-gray-900">{d.label}</div>
                <div className="text-[11px] text-gray-500">{d.discountText}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
