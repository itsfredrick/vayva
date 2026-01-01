/**
 * Vayva Template Service
 *
 * Template lifecycle management with versioning, safe updates, and deprecation.
 */

// Versioning
export {
  parseVersion,
  compareVersions,
  isNewerVersion,
  getVersionType,
  getNextVersion,
  isValidVersion,
  VersionRules,
} from "./versioning";
export type { TemplateVersion, VersionChange, VersionType } from "./versioning";

// Update Management
export { UpdateManager, UpdateRules } from "./update-manager";
export type {
  UpdateValidationResult,
  TemplateUpdate,
  UpdateChange,
} from "./update-manager";

// Deprecation
export { DeprecationManager, DeprecationTriggers } from "./deprecation";
export type {
  DeprecationInfo,
  DeprecationReason,
  DeprecationPolicy,
} from "./deprecation";
