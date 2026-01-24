import React from "react";
// DEPRECATED - Use /vs/[competitor] instead
import { redirect } from 'next/navigation';

export const metadata = {
    title: "Shopify vs Vayva Nigeria - Compare Pricing & Features",
    description: "Why Nigerian businesses are moving from Shopify to Vayva. Lower costs, local payments, and native WhatsApp features.",
};

export default function ComparePage(): React.JSX.Element {
    redirect('/vs/shopify');
}
