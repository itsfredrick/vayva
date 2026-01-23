import { FEATURES } from "../env-validation";
export class CustomProvider {
    constructor() {
        this.name = "CUSTOM";
    }
    async dispatch(order, settings) {
        return {
            success: true,
            providerJobId: `MANUAL-${Date.now()}`,
            trackingUrl: null,
            provider: "MANUAL",
            deliveryStatus: "MANUAL_CONFIRMED",
        };
    }
    async cancel(jobId) {
        return { success: true };
    }
}
// --- Kwik Provider ---
export class KwikProvider {
    constructor() {
        this.name = "KWIK";
        if (!FEATURES.DELIVERY_ENABLED) {
            throw new Error("Delivery integration is not configured");
        }
        this.apiKey = process.env.KWIK_API_KEY;
        this.merchantId = process.env.KWIK_MERCHANT_ID;
        this.baseUrl =
            process.env.KWIK_BASE_URL || "https://api.kwik.delivery/api/v1";
    }
    getHeaders() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
        };
    }
    async dispatch(order, settings) {
        try {
            const payload = {
                merchant_id: this.merchantId,
                pickup: {
                    name: settings.pickupName || "Merchant",
                    phone: settings.pickupPhone,
                    address: settings.pickupAddressLine1,
                    city: settings.pickupCity,
                },
                delivery: {
                    name: order.recipientName,
                    phone: order.recipientPhone,
                    address: order.addressLine1,
                    city: order.addressCity || "",
                },
                parcel: {
                    description: order.parcelDescription,
                    reference: order.id,
                },
            };
            const response = await fetch(`${this.baseUrl}/deliveries`, {
                method: "POST",
                headers: this.getHeaders(),
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                return {
                    success: false,
                    error: `Kwik API Error: ${response.status}`,
                    rawResponse: errorBody,
                };
            }
            const data = await response.json();
            return {
                success: true,
                providerJobId: data.data?.id || data.id,
                trackingUrl: data.data?.tracking_url || data.tracking_url,
                rawResponse: data,
                provider: "KWIK",
                deliveryStatus: "TRACKING_AVAILABLE",
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async cancel(jobId) {
        try {
            const response = await fetch(`${this.baseUrl}/deliveries/${jobId}/cancel`, {
                method: "POST",
                headers: this.getHeaders(),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                return { success: false, error: errorBody };
            }
            return { success: true, rawResponse: await response.json() };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
// --- Factory ---
export function getDeliveryProvider(providerName: any) {
    if (providerName === "KWIK") {
        if (!FEATURES.DELIVERY_ENABLED) {
            throw new Error("Kwik delivery is not configured");
        }
        return new KwikProvider();
    }
    return new CustomProvider();
}
