export interface Merchant {
    id: string;
    name: string;
    email: string;
    slug: string;
    plan: 'free' | 'pro' | 'enterprise';
    kycStatus: 'pending' | 'verified' | 'rejected' | 'incomplete';
    riskScore: 'low' | 'medium' | 'high';
    balance: number;
    joinedAt: string;
}

export interface Dispute {
    id: string;
    merchantName: string;
    customerName: string;
    amount: number;
    reason: string;
    status: 'open' | 'resolved_merchant' | 'resolved_buyer';
    createdAt: string;
}

export interface RefundRequest {
    id: string;
    merchantName: string;
    amount: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    date: string;
}

export const MOCK_MERCHANTS: Merchant[] = [
    { id: '1', name: 'Demo Store', email: 'demo@vayva.shop', slug: 'demo', plan: 'pro', kycStatus: 'verified', riskScore: 'low', balance: 150000, joinedAt: '2025-01-01' },
    { id: '2', name: 'New Fashion', email: 'fashion@gmail.com', slug: 'new-fashion', plan: 'free', kycStatus: 'pending', riskScore: 'medium', balance: 0, joinedAt: '2025-02-14' },
    { id: '3', name: 'Tech Hub', email: 'tech@hub.com', slug: 'techhub', plan: 'enterprise', kycStatus: 'verified', riskScore: 'low', balance: 5400000, joinedAt: '2024-12-10' },
    { id: '4', name: 'Scam Likely', email: 'sus@picious.com', slug: 'cheap-laptops', plan: 'free', kycStatus: 'rejected', riskScore: 'high', balance: 0, joinedAt: '2025-02-15' },
];

export const MOCK_DISPUTES: Dispute[] = [
    { id: 'D-101', merchantName: 'New Fashion', customerName: 'John Doe', amount: 5000, reason: 'Item not received', status: 'open', createdAt: '2025-02-15' },
    { id: 'D-102', merchantName: 'Tech Hub', customerName: 'Jane Smith', amount: 120000, reason: 'Defective item', status: 'resolved_buyer', createdAt: '2025-02-10' },
];

export const MOCK_REFUNDS: RefundRequest[] = [
    { id: 'R-555', merchantName: 'Demo Store', amount: 2500, reason: 'Customer changed mind', status: 'pending', date: '2025-02-16' },
];

export class OpsService {
    static async getDashboardStats() {
        return {
            pendingKYC: MOCK_MERCHANTS.filter(m => m.kycStatus === 'pending').length,
            openDisputes: MOCK_DISPUTES.filter(d => d.status === 'open').length,
            pendingRefunds: MOCK_REFUNDS.filter(r => r.status === 'pending').length,
            highRiskMerchants: MOCK_MERCHANTS.filter(m => m.riskScore === 'high').length
        };
    }

    static async getMerchants() {
        return MOCK_MERCHANTS;
    }

    static async getDisputes() {
        return MOCK_DISPUTES;
    }

    static async getMerchant(id: string) {
        return MOCK_MERCHANTS.find(m => m.id === id);
    }

    static async getRefunds() {
        return MOCK_REFUNDS;
    }

    static async reviewKyc(merchantId: string, action: 'APPROVE' | 'REJECT', reason?: string) {
        // In real, this calls API Gateway /v1/payments/ops/merchants/:id/kyc/review
        const response = await fetch(`/v1/payments/ops/merchants/${merchantId}/kyc/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-ops-user-id': 'ops-1' // Placeholder
            },
            body: JSON.stringify({ action, reason })
        });
        return response.json();
    }
}
