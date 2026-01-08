"use client";

export interface AttributionData {
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  entry_point?: string;
  initial_template?: string;
  timestamp?: number;
}

const STORAGE_KEY = "vayva_attribution";

export function saveAttribution(data: Partial<AttributionData>) {
  if (typeof window === "undefined") return;

  try {
    const existing = getAttribution();
    const merged = { ...existing, ...data, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

    // Also log to console for debugging/telemetry verification
    console.log("[ATTRIBUTION] Saved:", merged);
  } catch (e: any) {
    console.error("Failed to save attribution", e);
  }
}

export function getAttribution(): AttributionData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e: any) {
    return {};
  }
}

export function captureUrlParams(
  searchParams: URLSearchParams,
  entryPoint?: string,
) {
  const data: Partial<AttributionData> = {};
  const utmKeys = ["utm_source", "utm_campaign", "utm_content", "utm_medium"];

  let hasData = false;
  utmKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) {
      (data as any)[key] = val;
      hasData = true;
    }
  });

  if (entryPoint) {
    data.entry_point = entryPoint;
    hasData = true;
  }

  if (hasData) {
    saveAttribution(data);
  }
}
