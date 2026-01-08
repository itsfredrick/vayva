/**
 * Canonical Event Taxonomy for Vayva
 * Phase 2 - Product Analytics
 */

export type EventCategory =
  | "ACQUISITION"
  | "ACTIVATION"
  | "COMMERCE"
  | "OPS"
  | "ENGAGEMENT"
  | "SYSTEM";

export type EventSeverity = "info" | "warn" | "error";

export interface BaseAnalyticsEvent {
  eventId: string; // Unique UUID
  timestamp: string; // ISO String
  userId?: string; // Merchant User ID (if auth)
  storeId?: string; // Merchant Store ID (if auth)
  anonymousId?: string; // For logged-out tracking
  userAgent?: string;
  path?: string;
  ip?: string; // Anonymized/Hashed if possible
}

export interface AnalyticsEvent extends BaseAnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// --- TAXONOMY DEFINITIONS ---

// 1. ACQUISITION
export const ACQUISITION_EVENTS = {
  VIEW_LANDING: "view_landing",
  VIEW_PRICING: "view_pricing",
  START_SIGNUP: "start_signup",
  COMPLETE_SIGNUP: "complete_signup",
  VIEW_TEMPLATE_GALLERY: "view_template_gallery",
  PREVIEW_TEMPLATE: "preview_template",
} as const;

// 2. ACTIVATION
export const ACTIVATION_EVENTS = {
  SELECT_CATEGORY: "select_category",
  CREATE_STORE: "create_store",
  SELECT_TEMPLATE: "select_template",
  PUBLISH_STORE: "publish_store",
  ADD_FIRST_PRODUCT: "add_first_product",
  COMPLETE_ONBOARDING: "complete_onboarding",
} as const;

// 3. COMMERCE (Storefront & Admin)
export const COMMERCE_EVENTS = {
  VIEW_PRODUCT: "view_product",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  ADD_PAYMENT_INFO: "add_payment_info",
  PURCHASE_SUCCESS: "purchase_success",
  PURCHASE_FAILURE: "purchase_failure",
  REFUND_INITIATED: "refund_initiated",
} as const;

// 4. OPS (Merchant Admin)
export const OPS_EVENTS = {
  ORDER_STATUS_UPDATE: "order_status_update",
  INVENTORY_LOW: "inventory_low",
  PAYOUT_REQUESTED: "payout_requested",
  WITHDRAWAL_PROCESSED: "withdrawal_processed",
} as const;

// 5. ENGAGEMENT
export const ENGAGEMENT_EVENTS = {
  LOGIN: "login",
  VIEW_DASHBOARD: "view_dashboard",
  EXPORT_REPORT: "export_report",
  UPDATE_SETTINGS: "update_settings",
  INVITE_TEAM_MEMBER: "invite_team_member",
} as const;

// Helper to create event payload
export function createEventPayload(
  category: EventCategory,
  action: string,
  metadata: Record<string, any> = {},
  userId?: string,
  storeId?: string,
): Omit<AnalyticsEvent, "timestamp" | "eventId"> {
  return {
    category,
    action,
    metadata,
    userId,
    storeId,
  };
}
