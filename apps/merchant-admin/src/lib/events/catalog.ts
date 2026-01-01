import { EventDefinition } from "./types";

// Central mapping of system events to Notification and Audit actions
export const EVENT_CATALOG: Record<string, EventDefinition> = {
  // ---------------------------------------------------------------------------
  // ORDERS
  // ---------------------------------------------------------------------------
  "order.created": {
    notification: {
      title: "New Order Received",
      body: (p) =>
        `Order #${p.orderNumber} for ${p.currency} ${p.totalAmount} was placed by ${p.customerName}.`,
      severity: "success",
      actionUrl: (p, id) => `/dashboard/orders/${id}`,
    },
  },
  "order.paid": {
    audit: { action: "order.payment_confirmed" },
  },
  "order.cancelled": {
    audit: { action: "order.cancelled" },
    notification: {
      title: "Order Cancelled",
      body: (p) => `Order #${p.orderNumber} was cancelled.`,
      severity: "warning",
      actionUrl: (p, id) => `/dashboard/orders/${id}`,
    },
  },
  "order.refund_requested": {
    notification: {
      title: "Refund Requested",
      body: (p) => `Customer requested a refund for Order #${p.orderNumber}.`,
      severity: "warning",
      actionUrl: (p, id) => `/dashboard/orders/${id}/refunds`,
    },
    audit: { action: "refund.requested" },
  },
  "order.refund_approved": {
    notification: {
      title: "Refund Approved",
      body: (p) => `Refund for Order #${p.orderNumber} has been approved.`,
      severity: "info",
      actionUrl: (p, id) => `/dashboard/orders/${id}`,
    },
    audit: { action: "refund.approved" },
  },

  // ---------------------------------------------------------------------------
  // DELIVERY
  // ---------------------------------------------------------------------------
  "delivery.failed": {
    notification: {
      title: "Delivery Failed",
      body: (p) =>
        `Delivery for Order #${p.orderNumber} failed. Reason: ${p.reason}`,
      severity: "critical",
      actionUrl: (p, id) => `/dashboard/orders/${id}`, // Link to order context
    },
    audit: { action: "delivery.failed" },
  },

  // ---------------------------------------------------------------------------
  // DISPUTES
  // ---------------------------------------------------------------------------
  "dispute.opened": {
    notification: {
      title: "Dispute Opened",
      body: (p) =>
        `A new dispute has been opened for transaction ${p.transactionId}.`,
      severity: "critical",
      actionUrl: (p, id) => `/dashboard/disputes/${id}`,
    },
    audit: { action: "dispute.opened" },
  },
  "dispute.evidence_required": {
    notification: {
      title: "Evidence Required",
      body: (p) =>
        `Action required for dispute on Order #${p.orderNumber}. Due by: ${p.dueDate}`,
      severity: "critical",
      actionUrl: (p, id) => `/dashboard/disputes/${id}`,
    },
  },

  // ---------------------------------------------------------------------------
  // SYSTEM / CONFIG
  // ---------------------------------------------------------------------------
  "settings.updated": {
    audit: { action: "settings.updated" },
  },
  "plan.changed": {
    notification: {
      title: "Plan Updated",
      body: (p) => `Your store is now on the ${p.planName} plan.`,
      severity: "success",
      actionUrl: "/dashboard/settings/billing",
    },
    audit: { action: "billing.plan_changed" },
  },
  "consent.settings_changed": {
    audit: { action: "consent.settings_changed" },
  },
};
