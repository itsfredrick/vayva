
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingBag } from "lucide-react";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { PERMISSIONS } from "@/lib/core/permissions";
import { cn } from "@/lib/utils";


interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  activeCustomers: number;
  aov: number;
  chartData: Array<{ date: string; sales: number; orders: number }>;
}

interface Insight {
  type: string;
  text: string;
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    fetchInsights();
  }, [range]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics/overview?range=${range}`);
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch (error: any) {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/analytics/insights");
      if (res.ok) {
        const json = await res.json();
        setInsights(json.insights || []);
      }
    } catch (e: any) {
      // silent fail
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Overview</h2>
          <p className="text-gray-500 mt-1">Real-time performance summary of your store.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={(range as any)} onValueChange={setRange}>
            <SelectTrigger className="w-[180px] rounded-xl border-gray-200 shadow-sm bg-white font-medium">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PermissionGate permission={PERMISSIONS.FINANCE_VIEW}>
          <MetricCard
            title="Total Revenue"
            value={data ? `₦${data.totalSales.toLocaleString()}` : "₦0"}
            icon={(DollarSign as any)}
            loading={isLoading}
            status="success"
          />
        </PermissionGate>
        <MetricCard
          title="Orders"
          value={data ? data.totalOrders : "0"}
          icon={(ShoppingBag as any)}
          loading={isLoading}
        />
        <MetricCard
          title="Active Customers"
          value={data ? data.activeCustomers : "0"}
          icon={(Users as any)}
          loading={isLoading}
        />
        <PermissionGate permission={PERMISSIONS.FINANCE_VIEW}>
          <MetricCard
            title="Avg Order Value"
            value={data ? `₦${Math.round(data.aov).toLocaleString()}` : "₦0"}
            icon={(ArrowUpRight as any)}
            subtext="Average per transaction"
            loading={isLoading}
          />
        </PermissionGate>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100/50">
            <CardTitle className="text-lg font-bold">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[350px] w-full rounded-2xl" />
              </div>
            ) : (
              <div className="h-[350px]">
                {data?.chartData?.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-gray-400 gap-2">
                    <ShoppingBag className="h-10 w-10 text-gray-200" />
                    <p className="font-medium">No sales data found for this range</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.chartData || []}>
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₦${value}`}
                      />
                      <Tooltip
                        cursor={{ fill: '#F9FAFB' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
          <CardHeader className="bg-gray-50/50 p-6 border-b border-gray-100/50">
            <CardTitle className="text-lg font-bold">AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl text-sm transition-all hover:bg-indigo-50">
                    <div className="bg-white p-2 rounded-lg shadow-sm">✨</div>
                    <div>
                      <p className="font-medium text-indigo-900 leading-relaxed">{insight.text}</p>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter mt-1">Smart Suggestion</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-12 flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-50 rounded-full">✨</div>
                <p className="font-medium">Collecting data for smart insights...</p>
                <p className="text-xs text-gray-400">Insights appear after your first few sales.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtext?: string;
  loading: boolean;
  status?: 'success' | 'warning' | 'default';
}

function MetricCard({ title, value, icon: Icon, subtext, loading, status = 'default' }: MetricCardProps) {
  return (
    <Card className="rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          status === 'success' ? "bg-green-50 text-green-600 group-hover:bg-green-100" : "bg-gray-50 text-gray-500 group-hover:bg-gray-100"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {loading ? (
          <Skeleton className="h-8 w-28 rounded-lg" />
        ) : (
          <div className="text-2xl font-black text-gray-900 tracking-tight">{value}</div>
        )}
        {subtext && <p className="text-[10px] text-gray-400 font-medium mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );
}
