"use client";

import { useStore } from "@/context/StoreContext";
import { TemplateCategory } from "@/lib/templates-registry";
import { RetailProductForm } from "./forms/RetailProductForm";
import { FashionProductForm } from "./forms/FashionProductForm";
import { ServiceProductForm } from "./forms/ServiceProductForm";
import { FoodProductForm } from "./forms/FoodProductForm";
import { DigitalProductForm } from "./forms/DigitalProductForm";
import { RealEstateProductForm } from "./forms/RealEstateProductForm";
import { EducationProductForm } from "./forms/EducationProductForm";
import { EventsProductForm } from "./forms/EventsProductForm";
import { WholesaleProductForm } from "./forms/WholesaleProductForm";
import { MarketplaceProductForm } from "./forms/MarketplaceProductForm";
import { NonprofitProductForm } from "./forms/NonprofitProductForm";
import { EmptyState, Button } from "@vayva/ui";
import Link from "next/link";

/**
 * Dynamically renders the correct product form based on the store's template category.
 */
export function ProductFormFactory({ productId }: { productId?: string }) {
    const { store } = useStore();

    if (!store) return <div className="p-8 text-center">Loading store context...</div>;

    // Fallback to RETAIL if no category found
    const category = store.template?.category || TemplateCategory.RETAIL;
    const templateId = store.template?.templateId;

    // Special Case: A&A Fashion uses FashionForm (extended Retail)
    if (templateId === "vayva-aa-fashion") {
        return <FashionProductForm productId={productId} />;
    }

    // General Category Switching
    if (templateId === "vayva-ticketly") {
        return <EventsProductForm productId={productId} />;
    }
    if (templateId === "vayva-bulktrade") {
        return <WholesaleProductForm productId={productId} />;
    }
    if (templateId === "vayva-markethub") {
        return <MarketplaceProductForm productId={productId} />;
    }
    if (templateId === "vayva-giveflow") {
        return <NonprofitProductForm productId={productId} />;
    }
    if (templateId === "vayva-eduflow") {
        return <EducationProductForm productId={productId} />;
    }
    if (templateId === "vayva-homelist") {
        return <RealEstateProductForm productId={productId} />;
    }

    switch (category) {
        case TemplateCategory.RETAIL:
        case TemplateCategory.B2B: // Wholesalers use standard retail form for now
        case TemplateCategory.MARKETPLACE: // Vendors use standard retail form
        case TemplateCategory.NONPROFIT: // Donations treated as "products" roughly
            return <RetailProductForm productId={productId} />;

        case TemplateCategory.SERVICE:
            return <ServiceProductForm productId={productId} />;

        case TemplateCategory.FOOD:
            return <FoodProductForm productId={productId} />;

        case TemplateCategory.DIGITAL:
            return <DigitalProductForm productId={productId} />;

        case TemplateCategory.REAL_ESTATE:
            return <RealEstateProductForm productId={productId} />;

        case TemplateCategory.EDUCATION:
            return <EducationProductForm productId={productId} />;

        default:
            return (
                <EmptyState
                    title="Unknown Category"
                    description={`We don't have a form for ${category} yet.`}
                    action={
                        <Link href="/dashboard">
                            <Button>Go Back</Button>
                        </Link>
                    }
                />
            );
    }
}
