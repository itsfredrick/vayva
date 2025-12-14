export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}

export enum UserRole {
    OWNER = 'OWNER',
    STAFF = 'STAFF'
}

export enum OrderStatus {
    DRAFT = 'DRAFT',
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAID = 'PAID',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUND_REQUESTED = 'REFUND_REQUESTED',
    REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
    INITIATED = 'INITIATED',
    REDIRECTED = 'REDIRECTED',
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    CANCELED = 'CANCELED'
}
