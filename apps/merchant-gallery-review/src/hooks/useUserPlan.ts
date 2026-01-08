"use client";

import { useState, useEffect } from "react";

export function useUserPlan() {
  const [data, setData] = useState<{ plan: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await fetch("/api/me/plan");
        if (!res.ok) throw new Error("Failed to fetch plan");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, []);

  return {
    plan: data?.plan,
    isLoading: loading,
    error,
  };
}
