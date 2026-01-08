"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowUpRight,
  Loader2,
  Sparkles
} from "lucide-react";

// Mocking cn if not found to avoid build break in this environment, 
// though typically it would be imported from @/lib/utils or @vayva/ui
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "bi">("overview");
  const [biData, setBiData] = useState<any>(null);
  const [loadingBi, setLoadingBi] = useState(false);

  const [stats] = useState({
    totalVisitors: 0,
    pageViews: 0,
    uniqueVisitors: 0,
  });

  useEffect(() => {
    if (activeTab === "bi" && !biData) {
      fetchBI();
    }
  }, [activeTab, biData]);

  const fetchBI = async () => {
    setLoadingBi(true);
    try {
      const res = await fetch("/api/analytics/business-intelligence");
      const json = await res.json();
      setBiData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBi(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-gray-500 mt-1 text-lg">
            Monitor your store's growth and data-driven insights.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "overview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <BarChart3 size={16} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("bi")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeTab === "bi" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <BrainCircuit size={16} /> Business Intelligence (AI)
          </button>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors group">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">
                Total Visitors
              </h2>
              <p className="text-4xl font-black text-gray-900">
                {stats.totalVisitors.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-2">
                <ArrowUpRight size={12} /> +0% vs last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors group">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">
                Page Views
              </h2>
              <p className="text-4xl font-black text-gray-900">
                {stats.pageViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">1.2x average</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors group">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">
                Unique Visitors
              </h2>
              <p className="text-4xl font-black text-gray-900">
                {stats.uniqueVisitors.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2 font-medium">High retention rate</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Recent Activity
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </h2>
            <div className="flex flex-col items-center justify-center py-20 text-gray-300 border-2 border-dashed border-gray-50 rounded-xl">
              <TrendingUp size={48} strokeWidth={1} />
              <p className="mt-4 text-sm font-medium">Activity data will appear as you scale.</p>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {!biData && loadingBi ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
              <h3 className="text-xl font-bold text-gray-900">Consulting Vayva AI...</h3>
              <p className="text-gray-500 text-sm mt-1">Analyzing your sales and customer behavior</p>
            </div>
          ) : biData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: AI Summary Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                  <Sparkles className="absolute top-4 right-4 text-indigo-300 opacity-30 group-hover:scale-125 transition-transform duration-700" size={80} />

                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-6">
                      <ShieldCheck size={12} /> AI Strategy Report
                    </span>

                    <h2 className="text-3xl font-black mb-4 leading-tight">Weekly Business <br />Health Summary</h2>
                    <p className="text-indigo-100 leading-relaxed text-lg max-w-xl">
                      {biData.insights.summary}
                    </p>

                    <div className="mt-8 flex gap-4">
                      <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex-1">
                        <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Total Sales (30d)</h4>
                        <p className="text-2xl font-black">₦{biData.stats.totalSales.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex-1">
                        <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Volume</h4>
                        <p className="text-2xl font-black">{biData.stats.totalOrders} Orders</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Selling Grid */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Profit Drivers</h3>
                  <div className="space-y-4">
                    {biData.stats.topItems.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:border-indigo-200 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">{idx + 1}</span>
                          <span className="font-bold text-gray-800">{item}</span>
                        </div>
                        <TrendingUp size={16} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Rails: Growth & Risk */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600">
                      <ArrowUpRight size={20} />
                    </div>
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Growth Recommendation</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {biData.insights.growthTip}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-2 rounded-xl",
                      biData.insights.churnRisk === 'Low' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    )}>
                      <AlertTriangle size={20} />
                    </div>
                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Churn Risk: {biData.insights.churnRisk}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    Based on recent order intervals, your customer retention is {biData.insights.churnRisk?.toLowerCase() || 'low'}.
                  </p>
                  <button className="mt-4 w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">Setup Retention Campaign</button>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <h3 className="font-black text-indigo-900 uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
                    <Sparkles size={14} /> Inventory Foresight
                  </h3>
                  <p className="text-indigo-800 text-sm font-bold leading-relaxed">
                    {biData.insights.inventoryHint}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <BrainCircuit className="text-gray-200 mb-4" size={64} />
              <h3 className="text-xl font-bold text-gray-900">No Intelligence Data</h3>
              <p className="text-gray-500 text-sm mt-1">Start making sales to unlock AI-powered insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
