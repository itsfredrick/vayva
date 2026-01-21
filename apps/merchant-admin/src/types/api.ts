/**
 * Shared API Request/Response Type Definitions (Schema-Aligned)
 * 
 * All types in this file match the actual Prisma database schema.
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationMeta {
    total: number;
    limit: number;
    offset: number;
    hasMore?: boolean;
}

export interface ApiError {
    error: string;
    message?: string;
    code?: string;
    details?: Record<string, any>;
}

// ============================================================================
// Product Types (Schema-Aligned)
// ============================================================================

export interface ProductListRequest {
    limit?: number;
    offset?: number;
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'ALL';
    q?: string;
    productType?: string;
    brand?: string;
    sortBy?: 'title' | 'price' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface ProductCreateRequest {
    title: string;
    description?: string;
    handle?: string;
    price: number;
    compareAtPrice?: number;
    costPrice?: number;
    sku?: string;
    barcode?: string;
    trackInventory?: boolean;
    allowBackorder?: boolean;
    weight?: number;
    width?: number;
    height?: number;
    depth?: number;
    productType?: string;
    brand?: string;
    tags?: string[];
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    seoTitle?: string;
    seoDescription?: string;
    metadata?: Record<string, any>;
    condition?: 'NEW' | 'USED' | 'REFURBISHED';
    warrantyMonths?: number;
    techSpecs?: Record<string, any>;
    moq?: number;
}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {
    id: string;
}

export interface ProductResponse {
    id: string;
    storeId: string;
    title: string;
    description: string | null;
    handle: string;
    price: number;
    compareAtPrice: number | null;
    costPrice: number | null;
    sku: string | null;
    barcode: string | null;
    trackInventory: boolean;
    allowBackorder: boolean;
    weight: number | null;
    width: number | null;
    height: number | null;
    depth: number | null;
    status: string;
    productType: string | null;
    brand: string | null;
    tags: string[];
    seoTitle: string | null;
    seoDescription: string | null;
    metadata: Record<string, any> | null;
    condition: string | null;
    warrantyMonths: number | null;
    techSpecs: Record<string, any> | null;
    moq: number;
    createdAt: string;
    updatedAt: string;
}

// Note: These types remain as they are used for nested data
export interface ProductImage {
    id: string;
    url: string;
    alt: string | null;
    position: number;
}

export interface ProductVariant {
    id: string;
    name: string;
    sku: string | null;
    price: number | null;
    compareAtPrice: number | null;
    quantity: number;
    options: Record<string, string>;
}

// ============================================================================
// Order Types (Schema-Aligned)
// ============================================================================

export interface OrderListRequest {
    limit?: number;
    offset?: number;
    status?: string;
    paymentStatus?: string;
    fulfillmentStatus?: string;
    q?: string;
    from?: string;
    to?: string;
}

export interface OrderResponse {
    id: string;
    storeId: string;
    orderNumber: string;
    refCode: string;
    status: string;
    paymentStatus: string;
    fulfillmentStatus: string;
    total: number;
    subtotal: number;
    tax: number;
    shippingTotal: number;
    discountTotal: number;
    currency: string;
    source: string;
    paymentMethod: string | null;
    deliveryMethod: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Customer Types
// ============================================================================

export interface CustomerListRequest {
    limit?: number;
    offset?: number;
    q?: string;
    sortBy?: 'email' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface CustomerResponse {
    id: string;
    storeId: string;
    email: string | null;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    user: UserData;
}

export interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    storeId: string;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsDashboardResponse {
    revenue: MetricData;
    orders: MetricData;
    customers: MetricData;
    averageOrderValue: MetricData;
}

export interface MetricData {
    current: number;
    previous?: number;
    change?: number;
    changePercent?: number;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}
