/**
 * Template Versioning System
 *
 * Implements semantic versioning for Vayva templates.
 * Ensures stability for existing businesses while allowing continuous improvement.
 */

export type VersionType = "patch" | "minor" | "major";

export interface TemplateVersion {
  version: string; // e.g., "v1.0", "v1.1", "v2.0"
  releaseDate: Date;
  changeSummary: string;
  changes: VersionChange[];
  isLatest: boolean;
}

export interface VersionChange {
  type: "added" | "improved" | "fixed" | "deprecated";
  category: "workflow" | "status" | "report" | "integration" | "ui";
  description: string;
}

/**
 * Semantic versioning rules for templates
 */
export const VersionRules = {
  /**
   * Patch version (v1.0 → v1.1)
   * - Clarifications
   * - Label improvements
   * - Non-structural defaults
   * - Bug fixes
   */
  PATCH: "patch" as VersionType,

  /**
   * Minor version (v1.x → v2.0)
   * - New workflows
   * - Improved structure
   * - Optional capabilities
   * - New features
   */
  MINOR: "minor" as VersionType,

  /**
   * Major version (rare, deliberate)
   * - Conceptual changes
   * - Fundamental restructuring
   * - Breaking changes (with migration path)
   */
  MAJOR: "major" as VersionType,
};

/**
 * Parse version string to components
 */
export function parseVersion(version: string): {
  major: number;
  minor: number;
} {
  const match = version.match(/^v(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
  };
}

/**
 * Compare two versions
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parsed1 = parseVersion(v1);
  const parsed2 = parseVersion(v2);

  if (parsed1.major !== parsed2.major) {
    return parsed1.major > parsed2.major ? 1 : -1;
  }

  if (parsed1.minor !== parsed2.minor) {
    return parsed1.minor > parsed2.minor ? 1 : -1;
  }

  return 0;
}

/**
 * Check if version is newer
 */
export function isNewerVersion(current: string, latest: string): boolean {
  return compareVersions(latest, current) > 0;
}

/**
 * Get version type from two versions
 */
export function getVersionType(from: string, to: string): VersionType {
  const fromParsed = parseVersion(from);
  const toParsed = parseVersion(to);

  if (toParsed.major > fromParsed.major) {
    return "major";
  }

  if (toParsed.minor > fromParsed.minor) {
    return "minor";
  }

  return "patch";
}

/**
 * Generate next version
 */
export function getNextVersion(current: string, type: VersionType): string {
  const parsed = parseVersion(current);

  switch (type) {
    case "major":
      return `v${parsed.major + 1}.0`;
    case "minor":
      return `v${parsed.major}.${parsed.minor + 1}`;
    case "patch":
      return `v${parsed.major}.${parsed.minor}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

/**
 * Validate version format
 */
export function isValidVersion(version: string): boolean {
  return /^v\d+\.\d+$/.test(version);
}
