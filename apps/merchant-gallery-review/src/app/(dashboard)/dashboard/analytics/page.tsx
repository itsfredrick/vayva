"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    pageViews: 0,
    uniqueVisitors: 0,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics 📊</h1>
        <p className="text-gray-600 mt-2">
          Track your store's performance and visitor insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-600 mb-2">
            Total Visitors
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {stats.totalVisitors}
          </p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Page Views</h2>
          <p className="text-3xl font-bold text-gray-900">{stats.pageViews}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-sm font-medium text-gray-600 mb-2">
            Unique Visitors
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {stats.uniqueVisitors}
          </p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500">No recent activity to display</p>
      </div>
    </div>
  );
}
