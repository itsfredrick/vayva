import React, { useEffect, useState } from "react";
import { ActivePerformanceCard } from "@/components/analytics/ActivePerformanceCard";
import { PerformanceInsights } from "@/components/analytics/PerformanceInsights";
import { ComparisonTable } from "@/components/analytics/ComparisonTable";
import {
  ActivePerformance,
  ComparisonData,
  Insight,
  Recommendation,
} from "@/types/analytics";
import { Icon } from "@vayva/ui";

export const TemplatePerformanceView = () => {
  const [activeData, setActiveData] = useState<ActivePerformance | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [active, compare, ins, rec] = await Promise.all([
          fetch("/api/templates/performance/active").then((r) => r.json()),
          fetch("/api/templates/performance/compare").then((r) => r.json()),
          fetch("/api/templates/performance/insights").then((r) => r.json()),
          fetch("/api/templates/recommendations").then((r) => r.json()),
        ]);
        setActiveData(active);
        setComparisonData(compare);
        setInsights(ins);
        setRecommendation(rec);
      } catch (e) {
        console.error("Failed to load analytics", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400">
        Loading performance data...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {activeData && <ActivePerformanceCard data={activeData} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ComparisonTable data={comparisonData} />
        </div>
        <div>
          <PerformanceInsights
            insights={insights}
            recommendation={recommendation}
          />
        </div>
      </div>
    </div>
  );
};
