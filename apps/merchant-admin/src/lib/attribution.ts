"use client";
const STORAGE_KEY = "vayva_attribution";
export function saveAttribution(data: any) {
    if (typeof window === "undefined")
        return;
    try {
        const existing = getAttribution();
        const merged = { ...existing, ...data, timestamp: Date.now() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        // Also log to console for debugging/telemetry verification
    }
    catch (e) {
        console.error("Failed to save attribution", e);
    }
}
export function getAttribution() {
    if (typeof window === "undefined")
        return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch (e) {
        return {};
    }
}
export function captureUrlParams(searchParams: any, entryPoint: any) {
    const data = {};
    const utmKeys = ["utm_source", "utm_campaign", "utm_content", "utm_medium"];
    let hasData = false;
    utmKeys.forEach((key: any) => {
        const val = searchParams.get(key);
        if (val) {
            data[key] = val;
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
