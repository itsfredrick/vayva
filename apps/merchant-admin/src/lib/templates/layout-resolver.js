import React from "react";
// Centralized Layout Map
// This connects the string 'layoutKey' from the registry to actual React components.
// We use React.lazy to avoid bundling all 20+ templates into the main bundle.
export const LAYOUT_RESOLVER = {
    StandardRetailHome: React.lazy(() => import("../../components/storefront/StandardRetailHome").then((m) => ({ default: m.StandardRetailHome || m.default }))),
    AAFashionHome: React.lazy(() => import("../../components/storefront/AAFashionHome").then((m) => ({ default: m.AAFashionHome || m.default }))),
    GizmoTechHome: React.lazy(() => import("../../components/storefront/GizmoTechHome").then((m) => ({ default: m.GizmoTechHome || m.default }))),
    BloomeHome: React.lazy(() => import("../../components/storefront/BloomeHome").then((m) => ({ default: m.BloomeHome || m.default }))),
    StandardServiceHome: React.lazy(() => import("../../components/storefront/StandardServiceHome").then((m) => ({ default: m.StandardServiceHome || m.default }))),
    QuickBitesFood: React.lazy(() => import("../../components/storefront/QuickBitesFood").then((m) => ({ default: m.QuickBitesFood || m.default }))),
    StandardDigitalHome: React.lazy(() => import("../../components/storefront/StandardDigitalHome").then((m) => ({ default: m.StandardDigitalHome || m.default }))),
    StandardEventsHome: React.lazy(() => import("../../components/storefront/StandardEventsHome").then((m) => ({ default: m.StandardEventsHome || m.default }))),
    SkillAcademyCourses: React.lazy(() => import("../../components/storefront/SkillAcademyCourses").then((m) => ({ default: m.SkillAcademyCourses || m.default }))),
    BulkTradeHome: React.lazy(() => import("../../components/storefront/BulkTradeHome").then((m) => ({ default: m.BulkTradeHome || m.default }))),
    CreativeMarketStore: React.lazy(() => import("../../components/storefront/CreativeMarketStore").then((m) => ({ default: m.CreativeMarketStore || m.default }))),
    GiveFlowHome: React.lazy(() => import("../../components/storefront/GiveFlowHome").then((m) => ({ default: m.GiveFlowHome || m.default }))),
    HomeListHome: React.lazy(() => import("../../components/storefront/HomeListHome").then((m) => ({ default: m.HomeListHome || m.default }))),
    OneProductHome: React.lazy(() => import("../../components/storefront/OneProductHome").then((m) => ({ default: m.OneProductHome || m.default }))),
    SliceLifePizza: React.lazy(() => import("../../components/storefront/SliceLifePizza").then((m) => ({ default: m.SliceLifePizza || m.default }))),
    StandardFoodHome: React.lazy(() => import("../../components/storefront/StandardFoodHome").then((m) => ({ default: m.StandardFoodHome || m.default }))),
    DigitalVaultStore: React.lazy(() => import("../../components/storefront/DigitalVaultStore").then((m) => ({ default: m.DigitalVaultStore || m.default }))),
    EventTicketsPro: React.lazy(() => import("../../components/storefront/EventTicketsPro").then((m) => ({ default: m.EventTicketsPro || m.default }))),
    GourmetDiningFood: React.lazy(() => import("../../components/storefront/GourmetDiningFood").then((m) => ({ default: m.GourmetDiningFood || m.default }))),
    LearnHubCourses: React.lazy(() => import("../../components/storefront/LearnHubCourses").then((m) => ({ default: m.LearnHubCourses || m.default }))),
    ProConsultBooking: React.lazy(() => import("../../components/storefront/ProConsultBooking").then((m) => ({ default: m.ProConsultBooking || m.default }))),
    WellnessBooking: React.lazy(() => import("../../components/storefront/WellnessBooking").then((m) => ({ default: m.WellnessBooking || m.default }))),
};
export function resolveLayout(key) {
    if (!key || !LAYOUT_RESOLVER[key]) {
        console.warn(`Template Registry Error: Layout key "${key}" not found in resolver.`);
        return null;
    }
    return LAYOUT_RESOLVER[key];
}
