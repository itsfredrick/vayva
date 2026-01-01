export const OPS_PRICING_GUARDRAILS = {
  GROWTH_PLAN_PRICE: 25000,
  PRO_PLAN_PRICE: 40000,
};

export type ReadinessLevel = "blocked" | "warning" | "ready";

export interface ReadinessIssue {
  code: string;
  title: string;
  description: string;
  severity: "blocker" | "warning";
  actionUrl?: string;
  fixable?: boolean; // Can be auto-fixed
}

export interface OpsReadiness {
  level: ReadinessLevel;
  issues: ReadinessIssue[];
  summary: {
    identity: boolean;
    plan: boolean;
    template: boolean;
    policies: boolean;
    delivery: boolean;
    payments: boolean; // Warning only
  };
}

export interface OpsSnapshot {
  merchant: {
    id: string;
    plan: string;
    createdAt: Date;
  };
  store: {
    name: string;
    slug: string;
    category: string;
    contacts: { email?: string; phone?: string };
    templateSlug: string | null;
    readinessLevel: ReadinessLevel;
  };
  readiness: OpsReadiness;
  policies: {
    published: boolean;
    types: string[];
  };
  meta: {
    correlationId: string;
    generatedAt: string;
  };
  // Omitted lists for V1 brevity in contract, will be in API response
}
