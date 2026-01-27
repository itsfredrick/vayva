"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, cn } from "@vayva/ui";
import { ChevronLeft, ChevronRight, Sparkles, Globe, ShieldCheck } from "lucide-react";

export interface PromoSlide {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  tone?: "primary" | "dark" | "light";
  art?: "deals" | "china" | "verified";
}

export interface PromoCarouselProps {
  slides?: PromoSlide[];
  className?: string;
}

export function PromoCarousel({ slides, className }: PromoCarouselProps): React.JSX.Element {
  const data = useMemo<PromoSlide[]>(
    () =>
      slides ?? [
        {
          id: "flash",
          kicker: "Flash Deals",
          title: "Crazy prices for the next 12 hours",
          subtitle: "New drops every hour. Grab it before it’s gone.",
          cta: "Shop Deals",
          href: "/search",
          tone: "primary",
          art: "deals",
        },
        {
          id: "china",
          kicker: "China Bulk",
          title: "Factory-direct import made easy",
          subtitle: "MOQ + wholesale tiers. Buy smarter.",
          cta: "Explore China Bulk",
          href: "/search?chinaBulk=true",
          tone: "dark",
          art: "china",
        },
        {
          id: "verified",
          kicker: "Verified Stores",
          title: "Buy with confidence",
          subtitle: "Trusted sellers + escrow protection.",
          cta: "Browse Verified",
          href: "/search?verified=true",
          tone: "light",
          art: "verified",
        },
      ],
    [slides],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 5500);
    return () => window.clearInterval(t);
  }, [data.length]);

  const slide = data[index];

  const toneClass =
    slide.tone === "dark"
      ? "bg-gray-900 text-white"
      : slide.tone === "light"
        ? "bg-white text-gray-900 border border-gray-100"
        : "bg-primary text-white";

  const toneKickerClass =
    slide.tone === "dark"
      ? "text-white/80"
      : slide.tone === "primary"
        ? "text-white/90"
        : "text-primary";

  const toneSubtitleClass =
    slide.tone === "dark"
      ? "text-white/80"
      : slide.tone === "primary"
        ? "text-white/90"
        : "text-gray-600";

  const art =
    slide.art ?? (slide.id === "china" ? "china" : slide.id === "verified" ? "verified" : "deals");

  const ArtIcon = art === "china" ? Globe : art === "verified" ? ShieldCheck : Sparkles;

  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={cn("relative", toneClass)}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className={cn(
              "absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl",
              slide.tone === "dark" ? "bg-primary/25" : slide.tone === "primary" ? "bg-white/25" : "bg-primary/20",
            )} />
            <div className={cn(
              "absolute -left-24 -bottom-24 h-64 w-64 rounded-full blur-3xl",
              slide.tone === "dark" ? "bg-emerald-500/10" : "bg-primary/10",
            )} />
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x;
              if (swipe < -60) setIndex((prev) => (prev + 1) % data.length);
              if (swipe > 60) setIndex((prev) => (prev - 1 + data.length) % data.length);
            }}
            className="relative p-5 md:p-7"
          >
            <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
              <div className="min-w-0">
                <div className={cn("text-xs font-extrabold uppercase tracking-wide", toneKickerClass)}>
                  {slide.kicker}
                </div>
                <div className="mt-2 text-2xl md:text-3xl font-extrabold leading-tight">
                  {slide.title}
                </div>
                <div className={cn("mt-2 text-sm", toneSubtitleClass)}>
                  {slide.subtitle}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a href={slide.href} className="inline-flex">
                    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={slide.tone === "primary" ? "outline" : "primary"}
                        className={cn(
                          "h-10 font-bold",
                          slide.tone === "primary" ? "border-white text-white hover:bg-white/10" : undefined,
                        )}
                      >
                        {slide.cta}
                      </Button>
                    </motion.div>
                  </a>
                  <div className={cn(
                    "hidden md:block text-xs",
                    slide.tone === "dark" ? "text-white/70" : slide.tone === "primary" ? "text-white/80" : "text-gray-500",
                  )}>
                    Swipe or drag to browse.
                  </div>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/10 shadow-elevated",
                  slide.tone === "dark" ? "bg-white/5" : slide.tone === "primary" ? "bg-white/10" : "bg-gray-900",
                )}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
                  <div className="relative p-5">
                    <div className={cn(
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold",
                      slide.tone === "light" ? "bg-white text-gray-900" : "bg-black/20 text-white",
                    )}>
                      <ArtIcon className="h-4 w-4 text-primary" />
                      {art === "china" ? "Factory Direct" : art === "verified" ? "Trusted" : "Hot"}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={cn(
                          "rounded-2xl p-3",
                          slide.tone === "light" ? "bg-gray-100" : "bg-white/10",
                        )}>
                          <div className={cn(
                            "h-10 w-full rounded-xl",
                            slide.tone === "light" ? "bg-white" : "bg-white/10",
                          )} />
                          <div className={cn(
                            "mt-3 h-2 w-3/4 rounded-full",
                            slide.tone === "light" ? "bg-gray-300" : "bg-white/20",
                          )} />
                          <div className={cn(
                            "mt-2 h-2 w-1/2 rounded-full",
                            slide.tone === "light" ? "bg-gray-200" : "bg-white/15",
                          )} />
                        </div>
                      ))}
                    </div>

                    <div className={cn(
                      "mt-3 rounded-2xl p-3",
                      slide.tone === "light" ? "bg-white" : "bg-white/10",
                    )}>
                      <div className={cn(
                        "text-xs font-extrabold",
                        slide.tone === "light" ? "text-gray-900" : "text-white",
                      )}>
                        {art === "china" ? "MOQ + tier pricing" : art === "verified" ? "Escrow + verification" : "New drops hourly"}
                      </div>
                      <div className={cn(
                        "mt-1 text-[11px]",
                        slide.tone === "light" ? "text-gray-600" : "text-white/70",
                      )}>
                        {art === "china" ? "Best for importers" : art === "verified" ? "Buy with confidence" : "Catch it before it’s gone"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-3 -right-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md border border-white/10">
                  <div className="text-[11px] font-extrabold text-white">Limited</div>
                  <div className="mt-1 h-2 w-20 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      initial={{ width: "30%" }}
                      animate={{ width: ["30%", "80%", "45%", "70%"] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              {data.map((s, i) => (
                <Button
                  variant="ghost"
                  key={s.id}
                  className={cn(
                    "h-1.5 w-6 rounded-full transition-opacity",
                    slide.tone === "dark" ? "bg-white/30" : slide.tone === "primary" ? "bg-white/35" : "bg-gray-200",
                    i === index ? "opacity-100" : "opacity-40",
                  )}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to ${s.kicker}`}
                  title={s.kicker}
                  type="button"
                />
              ))}
            </div>

            <div className="absolute right-4 top-4 hidden md:flex items-center gap-2">
              <Button
                variant={slide.tone === "primary" ? "outline" : "ghost"}
                size="icon"
                className={cn("h-10 w-10 rounded-full", slide.tone === "primary" ? "border-white text-white hover:bg-white/10" : undefined)}
                onClick={() => setIndex((prev) => (prev - 1 + data.length) % data.length)}
                aria-label="Previous"
                title="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant={slide.tone === "primary" ? "outline" : "ghost"}
                size="icon"
                className={cn("h-10 w-10 rounded-full", slide.tone === "primary" ? "border-white text-white hover:bg-white/10" : undefined)}
                onClick={() => setIndex((prev) => (prev + 1) % data.length)}
                aria-label="Next"
                title="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
