"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Filter, Loader2, Search } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  body: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unread">("unread");
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchNotifications = async (reset = false) => {
    setLoading(true);
    try {
      const cursorParam = reset
        ? ""
        : nextCursor
          ? `&cursor=${nextCursor}`
          : "";
      const res = await fetch(
        `/api/merchant/notifications?status=${statusFilter}&limit=20${cursorParam}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (reset) {
          setNotifications(data.items);
        } else {
          setNotifications((prev) => [...prev, ...data.items]);
        }
        setNextCursor(data.next_cursor);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
  }, [statusFilter]);

  const markAsRead = async (id: string) => {
    await fetch("/api/merchant/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ ids: [id] }),
    });
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllRead = async () => {
    await fetch("/api/merchant/notifications/mark-read", {
      method: "POST",
      body: JSON.stringify({ mark_all: true }),
    });
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with your store activity.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setStatusFilter("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            statusFilter === "unread"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
            statusFilter === "all"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All Notifications
        </button>
      </div>

      {/* List */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 hover:bg-gray-50/50 transition-colors flex gap-4 ${!n.isRead ? "bg-indigo-50/20" : ""}`}
              >
                <div
                  className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    n.severity === "critical"
                      ? "bg-red-500"
                      : n.severity === "success"
                        ? "bg-green-500"
                        : n.severity === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-sm ${!n.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{n.body}</p>

                  <div className="mt-3 flex items-center gap-3">
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        onClick={() => markAsRead(n.id)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View Details
                      </Link>
                    )}
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {nextCursor && (
              <div className="p-4 text-center">
                <button
                  onClick={() => fetchNotifications(false)}
                  disabled={loading}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
