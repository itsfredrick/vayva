export const metadata = {
    title: "Shopify vs Vayva Nigeria - Compare Pricing & Features",
    description: "Why Nigerian businesses are moving from Shopify to Vayva. Lower costs, local payments, and native WhatsApp features.",
};
// DEPRECATED - Use /vs/[competitor] instead
import { redirect } from 'next/navigation';
export default function ComparePage() {
    redirect('/vs/shopify');
}
