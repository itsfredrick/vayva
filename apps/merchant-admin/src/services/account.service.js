// Test Data
let profile = {
    firstName: "Fredrick",
    lastName: "Admin",
    email: "fredrick@vayva.shop",
    phone: "+234 800 000 0000",
};
let store = {
    name: "Fredrick Store",
    category: "Fashion",
    slug: "fredrick-store",
    address: "123 Lagos Way",
    city: "Lekki",
    state: "Lagos",
    isPublished: false,
};
let staff = [
    {
        id: "1",
        name: "Fredrick Admin",
        email: "fredrick@vayva.shop",
        role: "admin",
        status: "active",
        joinedAt: new Date().toISOString(),
    },
];
let kyc = {
    status: "not_started",
};
const security = {
    lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    twoFactorEnabled: false,
    walletPinSet: false,
    activeSessions: [
        {
            id: "sess_1",
            device: "MacBook Pro (Chrome)",
            location: "Lagos, NG",
            lastActive: "Just now",
            isCurrent: true,
        },
    ],
};
let notifications = {
    email: {
        orders: true,
        payouts: true,
        waApprovals: true,
        lowStock: false,
    },
    whatsapp: {
        orders: false,
        payouts: false,
    },
};
export const AccountService = {
    getProfile: async () => {
        return profile;
    },
    updateProfile: async (data) => {
        profile = { ...profile, ...data };
    },
    getStoreProfile: async () => {
        return store;
    },
    updateStoreProfile: async (data) => {
        store = { ...store, ...data };
    },
    getStaff: async () => {
        return staff;
    },
    inviteStaff: async (email, role) => {
        staff.push({
            id: Math.random().toString(36).substr(2, 9),
            name: email.split("@")[0],
            email,
            role: role,
            status: "invited",
            joinedAt: new Date().toISOString(),
        });
    },
    removeStaff: async (id) => {
        staff = staff.filter((s) => s.id !== id);
    },
    getKycStatus: async () => {
        return kyc;
    },
    submitKyc: async (data) => {
        kyc = { ...kyc, status: "pending", ...data };
    },
    getSecurityState: async () => {
        // Test linking verified KYC to simulate PIN prompt requirement if needed
        return security;
    },
    getNotifications: async () => {
        return notifications;
    },
    updateNotifications: async (data) => {
        notifications = { ...notifications, ...data };
    },
};
