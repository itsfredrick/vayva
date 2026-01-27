"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, AlertTriangle, Shield, BarChart3 } from "lucide-react";

interface StoreStats {
  totalStores: number;
  restrictedStores: number;
  totalWarnings: number;
  totalAppeals: number;
  resolvedAppeals: number;
  restrictionBreakdown: {
    ordersDisabled: number;
    productsDisabled: number;
    marketingDisabled: number;
    settingsEditsDisabled: number;
    salesDisabled: number;
    paymentsDisabled: number;
    uploadsDisabled: number;
    aiDisabled: number;
  };
}

export default function EnforcementAnalyticsPage() {
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/ops/enforcement-analytics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStats(data.stats);
    } catch (err: any) {
      console.error("Failed to fetch enforcement stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load analytics</div>;
  }

  const restrictionRate = stats.totalStores > 0 ? (stats.restrictedStores / stats.totalStores * 100).toFixed(1) : "0";
  const appealResolutionRate = stats.totalAppeals > 0 ? (stats.resolvedAppeals / stats.totalAppeals * 100).toFixed(1) : "0";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <BarChart3 className="h-8 w-8 text-gray-600" />
        <div>
          <h1 className="text-3xl font-black text-gray-900">Enforcement Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor merchant compliance and restriction trends</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Stores</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalStores}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-red-100">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Restricted Stores</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.restrictedStores}</h3>
                <p className="text-xs text-gray-500">{restrictionRate}% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Warnings</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalWarnings}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Appeal Resolution</p>
                <h3 className="text-2xl font-bold text-gray-900">{appealResolutionRate}%</h3>
                <p className="text-xs text-gray-500">{stats.resolvedAppeals}/{stats.totalAppeals} resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restriction Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Restriction Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.restrictionBreakdown).map(([key, count]) => (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 capitalize">
                  {key.replace("Disabled", "").replace(/([A-Z])/g, " $1").trim()}
                </h4>
                <p className="text-2xl font-bold text-gray-700">{count}</p>
                <p className="text-xs text-gray-500">stores affected</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Risk levels are calculated based on warning history and active restrictions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-100 text-green-800">Low Risk</Badge>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Stores with 0-1 warnings and no active restrictions.
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                </div>
                <p className="text-sm text-yellow-700 mt-2">
                  Stores with 2-4 warnings or minor restrictions.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-100 text-red-800">High Risk</Badge>
                </div>
                <p className="text-sm text-red-700 mt-2">
                  Stores with 5+ warnings or major restrictions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
