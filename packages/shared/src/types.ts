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
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    SUPPORT = 'SUPPORT',
    FINANCE = 'FINANCE',
    OPS = 'OPS'
}

export enum OnboardingStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'COMPLETE'
}

export enum SubscriptionPlan {
    STARTER = 'STARTER',
    GROWTH = 'GROWTH',
    PRO = 'PRO'
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: UserRole;
    createdAt: string;
}

export interface MerchantContext {
    merchantId: string;
    storeId: string;
    onboardingStatus: OnboardingStatus;
    onboardingLastStep: string;
    onboardingUpdatedAt: string;
    plan: SubscriptionPlan;
}

export interface AuthMeResponse {
    user: User;
    merchant?: MerchantContext;
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
