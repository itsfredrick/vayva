"use client";

import { OpsSidebar } from "./OpsSidebar";
import { CommandMenu } from "./CommandMenu";
import { Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";

interface OpsUser {
  name: string;
  email: string;
  role: string;
}

export function OpsShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [density, setDensity] = useState<"relaxed" | "compact">("relaxed");
  const [user, setUser] = useState<OpsUser | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ops-sidebar-collapsed");
    if (saved === "true") setIsCollapsed(true);

    const savedDensity = localStorage.getItem("ops-table-density");
    if (savedDensity === "compact") setDensity("compact");

    // Fetch current user identity
    fetch("/api/ops/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Silently fail - user will see generic initials
      });
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("ops-sidebar-collapsed", String(newState));
  };

  const toggleDensity = () => {
    const next = density === "relaxed" ? "compact" : "relaxed";
    setDensity(next);
    localStorage.setItem("ops-table-density", next);
  };

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isCollapsed ? "pl-20" : "pl-64"} ${density === 'compact' ? 'ops-density-compact' : ''}`}>
      <OpsSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <CommandMenu />

      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
        <div className="w-96 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              if (!q) return;

              // Simple heuristic routing
              if (q.startsWith("ord_") || q.startsWith("#") || !isNaN(Number(q))) {
                window.location.href = `/ops/orders?q=${encodeURIComponent(q)}`;
              } else if (q.includes("trk_") || q.startsWith("KWIK")) {
                window.location.href = `/ops/deliveries?q=${encodeURIComponent(q)}`;
              } else {
                window.location.href = `/ops/merchants?q=${encodeURIComponent(q)}`;
              }
            }}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              name="q"
              placeholder="Search merchants, orders (ord_...), tracking..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDensity}
            title={`Switch to ${density === 'relaxed' ? 'Compact' : 'Relaxed'} View`}
            className="text-xs font-bold px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors uppercase"
          >
            {density}
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold"
            title={user ? `${user.name} (${user.role})` : "Loading..."}
          >
            {user ? getInitials(user.name) : "..."}
          </div>
        </div>
      </header>

      <main className="p-8 pb-20">{children}</main>
    </div>
  );
}
