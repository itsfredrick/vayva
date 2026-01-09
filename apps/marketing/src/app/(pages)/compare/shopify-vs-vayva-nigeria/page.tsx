import React from "react";
import { LandingHero } from "@/components/marketing/LandingHero";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { FinalCTASection } from "@/components/marketing/FinalCTASection";
import { SchemaOrg } from "@/components/seo/SchemaOrg";

export const metadata = {
    title: "Shopify vs Vayva Nigeria - Compare Pricing & Features",
    description: "Why Nigerian businesses are moving from Shopify to Vayva. Lower costs, local payments, and native WhatsApp features.",
};

export default function ComparePage() {
    return (
        <div className="min-h-screen bg-white">
            <SchemaOrg type="SoftwareApplication" />
            <LandingHero
                headline="Shopify is built for America. Vayva is built for you."
                sub="Don't pay in dollars for features you can't use. Switch to the platform designed for Nigerian commerce."
            />
            <ComparisonTable />
            <FinalCTASection />
        </div>
    );
}
