"use client";

import React, { Suspense, useMemo } from "react";
import { cn } from "@vayva/ui";

// Lazy-loaded components map
const COMPONENTS: Record<string, any> = {
    StandardRetailHome: React.lazy(() => import("../storefront/StandardRetailHome").then((m: any) => ({ default: m.StandardRetailHome || m.default }))),
    AAFashionHome: React.lazy(() => import("../storefront/AAFashionHome").then((m: any) => ({ default: m.AAFashionHome || m.default }))),
    GizmoTechHome: React.lazy(() => import("../storefront/GizmoTechHome").then((m: any) => ({ default: m.GizmoTechHome || m.default }))),
    BloomeHome: React.lazy(() => import("../storefront/BloomeHome").then((m: any) => ({ default: m.BloomeHome || m.default }))),
    StandardServiceHome: React.lazy(() => import("../storefront/StandardServiceHome").then((m: any) => ({ default: m.StandardServiceHome || m.default }))),
    QuickBitesFood: React.lazy(() => import("../storefront/QuickBitesFood").then((m: any) => ({ default: m.QuickBitesFood || m.default }))),
    StandardDigitalHome: React.lazy(() => import("../storefront/StandardDigitalHome").then((m: any) => ({ default: m.StandardDigitalHome || m.default }))),
    StandardEventsHome: React.lazy(() => import("../storefront/StandardEventsHome").then((m: any) => ({ default: m.StandardEventsHome || m.default }))),
    SkillAcademyCourses: React.lazy(() => import("../storefront/SkillAcademyCourses").then((m: any) => ({ default: m.SkillAcademyCourses || m.default }))),
    BulkTradeHome: React.lazy(() => import("../storefront/BulkTradeHome").then((m: any) => ({ default: m.BulkTradeHome || m.default }))),
    CreativeMarketStore: React.lazy(() => import("../storefront/CreativeMarketStore").then((m: any) => ({ default: m.CreativeMarketStore || m.default }))),
    GiveFlowHome: React.lazy(() => import("../storefront/GiveFlowHome").then((m: any) => ({ default: m.GiveFlowHome || m.default }))),
    HomeListHome: React.lazy(() => import("../storefront/HomeListHome").then((m: any) => ({ default: m.HomeListHome || m.default }))),
    OneProductHome: React.lazy(() => import("../storefront/OneProductHome").then((m: any) => ({ default: m.OneProductHome || m.default }))),
    SliceLifePizza: React.lazy(() => import("../storefront/SliceLifePizza").then((m: any) => ({ default: m.SliceLifePizza || m.default }))),
    StandardFoodHome: React.lazy(() => import("../storefront/StandardFoodHome").then((m: any) => ({ default: m.StandardFoodHome || m.default }))),
    DigitalVaultStore: React.lazy(() => import("../storefront/DigitalVaultStore").then((m: any) => ({ default: m.DigitalVaultStore || m.default }))),
    EventTicketsPro: React.lazy(() => import("../storefront/EventTicketsPro").then((m: any) => ({ default: m.EventTicketsPro || m.default }))),
    GourmetDiningFood: React.lazy(() => import("../storefront/GourmetDiningFood").then((m: any) => ({ default: m.GourmetDiningFood || m.default }))),
    LearnHubCourses: React.lazy(() => import("../storefront/LearnHubCourses").then((m: any) => ({ default: m.LearnHubCourses || m.default }))),
    ProConsultBooking: React.lazy(() => import("../storefront/ProConsultBooking").then((m: any) => ({ default: m.ProConsultBooking || m.default }))),
    WellnessBooking: React.lazy(() => import("../storefront/WellnessBooking").then((m: any) => ({ default: m.WellnessBooking || m.default }))),
};

interface TemplateMiniPreviewProps {
    layoutComponent: string;
    templateName: string;
    className?: string;
    componentProps?: Record<string, any>;
}

export const TemplateMiniPreview = React.memo(({
    layoutComponent,
    templateName,
    className,
    componentProps = {}
}: TemplateMiniPreviewProps) => {
    const Component = COMPONENTS[layoutComponent];

    if (!Component) {
        return (
            <div className={cn("w-full aspect-[16/9] bg-gray-100 flex items-center justify-center text-gray-400 text-xs", className)}>
                {templateName}
            </div>
        );
    }

    return (
        <div className={cn("w-full aspect-[16/9] overflow-hidden relative bg-white select-none pointer-events-none", className)}>
            <Suspense fallback={
                <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-2 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="w-20 h-3 bg-gray-200 rounded" />
                </div>
            }>
                <div style={{
                    width: '400%',
                    height: '400%',
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zoom: 1 // For some legacy scale bugs
                }}>
                    <Component
                        storeName={templateName}
                        storeSlug="preview"
                        {...componentProps}
                    />
                </div>
            </Suspense>

            {/* Interaction Shield - extra layer of safety */}
            <div className="absolute inset-0 z-10" />
        </div>
    );
});

TemplateMiniPreview.displayName = "TemplateMiniPreview";
