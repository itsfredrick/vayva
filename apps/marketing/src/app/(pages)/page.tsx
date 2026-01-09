import React, { Suspense } from "react";
import { LandingHero } from "@/components/marketing/LandingHero";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import TrustVisualSection from "@/components/marketing/sections/TrustVisualSection";
import TemplatesDiscoverySection from "@/components/marketing/sections/TemplatesDiscoverySection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { InfrastructureSection } from "@/components/marketing/InfrastructureSection";
import { FinalCTASection } from "@/components/marketing/FinalCTASection";
import { SchemaOrg } from "@/components/seo/SchemaOrg";

const INDUSTRY_VARIANTS: Record<string, { headline: string; sub: string }> = {
  food: {
    headline: "Turn your Menu into a 24/7 Ordering Machine.",
    sub: "Let Vayva's AI handle the back-and-forth orders on WhatsApp while you focus on the kitchen."
  },
  fashion: {
    headline: "Sell Out your Collections on WhatsApp.",
    sub: "Manage orders, sizes, and payments automatically. Your store stays open while you design."
  },
  realestate: {
    headline: "Your WhatsApp is now a Property Showroom.",
    sub: "Let AI filter leads and book viewings while you close the deals."
  },
  default: {
    headline: "Turn your WhatsApp into a 24/7 Sales Machine.",
    sub: "Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders, track payments, and organize your business."
  }
};

export default async function LandingPage(props: {
  searchParams: Promise<{ industry?: string }>;
}) {
  const searchParams = await props.searchParams;
  const industry = searchParams.industry || "default";
  const content = INDUSTRY_VARIANTS[industry] || INDUSTRY_VARIANTS.default;

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: "#ffffff", color: "#0f172a" }}>
      <SchemaOrg type="SoftwareApplication" />

      {/* Hero Section */}
      <Suspense fallback={<div className="h-screen bg-white" />}>
        <LandingHero headline={content.headline} sub={content.sub} />
      </Suspense>

      {/* Trust Visual Hero Section */}
      <TrustVisualSection />

      {/* Problem Statement */}
      <ProblemSection />

      {/* Core Capabilities */}
      <FeaturesSection />

      {/* Templates Discovery Section */}
      <TemplatesDiscoverySection />

      {/* Infrastructure Section */}
      <InfrastructureSection />

      {/* Final CTA */}
      <FinalCTASection />
    </div>
  );
}
