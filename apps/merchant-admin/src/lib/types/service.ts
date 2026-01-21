
export interface ServiceProductMetadata {
    durationMinutes: number;
    bufferTimeMinutes?: number;
    providerNames?: string[]; // Simplified for now, could be User IDs later
    location?: "IN_STORE" | "HOME_SERVICE" | "VIRTUAL";
}

export interface ServiceProductForm {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    metadata: ServiceProductMetadata;
}
