"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Info, Loader2, X } from "lucide-react";

interface AuditLog {
  id: string;
  createdAt: string;
  actorLabel: string;
  action: string;
  entityType: string;
  entityId: string;
  correlationId: string;
  beforeState?: any;
  afterState?: any;
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Simple filter (client-side concept for now, can extend to API params)
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async (reset = false) => {
    setLoading(true);
    try {
      const cursorParam = reset
        ? ""
        : nextCursor
          ? `&limit=50&cursor=${nextCursor}`
          : "&limit=50";
      const res = await fetch(`/api/merchant/audit?${cursorParam}`);
      if (res.ok) {
        const data = await res.json();
        if (reset) {
          setLogs(data.items);
        } else {
          setLogs((prev) => [...prev, ...data.items]);
        }
        setNextCursor(data.next_cursor);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(true);
  }, []);

  // Filter in memory for V1 simplicity if list is small, otherwise pass to API
  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track system events and user actions.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search action or user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-500">Time</th>
                <th className="px-6 py-3 font-medium text-gray-500">Actor</th>
                <th className="px-6 py-3 font-medium text-gray-500">Action</th>
                <th className="px-6 py-3 font-medium text-gray-500">Entity</th>
                <th className="px-6 py-3 font-medium text-gray-500 text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {log.actorLabel}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {log.entityType && (
                        <span className="text-xs uppercase tracking-wider text-gray-400 mr-2">
                          {log.entityType}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {nextCursor && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              onClick={() => fetchLogs(false)}
              disabled={loading}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Log Details
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correlation ID
                </label>
                <p className="mt-1 font-mono text-xs text-gray-700 bg-gray-50 p-2 rounded select-all">
                  {selectedLog.correlationId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedLog.action}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actor
                  </label>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedLog.actorLabel}
                  </p>
                </div>
              </div>

              {selectedLog.beforeState && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    Before State
                  </label>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                    {JSON.stringify(selectedLog.beforeState, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.afterState && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    After State
                  </label>
                  <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                    {JSON.stringify(selectedLog.afterState, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
