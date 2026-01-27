"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@vayva/ui";
import {
  Shirt,
  Smartphone,
  Gem,
  Monitor,
  Home,
  PackageSearch,
  Globe,
  ShieldCheck,
} from "lucide-react";

export interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps): React.JSX.Element {
  const categories = useMemo(
    () => [
      {
        key: "electronics",
        label: "Electronics",
        href: "/search?category=Electronics",
        icon: Monitor,
        tone: "from-sky-500/15 via-white to-white",
      },
      {
        key: "phones",
        label: "Phones",
        href: "/search?category=Electronics&q=phone",
        icon: Smartphone,
        tone: "from-indigo-500/15 via-white to-white",
      },
      {
        key: "fashion",
        label: "Fashion",
        href: "/search?category=Fashion",
        icon: Shirt,
        tone: "from-pink-500/15 via-white to-white",
      },
      {
        key: "beauty",
        label: "Beauty",
        href: "/search?q=beauty",
        icon: Gem,
        tone: "from-rose-500/15 via-white to-white",
      },
      {
        key: "home",
        label: "Home",
        href: "/search?q=home",
        icon: Home,
        tone: "from-amber-500/15 via-white to-white",
      },
      {
        key: "china",
        label: "China Bulk",
        href: "/search?chinaBulk=true",
        icon: Globe,
        tone: "from-emerald-500/15 via-white to-white",
      },
      {
        key: "verified",
        label: "Verified",
        href: "/search?verified=true",
        icon: ShieldCheck,
        tone: "from-primary/15 via-white to-white",
      },
      {
        key: "sourcing",
        label: "Request Quote",
        href: "/sourcing",
        icon: PackageSearch,
        tone: "from-gray-900/10 via-white to-white",
      },
    ],
    [],
  );

  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-extrabold text-gray-900 leading-tight">
            Browse categories
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Jump into retail deals or wholesale sourcing
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {categories.map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02, ease: "easeOut" }}
            >
              <Link href={c.href} className="block">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group rounded-2xl border border-gray-100 bg-gradient-to-br p-3 text-center shadow-sm",
                    c.tone,
                  )}
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/5 text-primary transition-transform group-hover:scale-[1.03]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-[11px] font-extrabold text-gray-900 leading-tight">
                    {c.label}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
