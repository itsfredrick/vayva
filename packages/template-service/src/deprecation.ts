/**
 * Template Deprecation System
 *
 * Handles template lifecycle end-of-life with user trust preservation.
 */

export type DeprecationReason =
  | "replaced_by_superior"
  | "business_patterns_changed"
  | "low_activation"
  | "security_concern";

export interface DeprecationInfo {
  templateId: string;
  templateName: string;
  deprecatedAt: Date;
  reason: DeprecationReason;
  replacementTemplateId?: string;
  replacementTemplateName?: string;
  migrationAssistanceAvailable: boolean;
  endOfLifeDate?: Date; // Optional hard deadline (rare)
}

export interface DeprecationPolicy {
  /**
   * Deprecated templates remain functional for existing users
   */
  existingUsersContinue: true;

  /**
   * New users cannot apply deprecated templates
   */
  blockNewApplications: true;

  /**
   * No forced deadlines unless legally required
   */
  noForcedMigration: true;
}

export class DeprecationManager {
  /**
   * Check if template is deprecated
   */
  static isDeprecated(
    templateId: string,
    deprecations: DeprecationInfo[],
  ): boolean {
    return deprecations.some((d) => d.templateId === templateId);
  }

  /**
   * Get deprecation info for template
   */
  static getDeprecationInfo(
    templateId: string,
    deprecations: DeprecationInfo[],
  ): DeprecationInfo | null {
    return deprecations.find((d) => d.templateId === templateId) || null;
  }

  /**
   * Generate user-facing deprecation message
   */
  static getDeprecationMessage(info: DeprecationInfo): {
    title: string;
    message: string;
    hasReplacement: boolean;
    hasMigration: boolean;
  } {
    const hasReplacement = !!info.replacementTemplateId;
    const hasMigration = info.migrationAssistanceAvailable;

    let reasonText = "";
    switch (info.reason) {
      case "replaced_by_superior":
        reasonText = "A newer, improved version is available";
        break;
      case "business_patterns_changed":
        reasonText = "Business patterns have evolved";
        break;
      case "low_activation":
        reasonText = "This template has been superseded";
        break;
      case "security_concern":
        reasonText = "Security improvements are available";
        break;
    }

    return {
      title: "Template No Longer Recommended",
      message: `This template is no longer recommended for new setups. ${reasonText}. Your current setup will continue to work normally.`,
      hasReplacement,
      hasMigration,
    };
  }

  /**
   * Check if template can be applied by new users
   */
  static canApply(
    templateId: string,
    deprecations: DeprecationInfo[],
  ): boolean {
    return !this.isDeprecated(templateId, deprecations);
  }

  /**
   * Get suggested alternative template
   */
  static getSuggestedAlternative(
    templateId: string,
    deprecations: DeprecationInfo[],
  ): { templateId: string; templateName: string } | null {
    const info = this.getDeprecationInfo(templateId, deprecations);
    if (!info || !info.replacementTemplateId) {
      return null;
    }

    return {
      templateId: info.replacementTemplateId,
      templateName: info.replacementTemplateName || "Recommended Template",
    };
  }

  /**
   * Check if end-of-life deadline exists
   */
  static hasDeadline(info: DeprecationInfo): boolean {
    return !!info.endOfLifeDate;
  }

  /**
   * Get days until end-of-life (if applicable)
   */
  static getDaysUntilEOL(info: DeprecationInfo): number | null {
    if (!info.endOfLifeDate) {
      return null;
    }

    const now = new Date();
    const eol = new Date(info.endOfLifeDate);
    const diffTime = eol.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  }
}

/**
 * Deprecation triggers for internal use
 */
export const DeprecationTriggers = {
  /**
   * Template replaced by clearly superior version
   */
  SUPERIOR_VERSION: {
    activationRateImprovement: 0.2, // 20% better activation
    userSatisfactionIncrease: 0.15, // 15% higher satisfaction
  },

  /**
   * Low activation rate threshold
   */
  LOW_ACTIVATION: {
    threshold: 0.3, // Below 30% activation rate
    minimumUsers: 50, // At least 50 users to be statistically significant
  },

  /**
   * Business patterns changed significantly
   */
  PATTERN_CHANGE: {
    usageDecline: 0.5, // 50% decline in new applications over 6 months
  },
};
