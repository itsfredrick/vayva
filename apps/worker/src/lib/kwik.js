export class KwikProvider {
    constructor() {
        this.apiKey = process.env.KWIK_API_KEY || "";
        this.isSandbox = process.env.NODE_ENV !== "production";
    }
    async createJob(params) {
        // Stub implementation for now - fully mocking the external call
        // as per project constraints when API keys might be missing
        console.log("[KwikProvider] Creating job:", JSON.stringify(params, null, 2));
        if (!this.apiKey) {
            console.warn("[KwikProvider] Missing API Key, using mock result.");
        }
        // Mock Response
        return {
            providerJobId: `kwik_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            status: "CREATED",
            trackingUrl: `https://kwik.delivery/track/mock/${Date.now()}`,
        };
    }
}
