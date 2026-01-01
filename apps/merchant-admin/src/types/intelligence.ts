export interface OptimizationRule {
  id: string;
  name: string;
  impact: "high" | "medium" | "low";
  type: "mobile" | "conversion" | "speed";
}

export interface OptimizationStatus {
  active: boolean;
  applied_rules: OptimizationRule[];
  last_updated: string;
  metrics: {
    uplift_rate: number;
    prevented_dropoff: number;
  };
}

export interface SeasonalSuggestion {
  season: string;
  id: string;
  active: boolean;
  expected_uplift: string;
  changes: string[];
  preview_image: string;
}

export interface MarketplaceTemplate {
  id: string;
  name: string;
  designer: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  image: string;
  best_for: string[];
  badges: string[];
}
