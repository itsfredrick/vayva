/**
 * STORE CONFIGURATION SERVICE
 *
 * DISABLED: Control Center requires Prisma schema migration.
 * Feature is disabled via feature flag until migration complete.
 */

import { assertFeatureEnabled } from "@/lib/env-validation";
import {
  StoreConfig,
  StoreTemplate,
  StorePage,
  StoreBranding,
  StoreNavigation,
  StorePolicy,
  StoreDomain,
} from "@/types/control-center";

async function getStoreConfig(storeId?: string): Promise<StoreConfig | null> {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  // Pending return to satisfy types
  return {
    templateId: "default",
    branding: {
      storeName: "Vayva Store",
      accentColor: "#000000",
      fontHeading: "Inter",
      fontBody: "Inter",
    },
    pages: [],
    navigation: { header: [], footer: [] },
    policies: [],
    domains: { subdomain: "store", status: "active" },
    isPublished: false,
  };
}

async function updateTemplate(storeId?: string, templateId?: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  throw new Error("Control Center not yet implemented");
}

import { getNormalizedTemplates } from "@/lib/templates-registry";

// ...

async function getTemplates(storeId?: string): Promise<StoreTemplate[]> {
  // DO NOT block template browsing behind CONTROL_CENTER_ENABLED.
  return getNormalizedTemplates() as any;
}

async function updateBranding(branding: StoreBranding, storeId?: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  // Pending
}

async function getPages(storeId?: string): Promise<StorePage[]> {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  return [];
}

async function createPage(page: any, storeId?: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  throw new Error("Control Center not yet implemented");
}

async function updatePage(pageId: string, updates: any, storeId?: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  throw new Error("Control Center not yet implemented");
}

async function publishStore(storeId?: string) {
  assertFeatureEnabled("CONTROL_CENTER_ENABLED");
  throw new Error("Control Center not yet implemented");
}

export const ControlCenterService = {
  getStoreConfig,
  getTemplates,
  updateTemplate,
  updateBranding,
  getPages,
  createPage,
  updatePage,
  publishStore,
};
