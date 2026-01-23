// Central mapping of system events to Notification and Audit actions
export const EVENT_CATALOG = {
    // ---------------------------------------------------------------------------
    // ORDERS
    // ---------------------------------------------------------------------------
    "order.created": {
        notification: {
            title: "New Order Received",
            body: (p: unknown) => `Order #${p.orderNumber} for ${p.currency} ${p.totalAmount} was placed by ${p.customerName}.`,
            severity: "success",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/orders/${id}`,
        },
    },
    "order.paid": {
        audit: { action: "order.payment_confirmed" },
    },
    "order.cancelled": {
        audit: { action: "order.cancelled" },
        notification: {
            title: "Order Cancelled",
            body: (p: unknown) => `Order #${p.orderNumber} was cancelled.`,
            severity: "warning",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/orders/${id}`,
        },
    },
    "order.refund_requested": {
        notification: {
            title: "Refund Requested",
            body: (p: unknown) => `Customer requested a refund for Order #${p.orderNumber}.`,
            severity: "warning",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/orders/${id}/refunds`,
        },
        audit: { action: "refund.requested" },
    },
    "order.refund_approved": {
        notification: {
            title: "Refund Approved",
            body: (p: unknown) => `Refund for Order #${p.orderNumber} has been approved.`,
            severity: "info",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/orders/${id}`,
        },
        audit: { action: "refund.approved" },
    },
    // ---------------------------------------------------------------------------
    // DELIVERY
    // ---------------------------------------------------------------------------
    "delivery.failed": {
        notification: {
            title: "Delivery Failed",
            body: (p: unknown) => `Delivery for Order #${p.orderNumber} failed. Reason: ${p.reason}`,
            severity: "critical",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/orders/${id}`, // Link to order context
        },
        audit: { action: "delivery.failed" },
    },
    // ---------------------------------------------------------------------------
    // DISPUTES
    // ---------------------------------------------------------------------------
    "dispute.opened": {
        notification: {
            title: "Dispute Opened",
            body: (p: unknown) => `A new dispute has been opened for transaction ${p.transactionId}.`,
            severity: "critical",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/disputes/${id}`,
        },
        audit: { action: "dispute.opened" },
    },
    "dispute.evidence_required": {
        notification: {
            title: "Evidence Required",
            body: (p: unknown) => `Action required for dispute on Order #${p.orderNumber}. Due by: ${p.dueDate}`,
            severity: "critical",
            actionUrl: (p: unknown, id: unknown) => `/dashboard/disputes/${id}`,
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
            body: (p: unknown) => `Your store is now on the ${p.planName} plan.`,
            severity: "success",
            actionUrl: "/dashboard/settings/billing",
        },
        audit: { action: "billing.plan_changed" },
    },
    "consent.settings_changed": {
        audit: { action: "consent.settings_changed" },
    },
};
