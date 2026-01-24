// Kwik Logistics Service (Staging Integration)
// Docs: https://apikwik.docs.apiary.io
// Base URL: https://staging-api-test.kwik.delivery/
const KWIK_BASE_URL = process.env.KWIK_BASE_URL || "https://staging-api-test.kwik.delivery/api/v2";
// Defaults to provided Staging Creds if env missing (for immediate verification)
const KWIK_EMAIL = process.env.KWIK_EMAIL;
const KWIK_PASSWORD = process.env.KWIK_PASSWORD;
let cachedToken: string | null | undefined = null;
async function getKwikToken() {
    if (cachedToken)
        return cachedToken;
    if (!KWIK_EMAIL || !KWIK_PASSWORD) {
        console.error("Kwik Credentials Missing");
        throw new Error("Kwik integration is not configured (missing env variables).");
    }
    try {
        const res = await fetch(`${KWIK_BASE_URL}/vendor/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: KWIK_EMAIL, password: KWIK_PASSWORD })
        });
        if (!res.ok) {
            const err = await res.text();
            console.error("Kwik Auth Failed:", err);
            throw new Error("Kwik Auth Failed: " + res.statusText);
        }
        const data = await res.json();
        // API V2 response: { status: 1, message: "...", data: { token: "..." } }
        cachedToken = data.data?.token;
        return cachedToken;
    }
    catch (error: any) {
        console.error("Kwik Token Error:", error);
        throw error;
    }
}
export const KwikService = {
    // 1. Get Delivery Quote
    async getQuote(data: any) {
        const token = await getKwikToken();
        const vehicleMap = { bike: 1, car: 2, van: 3 };
        const vehicleId = (vehicleMap as any)[data.vehicleType || "bike"] || 1;
        // Payload strictly per Kwik V2
        const payload: any = {
            pickup_address: data.pickupAddress,
            delivery_address: data.deliveryAddress,
            parcel_size: vehicleId,
            weight: data.weightKg,
            is_multiple_delivery: 0
        };
        const res = await fetch(`${KWIK_BASE_URL}/pricing/calculate_price`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        // Check Status
        if (json.status !== 1 && json.status !== true) {
            console.error("Kwik Pricing Error:", json);
            throw new Error(json.message || "Pricing Failed");
        }
        const cost = json.data?.estimated_price || 0;
        return {
            provider: "kwik",
            estimatedPrice: cost,
            priceKobo: cost * 100,
            etaMinutes: json.data?.estimated_eta || 120,
            vehicle: data.vehicleType || "bike",
            debug_token_used: !!token
        };
    },
    // 2. Create Delivery Task (Book Rider)
    async requestPickup(data: any) {
        const token = await getKwikToken();
        // Construct V2 Payload
        const payload: any = {
            domain_name: "staging-client-panel.kwik.delivery", // Required by some implementations
            pickup_delivery_relationship: 0, // 0 = Standard
            vehicle_id: 1, // Default Bike
            parcels: [
                {
                    description: data.parcel.description,
                    weight: data.parcel.weight,
                    is_fragile: data.parcel.isFragile ? 1 : 0
                }
            ],
            pickups: [
                {
                    address: data.pickup.address,
                    name: data.pickup.name,
                    phone: data.pickup.phone,
                    email: data.pickup.email,
                    time: new Date().toISOString() // Immediate
                }
            ],
            deliveries: [
                {
                    address: data.delivery.address,
                    name: data.delivery.name,
                    phone: data.delivery.phone,
                    email: data.delivery.email,
                    has_return_task: 0
                }
            ]
        };
        const res = await fetch(`${KWIK_BASE_URL}/tasks/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.status !== 1) {
            throw new Error(json.message || "Booking Failed");
        }
        return {
            jobId: json.data?.job_id || json.data?.unique_id,
            trackingUrl: json.data?.tracking_url,
            status: "PENDING"
        };
    }
};
