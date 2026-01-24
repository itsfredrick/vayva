// src/lib/seo/seo-engine.ts
import type { Metadata } from "next";
import {
  SITE_ORIGIN,
  isAllowIndex,
  isHardNoindex,
  pageTypeFor,
} from "./route-policy";
import { buildJsonLdFor } from "./schema/index";

export function canonicalFor(path: string) {
  // normalize
  const normalized = path === "" ? "/" : path;
  return `${SITE_ORIGIN}${normalized}`;
}

export function robotsFor(path: string) {
  if (isHardNoindex(path)) return { index: false, follow: true };
  if (!isAllowIndex(path)) return { index: false, follow: true };
  return { index: true, follow: true };
}

export function metadataFor(path: string, ctx?: Record<string, unknown>): Metadata {
  const robots = robotsFor(path);
  const canonicalPath = path;

  const title = computeTitle(path, ctx);
  const description = computeDescription(path, ctx);

  return {
    title,
    description,
    alternates: { canonical: canonicalFor(canonicalPath) },
    robots: {
      index: robots.index,
      follow: robots.follow,
      googleBot: { index: robots.index, follow: robots.follow },
    },
    openGraph: {
      title,
      description,
      url: canonicalFor(canonicalPath),
      siteName: "Vayva",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function computeTitle(path: string, ctx?: Record<string, unknown>) {
  const pt = pageTypeFor(path);
  switch (pt) {
    case "home":
      return "Vayva | Nigeria's #1 AI Commerce Platform";
    case "blog_hub":
      return "Vayva Blog | Guides for Selling Online";
    case "blog_post":
      return `${ctx?.postTitle ?? "Guide"} | Vayva Blog`;
    case "legal_page":
      return `${ctx?.pageTitle ?? "Legal"} | Vayva`;
    case "help_page":
      return `${ctx?.pageTitle ?? "Help Center"} | Vayva`;
    default:
      return `${ctx?.pageTitle ?? "Vayva"} | Vayva`;
  }
}

function computeDescription(path: string, ctx?: Record<string, unknown>): string {
  const pt = pageTypeFor(path);
  switch (pt) {
    case "home":
      return "Build, sell, and scale with Vayva—Nigeria's #1 AI-powered commerce platform. Professional storefronts, WhatsApp ordering, and automated payments for modern vendors.";
    case "blog_post":
      return (ctx?.postDescription as string) ?? "Read the latest from Vayva.";
    default:
      return (
        (ctx?.pageDescription as string) ??
        "Build, sell, and grow with Vayva—Nigeria-first ecommerce infrastructure."
      );
  }
}

export function jsonLdFor(path: string, ctx?: Record<string, unknown>) {
  return buildJsonLdFor(path, ctx);
}
