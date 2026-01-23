export const telemetry = {
    track: async (eventName: any, properties: any) => {
        try {
            await fetch("/api/telemetry/event", {
                method: "POST",
                keepalive: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventName,
                    properties: {
                        ...properties,
                        timestamp: new Date().toISOString(),
                        url: typeof window !== "undefined"
                            ? window.location.pathname
                            : undefined,
                    },
                }),
            });
        }
        catch (err) {
            // fail silently
            console.warn("Telemetry error:", err);
        }
    },
};
