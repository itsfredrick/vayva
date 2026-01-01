import { prisma } from "@vayva/db";
import crypto from "crypto";

interface FlagContext {
  merchantId?: string;
  userId?: string;
  plan?: string;
}

interface FlagRules {
  merchant_allowlist?: string[];
  merchant_blocklist?: string[];
  rollout_percent?: number;
}

export class FlagService {
  // In a real app, use Redis or robust in-memory caching.
  // For V1, we fetch or use a short-lived simplistic cache concept.

  static async isEnabled(
    key: string,
    context: FlagContext = {},
  ): Promise<boolean> {
    try {
      const flag = await prisma.featureFlag.findUnique({
        where: { key },
      });

      if (!flag) return false; // Default safe

      // 1. Check Global Disable (if not enabled and no rules override - usually enabled is the master switch)
      // Actually, usually 'enabled' means "Global ON unless rules restrict" or "Off unless rules enable".
      // Let's define: enabled = BASE STATE. Rules = OVERRIDES.

      // Allowlist overrides everything (Specific Turn ON)
      const rules = flag.rules as FlagRules;

      if (context.merchantId) {
        if (rules.merchant_blocklist?.includes(context.merchantId))
          return false;
        if (rules.merchant_allowlist?.includes(context.merchantId)) return true;

        // Percentage Rollout
        if (rules.rollout_percent && rules.rollout_percent > 0) {
          const hash = crypto
            .createHash("sha256")
            .update(context.merchantId + key)
            .digest("hex");
          const val = parseInt(hash.substring(0, 8), 16); // Take first 8 chars
          const bucket = val % 100;
          if (bucket < rules.rollout_percent) return true;
        }
      }

      return flag.enabled;
    } catch (e) {
      console.error(`[FlagService] Error evaluating ${key}`, e);
      return false; // Fail safe
    }
  }

  static async isKillSwitchActive(
    key: string,
    merchantId: string,
  ): Promise<boolean> {
    // Semantic helper: "Active" means "The Kill Switch is ENGAGED (Blocking)"?
    // Or "Is the FEATURE enabled?"
    // Usually boolean questions should be "isFeatureXEnabled?".
    // If isEnabled returns FALSE, the feature is OFF (Kill switch active potentially).
    return this.isEnabled(key, { merchantId });
  }
}
