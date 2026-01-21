
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.AbuseRuleScalarFieldEnum = {
  id: 'id',
  key: 'key',
  enabled: 'enabled',
  config: 'config',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AccountDeletionRequestScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  requestedByUserId: 'requestedByUserId',
  status: 'status',
  scheduledFor: 'scheduledFor',
  reason: 'reason',
  confirmationMeta: 'confirmationMeta',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminAuditLogScalarFieldEnum = {
  id: 'id',
  actorUserId: 'actorUserId',
  action: 'action',
  targetType: 'targetType',
  targetId: 'targetId',
  storeId: 'storeId',
  reason: 'reason',
  before: 'before',
  after: 'after',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.AiActionDefinitionScalarFieldEnum = {
  id: 'id',
  triggerType: 'triggerType',
  name: 'name',
  description: 'description',
  toolConfig: 'toolConfig',
  createdAt: 'createdAt'
};

exports.Prisma.AiActionMessageLinkScalarFieldEnum = {
  id: 'id',
  messageId: 'messageId',
  aiActionRunId: 'aiActionRunId',
  relationType: 'relationType'
};

exports.Prisma.AiActionRunScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  actionDefId: 'actionDefId',
  status: 'status',
  arguments: 'arguments',
  requiresApproval: 'requiresApproval',
  result: 'result',
  error: 'error',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiUsageEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  channel: 'channel',
  conversationId: 'conversationId',
  userId: 'userId',
  model: 'model',
  inputTokens: 'inputTokens',
  outputTokens: 'outputTokens',
  imageCount: 'imageCount',
  toolCallsCount: 'toolCallsCount',
  toolCallBreakdown: 'toolCallBreakdown',
  latencyMs: 'latencyMs',
  success: 'success',
  errorType: 'errorType',
  costEstimateKobo: 'costEstimateKobo',
  requestId: 'requestId',
  correlationId: 'correlationId',
  createdAt: 'createdAt'
};

exports.Prisma.AiUsageDailyScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  tokensCount: 'tokensCount',
  requestsCount: 'requestsCount',
  imagesCount: 'imagesCount',
  toolCallsCount: 'toolCallsCount',
  costKobo: 'costKobo',
  overLimitBlocks: 'overLimitBlocks',
  rateLimitBlocks: 'rateLimitBlocks',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantAiProfileScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  agentName: 'agentName',
  tonePreset: 'tonePreset',
  greetingTemplate: 'greetingTemplate',
  signoffTemplate: 'signoffTemplate',
  persuasionLevel: 'persuasionLevel',
  brevityMode: 'brevityMode',
  oneQuestionRule: 'oneQuestionRule',
  escalationRules: 'escalationRules',
  prohibitedClaims: 'prohibitedClaims',
  policyOverrides: 'policyOverrides',
  languagesSelected: 'languagesSelected',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhatsAppAgentSettingsScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  enabled: 'enabled',
  businessHours: 'businessHours',
  autoReplyOutsideHours: 'autoReplyOutsideHours',
  outsideHoursMessage: 'outsideHoursMessage',
  catalogMode: 'catalogMode',
  allowImageUnderstanding: 'allowImageUnderstanding',
  orderStatusAccess: 'orderStatusAccess',
  paymentGuidanceMode: 'paymentGuidanceMode',
  maxDailyMsgsPerUser: 'maxDailyMsgsPerUser',
  humanHandoffEnabled: 'humanHandoffEnabled',
  handoffDestination: 'handoffDestination',
  safetyFilters: 'safetyFilters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiPlanScalarFieldEnum = {
  id: 'id',
  name: 'name',
  monthlyTokenLimit: 'monthlyTokenLimit',
  monthlyImageLimit: 'monthlyImageLimit',
  monthlyRequestLimit: 'monthlyRequestLimit',
  maxRps: 'maxRps',
  overagePolicy: 'overagePolicy',
  features: 'features',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantAiSubscriptionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  planId: 'planId',
  planKey: 'planKey',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  status: 'status',
  monthTokensUsed: 'monthTokensUsed',
  monthImagesUsed: 'monthImagesUsed',
  monthRequestsUsed: 'monthRequestsUsed',
  monthMessagesUsed: 'monthMessagesUsed',
  trialStartedAt: 'trialStartedAt',
  trialExpiresAt: 'trialExpiresAt',
  graceEndsAt: 'graceEndsAt',
  closureScheduledAt: 'closureScheduledAt',
  closedAt: 'closedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiAddonPurchaseScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  subscriptionId: 'subscriptionId',
  packType: 'packType',
  priceKobo: 'priceKobo',
  transactionId: 'transactionId',
  messagesAdded: 'messagesAdded',
  imagesAdded: 'imagesAdded',
  createdAt: 'createdAt'
};

exports.Prisma.SignupAbuseSignalScalarFieldEnum = {
  id: 'id',
  ipHash: 'ipHash',
  fingerprintHash: 'fingerprintHash',
  emailDomain: 'emailDomain',
  signupCount: 'signupCount',
  lastSignupAt: 'lastSignupAt',
  isBlocked: 'isBlocked',
  blockedUntil: 'blockedUntil'
};

exports.Prisma.AnalyticsDailyDeliveryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  shipmentsDispatched: 'shipmentsDispatched',
  shipmentsDelivered: 'shipmentsDelivered',
  shipmentsFailed: 'shipmentsFailed',
  deliverySuccessRate: 'deliverySuccessRate',
  avgDeliveryHours: 'avgDeliveryHours',
  kwikShare: 'kwikShare',
  selfDispatchShare: 'selfDispatchShare',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsDailyPaymentsScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  successCount: 'successCount',
  failedCount: 'failedCount',
  successAmount: 'successAmount',
  failedAmount: 'failedAmount',
  avgPaymentTimeSeconds: 'avgPaymentTimeSeconds',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsDailySalesScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  ordersCount: 'ordersCount',
  grossSales: 'grossSales',
  discounts: 'discounts',
  shipping: 'shipping',
  netSales: 'netSales',
  refunds: 'refunds',
  paidOrdersCount: 'paidOrdersCount',
  codOrdersCount: 'codOrdersCount',
  transferOrdersCount: 'transferOrdersCount',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsDailySupportScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  inboundMessages: 'inboundMessages',
  outboundMessages: 'outboundMessages',
  firstResponseAvgSeconds: 'firstResponseAvgSeconds',
  ticketsCreated: 'ticketsCreated',
  ticketsResolved: 'ticketsResolved',
  resolutionAvgSeconds: 'resolutionAvgSeconds',
  unreadConversationsEOD: 'unreadConversationsEOD',
  createdAt: 'createdAt'
};

exports.Prisma.ApiKeyScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  keyHash: 'keyHash',
  scopes: 'scopes',
  status: 'status',
  lastUsedAt: 'lastUsedAt',
  createdAt: 'createdAt',
  revokedAt: 'revokedAt',
  expiresAt: 'expiresAt',
  ipAllowlist: 'ipAllowlist',
  lastIp: 'lastIp'
};

exports.Prisma.AutomationRuleScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  name: 'name',
  triggerType: 'triggerType',
  actionType: 'actionType',
  enabled: 'enabled',
  config: 'config',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BankBeneficiaryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  bankCode: 'bankCode',
  bankName: 'bankName',
  accountNumber: 'accountNumber',
  accountName: 'accountName',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BillingProfileScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  legalName: 'legalName',
  addressText: 'addressText',
  taxId: 'taxId',
  billingEmail: 'billingEmail',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  channel: 'channel',
  name: 'name',
  status: 'status',
  segmentId: 'segmentId',
  scheduledAt: 'scheduledAt',
  quietHours: 'quietHours',
  messageTemplateKey: 'messageTemplateKey',
  messageBody: 'messageBody',
  variables: 'variables',
  createdByUserId: 'createdByUserId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CampaignSendScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  campaignId: 'campaignId',
  customerId: 'customerId',
  toAddress: 'toAddress',
  status: 'status',
  providerMessageId: 'providerMessageId',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CarrierAccountScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  carrier: 'carrier',
  status: 'status',
  credentialsEnc: 'credentialsEnc',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionToken: 'sessionToken',
  email: 'email',
  phone: 'phone',
  recoveryStatus: 'recoveryStatus',
  checkoutUrl: 'checkoutUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CartItemScalarFieldEnum = {
  id: 'id',
  cartId: 'cartId',
  variantId: 'variantId',
  quantity: 'quantity'
};

exports.Prisma.ChargeScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  paymentIntentId: 'paymentIntentId',
  provider: 'provider',
  providerChargeId: 'providerChargeId',
  status: 'status',
  amount: 'amount',
  currency: 'currency',
  paidAt: 'paidAt',
  failureCode: 'failureCode',
  failureMessage: 'failureMessage',
  receiptUrl: 'receiptUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CollectionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  title: 'title',
  handle: 'handle',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CollectionProductScalarFieldEnum = {
  collectionId: 'collectionId',
  productId: 'productId'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  channel: 'channel',
  externalId: 'externalId',
  displayName: 'displayName',
  phoneE164: 'phoneE164',
  lastSeenAt: 'lastSeenAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  contactId: 'contactId',
  status: 'status',
  assignedTo: 'assignedTo',
  unreadCount: 'unreadCount',
  lastMessageAt: 'lastMessageAt',
  lastInboundAt: 'lastInboundAt',
  lastOutboundAt: 'lastOutboundAt',
  lastRepliedAt: 'lastRepliedAt',
  priority: 'priority',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  ruleId: 'ruleId',
  code: 'code',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomDomainScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  domain: 'domain',
  status: 'status',
  verificationType: 'verificationType',
  expectedValue: 'expectedValue',
  lastCheckedAt: 'lastCheckedAt',
  createdAt: 'createdAt'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  email: 'email',
  phone: 'phone',
  firstName: 'firstName',
  lastName: 'lastName',
  whatsappContactId: 'whatsappContactId',
  defaultAddressId: 'defaultAddressId',
  notes: 'notes',
  tags: 'tags',
  marketingOptIn: 'marketingOptIn',
  passwordHash: 'passwordHash',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerAccountScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  firstName: 'firstName',
  lastName: 'lastName',
  isVerified: 'isVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerAddressScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  customerId: 'customerId',
  label: 'label',
  isDefault: 'isDefault',
  recipientName: 'recipientName',
  recipientPhone: 'recipientPhone',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  country: 'country',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerRiskProfileScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  customerId: 'customerId',
  phoneE164: 'phoneE164',
  riskScore: 'riskScore',
  flags: 'flags',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomerSessionScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  token: 'token',
  device: 'device',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.DataRequestScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  status: 'status',
  requesterType: 'requesterType',
  customerId: 'customerId',
  userId: 'userId',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  completedAt: 'completedAt'
};

exports.Prisma.DeadLetterQueueScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  jobType: 'jobType',
  payload: 'payload',
  lastError: 'lastError',
  failedAt: 'failedAt',
  retryAfter: 'retryAfter',
  status: 'status',
  replayedAt: 'replayedAt'
};

exports.Prisma.DeliveryOptionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  profileId: 'profileId',
  type: 'type',
  name: 'name',
  description: 'description',
  enabled: 'enabled',
  etaMinDays: 'etaMinDays',
  etaMaxDays: 'etaMaxDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeliveryProfileScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  isDefault: 'isDefault',
  defaultCurrency: 'defaultCurrency',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeliveryWebhookEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  carrier: 'carrier',
  providerEventId: 'providerEventId',
  payload: 'payload',
  status: 'status',
  error: 'error',
  receivedAt: 'receivedAt',
  processedAt: 'processedAt'
};

exports.Prisma.DeliveryZoneScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  profileId: 'profileId',
  name: 'name',
  states: 'states',
  cities: 'cities',
  feeType: 'feeType',
  feeAmount: 'feeAmount',
  freeOverAmount: 'freeOverAmount',
  etaMinDays: 'etaMinDays',
  etaMaxDays: 'etaMaxDays',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeviceRegistrationScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  userId: 'userId',
  customerId: 'customerId',
  deviceType: 'deviceType',
  pushToken: 'pushToken',
  status: 'status',
  lastSeenAt: 'lastSeenAt',
  createdAt: 'createdAt'
};

exports.Prisma.DiscountRedemptionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  ruleId: 'ruleId',
  couponId: 'couponId',
  orderId: 'orderId',
  customerId: 'customerId',
  amountDiscounted: 'amountDiscounted',
  redeemedAt: 'redeemedAt'
};

exports.Prisma.DiscountRuleScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  type: 'type',
  valueAmount: 'valueAmount',
  valuePercent: 'valuePercent',
  appliesTo: 'appliesTo',
  productIds: 'productIds',
  collectionIds: 'collectionIds',
  minOrderAmount: 'minOrderAmount',
  maxDiscountAmount: 'maxDiscountAmount',
  currency: 'currency',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  usageLimitTotal: 'usageLimitTotal',
  usageLimitPerCustomer: 'usageLimitPerCustomer',
  requiresCoupon: 'requiresCoupon',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DispatchJobScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  shipmentId: 'shipmentId',
  carrier: 'carrier',
  providerJobId: 'providerJobId',
  status: 'status',
  assignedRiderName: 'assignedRiderName',
  assignedRiderPhone: 'assignedRiderPhone',
  vehicleType: 'vehicleType',
  pickupEta: 'pickupEta',
  deliveryEta: 'deliveryEta',
  podType: 'podType',
  podData: 'podData',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DisputeScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  storeId: 'storeId',
  provider: 'provider',
  providerDisputeId: 'providerDisputeId',
  paymentId: 'paymentId',
  orderId: 'orderId',
  customerId: 'customerId',
  amount: 'amount',
  currency: 'currency',
  reasonCode: 'reasonCode',
  status: 'status',
  evidenceDueAt: 'evidenceDueAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DisputeEvidenceScalarFieldEnum = {
  id: 'id',
  disputeId: 'disputeId',
  type: 'type',
  s3Key: 's3Key',
  url: 'url',
  textExcerpt: 'textExcerpt',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.DisputeTimelineEventScalarFieldEnum = {
  id: 'id',
  disputeId: 'disputeId',
  eventType: 'eventType',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.EnforcementActionScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  actorType: 'actorType',
  action: 'action',
  scope: 'scope',
  scopeId: 'scopeId',
  reason: 'reason',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.EvidenceAssetScalarFieldEnum = {
  id: 'id',
  bundleId: 'bundleId',
  type: 'type',
  s3Key: 's3Key',
  url: 'url',
  redactionLevel: 'redactionLevel',
  createdAt: 'createdAt'
};

exports.Prisma.EvidenceBundleScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  scope: 'scope',
  scopeId: 'scopeId',
  generatedBy: 'generatedBy',
  status: 'status',
  summary: 'summary',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  disputeId: 'disputeId',
  returnRequestId: 'returnRequestId'
};

exports.Prisma.GoLiveChecklistItemScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  title: 'title',
  description: 'description',
  category: 'category',
  status: 'status',
  blockerReason: 'blockerReason',
  updatedAt: 'updatedAt'
};

exports.Prisma.GoalScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  metricKey: 'metricKey',
  period: 'period',
  targetValue: 'targetValue',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HealthScoreScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  score: 'score',
  components: 'components',
  createdAt: 'createdAt'
};

exports.Prisma.IdempotencyKeyV2ScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  scope: 'scope',
  key: 'key',
  status: 'status',
  responseHash: 'responseHash',
  responseJson: 'responseJson',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InventoryEventScalarFieldEnum = {
  id: 'id',
  variantId: 'variantId',
  action: 'action',
  quantity: 'quantity',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  locationId: 'locationId',
  variantId: 'variantId',
  productId: 'productId',
  onHand: 'onHand',
  reserved: 'reserved',
  available: 'available',
  reorderPoint: 'reorderPoint',
  updatedAt: 'updatedAt',
  merchantId: 'merchantId'
};

exports.Prisma.InventoryLocationScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InventoryMovementScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  locationId: 'locationId',
  variantId: 'variantId',
  userId: 'userId',
  type: 'type',
  quantity: 'quantity',
  reason: 'reason',
  referenceId: 'referenceId',
  createdAt: 'createdAt'
};

exports.Prisma.InvoiceLineV2ScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  description: 'description',
  quantity: 'quantity',
  unitAmount: 'unitAmount',
  amount: 'amount',
  metadata: 'metadata'
};

exports.Prisma.InvoiceV2ScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  customerId: 'customerId',
  invoiceNumber: 'invoiceNumber',
  status: 'status',
  subtotalKobo: 'subtotalKobo',
  taxKobo: 'taxKobo',
  totalKobo: 'totalKobo',
  dueDate: 'dueDate',
  items: 'items',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  subscriptionId: 'subscriptionId'
};

exports.Prisma.JobRunScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  jobName: 'jobName',
  correlationId: 'correlationId',
  attempt: 'attempt',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  duration: 'duration',
  errorType: 'errorType',
  errorMessage: 'errorMessage',
  metadata: 'metadata'
};

exports.Prisma.KnowledgeBaseEntryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  content: 'content',
  embedding: 'embedding',
  sourceType: 'sourceType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.KycRecordScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  ninLast4: 'ninLast4',
  bvnLast4: 'bvnLast4',
  fullNinEncrypted: 'fullNinEncrypted',
  fullBvnEncrypted: 'fullBvnEncrypted',
  cacNumberEncrypted: 'cacNumberEncrypted',
  status: 'status',
  submittedAt: 'submittedAt',
  reviewedAt: 'reviewedAt',
  reviewedBy: 'reviewedBy',
  rejectionReason: 'rejectionReason',
  notes: 'notes',
  audit: 'audit',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LedgerEntryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  referenceType: 'referenceType',
  referenceId: 'referenceId',
  direction: 'direction',
  account: 'account',
  amount: 'amount',
  currency: 'currency',
  description: 'description',
  occurredAt: 'occurredAt',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.LedgerAccountScalarFieldEnum = {
  id: 'id',
  ownerId: 'ownerId',
  type: 'type',
  currency: 'currency',
  balance: 'balance',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LedgerTransactionScalarFieldEnum = {
  id: 'id',
  accountId: 'accountId',
  amount: 'amount',
  type: 'type',
  referenceId: 'referenceId',
  balanceBefore: 'balanceBefore',
  balanceAfter: 'balanceAfter',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.LegalAcceptanceScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  userId: 'userId',
  key: 'key',
  version: 'version',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  acceptedAt: 'acceptedAt'
};

exports.Prisma.LegalTemplateScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  title: 'title',
  content: 'content',
  version: 'version',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MarketplaceListingScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  status: 'status',
  category: 'category',
  rankScore: 'rankScore',
  moderationNote: 'moderationNote',
  moderatedBy: 'moderatedBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MediaAssetScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  messageId: 'messageId',
  contentType: 'contentType',
  filename: 'filename',
  sizeBytes: 'sizeBytes',
  s3Key: 's3Key',
  sha256: 'sha256',
  createdAt: 'createdAt'
};

exports.Prisma.MembershipScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  storeId: 'storeId',
  roleName: 'roleName',
  status: 'status',
  roleId: 'roleId',
  role_enum: 'role_enum',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantFeatureOverrideScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  value: 'value',
  reason: 'reason',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantFlagScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  severity: 'severity',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantOnboardingScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  status: 'status',
  currentStepKey: 'currentStepKey',
  completedSteps: 'completedSteps',
  data: 'data',
  setupPath: 'setupPath',
  hasDelivery: 'hasDelivery',
  payments: 'payments',
  storeName: 'storeName',
  location: 'location',
  completedAt: 'completedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OnboardingAnalyticsEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  sessionId: 'sessionId',
  eventName: 'eventName',
  templateSlug: 'templateSlug',
  plan: 'plan',
  entryPoint: 'entryPoint',
  step: 'step',
  fastPath: 'fastPath',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.MerchantPolicyScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  storeId: 'storeId',
  storeSlug: 'storeSlug',
  type: 'type',
  title: 'title',
  contentMd: 'contentMd',
  contentHtml: 'contentHtml',
  status: 'status',
  publishedVersion: 'publishedVersion',
  publishedAt: 'publishedAt',
  lastUpdatedLabel: 'lastUpdatedLabel',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  device: 'device',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  sudoExpiresAt: 'sudoExpiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.MerchantThemeScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  templateId: 'templateId',
  templateVersionId: 'templateVersionId',
  status: 'status',
  config: 'config',
  publishedAt: 'publishedAt',
  appliedAt: 'appliedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MerchantThemeHistoryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  themeId: 'themeId',
  templateId: 'templateId',
  templateVersionId: 'templateVersionId',
  configSnapshot: 'configSnapshot',
  changedByUserId: 'changedByUserId',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  direction: 'direction',
  type: 'type',
  providerMessageId: 'providerMessageId',
  textBody: 'textBody',
  mediaId: 'mediaId',
  status: 'status',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  sentAt: 'sentAt',
  receivedAt: 'receivedAt',
  createdAt: 'createdAt'
};

exports.Prisma.MigrationRunScalarFieldEnum = {
  id: 'id',
  key: 'key',
  description: 'description',
  status: 'status',
  progress: 'progress',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  lastError: 'lastError',
  metadata: 'metadata'
};

exports.Prisma.NotificationOutboxScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  channel: 'channel',
  templateKey: 'templateKey',
  to: 'to',
  payload: 'payload',
  status: 'status',
  providerMessageId: 'providerMessageId',
  errorCode: 'errorCode',
  errorMessage: 'errorMessage',
  recipientId: 'recipientId',
  orderId: 'orderId',
  ticketId: 'ticketId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationTemplateScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  channel: 'channel',
  key: 'key',
  name: 'name',
  enabled: 'enabled',
  subject: 'subject',
  body: 'body',
  variables: 'variables',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OnboardingFlowScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  status: 'status',
  currentStepKey: 'currentStepKey',
  completedSteps: 'completedSteps',
  skippedSteps: 'skippedSteps',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OpsSessionScalarFieldEnum = {
  id: 'id',
  opsUserId: 'opsUserId',
  token: 'token',
  device: 'device',
  ipAddress: 'ipAddress',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.OpsUserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  mfaSecret: 'mfaSecret',
  isMfaEnabled: 'isMfaEnabled',
  isActive: 'isActive',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  refCode: 'refCode',
  storeId: 'storeId',
  customerId: 'customerId',
  customerEmail: 'customerEmail',
  customerPhone: 'customerPhone',
  orderNumber: 'orderNumber',
  source: 'source',
  status: 'status',
  paymentStatus: 'paymentStatus',
  fulfillmentStatus: 'fulfillmentStatus',
  deliveryMethod: 'deliveryMethod',
  deliveryFee: 'deliveryFee',
  paymentMethod: 'paymentMethod',
  internalNote: 'internalNote',
  customerNote: 'customerNote',
  currency: 'currency',
  subtotal: 'subtotal',
  tax: 'tax',
  shippingTotal: 'shippingTotal',
  discountTotal: 'discountTotal',
  total: 'total',
  channel: 'channel',
  metadata: 'metadata',
  parentOrderId: 'parentOrderId',
  riskLevel: 'riskLevel',
  isHeld: 'isHeld',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  importStatus: 'importStatus'
};

exports.Prisma.OrderDiscountScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  ruleId: 'ruleId',
  couponCode: 'couponCode',
  discountAmount: 'discountAmount',
  shippingDiscountAmount: 'shippingDiscountAmount',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.OrderEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  type: 'type',
  message: 'message',
  metadata: 'metadata',
  createdBy: 'createdBy',
  createdAt: 'createdAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  variantId: 'variantId',
  title: 'title',
  sku: 'sku',
  price: 'price',
  quantity: 'quantity',
  fulfillmentGroupId: 'fulfillmentGroupId'
};

exports.Prisma.FulfillmentGroupScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  storeId: 'storeId',
  status: 'status',
  deliveryMethod: 'deliveryMethod',
  deliveryFee: 'deliveryFee',
  total: 'total',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderTimelineEventScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  title: 'title',
  body: 'body',
  createdAt: 'createdAt'
};

exports.Prisma.OtpCodeScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  code: 'code',
  type: 'type',
  expiresAt: 'expiresAt',
  isUsed: 'isUsed',
  createdAt: 'createdAt'
};

exports.Prisma.OutboxEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  payload: 'payload',
  status: 'status',
  nextRetryAt: 'nextRetryAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentAccountScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  status: 'status',
  defaultCurrency: 'defaultCurrency',
  capabilities: 'capabilities',
  webhookSecretEnc: 'webhookSecretEnc',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentCustomerScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  contactId: 'contactId',
  provider: 'provider',
  providerCustomerId: 'providerCustomerId',
  email: 'email',
  phoneE164: 'phoneE164',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentIntentScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  provider: 'provider',
  providerPaymentIntentId: 'providerPaymentIntentId',
  status: 'status',
  amount: 'amount',
  currency: 'currency',
  clientSecretHash: 'clientSecretHash',
  description: 'description',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentTransactionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  reference: 'reference',
  provider: 'provider',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  type: 'type',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentWebhookEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  provider: 'provider',
  providerEventId: 'providerEventId',
  eventType: 'eventType',
  payload: 'payload',
  status: 'status',
  error: 'error',
  receivedAt: 'receivedAt',
  processedAt: 'processedAt'
};

exports.Prisma.StoreCounterScalarFieldEnum = {
  storeId: 'storeId',
  orderSeq: 'orderSeq'
};

exports.Prisma.PayoutScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  provider: 'provider',
  providerPayoutId: 'providerPayoutId',
  status: 'status',
  amount: 'amount',
  currency: 'currency',
  arrivalDate: 'arrivalDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  reference: 'reference',
  destination: 'destination'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  key: 'key',
  description: 'description',
  group: 'group'
};

exports.Prisma.PlanScalarFieldEnum = {
  id: 'id',
  key: 'key',
  name: 'name',
  description: 'description',
  currency: 'currency',
  priceMonthly: 'priceMonthly',
  priceYearly: 'priceYearly',
  features: 'features',
  limits: 'limits',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PlatformKillSwitchScalarFieldEnum = {
  id: 'id',
  key: 'key',
  enabled: 'enabled',
  config: 'config',
  reason: 'reason',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  title: 'title',
  description: 'description',
  handle: 'handle',
  status: 'status',
  productType: 'productType',
  brand: 'brand',
  tags: 'tags',
  price: 'price',
  compareAtPrice: 'compareAtPrice',
  costPrice: 'costPrice',
  sku: 'sku',
  barcode: 'barcode',
  trackInventory: 'trackInventory',
  allowBackorder: 'allowBackorder',
  weight: 'weight',
  width: 'width',
  height: 'height',
  depth: 'depth',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  metadata: 'metadata',
  condition: 'condition',
  warrantyMonths: 'warrantyMonths',
  techSpecs: 'techSpecs',
  moq: 'moq',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  externalRef: 'externalRef'
};

exports.Prisma.PricingTierScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  minQty: 'minQty',
  unitPrice: 'unitPrice'
};

exports.Prisma.ProductImageScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  url: 'url',
  altText: 'altText',
  width: 'width',
  height: 'height',
  s3Key: 's3Key',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  title: 'title',
  options: 'options',
  sku: 'sku',
  barcode: 'barcode',
  price: 'price',
  compareAtPrice: 'compareAtPrice',
  costPrice: 'costPrice',
  trackInventory: 'trackInventory',
  allowBackorder: 'allowBackorder',
  weight: 'weight',
  position: 'position',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  imageId: 'imageId'
};

exports.Prisma.ReceiptScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  url: 'url',
  createdAt: 'createdAt'
};

exports.Prisma.RefundScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  chargeId: 'chargeId',
  provider: 'provider',
  providerRefundId: 'providerRefundId',
  status: 'status',
  amount: 'amount',
  currency: 'currency',
  reason: 'reason',
  requestedBy: 'requestedBy',
  approvedBy: 'approvedBy',
  approvedAt: 'approvedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  approvalRequestId: 'approvalRequestId'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  reporterIp: 'reporterIp',
  reporterCustomerId: 'reporterCustomerId',
  reason: 'reason',
  details: 'details',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReturnItemScalarFieldEnum = {
  id: 'id',
  returnRequestId: 'returnRequestId',
  orderItemId: 'orderItemId',
  qty: 'qty',
  conditionReceived: 'conditionReceived',
  restockAction: 'restockAction',
  createdAt: 'createdAt'
};

exports.Prisma.ReturnLogisticsScalarFieldEnum = {
  id: 'id',
  returnRequestId: 'returnRequestId',
  method: 'method',
  pickupAddress: 'pickupAddress',
  dropoffInstructions: 'dropoffInstructions',
  carrierJobId: 'carrierJobId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReturnRequestScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  orderId: 'orderId',
  customerId: 'customerId',
  status: 'status',
  reasonCode: 'reasonCode',
  reasonText: 'reasonText',
  resolutionType: 'resolutionType',
  requestedAt: 'requestedAt',
  approvedAt: 'approvedAt',
  completedAt: 'completedAt',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  storeProfileId: 'storeProfileId',
  productId: 'productId',
  orderId: 'orderId',
  customerId: 'customerId',
  rating: 'rating',
  title: 'title',
  body: 'body',
  status: 'status',
  isVerifiedPurchase: 'isVerifiedPurchase',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewMediaScalarFieldEnum = {
  id: 'id',
  reviewId: 'reviewId',
  s3Key: 's3Key',
  url: 'url',
  createdAt: 'createdAt'
};

exports.Prisma.RiskProfileScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  merchantRiskScore: 'merchantRiskScore',
  status: 'status',
  lastEvaluatedAt: 'lastEvaluatedAt',
  metadata: 'metadata',
  updatedAt: 'updatedAt'
};

exports.Prisma.RiskSignalScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  scope: 'scope',
  scopeId: 'scopeId',
  key: 'key',
  severity: 'severity',
  scoreDelta: 'scoreDelta',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  description: 'description',
  isSystem: 'isSystem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  permissionId: 'permissionId'
};

exports.Prisma.SecuritySettingScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  mfaRequired: 'mfaRequired',
  sessionTimeoutMinutes: 'sessionTimeoutMinutes',
  allowedIpRanges: 'allowedIpRanges',
  updatedAt: 'updatedAt'
};

exports.Prisma.SegmentScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  definition: 'definition',
  estimatedSize: 'estimatedSize',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoreScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logoUrl: 'logoUrl',
  onboardingStatus: 'onboardingStatus',
  onboardingLastStep: 'onboardingLastStep',
  onboardingUpdatedAt: 'onboardingUpdatedAt',
  onboardingCompleted: 'onboardingCompleted',
  plan: 'plan',
  category: 'category',
  contacts: 'contacts',
  settings: 'settings',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tenantId: 'tenantId',
  isLive: 'isLive',
  payoutsEnabled: 'payoutsEnabled',
  walletPin: 'walletPin',
  type: 'type',
  lastSyncAt: 'lastSyncAt',
  performanceMetrics: 'performanceMetrics',
  verificationLevel: 'verificationLevel',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  seoKeywords: 'seoKeywords',
  socialImage: 'socialImage',
  aiConsentGivenAt: 'aiConsentGivenAt',
  aiConsentRevokedAt: 'aiConsentRevokedAt',
  aiConsentVersion: 'aiConsentVersion',
  aiAgencyStatus: 'aiAgencyStatus',
  kycStatus: 'kycStatus',
  industrySlug: 'industrySlug',
  tier: 'tier',
  isActive: 'isActive',
  version: 'version'
};

exports.Prisma.FlashSaleScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  startTime: 'startTime',
  endTime: 'endTime',
  isActive: 'isActive',
  discount: 'discount',
  targetType: 'targetType',
  targetId: 'targetId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoreDeliverySettingsScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  provider: 'provider',
  isEnabled: 'isEnabled',
  autoDispatchEnabled: 'autoDispatchEnabled',
  autoDispatchMode: 'autoDispatchMode',
  autoDispatchWhatsapp: 'autoDispatchWhatsapp',
  autoDispatchStorefront: 'autoDispatchStorefront',
  pickupName: 'pickupName',
  pickupPhone: 'pickupPhone',
  pickupAddressLine1: 'pickupAddressLine1',
  pickupAddressLine2: 'pickupAddressLine2',
  pickupCity: 'pickupCity',
  pickupState: 'pickupState',
  pickupLandmark: 'pickupLandmark',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShipmentScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  orderId: 'orderId',
  deliveryOptionType: 'deliveryOptionType',
  status: 'status',
  provider: 'provider',
  externalId: 'externalId',
  trackingCode: 'trackingCode',
  trackingUrl: 'trackingUrl',
  providerRawStatus: 'providerRawStatus',
  courierName: 'courierName',
  courierPhone: 'courierPhone',
  notes: 'notes',
  cost: 'cost',
  recipientName: 'recipientName',
  recipientPhone: 'recipientPhone',
  addressLine1: 'addressLine1',
  addressCity: 'addressCity',
  addressState: 'addressState',
  deliveryFee: 'deliveryFee',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DeliveryEventScalarFieldEnum = {
  id: 'id',
  shipmentId: 'shipmentId',
  status: 'status',
  providerStatus: 'providerStatus',
  note: 'note',
  createdAt: 'createdAt'
};

exports.Prisma.StaffInviteScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  email: 'email',
  phone: 'phone',
  role: 'role',
  token: 'token',
  createdBy: 'createdBy',
  expiresAt: 'expiresAt',
  acceptedAt: 'acceptedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoreProfileScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  slug: 'slug',
  displayName: 'displayName',
  bio: 'bio',
  logoUrl: 'logoUrl',
  bannerUrl: 'bannerUrl',
  state: 'state',
  city: 'city',
  lga: 'lga',
  categories: 'categories',
  whatsappNumberE164: 'whatsappNumberE164',
  websiteUrl: 'websiteUrl',
  isDirectoryListed: 'isDirectoryListed',
  isMarketplaceListed: 'isMarketplaceListed',
  pickupAvailable: 'pickupAvailable',
  pickupAddress: 'pickupAddress',
  deliveryMethods: 'deliveryMethods',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StorefrontSettingsScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  slug: 'slug',
  isLive: 'isLive',
  themeKey: 'themeKey',
  accentColor: 'accentColor',
  logoS3Key: 'logoS3Key',
  bannerS3Key: 'bannerS3Key',
  socialLinks: 'socialLinks',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  planKey: 'planKey',
  status: 'status',
  provider: 'provider',
  providerSubscriptionId: 'providerSubscriptionId',
  currentPeriodStart: 'currentPeriodStart',
  currentPeriodEnd: 'currentPeriodEnd',
  cancelAtPeriodEnd: 'cancelAtPeriodEnd',
  trialEndsAt: 'trialEndsAt',
  gracePeriodEndsAt: 'gracePeriodEndsAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportCaseScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  createdByAdminId: 'createdByAdminId',
  category: 'category',
  summary: 'summary',
  status: 'status',
  links: 'links',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemplateScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  description: 'description',
  category: 'category',
  tags: 'tags',
  licenseKey: 'licenseKey',
  licenseName: 'licenseName',
  repoUrl: 'repoUrl',
  homepageUrl: 'homepageUrl',
  stars: 'stars',
  isActive: 'isActive',
  isFeatured: 'isFeatured',
  isFree: 'isFree',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemplateAssetScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  type: 'type',
  storageKey: 'storageKey',
  publicUrl: 'publicUrl',
  createdAt: 'createdAt'
};

exports.Prisma.TemplateSourceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  provider: 'provider',
  queryText: 'queryText',
  enabled: 'enabled',
  allowLicenses: 'allowLicenses',
  minStars: 'minStars',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TemplateSyncRunScalarFieldEnum = {
  id: 'id',
  sourceId: 'sourceId',
  status: 'status',
  importedCount: 'importedCount',
  rejectedCount: 'rejectedCount',
  errorText: 'errorText',
  startedAt: 'startedAt',
  finishedAt: 'finishedAt'
};

exports.Prisma.TemplateVersionScalarFieldEnum = {
  id: 'id',
  templateId: 'templateId',
  version: 'version',
  commitSha: 'commitSha',
  packStorageKey: 'packStorageKey',
  createdAt: 'createdAt'
};

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TenantMembershipScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  userId: 'userId',
  role: 'role'
};

exports.Prisma.TrackingEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  shipmentId: 'shipmentId',
  dispatchJobId: 'dispatchJobId',
  status: 'status',
  description: 'description',
  locationText: 'locationText',
  occurredAt: 'occurredAt',
  raw: 'raw',
  createdAt: 'createdAt'
};

exports.Prisma.TrustBadgeSnapshotScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  date: 'date',
  badges: 'badges',
  metrics: 'metrics',
  createdAt: 'createdAt'
};

exports.Prisma.UsageCounterScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  key: 'key',
  periodStart: 'periodStart',
  periodEnd: 'periodEnd',
  used: 'used',
  limit: 'limit',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  avatarUrl: 'avatarUrl',
  isEmailVerified: 'isEmailVerified',
  isPhoneVerified: 'isPhoneVerified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  kycStatus: 'kycStatus',
  pinHash: 'pinHash',
  pinSet: 'pinSet',
  isLocked: 'isLocked',
  failedPinAttempts: 'failedPinAttempts',
  lockedUntil: 'lockedUntil',
  availableKobo: 'availableKobo',
  pendingKobo: 'pendingKobo',
  vaStatus: 'vaStatus',
  vaBankName: 'vaBankName',
  vaAccountNumber: 'vaAccountNumber',
  vaAccountName: 'vaAccountName',
  vaProviderRef: 'vaProviderRef',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  twoFactorSecret: 'twoFactorSecret',
  twoFactorEnabled: 'twoFactorEnabled',
  twoFactorBackupCodes: 'twoFactorBackupCodes',
  pinVersion: 'pinVersion'
};

exports.Prisma.WebhookDeliveryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  endpointId: 'endpointId',
  eventId: 'eventId',
  eventType: 'eventType',
  attempt: 'attempt',
  status: 'status',
  responseCode: 'responseCode',
  responseBodySnippet: 'responseBodySnippet',
  nextRetryAt: 'nextRetryAt',
  deliveredAt: 'deliveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookEndpointScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  url: 'url',
  status: 'status',
  secretEnc: 'secretEnc',
  subscribedEvents: 'subscribedEvents',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WebhookEventV2ScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.WhatsappChannelScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  provider: 'provider',
  wabaId: 'wabaId',
  phoneNumberId: 'phoneNumberId',
  displayPhoneNumber: 'displayPhoneNumber',
  businessName: 'businessName',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhatsappCredentialScalarFieldEnum = {
  id: 'id',
  channelId: 'channelId',
  encryptedToken: 'encryptedToken',
  tokenExpiresAt: 'tokenExpiresAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WhatsappTemplateScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  name: 'name',
  language: 'language',
  category: 'category',
  status: 'status',
  components: 'components',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WithdrawalScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  requestedByUserId: 'requestedByUserId',
  amountKobo: 'amountKobo',
  feeKobo: 'feeKobo',
  amountNetKobo: 'amountNetKobo',
  feePercent: 'feePercent',
  bankAccountId: 'bankAccountId',
  status: 'status',
  referenceCode: 'referenceCode',
  otpCode: 'otpCode',
  otpExpiresAt: 'otpExpiresAt',
  providerRef: 'providerRef',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  lockedAt: 'lockedAt',
  lockedBy: 'lockedBy'
};

exports.Prisma.ApprovalExecutionLogScalarFieldEnum = {
  id: 'id',
  approvalRequestId: 'approvalRequestId',
  status: 'status',
  output: 'output',
  error: 'error',
  startedAt: 'startedAt',
  finishedAt: 'finishedAt'
};

exports.Prisma.ApprovalScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  storeId: 'storeId',
  requestedByUserId: 'requestedByUserId',
  requestedByLabel: 'requestedByLabel',
  actionType: 'actionType',
  type: 'type',
  summary: 'summary',
  entityType: 'entityType',
  entityId: 'entityId',
  payload: 'payload',
  data: 'data',
  status: 'status',
  actionBy: 'actionBy',
  reason: 'reason',
  decisionReason: 'decisionReason',
  decidedByUserId: 'decidedByUserId',
  decidedByLabel: 'decidedByLabel',
  decidedAt: 'decidedAt',
  executionId: 'executionId',
  correlationId: 'correlationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RateLimitScalarFieldEnum = {
  key: 'key',
  points: 'points',
  expireAt: 'expireAt'
};

exports.Prisma.ExportJobScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  userId: 'userId',
  type: 'type',
  filters: 'filters',
  status: 'status',
  expiresAt: 'expiresAt',
  downloadedAt: 'downloadedAt',
  createdAt: 'createdAt',
  lockedAt: 'lockedAt',
  lockedBy: 'lockedBy'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  actorType: 'actorType',
  actorId: 'actorId',
  actorLabel: 'actorLabel',
  action: 'action',
  entityType: 'entityType',
  entityId: 'entityId',
  beforeState: 'beforeState',
  afterState: 'afterState',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  correlationId: 'correlationId',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsEventScalarFieldEnum = {
  id: 'id',
  category: 'category',
  action: 'action',
  label: 'label',
  value: 'value',
  metadata: 'metadata',
  userId: 'userId',
  storeId: 'storeId',
  anonymousId: 'anonymousId',
  userAgent: 'userAgent',
  path: 'path',
  ip: 'ip',
  timestamp: 'timestamp'
};

exports.Prisma.ApiErrorScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  routeKey: 'routeKey',
  statusCode: 'statusCode',
  createdAt: 'createdAt'
};

exports.Prisma.IntegrationEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  integrationKey: 'integrationKey',
  eventType: 'eventType',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.BackupReceiptScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  backupType: 'backupType',
  backupId: 'backupId',
  status: 'status',
  createdAt: 'createdAt',
  meta: 'meta'
};

exports.Prisma.DisputeSubmissionScalarFieldEnum = {
  id: 'id',
  disputeId: 'disputeId',
  submittedBy: 'submittedBy',
  submittedAt: 'submittedAt',
  providerReference: 'providerReference',
  notes: 'notes'
};

exports.Prisma.DomainMappingScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  domain: 'domain',
  status: 'status',
  verificationToken: 'verificationToken',
  provider: 'provider',
  createdAt: 'createdAt'
};

exports.Prisma.DunningAttemptScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  subscriptionId: 'subscriptionId',
  attemptNumber: 'attemptNumber',
  status: 'status',
  nextAttemptAt: 'nextAttemptAt',
  lastError: 'lastError',
  createdAt: 'createdAt'
};

exports.Prisma.FeatureFlagScalarFieldEnum = {
  id: 'id',
  key: 'key',
  description: 'description',
  enabled: 'enabled',
  rules: 'rules',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ImportJobScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  type: 'type',
  status: 'status',
  originalFilename: 'originalFilename',
  fileUrl: 'fileUrl',
  checksum: 'checksum',
  totalRows: 'totalRows',
  validRows: 'validRows',
  invalidRows: 'invalidRows',
  processedRows: 'processedRows',
  errorReportUrl: 'errorReportUrl',
  summary: 'summary',
  mappings: 'mappings',
  correlationId: 'correlationId',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InternalNoteScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  conversationId: 'conversationId',
  authorId: 'authorId',
  note: 'note',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  userId: 'userId',
  type: 'type',
  title: 'title',
  body: 'body',
  severity: 'severity',
  actionUrl: 'actionUrl',
  entityType: 'entityType',
  entityId: 'entityId',
  metadata: 'metadata',
  category: 'category',
  channels: 'channels',
  dedupeKey: 'dedupeKey',
  isRead: 'isRead',
  readAt: 'readAt',
  resolvedAt: 'resolvedAt',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationPreferenceScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  channels: 'channels',
  categories: 'categories',
  quietHours: 'quietHours',
  isMuted: 'isMuted',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationLogScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  type: 'type',
  channel: 'channel',
  status: 'status',
  providerRef: 'providerRef',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.PartnerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  status: 'status',
  payoutMethod: 'payoutMethod',
  createdAt: 'createdAt'
};

exports.Prisma.PartnerPayoutLedgerScalarFieldEnum = {
  id: 'id',
  partnerId: 'partnerId',
  merchantId: 'merchantId',
  amountNgn: 'amountNgn',
  reason: 'reason',
  status: 'status',
  createdAt: 'createdAt',
  paidAt: 'paidAt'
};

exports.Prisma.PartnerReferralCodeScalarFieldEnum = {
  id: 'id',
  partnerId: 'partnerId',
  code: 'code',
  codeHash: 'codeHash',
  createdAt: 'createdAt'
};

exports.Prisma.PublishHistoryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  action: 'action',
  actorType: 'actorType',
  actorId: 'actorId',
  actorLabel: 'actorLabel',
  correlationId: 'correlationId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.ReferralAttributionScalarFieldEnum = {
  id: 'id',
  partnerId: 'partnerId',
  merchantId: 'merchantId',
  referralCode: 'referralCode',
  firstSeenAt: 'firstSeenAt',
  signupCompletedAt: 'signupCompletedAt',
  storeLiveAt: 'storeLiveAt',
  firstPaymentAt: 'firstPaymentAt',
  metadata: 'metadata'
};

exports.Prisma.StatusIncidentScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  impact: 'impact',
  startedAt: 'startedAt',
  resolvedAt: 'resolvedAt',
  links: 'links',
  autoGenerated: 'autoGenerated',
  createdAt: 'createdAt'
};

exports.Prisma.StoreTemplateSelectionScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  templateId: 'templateId',
  version: 'version',
  config: 'config',
  previousTemplateId: 'previousTemplateId',
  previousVersion: 'previousVersion',
  previousConfig: 'previousConfig',
  appliedAt: 'appliedAt',
  appliedBy: 'appliedBy'
};

exports.Prisma.SupportTicketScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  customerId: 'customerId',
  orderId: 'orderId',
  conversationId: 'conversationId',
  type: 'type',
  category: 'category',
  status: 'status',
  priority: 'priority',
  subject: 'subject',
  description: 'description',
  summary: 'summary',
  assignedToUserId: 'assignedToUserId',
  lastMessageAt: 'lastMessageAt',
  slaDueAt: 'slaDueAt',
  firstOpsReplyAt: 'firstOpsReplyAt',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SupportTicketFeedbackScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.SupportBotFeedbackScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  messageId: 'messageId',
  rating: 'rating',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.SupportTelemetryEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  eventType: 'eventType',
  messageId: 'messageId',
  ticketId: 'ticketId',
  payload: 'payload',
  createdAt: 'createdAt'
};

exports.Prisma.TemplateManifestScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  version: 'version',
  author: 'author',
  source: 'source',
  homepageUrl: 'homepageUrl',
  previewImageUrl: 'previewImageUrl',
  tags: 'tags',
  supportedPages: 'supportedPages',
  configSchema: 'configSchema',
  isArchived: 'isArchived',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StorefrontDraftScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  activeTemplateId: 'activeTemplateId',
  themeConfig: 'themeConfig',
  sectionOrder: 'sectionOrder',
  sectionConfig: 'sectionConfig',
  assets: 'assets',
  updatedAt: 'updatedAt',
  publishedAt: 'publishedAt'
};

exports.Prisma.StorefrontPublishedScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  activeTemplateId: 'activeTemplateId',
  themeConfig: 'themeConfig',
  sectionConfig: 'sectionConfig',
  assets: 'assets',
  publishedAt: 'publishedAt'
};

exports.Prisma.TicketMessageScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  storeId: 'storeId',
  sender: 'sender',
  senderId: 'senderId',
  authorType: 'authorType',
  authorId: 'authorId',
  authorName: 'authorName',
  message: 'message',
  attachments: 'attachments',
  createdAt: 'createdAt'
};

exports.Prisma.HandoffEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  ticketId: 'ticketId',
  triggerType: 'triggerType',
  aiSummary: 'aiSummary',
  recommendedSteps: 'recommendedSteps',
  createdAt: 'createdAt'
};

exports.Prisma.SupportSlaPolicyScalarFieldEnum = {
  id: 'id',
  plan: 'plan',
  category: 'category',
  responseTimeMinutes: 'responseTimeMinutes',
  resolutionTimeMinutes: 'resolutionTimeMinutes',
  createdAt: 'createdAt'
};

exports.Prisma.UptimeCheckScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  method: 'method',
  expectedStatus: 'expectedStatus',
  timeoutMs: 'timeoutMs',
  enabled: 'enabled',
  createdAt: 'createdAt'
};

exports.Prisma.UserSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  sessionTokenHash: 'sessionTokenHash',
  device: 'device',
  location: 'location',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  lastSeenAt: 'lastSeenAt',
  revokedAt: 'revokedAt',
  createdAt: 'createdAt'
};

exports.Prisma.WebhookEventScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  provider: 'provider',
  eventId: 'eventId',
  eventType: 'eventType',
  payload: 'payload',
  status: 'status',
  error: 'error',
  receivedAt: 'receivedAt',
  processedAt: 'processedAt'
};

exports.Prisma.WebhookSubscriptionScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  name: 'name',
  url: 'url',
  events: 'events',
  signingSecretHash: 'signingSecretHash',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TelemetryEventScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  userId: 'userId',
  eventName: 'eventName',
  properties: 'properties',
  createdAt: 'createdAt'
};

exports.Prisma.AuditEventScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  userId: 'userId',
  eventType: 'eventType',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.OpsAuditEventScalarFieldEnum = {
  id: 'id',
  opsUserId: 'opsUserId',
  eventType: 'eventType',
  metadata: 'metadata',
  rescueIncidentId: 'rescueIncidentId',
  createdAt: 'createdAt'
};

exports.Prisma.DataExportRequestScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  requestedBy: 'requestedBy',
  scopes: 'scopes',
  status: 'status',
  format: 'format',
  createdAt: 'createdAt',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  expiresAt: 'expiresAt',
  errorMessage: 'errorMessage',
  correlationId: 'correlationId'
};

exports.Prisma.DataExportArtifactScalarFieldEnum = {
  id: 'id',
  exportRequestId: 'exportRequestId',
  fileType: 'fileType',
  storageKey: 'storageKey',
  sizeBytes: 'sizeBytes',
  signedUrl: 'signedUrl',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.DataDeletionRequestScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  requestedBy: 'requestedBy',
  reason: 'reason',
  status: 'status',
  scheduledFor: 'scheduledFor',
  completedAt: 'completedAt',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.AiTraceScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  requestId: 'requestId',
  model: 'model',
  toolsUsed: 'toolsUsed',
  retrievedDocs: 'retrievedDocs',
  inputSummary: 'inputSummary',
  outputSummary: 'outputSummary',
  guardrailFlags: 'guardrailFlags',
  latencyMs: 'latencyMs',
  createdAt: 'createdAt'
};

exports.Prisma.ProviderPricingScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  effectiveFrom: 'effectiveFrom',
  inputCostPer1K: 'inputCostPer1K',
  outputCostPer1K: 'outputCostPer1K',
  imageCost: 'imageCost',
  currency: 'currency',
  fxRateToNGN: 'fxRateToNGN',
  version: 'version'
};

exports.Prisma.MerchantCostDailyScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  date: 'date',
  estimatedCostKobo: 'estimatedCostKobo',
  estimatedRevKobo: 'estimatedRevKobo',
  marginKobo: 'marginKobo',
  planId: 'planId',
  requestsCount: 'requestsCount'
};

exports.Prisma.PlatformCostDailyScalarFieldEnum = {
  id: 'id',
  date: 'date',
  totalCostKobo: 'totalCostKobo',
  totalRevenueKobo: 'totalRevenueKobo',
  marginKobo: 'marginKobo',
  budgetKobo: 'budgetKobo',
  budgetUsedPercent: 'budgetUsedPercent'
};

exports.Prisma.CostAnomalyEventScalarFieldEnum = {
  id: 'id',
  merchantId: 'merchantId',
  type: 'type',
  severity: 'severity',
  detectedAt: 'detectedAt',
  metricsSnapshot: 'metricsSnapshot',
  actionTaken: 'actionTaken',
  resolvedAt: 'resolvedAt'
};

exports.Prisma.ThrottlePolicyScalarFieldEnum = {
  id: 'id',
  scope: 'scope',
  targetId: 'targetId',
  mode: 'mode',
  rules: 'rules',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  createdBy: 'createdBy',
  reason: 'reason'
};

exports.Prisma.KnowledgeEmbeddingScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  sourceType: 'sourceType',
  sourceId: 'sourceId',
  content: 'content',
  embedding: 'embedding',
  contentHash: 'contentHash',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConversionEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  eventType: 'eventType',
  productId: 'productId',
  valueKobo: 'valueKobo',
  aiAttributionScore: 'aiAttributionScore',
  occurredAt: 'occurredAt'
};

exports.Prisma.PersuasionAttemptScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  strategy: 'strategy',
  evidenceIds: 'evidenceIds',
  confidenceScore: 'confidenceScore',
  outcome: 'outcome',
  occurredAt: 'occurredAt'
};

exports.Prisma.ObjectionEventScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  conversationId: 'conversationId',
  category: 'category',
  rawText: 'rawText',
  resolved: 'resolved',
  resolvedBy: 'resolvedBy',
  occurredAt: 'occurredAt'
};

exports.Prisma.RescueIncidentScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  severity: 'severity',
  surface: 'surface',
  route: 'route',
  storeId: 'storeId',
  userId: 'userId',
  errorType: 'errorType',
  errorMessage: 'errorMessage',
  fingerprint: 'fingerprint',
  status: 'status',
  diagnostics: 'diagnostics'
};

exports.Prisma.RescueFixActionScalarFieldEnum = {
  id: 'id',
  incidentId: 'incidentId',
  createdAt: 'createdAt',
  actionType: 'actionType',
  actionStatus: 'actionStatus',
  summary: 'summary',
  beforeState: 'beforeState',
  afterState: 'afterState',
  performedBy: 'performedBy'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  customerId: 'customerId',
  serviceId: 'serviceId',
  orderId: 'orderId',
  startsAt: 'startsAt',
  endsAt: 'endsAt',
  status: 'status',
  notes: 'notes',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RaffleEntryScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  raffleId: 'raffleId',
  userId: 'userId',
  customerEmail: 'customerEmail',
  status: 'status',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.PortfolioProjectScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  title: 'title',
  slug: 'slug',
  description: 'description',
  images: 'images',
  clientMode: 'clientMode',
  password: 'password',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectCommentScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  imageIndex: 'imageIndex',
  content: 'content',
  author: 'author',
  createdAt: 'createdAt'
};

exports.Prisma.VehicleProductScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  vin: 'vin',
  make: 'make',
  model: 'model',
  year: 'year',
  mileage: 'mileage',
  fuelType: 'fuelType',
  transmission: 'transmission',
  color: 'color',
  bodyType: 'bodyType',
  condition: 'condition'
};

exports.Prisma.AccommodationProductScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  type: 'type',
  maxGuests: 'maxGuests',
  bedCount: 'bedCount',
  bathrooms: 'bathrooms',
  totalUnits: 'totalUnits',
  amenities: 'amenities',
  checkInTime: 'checkInTime',
  checkOutTime: 'checkOutTime'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  storeId: 'storeId',
  title: 'title',
  slug: 'slug',
  excerpt: 'excerpt',
  content: 'content',
  featuredImage: 'featuredImage',
  publishedAt: 'publishedAt',
  status: 'status',
  tags: 'tags',
  metaTitle: 'metaTitle',
  metaDesc: 'metaDesc',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BlogPostProductScalarFieldEnum = {
  postId: 'postId',
  productId: 'productId'
};

exports.Prisma.SourcingRequestScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productName: 'productName',
  description: 'description',
  quantity: 'quantity',
  targetPrice: 'targetPrice',
  referenceUrl: 'referenceUrl',
  images: 'images',
  status: 'status',
  suggestedStoreId: 'suggestedStoreId',
  adminNote: 'adminNote',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MobileAppWaitlistScalarFieldEnum = {
  id: 'id',
  email: 'email',
  source: 'source',
  notified: 'notified',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.DeletionStatus = exports.$Enums.DeletionStatus = {
  SCHEDULED: 'SCHEDULED',
  CANCELED: 'CANCELED',
  EXECUTED: 'EXECUTED'
};

exports.AiActionStatus = exports.$Enums.AiActionStatus = {
  PROPOSED: 'PROPOSED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  RUNNING: 'RUNNING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED'
};

exports.ApiKeyStatus = exports.$Enums.ApiKeyStatus = {
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED'
};

exports.AutomationTrigger = exports.$Enums.AutomationTrigger = {
  ORDER_CREATED: 'ORDER_CREATED',
  ABANDONED_CHECKOUT: 'ABANDONED_CHECKOUT',
  CUSTOMER_CREATED: 'CUSTOMER_CREATED',
  PRODUCT_VIEWED: 'PRODUCT_VIEWED'
};

exports.AutomationAction = exports.$Enums.AutomationAction = {
  SEND_EMAIL: 'SEND_EMAIL',
  SEND_WHATSAPP: 'SEND_WHATSAPP',
  APPLY_DISCOUNT: 'APPLY_DISCOUNT',
  ADD_TO_SEGMENT: 'ADD_TO_SEGMENT'
};

exports.CampaignType = exports.$Enums.CampaignType = {
  BROADCAST: 'BROADCAST',
  AUTOMATION: 'AUTOMATION'
};

exports.CampaignChannel = exports.$Enums.CampaignChannel = {
  WHATSAPP: 'WHATSAPP',
  SMS: 'SMS',
  EMAIL: 'EMAIL'
};

exports.CampaignStatus = exports.$Enums.CampaignStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  SCHEDULED: 'SCHEDULED',
  SENDING: 'SENDING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

exports.CampaignSendStatus = exports.$Enums.CampaignSendStatus = {
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED',
  SKIPPED: 'SKIPPED'
};

exports.Channel = exports.$Enums.Channel = {
  STOREFRONT: 'STOREFRONT',
  MARKETPLACE: 'MARKETPLACE',
  WHATSAPP: 'WHATSAPP'
};

exports.CouponStatus = exports.$Enums.CouponStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
  EXPIRED: 'EXPIRED'
};

exports.DataRequestType = exports.$Enums.DataRequestType = {
  EXPORT: 'EXPORT',
  DELETE: 'DELETE',
  ACCESS: 'ACCESS',
  CORRECTION: 'CORRECTION'
};

exports.DataRequestStatus = exports.$Enums.DataRequestStatus = {
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

exports.DLQStatus = exports.$Enums.DLQStatus = {
  DEAD: 'DEAD',
  REPLAYED: 'REPLAYED',
  IGNORED: 'IGNORED'
};

exports.DeviceType = exports.$Enums.DeviceType = {
  WEB_PUSH: 'WEB_PUSH',
  ANDROID: 'ANDROID',
  IOS: 'IOS'
};

exports.DeviceStatus = exports.$Enums.DeviceStatus = {
  ACTIVE: 'ACTIVE',
  REVOKED: 'REVOKED'
};

exports.DiscountType = exports.$Enums.DiscountType = {
  PERCENT: 'PERCENT',
  AMOUNT: 'AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING'
};

exports.DiscountAppliesTo = exports.$Enums.DiscountAppliesTo = {
  ALL: 'ALL',
  PRODUCTS: 'PRODUCTS',
  COLLECTIONS: 'COLLECTIONS'
};

exports.DisputeProvider = exports.$Enums.DisputeProvider = {
  STRIPE: 'STRIPE',
  PAYSTACK: 'PAYSTACK',
  OTHER: 'OTHER'
};

exports.DisputeStatus = exports.$Enums.DisputeStatus = {
  OPENED: 'OPENED',
  EVIDENCE_REQUIRED: 'EVIDENCE_REQUIRED',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  WON: 'WON',
  LOST: 'LOST',
  CANCELLED: 'CANCELLED'
};

exports.DisputeEvidenceType = exports.$Enums.DisputeEvidenceType = {
  DELIVERY_PROOF: 'DELIVERY_PROOF',
  CHAT_PROOF: 'CHAT_PROOF',
  RECEIPT: 'RECEIPT',
  REFUND_POLICY: 'REFUND_POLICY',
  INVOICE: 'INVOICE',
  OTHER: 'OTHER'
};

exports.EnforcementActionType = exports.$Enums.EnforcementActionType = {
  THROTTLE: 'THROTTLE',
  REQUIRE_MANUAL_APPROVAL: 'REQUIRE_MANUAL_APPROVAL',
  DISABLE_CAMPAIGNS: 'DISABLE_CAMPAIGNS',
  DISABLE_WHATSAPP_SENDING: 'DISABLE_WHATSAPP_SENDING',
  HOLD_REFUNDS: 'HOLD_REFUNDS',
  SUSPEND: 'SUSPEND'
};

exports.EnforcementScope = exports.$Enums.EnforcementScope = {
  MERCHANT: 'MERCHANT',
  ORDER: 'ORDER',
  CAMPAIGN: 'CAMPAIGN',
  CUSTOMER: 'CUSTOMER'
};

exports.EvidenceFileType = exports.$Enums.EvidenceFileType = {
  SCREENSHOT: 'SCREENSHOT',
  PDF: 'PDF',
  IMAGE: 'IMAGE',
  JSON: 'JSON',
  TEXT: 'TEXT'
};

exports.EvidenceScope = exports.$Enums.EvidenceScope = {
  ORDER: 'ORDER',
  RETURN: 'RETURN',
  DISPUTE: 'DISPUTE',
  REFUND: 'REFUND',
  DELIVERY: 'DELIVERY'
};

exports.ChecklistCategory = exports.$Enums.ChecklistCategory = {
  STOREFRONT: 'STOREFRONT',
  PAYMENTS: 'PAYMENTS',
  DELIVERY: 'DELIVERY',
  WHATSAPP: 'WHATSAPP',
  POLICIES: 'POLICIES',
  SECURITY: 'SECURITY'
};

exports.ChecklistStatus = exports.$Enums.ChecklistStatus = {
  TODO: 'TODO',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED',
  SKIPPED: 'SKIPPED'
};

exports.MetricPeriod = exports.$Enums.MetricPeriod = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY'
};

exports.IdempotencyStatus = exports.$Enums.IdempotencyStatus = {
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.JobRunStatus = exports.$Enums.JobRunStatus = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.KycStatus = exports.$Enums.KycStatus = {
  NOT_STARTED: 'NOT_STARTED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

exports.LedgerAccountType = exports.$Enums.LedgerAccountType = {
  MERCHANT_AVAILABLE: 'MERCHANT_AVAILABLE',
  MERCHANT_PENDING: 'MERCHANT_PENDING',
  MERCHANT_RESERVED: 'MERCHANT_RESERVED',
  SYSTEM_COMMISSION: 'SYSTEM_COMMISSION',
  SYSTEM_ESCROW: 'SYSTEM_ESCROW',
  SYSTEM_OPERATIONAL: 'SYSTEM_OPERATIONAL'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT'
};

exports.LegalKey = exports.$Enums.LegalKey = {
  PRIVACY: 'PRIVACY',
  TERMS: 'TERMS',
  REFUNDS: 'REFUNDS',
  SHIPPING: 'SHIPPING',
  COOKIES: 'COOKIES',
  AUP: 'AUP',
  CONTACT: 'CONTACT'
};

exports.ListingStatus = exports.$Enums.ListingStatus = {
  UNLISTED: 'UNLISTED',
  PENDING_REVIEW: 'PENDING_REVIEW',
  LISTED: 'LISTED',
  REJECTED: 'REJECTED'
};

exports.AppRole = exports.$Enums.AppRole = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  SUPPORT: 'SUPPORT',
  FINANCE: 'FINANCE',
  OPS_ADMIN: 'OPS_ADMIN',
  OPS_AGENT: 'OPS_AGENT'
};

exports.FlagSeverity = exports.$Enums.FlagSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

exports.OnboardingStatus = exports.$Enums.OnboardingStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  REQUIRED_COMPLETE: 'REQUIRED_COMPLETE',
  OPTIONAL_INCOMPLETE: 'OPTIONAL_INCOMPLETE',
  COMPLETE: 'COMPLETE'
};

exports.PolicyType = exports.$Enums.PolicyType = {
  TERMS: 'TERMS',
  PRIVACY: 'PRIVACY',
  RETURNS: 'RETURNS',
  REFUNDS: 'REFUNDS',
  SHIPPING_DELIVERY: 'SHIPPING_DELIVERY'
};

exports.PolicyStatus = exports.$Enums.PolicyStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
};

exports.ThemeStatus = exports.$Enums.ThemeStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
};

exports.Direction = exports.$Enums.Direction = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND'
};

exports.MessageType = exports.$Enums.MessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  DOCUMENT: 'DOCUMENT',
  STICKER: 'STICKER',
  LOCATION: 'LOCATION',
  TEMPLATE: 'TEMPLATE'
};

exports.MessageStatus = exports.$Enums.MessageStatus = {
  QUEUED: 'QUEUED',
  SENT: 'SENT',
  DELIVERED: 'DELIVERED',
  READ: 'READ',
  FAILED: 'FAILED'
};

exports.MigrationStatus = exports.$Enums.MigrationStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  PAUSED: 'PAUSED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  DRAFT: 'DRAFT',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  FULFILLING: 'FULFILLING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUND_REQUESTED: 'REFUND_REQUESTED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  INITIATED: 'INITIATED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  DISPUTED: 'DISPUTED'
};

exports.FulfillmentStatus = exports.$Enums.FulfillmentStatus = {
  UNFULFILLED: 'UNFULFILLED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  PROCESSING: 'PROCESSING',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  RETURNED: 'RETURNED'
};

exports.ImportOrderState = exports.$Enums.ImportOrderState = {
  CREATED: 'CREATED',
  DEPOSIT_PENDING: 'DEPOSIT_PENDING',
  DEPOSIT_PAID: 'DEPOSIT_PAID',
  SUPPLIER_CONFIRMED: 'SUPPLIER_CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

exports.OutboxEventStatus = exports.$Enums.OutboxEventStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED'
};

exports.ReportEntityType = exports.$Enums.ReportEntityType = {
  REVIEW: 'REVIEW',
  STORE: 'STORE',
  PRODUCT: 'PRODUCT'
};

exports.ReportReason = exports.$Enums.ReportReason = {
  SPAM: 'SPAM',
  FRAUD: 'FRAUD',
  HATE: 'HATE',
  HARASSMENT: 'HARASSMENT',
  COPYRIGHT: 'COPYRIGHT',
  OTHER: 'OTHER'
};

exports.ReportStatus = exports.$Enums.ReportStatus = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  DISMISSED: 'DISMISSED'
};

exports.ReturnCondition = exports.$Enums.ReturnCondition = {
  NEW: 'NEW',
  OPENED: 'OPENED',
  DAMAGED: 'DAMAGED',
  MISSING_PARTS: 'MISSING_PARTS',
  UNKNOWN: 'UNKNOWN'
};

exports.RestockAction = exports.$Enums.RestockAction = {
  RESTOCK: 'RESTOCK',
  DISCARD: 'DISCARD',
  REPAIR: 'REPAIR',
  RETURN_TO_VENDOR: 'RETURN_TO_VENDOR'
};

exports.ReturnMethod = exports.$Enums.ReturnMethod = {
  SELF_PICKUP: 'SELF_PICKUP',
  DROPOFF: 'DROPOFF',
  CARRIER: 'CARRIER'
};

exports.ReturnStatus = exports.$Enums.ReturnStatus = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  IN_TRANSIT: 'IN_TRANSIT',
  RECEIVED: 'RECEIVED',
  INSPECTED: 'INSPECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.ReturnReason = exports.$Enums.ReturnReason = {
  WRONG_ITEM: 'WRONG_ITEM',
  DAMAGED: 'DAMAGED',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  SIZE_ISSUE: 'SIZE_ISSUE',
  CHANGED_MIND: 'CHANGED_MIND',
  OTHER: 'OTHER'
};

exports.ReturnResolution = exports.$Enums.ReturnResolution = {
  REFUND: 'REFUND',
  EXCHANGE: 'EXCHANGE',
  STORE_CREDIT: 'STORE_CREDIT'
};

exports.ReviewStatus = exports.$Enums.ReviewStatus = {
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  HIDDEN: 'HIDDEN'
};

exports.RiskStatus = exports.$Enums.RiskStatus = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.RiskScope = exports.$Enums.RiskScope = {
  MERCHANT: 'MERCHANT',
  CUSTOMER: 'CUSTOMER',
  ORDER: 'ORDER',
  CAMPAIGN: 'CAMPAIGN',
  MESSAGE: 'MESSAGE',
  PAYMENT: 'PAYMENT'
};

exports.RiskSeverity = exports.$Enums.RiskSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

exports.SubscriptionPlan = exports.$Enums.SubscriptionPlan = {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PRO: 'PRO'
};

exports.MerchantType = exports.$Enums.MerchantType = {
  INDIVIDUAL: 'INDIVIDUAL',
  RETAILER: 'RETAILER',
  WHOLESALER: 'WHOLESALER',
  CHINA_SUPPLIER: 'CHINA_SUPPLIER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER'
};

exports.SubscriptionStatus = exports.$Enums.SubscriptionStatus = {
  TRIALING: 'TRIALING',
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  INCOMPLETE: 'INCOMPLETE',
  PAUSED: 'PAUSED',
  GRACE_PERIOD: 'GRACE_PERIOD'
};

exports.BillingProvider = exports.$Enums.BillingProvider = {
  STRIPE: 'STRIPE',
  PAYSTACK: 'PAYSTACK',
  MANUAL: 'MANUAL'
};

exports.SupportCaseCategory = exports.$Enums.SupportCaseCategory = {
  PAYMENTS: 'PAYMENTS',
  DELIVERY: 'DELIVERY',
  WHATSAPP: 'WHATSAPP',
  CAMPAIGNS: 'CAMPAIGNS',
  ACCOUNT: 'ACCOUNT'
};

exports.SupportCaseStatus = exports.$Enums.SupportCaseStatus = {
  OPEN: 'OPEN',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED'
};

exports.VirtualAccountStatus = exports.$Enums.VirtualAccountStatus = {
  NOT_CREATED: 'NOT_CREATED',
  CREATED: 'CREATED',
  FAILED: 'FAILED'
};

exports.WebhookDeliveryStatus = exports.$Enums.WebhookDeliveryStatus = {
  PENDING: 'PENDING',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  DEAD: 'DEAD'
};

exports.WebhookEndpointStatus = exports.$Enums.WebhookEndpointStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED'
};

exports.ApprovalStatus = exports.$Enums.ApprovalStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

exports.ExportStatus = exports.$Enums.ExportStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED'
};

exports.DataDeletionStatus = exports.$Enums.DataDeletionStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW'
};

exports.RaffleEntryStatus = exports.$Enums.RaffleEntryStatus = {
  PENDING: 'PENDING',
  WON: 'WON',
  LOST: 'LOST'
};

exports.FuelType = exports.$Enums.FuelType = {
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  ELECTRIC: 'ELECTRIC',
  HYBRID: 'HYBRID',
  PLUGIN_HYBRID: 'PLUGIN_HYBRID'
};

exports.Transmission = exports.$Enums.Transmission = {
  AUTOMATIC: 'AUTOMATIC',
  MANUAL: 'MANUAL',
  CVT: 'CVT'
};

exports.AccommodationType = exports.$Enums.AccommodationType = {
  ROOM: 'ROOM',
  SUITE: 'SUITE',
  VILLA: 'VILLA',
  APARTMENT: 'APARTMENT',
  HOSTEL_BED: 'HOSTEL_BED',
  CAMP_SITE: 'CAMP_SITE'
};

exports.PostStatus = exports.$Enums.PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.Prisma.ModelName = {
  AbuseRule: 'AbuseRule',
  AccountDeletionRequest: 'AccountDeletionRequest',
  AdminAuditLog: 'AdminAuditLog',
  AiActionDefinition: 'AiActionDefinition',
  AiActionMessageLink: 'AiActionMessageLink',
  AiActionRun: 'AiActionRun',
  AiUsageEvent: 'AiUsageEvent',
  AiUsageDaily: 'AiUsageDaily',
  MerchantAiProfile: 'MerchantAiProfile',
  WhatsAppAgentSettings: 'WhatsAppAgentSettings',
  AiPlan: 'AiPlan',
  MerchantAiSubscription: 'MerchantAiSubscription',
  AiAddonPurchase: 'AiAddonPurchase',
  SignupAbuseSignal: 'SignupAbuseSignal',
  AnalyticsDailyDelivery: 'AnalyticsDailyDelivery',
  AnalyticsDailyPayments: 'AnalyticsDailyPayments',
  AnalyticsDailySales: 'AnalyticsDailySales',
  AnalyticsDailySupport: 'AnalyticsDailySupport',
  ApiKey: 'ApiKey',
  AutomationRule: 'AutomationRule',
  BankBeneficiary: 'BankBeneficiary',
  BillingProfile: 'BillingProfile',
  Campaign: 'Campaign',
  CampaignSend: 'CampaignSend',
  CarrierAccount: 'CarrierAccount',
  Cart: 'Cart',
  CartItem: 'CartItem',
  Charge: 'Charge',
  Collection: 'Collection',
  CollectionProduct: 'CollectionProduct',
  Contact: 'Contact',
  Conversation: 'Conversation',
  Coupon: 'Coupon',
  CustomDomain: 'CustomDomain',
  Customer: 'Customer',
  CustomerAccount: 'CustomerAccount',
  CustomerAddress: 'CustomerAddress',
  CustomerRiskProfile: 'CustomerRiskProfile',
  CustomerSession: 'CustomerSession',
  DataRequest: 'DataRequest',
  DeadLetterQueue: 'DeadLetterQueue',
  DeliveryOption: 'DeliveryOption',
  DeliveryProfile: 'DeliveryProfile',
  DeliveryWebhookEvent: 'DeliveryWebhookEvent',
  DeliveryZone: 'DeliveryZone',
  DeviceRegistration: 'DeviceRegistration',
  DiscountRedemption: 'DiscountRedemption',
  DiscountRule: 'DiscountRule',
  DispatchJob: 'DispatchJob',
  Dispute: 'Dispute',
  DisputeEvidence: 'DisputeEvidence',
  DisputeTimelineEvent: 'DisputeTimelineEvent',
  EnforcementAction: 'EnforcementAction',
  EvidenceAsset: 'EvidenceAsset',
  EvidenceBundle: 'EvidenceBundle',
  GoLiveChecklistItem: 'GoLiveChecklistItem',
  Goal: 'Goal',
  HealthScore: 'HealthScore',
  IdempotencyKeyV2: 'IdempotencyKeyV2',
  InventoryEvent: 'InventoryEvent',
  InventoryItem: 'InventoryItem',
  InventoryLocation: 'InventoryLocation',
  InventoryMovement: 'InventoryMovement',
  InvoiceLineV2: 'InvoiceLineV2',
  InvoiceV2: 'InvoiceV2',
  JobRun: 'JobRun',
  KnowledgeBaseEntry: 'KnowledgeBaseEntry',
  KycRecord: 'KycRecord',
  LedgerEntry: 'LedgerEntry',
  LedgerAccount: 'LedgerAccount',
  LedgerTransaction: 'LedgerTransaction',
  LegalAcceptance: 'LegalAcceptance',
  LegalTemplate: 'LegalTemplate',
  MarketplaceListing: 'MarketplaceListing',
  MediaAsset: 'MediaAsset',
  Membership: 'Membership',
  MerchantFeatureOverride: 'MerchantFeatureOverride',
  MerchantFlag: 'MerchantFlag',
  MerchantOnboarding: 'MerchantOnboarding',
  OnboardingAnalyticsEvent: 'OnboardingAnalyticsEvent',
  MerchantPolicy: 'MerchantPolicy',
  MerchantSession: 'MerchantSession',
  MerchantTheme: 'MerchantTheme',
  MerchantThemeHistory: 'MerchantThemeHistory',
  Message: 'Message',
  MigrationRun: 'MigrationRun',
  NotificationOutbox: 'NotificationOutbox',
  NotificationTemplate: 'NotificationTemplate',
  OnboardingFlow: 'OnboardingFlow',
  OpsSession: 'OpsSession',
  OpsUser: 'OpsUser',
  Order: 'Order',
  OrderDiscount: 'OrderDiscount',
  OrderEvent: 'OrderEvent',
  OrderItem: 'OrderItem',
  FulfillmentGroup: 'FulfillmentGroup',
  OrderTimelineEvent: 'OrderTimelineEvent',
  OtpCode: 'OtpCode',
  OutboxEvent: 'OutboxEvent',
  PaymentAccount: 'PaymentAccount',
  PaymentCustomer: 'PaymentCustomer',
  PaymentIntent: 'PaymentIntent',
  PaymentTransaction: 'PaymentTransaction',
  PaymentWebhookEvent: 'PaymentWebhookEvent',
  StoreCounter: 'StoreCounter',
  Payout: 'Payout',
  Permission: 'Permission',
  Plan: 'Plan',
  PlatformKillSwitch: 'PlatformKillSwitch',
  Product: 'Product',
  PricingTier: 'PricingTier',
  ProductImage: 'ProductImage',
  ProductVariant: 'ProductVariant',
  Receipt: 'Receipt',
  Refund: 'Refund',
  Report: 'Report',
  ReturnItem: 'ReturnItem',
  ReturnLogistics: 'ReturnLogistics',
  ReturnRequest: 'ReturnRequest',
  Review: 'Review',
  ReviewMedia: 'ReviewMedia',
  RiskProfile: 'RiskProfile',
  RiskSignal: 'RiskSignal',
  Role: 'Role',
  RolePermission: 'RolePermission',
  SecuritySetting: 'SecuritySetting',
  Segment: 'Segment',
  Store: 'Store',
  FlashSale: 'FlashSale',
  StoreDeliverySettings: 'StoreDeliverySettings',
  Shipment: 'Shipment',
  DeliveryEvent: 'DeliveryEvent',
  StaffInvite: 'StaffInvite',
  StoreProfile: 'StoreProfile',
  StorefrontSettings: 'StorefrontSettings',
  Subscription: 'Subscription',
  SupportCase: 'SupportCase',
  Template: 'Template',
  TemplateAsset: 'TemplateAsset',
  TemplateSource: 'TemplateSource',
  TemplateSyncRun: 'TemplateSyncRun',
  TemplateVersion: 'TemplateVersion',
  Tenant: 'Tenant',
  TenantMembership: 'TenantMembership',
  TrackingEvent: 'TrackingEvent',
  TrustBadgeSnapshot: 'TrustBadgeSnapshot',
  UsageCounter: 'UsageCounter',
  User: 'User',
  Wallet: 'Wallet',
  WebhookDelivery: 'WebhookDelivery',
  WebhookEndpoint: 'WebhookEndpoint',
  WebhookEventV2: 'WebhookEventV2',
  WhatsappChannel: 'WhatsappChannel',
  WhatsappCredential: 'WhatsappCredential',
  WhatsappTemplate: 'WhatsappTemplate',
  Withdrawal: 'Withdrawal',
  ApprovalExecutionLog: 'ApprovalExecutionLog',
  Approval: 'Approval',
  RateLimit: 'RateLimit',
  ExportJob: 'ExportJob',
  AuditLog: 'AuditLog',
  AnalyticsEvent: 'AnalyticsEvent',
  ApiError: 'ApiError',
  IntegrationEvent: 'IntegrationEvent',
  BackupReceipt: 'BackupReceipt',
  DisputeSubmission: 'DisputeSubmission',
  DomainMapping: 'DomainMapping',
  DunningAttempt: 'DunningAttempt',
  FeatureFlag: 'FeatureFlag',
  ImportJob: 'ImportJob',
  InternalNote: 'InternalNote',
  Notification: 'Notification',
  NotificationPreference: 'NotificationPreference',
  NotificationLog: 'NotificationLog',
  Partner: 'Partner',
  PartnerPayoutLedger: 'PartnerPayoutLedger',
  PartnerReferralCode: 'PartnerReferralCode',
  PublishHistory: 'PublishHistory',
  ReferralAttribution: 'ReferralAttribution',
  StatusIncident: 'StatusIncident',
  StoreTemplateSelection: 'StoreTemplateSelection',
  SupportTicket: 'SupportTicket',
  SupportTicketFeedback: 'SupportTicketFeedback',
  SupportBotFeedback: 'SupportBotFeedback',
  SupportTelemetryEvent: 'SupportTelemetryEvent',
  TemplateManifest: 'TemplateManifest',
  StorefrontDraft: 'StorefrontDraft',
  StorefrontPublished: 'StorefrontPublished',
  TicketMessage: 'TicketMessage',
  HandoffEvent: 'HandoffEvent',
  SupportSlaPolicy: 'SupportSlaPolicy',
  UptimeCheck: 'UptimeCheck',
  UserSession: 'UserSession',
  WebhookEvent: 'WebhookEvent',
  WebhookSubscription: 'WebhookSubscription',
  TelemetryEvent: 'TelemetryEvent',
  AuditEvent: 'AuditEvent',
  OpsAuditEvent: 'OpsAuditEvent',
  DataExportRequest: 'DataExportRequest',
  DataExportArtifact: 'DataExportArtifact',
  DataDeletionRequest: 'DataDeletionRequest',
  AiTrace: 'AiTrace',
  ProviderPricing: 'ProviderPricing',
  MerchantCostDaily: 'MerchantCostDaily',
  PlatformCostDaily: 'PlatformCostDaily',
  CostAnomalyEvent: 'CostAnomalyEvent',
  ThrottlePolicy: 'ThrottlePolicy',
  KnowledgeEmbedding: 'KnowledgeEmbedding',
  ConversionEvent: 'ConversionEvent',
  PersuasionAttempt: 'PersuasionAttempt',
  ObjectionEvent: 'ObjectionEvent',
  RescueIncident: 'RescueIncident',
  RescueFixAction: 'RescueFixAction',
  Booking: 'Booking',
  RaffleEntry: 'RaffleEntry',
  PortfolioProject: 'PortfolioProject',
  ProjectComment: 'ProjectComment',
  VehicleProduct: 'VehicleProduct',
  AccommodationProduct: 'AccommodationProduct',
  BlogPost: 'BlogPost',
  BlogPostProduct: 'BlogPostProduct',
  SourcingRequest: 'SourcingRequest',
  MobileAppWaitlist: 'MobileAppWaitlist'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
