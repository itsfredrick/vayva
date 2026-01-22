
import React from "react";

// Centralized Layout Map
// This connects the string 'layoutKey' from the registry to actual React components.
// We use React.lazy to avoid bundling all 20+ templates into the main bundle.

export const LAYOUT_RESOLVER: Record<string, React.LazyExoticComponent<React.ComponentType<unknown>>> = {
    StandardRetailHome: React.lazy(() => import("../../components/storefront/StandardRetailHome").then((m: unknown) => ({ default: m.StandardRetailHome || m.default }))),
    AAFashionHome: React.lazy(() => import("../../components/storefront/AAFashionHome").then((m: unknown) => ({ default: m.AAFashionHome || m.default }))),
    GizmoTechHome: React.lazy(() => import("../../components/storefront/GizmoTechHome").then((m: unknown) => ({ default: m.GizmoTechHome || m.default }))),
    BloomeHome: React.lazy(() => import("../../components/storefront/BloomeHome").then((m: unknown) => ({ default: m.BloomeHome || m.default }))),
    StandardServiceHome: React.lazy(() => import("../../components/storefront/StandardServiceHome").then((m: unknown) => ({ default: m.StandardServiceHome || m.default }))),
    QuickBitesFood: React.lazy(() => import("../../components/storefront/QuickBitesFood").then((m: unknown) => ({ default: m.QuickBitesFood || m.default }))),
    StandardDigitalHome: React.lazy(() => import("../../components/storefront/StandardDigitalHome").then((m: unknown) => ({ default: m.StandardDigitalHome || m.default }))),
    StandardEventsHome: React.lazy(() => import("../../components/storefront/StandardEventsHome").then((m: unknown) => ({ default: m.StandardEventsHome || m.default }))),
    SkillAcademyCourses: React.lazy(() => import("../../components/storefront/SkillAcademyCourses").then((m: unknown) => ({ default: m.SkillAcademyCourses || m.default }))),
    BulkTradeHome: React.lazy(() => import("../../components/storefront/BulkTradeHome").then((m: unknown) => ({ default: m.BulkTradeHome || m.default }))),
    CreativeMarketStore: React.lazy(() => import("../../components/storefront/CreativeMarketStore").then((m: unknown) => ({ default: m.CreativeMarketStore || m.default }))),
    GiveFlowHome: React.lazy(() => import("../../components/storefront/GiveFlowHome").then((m: unknown) => ({ default: m.GiveFlowHome || m.default }))),
    HomeListHome: React.lazy(() => import("../../components/storefront/HomeListHome").then((m: unknown) => ({ default: m.HomeListHome || m.default }))),
    OneProductHome: React.lazy(() => import("../../components/storefront/OneProductHome").then((m: unknown) => ({ default: m.OneProductHome || m.default }))),
    SliceLifePizza: React.lazy(() => import("../../components/storefront/SliceLifePizza").then((m: unknown) => ({ default: m.SliceLifePizza || m.default }))),
    StandardFoodHome: React.lazy(() => import("../../components/storefront/StandardFoodHome").then((m: unknown) => ({ default: m.StandardFoodHome || m.default }))),
    DigitalVaultStore: React.lazy(() => import("../../components/storefront/DigitalVaultStore").then((m: unknown) => ({ default: m.DigitalVaultStore || m.default }))),
    EventTicketsPro: React.lazy(() => import("../../components/storefront/EventTicketsPro").then((m: unknown) => ({ default: m.EventTicketsPro || m.default }))),
    GourmetDiningFood: React.lazy(() => import("../../components/storefront/GourmetDiningFood").then((m: unknown) => ({ default: m.GourmetDiningFood || m.default }))),
    LearnHubCourses: React.lazy(() => import("../../components/storefront/LearnHubCourses").then((m: unknown) => ({ default: m.LearnHubCourses || m.default }))),
    ProConsultBooking: React.lazy(() => import("../../components/storefront/ProConsultBooking").then((m: unknown) => ({ default: m.ProConsultBooking || m.default }))),
    WellnessBooking: React.lazy(() => import("../../components/storefront/WellnessBooking").then((m: unknown) => ({ default: m.WellnessBooking || m.default }))),
};

export type LayoutKeyEnum = keyof typeof LAYOUT_RESOLVER;

export function resolveLayout(key: string) {
    if (!key || !LAYOUT_RESOLVER[key]) {
        console.warn(`Template Registry Error: Layout key "${key}" not found in resolver.`);
        return null;
    }
    return LAYOUT_RESOLVER[key];
}
