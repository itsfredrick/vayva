"use client";

import { OpsSidebar } from "./OpsSidebar";
import { CommandMenu } from "./CommandMenu";
import { Search, Bell } from 'lucide-react';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@vayva/ui";

interface OpsUser {
  name: string;
  email: string;
  role: string;
}

export function OpsShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ops-sidebar-collapsed") === "true";
    }
    return false;
  });
  const [density, setDensity] = useState<"relaxed" | "compact">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("ops-table-density") as "relaxed" | "compact") || "relaxed";
    }
    return "relaxed";
  });
  const [user, setUser] = useState<OpsUser | null>(null);

  // Fetch current user identity in background
  useEffect(() => {
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
      .map((n: any) => n[0])
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
              (e as any).preventDefault();
              const q = ((e as any).currentTarget.elements.namedItem("q") as HTMLInputElement).value;
              if (!q) return;

              // Simple heuristic routing
              if (q.startsWith("ord_") || q.startsWith("#") || !isNaN(Number(q))) {
                router.push(`/ops/orders?q=${encodeURIComponent(q)}`);
              } else if (q.includes("trk_") || q.startsWith("KWIK")) {
                router.push(`/ops/deliveries?q=${encodeURIComponent(q)}`);
              } else {
                router.push(`/ops/merchants?q=${encodeURIComponent(q)}`);
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
          <Button
            variant="outline"
            onClick={toggleDensity}
            className="text-xs font-bold px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors uppercase h-auto"
            aria-label={`Switch to ${density === 'relaxed' ? 'Compact' : 'Relaxed'} View`}
          >
            {density}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black relative"
            aria-label="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
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
