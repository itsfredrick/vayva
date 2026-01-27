"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge, Button, cn } from "@vayva/ui";
import {
  BadgeCheck,
  Heart,
  MessageCircle,
  ShoppingCart,
  MapPin,
} from "lucide-react";
import type { SearchResult } from "@vayva/shared";

export interface ProductCardProps {
  item: SearchResult;
  className?: string;
}

function formatNgn(amount: number): string {
  return `₦${Math.round(amount).toLocaleString()}`;
}

export function ProductCard({ item, className }: ProductCardProps): React.JSX.Element {
  const isCheckout = item.mode === "CHECKOUT";
  const fallbackImage = "/vayva-logo-official.svg";
  const [imgSrc, setImgSrc] = React.useState(item.image || fallbackImage);

  return (
    <motion.div
      className={cn("group relative", className)}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Link
        href={`/listing/${item.id}`}
        className={cn(
          "block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm",
          "transition-shadow hover:shadow-elevated",
        )}
      >
        <div className="relative aspect-[4/3] bg-gray-100">
          <motion.img
            src={imgSrc}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onError={() => {
              if (imgSrc !== fallbackImage) setImgSrc(fallbackImage);
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {item.isChinaBulk ? (
              <Badge variant="warning" className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">
                China Bulk
              </Badge>
            ) : null}

            <Badge
              variant={isCheckout ? "default" : "info"}
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
            >
              {isCheckout ? "Buy Now" : "Quote"}
            </Badge>

            {item.moq && item.moq > 1 ? (
              <Badge variant="info" className="rounded-md px-2 py-0.5 text-[10px] font-bold">
                MOQ {item.moq}
              </Badge>
            ) : null}
          </div>

          {item.isPromoted ? (
            <div className="absolute right-2 top-2">
              <Badge variant="warning" className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase">
                Hot
              </Badge>
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-x-2 bottom-2 hidden gap-2 opacity-0 transition-opacity group-hover:opacity-100 md:flex">
            <Button
              size="sm"
              variant={isCheckout ? "primary" : "secondary"}
              className="pointer-events-auto h-9 flex-1 rounded-lg text-xs font-bold"
              type="button"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              {isCheckout ? (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </>
              ) : (
                <>
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="pointer-events-auto h-9 w-10 rounded-lg"
              type="button"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label="Save"
              title="Save"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-3">
          <div className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-primary">
            {item.title}
          </div>

          <div className="flex items-end justify-between gap-2">
            <div className="text-lg font-extrabold text-gray-900">
              {formatNgn(item.price)}
            </div>
            {item.moq && item.moq > 1 ? (
              <div className="text-[11px] font-bold text-gray-500">
                from <span className="text-gray-700">MOQ {item.moq}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-3">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-6 w-6 shrink-0 rounded-full bg-gray-100 text-center text-[10px] font-bold leading-6 text-gray-600">
                {item.merchant.name?.[0] || "M"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate text-xs font-medium text-gray-700">
                    {item.merchant.name}
                  </span>
                  {item.merchant.isVerified ? (
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="md:hidden">
              <Button
                size="icon"
                variant={isCheckout ? "primary" : "secondary"}
                className="h-9 w-9 rounded-full"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {isCheckout ? (
                  <ShoppingCart className="h-4 w-4" />
                ) : (
                  <MessageCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
