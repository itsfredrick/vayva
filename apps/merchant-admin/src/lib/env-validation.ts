/**
 * ENVIRONMENT VALIDATION & FEATURE FLAGS
 *
 * This module enforces required environment variables and disables features
 * if their dependencies are missing. NO SILENT FALLBACKS ALLOWED.
 *
 * If a feature is disabled, it MUST be hidden from the UI.
 */

// Environment variable validation
const ENV = {
  // Core
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,

  // Payment
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,

  // WhatsApp
  WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
  WHATSAPP_PHONE_NUMBER: process.env.WHATSAPP_PHONE_NUMBER,
  WHATSAPP_WEBHOOK_SECRET: process.env.WHATSAPP_WEBHOOK_SECRET,

  // Delivery
  KWIK_API_KEY: process.env.KWIK_API_KEY,
  KWIK_MERCHANT_ID: process.env.KWIK_MERCHANT_ID,

  // KYC
  YOUVERIFY_API_KEY: process.env.YOUVERIFY_API_KEY,
  // YOUVERIFY_APP_ID: process.env.YOUVERIFY_APP_ID, // If needed

  // Storage
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN,

  // AI (Groq)
  GROQ_ADMIN_KEY: process.env.GROQ_ADMIN_KEY,
  GROQ_MARKETING_KEY: process.env.GROQ_MARKETING_KEY,
  GROQ_WHATSAPP_KEY: process.env.GROQ_WHATSAPP_KEY,
} as const;

/**
 * FEATURE FLAGS
 *
 * Features are DISABLED by default if their env vars are missing.
 * This prevents silent fallbacks to test data.
 */
export const FEATURES = {
  /**
   * Payment Processing
   * Requires: PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY
   */
  PAYMENTS_ENABLED: Boolean(
    ENV.PAYSTACK_SECRET_KEY &&
    ENV.PAYSTACK_PUBLIC_KEY &&
    !ENV.PAYSTACK_SECRET_KEY.includes("test") &&
    !ENV.PAYSTACK_SECRET_KEY.includes("test_test"),
  ),

  /**
   * Email Sending
   * Requires: RESEND_API_KEY, RESEND_FROM_EMAIL
   */
  EMAIL_ENABLED: Boolean(ENV.RESEND_API_KEY && ENV.RESEND_FROM_EMAIL),

  /**
   * WhatsApp Integration
   * Requires: WHATSAPP_API_KEY, WHATSAPP_PHONE_NUMBER, WHATSAPP_WEBHOOK_SECRET
   */
  WHATSAPP_ENABLED: Boolean(
    ENV.WHATSAPP_API_KEY &&
    ENV.WHATSAPP_PHONE_NUMBER &&
    ENV.WHATSAPP_WEBHOOK_SECRET,
  ),

  /**
   * Delivery Integration
   * Requires: KWIK_API_KEY, KWIK_MERCHANT_ID
   */
  DELIVERY_ENABLED: Boolean(ENV.KWIK_API_KEY && ENV.KWIK_MERCHANT_ID),

  /**
   * KYC Verification
   * Requires: YOUVERIFY_API_KEY
   */
  KYC_ENABLED: Boolean(ENV.YOUVERIFY_API_KEY),

  /**
   * File Storage
   * Requires: BLOB_READ_WRITE_TOKEN
   */
  STORAGE_ENABLED: Boolean(ENV.BLOB_READ_WRITE_TOKEN),

  /**
   * Control Center (Store Builder)
   * Disabled until Prisma StoreConfig migration complete
   */
  CONTROL_CENTER_ENABLED: false,

  /**
   * Error Monitoring
   * Requires: SENTRY_DSN
   */
  SENTRY_ENABLED: Boolean(ENV.SENTRY_DSN),

  /**
   * AI Assistant (Core & Support)
   * Requires: GROQ_ADMIN_KEY
   */
  AI_ASSISTANT_ENABLED: Boolean(ENV.GROQ_ADMIN_KEY),

  /**
   * Marketing AI Assistant
   * Requires: GROQ_MARKETING_KEY
   */
  MARKETING_AI_ENABLED: Boolean(ENV.GROQ_MARKETING_KEY),
} as const;

/**
 * PRODUCTION VALIDATION
 *
 * In production, certain features MUST be enabled.
 * This prevents accidental deployment without critical services.
 */
export function validateProductionRequirements(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (ENV.NODE_ENV === "production") {
    // Core requirements
    if (!ENV.NEXTAUTH_SECRET) {
      errors.push("NEXTAUTH_SECRET is required in production");
    }
    if (!ENV.DATABASE_URL) {
      errors.push("DATABASE_URL is required in production");
    }

    // Critical features
    if (!FEATURES.PAYMENTS_ENABLED) {
      errors.push("Payment integration (Paystack) is required in production");
    }
    if (!FEATURES.EMAIL_ENABLED) {
      errors.push("Email integration (Resend) is required in production");
    }

    // Recommended features (warnings, not blockers)
    if (!FEATURES.WHATSAPP_ENABLED) {
      console.warn(
        "⚠️  WhatsApp integration is disabled. Core product feature unavailable.",
      );
    }
    if (!FEATURES.KYC_ENABLED) {
      console.warn(
        "⚠️  KYC integration is disabled. Compliance features unavailable.",
      );
    }
    if (!FEATURES.DELIVERY_ENABLED) {
      console.warn(
        "⚠️  Delivery integration is disabled. Auto-dispatch unavailable.",
      );
    }
    if (!FEATURES.SENTRY_ENABLED) {
      console.warn("⚠️  Sentry is disabled. Error monitoring unavailable.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * FEATURE GATE HELPER
 *
 * Use this to conditionally render UI based on feature availability.
 *
 * Example:
 * ```tsx
 * {isFeatureEnabled('WHATSAPP') && <WhatsAppButton />}
 * ```
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}

/**
 * GET DISABLED FEATURE MESSAGE
 *
 * Returns user-friendly message for disabled features.
 */
export function getDisabledFeatureMessage(
  feature: keyof typeof FEATURES,
): string {
  const messages: Record<keyof typeof FEATURES, string> = {
    PAYMENTS_ENABLED:
      "Payment processing is currently unavailable. Please contact support.",
    EMAIL_ENABLED: "Email notifications are currently unavailable.",
    WHATSAPP_ENABLED:
      "WhatsApp integration is not configured. Contact your administrator.",
    DELIVERY_ENABLED:
      "Automated delivery dispatch is not available. Use manual dispatch.",
    KYC_ENABLED: "Identity verification is not available at this time.",
    STORAGE_ENABLED: "File uploads are currently unavailable.",
    CONTROL_CENTER_ENABLED:
      "Control Center requires database migration. Contact support.",
    SENTRY_ENABLED: "Error monitoring is not configured.",
    AI_ASSISTANT_ENABLED: "The core AI assistant is currently disabled.",
    MARKETING_AI_ENABLED: "The marketing AI chat is currently disabled.",
  };

  return messages[feature];
}

/**
 * ASSERT FEATURE ENABLED
 *
 * Throws error if feature is disabled. Use in API routes.
 *
 * Example:
 * ```ts
 * assertFeatureEnabled('PAYMENTS');
 * // Proceeds only if payments are enabled
 * ```
 */
export function assertFeatureEnabled(feature: keyof typeof FEATURES): void {
  if (!FEATURES[feature]) {
    throw new Error(
      `Feature ${feature} is disabled. ${getDisabledFeatureMessage(feature)}`,
    );
  }
}

/**
 * STARTUP VALIDATION
 *
 * Call this at app startup to validate environment.
 * Logs warnings/errors but doesn't crash (except in production with missing critical vars).
 */
export function validateEnvironment(): void {
  console.log("🔍 Validating environment configuration...");
  console.log("");

  // Feature status
  console.log("Feature Status:");
  console.log(
    `  Payments: ${FEATURES.PAYMENTS_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  Email: ${FEATURES.EMAIL_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  WhatsApp: ${FEATURES.WHATSAPP_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  Delivery: ${FEATURES.DELIVERY_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(`  KYC: ${FEATURES.KYC_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`);
  console.log(
    `  Storage: ${FEATURES.STORAGE_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  Sentry: ${FEATURES.SENTRY_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  AI Assistant: ${FEATURES.AI_ASSISTANT_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log(
    `  Marketing AI: ${FEATURES.MARKETING_AI_ENABLED ? "✅ ENABLED" : "❌ DISABLED"}`,
  );
  console.log("");

  // Production validation
  const validation = validateProductionRequirements();
  if (!validation.valid) {
    console.error("❌ PRODUCTION VALIDATION FAILED:");
    validation.errors.forEach((error) => console.error(`  - ${error}`));

    if (ENV.NODE_ENV === "production") {
      console.error("");
      console.error(
        "🚨 CRITICAL: Cannot start in production with missing required configuration.",
      );
      console.error("Please set all required environment variables.");
      process.exit(1);
    }
  } else {
    console.log("✅ Environment validation passed");
  }
  console.log("");
}

// Export environment for read-only access
export { ENV };

// Export type for feature flags
export type FeatureFlag = keyof typeof FEATURES;
