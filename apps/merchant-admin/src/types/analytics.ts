export interface TemplateMetric {
  conversion_rate: number;
  revenue: number;
  orders: number;
  aov?: number;
  bounce_rate?: number;
  checkout_completion?: number;
}

export interface ActivePerformance {
  template_id: string;
  health_score: number;
  metrics: TemplateMetric;
  delta: Partial<TemplateMetric>;
}

export interface ComparisonData {
  template_id: string;
  name: string;
  is_active: boolean;
  conversion_rate: number;
  orders: number;
  revenue: number;
  best_for: string;
  plan_required?: string;
}

export interface Insight {
  id: string;
  type: "positive" | "warning" | "negative";
  message: string;
  impact: "high" | "medium" | "low";
  action: string;
  actionLink?: string;
}

export interface Recommendation {
  recommended_template_id: string;
  reason: string;
  potential_uplift: {
    orders?: number;
    revenue?: number;
  };
}
