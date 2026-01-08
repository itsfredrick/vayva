export interface CheckoutRule {
  id: string;
  name: string;
  type: "retry" | "ordering" | "ux";
  status: "active" | "inactive";
  impact: "high" | "medium" | "low";
}

export interface CheckoutOptimizationStatus {
  active: boolean;
  rules: CheckoutRule[];
  metrics: {
    success_rate_uplift: number;
    failed_transactions_prevented: number;
    disputes_reduced: number;
  };
  last_updated: string;
}

export interface FunnelStep {
  name: string;
  count: number;
  dropoff: number;
}

export interface PaymentFunnel {
  period: string;
  steps: FunnelStep[];
  optimization_impact: {
    step: string;
    uplift: string;
  };
}
