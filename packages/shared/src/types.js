export var UserRole;
(function (UserRole) {
    UserRole["OWNER"] = "OWNER";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["STAFF"] = "STAFF";
    UserRole["SUPPORT"] = "SUPPORT";
    UserRole["FINANCE"] = "FINANCE";
    UserRole["OPS"] = "OPS";
    UserRole["PLATFORM_ADMIN"] = "PLATFORM_ADMIN";
})(UserRole || (UserRole = {}));
export var OnboardingStatus;
(function (OnboardingStatus) {
    OnboardingStatus["NOT_STARTED"] = "NOT_STARTED";
    OnboardingStatus["IN_PROGRESS"] = "IN_PROGRESS";
    OnboardingStatus["REQUIRED_COMPLETE"] = "REQUIRED_COMPLETE";
    OnboardingStatus["OPTIONAL_INCOMPLETE"] = "OPTIONAL_INCOMPLETE";
    OnboardingStatus["COMPLETE"] = "COMPLETE";
})(OnboardingStatus || (OnboardingStatus = {}));
export var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["STARTER"] = "STARTER";
    SubscriptionPlan["GROWTH"] = "GROWTH";
    SubscriptionPlan["PRO"] = "PRO";
})(SubscriptionPlan || (SubscriptionPlan = {}));
export var BusinessType;
(function (BusinessType) {
    BusinessType["RETAIL"] = "RETAIL";
    BusinessType["FOOD"] = "FOOD";
    BusinessType["SERVICES"] = "SERVICES";
})(BusinessType || (BusinessType = {}));
export var OrderStatus;
(function (OrderStatus) {
    OrderStatus["DRAFT"] = "DRAFT";
    OrderStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUND_REQUESTED"] = "REFUND_REQUESTED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (OrderStatus = {}));
export var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["INITIATED"] = "INITIATED";
    PaymentStatus["REDIRECTED"] = "REDIRECTED";
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELED"] = "CANCELED";
})(PaymentStatus || (PaymentStatus = {}));
export var WhatsAppMessageSender;
(function (WhatsAppMessageSender) {
    WhatsAppMessageSender["CUSTOMER"] = "customer";
    WhatsAppMessageSender["MERCHANT"] = "merchant";
    WhatsAppMessageSender["SYSTEM"] = "system";
})(WhatsAppMessageSender || (WhatsAppMessageSender = {}));
export var WhatsAppLinkedEntityType;
(function (WhatsAppLinkedEntityType) {
    WhatsAppLinkedEntityType["ORDER"] = "order";
    WhatsAppLinkedEntityType["BOOKING"] = "booking";
    WhatsAppLinkedEntityType["NONE"] = "none";
})(WhatsAppLinkedEntityType || (WhatsAppLinkedEntityType = {}));
export var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["PAYMENT"] = "payment";
    WalletTransactionType["PAYOUT"] = "payout";
    WalletTransactionType["REFUND"] = "refund";
    WalletTransactionType["DISPUTE_HOLD"] = "dispute_hold";
    WalletTransactionType["DISPUTE_RELEASE"] = "dispute_release";
    WalletTransactionType["SETTLEMENT"] = "settlement";
})(WalletTransactionType || (WalletTransactionType = {}));
export var WalletTransactionStatus;
(function (WalletTransactionStatus) {
    WalletTransactionStatus["PENDING"] = "pending";
    WalletTransactionStatus["COMPLETED"] = "completed";
    WalletTransactionStatus["FAILED"] = "failed";
    WalletTransactionStatus["ON_HOLD"] = "on_hold";
    WalletTransactionStatus["CANCELLED"] = "cancelled";
})(WalletTransactionStatus || (WalletTransactionStatus = {}));
export var SettlementStatus;
(function (SettlementStatus) {
    SettlementStatus["PENDING"] = "pending";
    SettlementStatus["SETTLED"] = "settled";
    SettlementStatus["FAILED"] = "failed";
    SettlementStatus["DELAYED"] = "delayed";
})(SettlementStatus || (SettlementStatus = {}));
export var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["OPEN"] = "open";
    DisputeStatus["UNDER_REVIEW"] = "under_review";
    DisputeStatus["WON"] = "won";
    DisputeStatus["LOST"] = "lost";
})(DisputeStatus || (DisputeStatus = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "draft";
    InvoiceStatus["ISSUED"] = "issued";
    InvoiceStatus["PAID"] = "paid";
    InvoiceStatus["OVERDUE"] = "overdue";
    InvoiceStatus["VOID"] = "void";
})(InvoiceStatus || (InvoiceStatus = {}));
export var ProductServiceType;
(function (ProductServiceType) {
    ProductServiceType["RETAIL"] = "retail";
    ProductServiceType["FOOD"] = "food";
    ProductServiceType["SERVICE"] = "service";
    ProductServiceType["DIGITAL"] = "digital";
    ProductServiceType["EVENT"] = "event";
    ProductServiceType["HOTEL"] = "hotel";
    ProductServiceType["AUTO"] = "auto";
    ProductServiceType["REAL_ESTATE"] = "real_estate";
})(ProductServiceType || (ProductServiceType = {}));
export var ProductServiceStatus;
(function (ProductServiceStatus) {
    ProductServiceStatus["ACTIVE"] = "active";
    ProductServiceStatus["DRAFT"] = "draft";
    ProductServiceStatus["INACTIVE"] = "inactive";
    ProductServiceStatus["OUT_OF_STOCK"] = "out_of_stock";
    ProductServiceStatus["SCHEDULED"] = "scheduled";
})(ProductServiceStatus || (ProductServiceStatus = {}));
export var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["NEW"] = "new";
    CustomerStatus["RETURNING"] = "returning";
    CustomerStatus["VIP"] = "vip";
})(CustomerStatus || (CustomerStatus = {}));
export var OrderType;
(function (OrderType) {
    OrderType["RETAIL"] = "retail";
    OrderType["FOOD"] = "food";
    OrderType["SERVICE"] = "service";
})(OrderType || (OrderType = {}));
export var UnifiedOrderStatus;
(function (UnifiedOrderStatus) {
    // Retail & Food
    UnifiedOrderStatus["NEW"] = "new";
    UnifiedOrderStatus["PROCESSING"] = "processing";
    UnifiedOrderStatus["READY"] = "ready";
    UnifiedOrderStatus["COMPLETED"] = "completed";
    UnifiedOrderStatus["CANCELLED"] = "cancelled";
    UnifiedOrderStatus["REFUNDED"] = "refunded";
    // Service specific
    UnifiedOrderStatus["REQUESTED"] = "requested";
    UnifiedOrderStatus["CONFIRMED"] = "confirmed";
})(UnifiedOrderStatus || (UnifiedOrderStatus = {}));
// ACCOUNT OVERVIEW TYPES
export var KYCStatus;
(function (KYCStatus) {
    KYCStatus["NOT_STARTED"] = "not_started";
    KYCStatus["IN_REVIEW"] = "in_review";
    KYCStatus["APPROVED"] = "approved";
    KYCStatus["FAILED"] = "failed";
    KYCStatus["REQUIRES_ACTION"] = "requires_action";
})(KYCStatus || (KYCStatus = {}));
