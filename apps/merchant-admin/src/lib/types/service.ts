
export interface ServiceProductMetadata {
    durationMinutes: number;
    location: "ONLINE" | "ON_SITE" | "CLIENT_LOCATION";
    isBookingRequired: boolean;
}
