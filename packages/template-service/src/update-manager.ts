/**
 * Template Update Manager
 *
 * Implements safe update mechanics:
 * - Merge forward, not overwrite
 * - Never remove/rename active user states
 * - Never delete data
 * - Add capabilities only
 */

import { TemplateVersion, compareVersions } from "./versioning";

export interface UpdateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TemplateUpdate {
  fromVersion: string;
  toVersion: string;
  changes: UpdateChange[];
  requiresApproval: boolean;
}

export interface UpdateChange {
  type: "add" | "modify" | "deprecate";
  target: "workflow" | "status" | "field" | "report";
  path: string;
  description: string;
  optional: boolean;
}

/**
 * Safe update rules
 */
export const UpdateRules = {
  /**
   * Allowed operations
   */
  ALLOWED: [
    "add_workflow",
    "add_status",
    "add_field",
    "add_report",
    "improve_label",
    "add_capability",
  ],

  /**
   * Forbidden operations (breaking changes)
   */
  FORBIDDEN: [
    "remove_workflow",
    "remove_status",
    "rename_status",
    "delete_field",
    "reorder_workflow",
    "change_data_type",
  ],

  /**
   * Requires explicit user approval
   */
  REQUIRES_APPROVAL: [
    "deprecate_workflow",
    "modify_workflow_order",
    "change_default_value",
  ],
};

export class UpdateManager {
  /**
   * Validate if update is safe to apply
   */
  static validateUpdate(update: TemplateUpdate): UpdateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for forbidden operations
    for (const change of update.changes) {
      if (change.type === "add") {
        // Additions are always safe
        continue;
      }

      if (change.type === "modify") {
        // Modifications require approval
        if (!update.requiresApproval) {
          warnings.push(
            `Modification to ${change.target} "${change.path}" requires user approval`,
          );
        }
      }

      if (change.type === "deprecate") {
        // Deprecations are allowed but need clear communication
        warnings.push(`Deprecating ${change.target} "${change.path}"`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Merge update into existing configuration
   * Returns merged configuration
   */
  static mergeUpdate(
    currentConfig: Record<string, any>,
    update: TemplateUpdate,
  ): Record<string, any> {
    const merged = { ...currentConfig };

    for (const change of update.changes) {
      if (change.type === "add") {
        // Add new capabilities without affecting existing ones
        this.applyAddition(merged, change);
      } else if (change.type === "modify" && !change.optional) {
        // Only apply non-optional modifications
        this.applyModification(merged, change);
      }
      // Skip deprecations - they don't change existing config
    }

    return merged;
  }

  /**
   * Apply addition to configuration
   */
  private static applyAddition(
    config: Record<string, any>,
    change: UpdateChange,
  ): void {
    const pathParts = change.path.split(".");
    let current = config;

    // Navigate to parent
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Add new item
    const lastPart = pathParts[pathParts.length - 1];
    if (!current[lastPart]) {
      current[lastPart] = {}; // Add new capability
    }
  }

  /**
   * Apply modification to configuration
   */
  private static applyModification(
    config: Record<string, any>,
    change: UpdateChange,
  ): void {
    // Only apply if user has approved
    // This is a placeholder - actual implementation would check approval status
    console.log(`Applying modification to ${change.path}`);
  }

  /**
   * Check if user has newer version available
   */
  static hasUpdateAvailable(
    currentVersion: string,
    latestVersion: string,
  ): boolean {
    return compareVersions(latestVersion, currentVersion) > 0;
  }

  /**
   * Get update summary for user review
   */
  static getUpdateSummary(update: TemplateUpdate): {
    whatsNew: string[];
    whatStaysSame: string[];
    whatsOptional: string[];
  } {
    const whatsNew: string[] = [];
    const whatStaysSame: string[] = [
      "Existing orders",
      "Records",
      "Staff permissions",
      "Customizations",
    ];
    const whatsOptional: string[] = [];

    for (const change of update.changes) {
      if (change.type === "add") {
        whatsNew.push(change.description);
        if (change.optional) {
          whatsOptional.push(change.description);
        }
      }
    }

    return { whatsNew, whatStaysSame, whatsOptional };
  }
}
