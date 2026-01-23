import {
    UserProfile,
    StoreProfile,
    StaffMember,
    KYCState,
    SecurityState,
    NotificationSettings
} from "@/types/account";

// Test Data
let profile: UserProfile = {
    firstName: "Fredrick",
    lastName: "Admin",
    email: "fredrick@vayva.shop",
    phone: "+234 800 000 0000",
};
let store: StoreProfile = {
    name: "Fredrick Store",
    category: "Fashion",
    slug: "fredrick-store",
    address: "123 Lagos Way",
    city: "Lekki",
    state: "Lagos",
    isPublished: false,
};
let staff: StaffMember[] = [
    {
        id: "1",
        name: "Fredrick Admin",
        email: "fredrick@vayva.shop",
        role: "admin",
        status: "active",
        joinedAt: new Date().toISOString(),
    },
];
let kyc: KYCState = {
    status: "not_started",
};
const security: SecurityState = {
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
let notifications: NotificationSettings = {
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
    getProfile: async (): Promise<UserProfile> => {
        return profile;
    },
    updateProfile: async (data: Partial<UserProfile>) => {
        profile = { ...profile, ...data };
    },
    getStoreProfile: async (): Promise<StoreProfile> => {
        return store;
    },
    updateStoreProfile: async (data: Partial<StoreProfile>) => {
        store = { ...store, ...data };
    },
    getStaff: async (): Promise<StaffMember[]> => {
        return staff;
    },
    inviteStaff: async (email: string, role: string) => {
        staff.push({
            id: Math.random().toString(36).substr(2, 9),
            name: email.split("@")[0],
            email,
            role: role,
            status: "invited",
            joinedAt: new Date().toISOString(),
        });
    },
    removeStaff: async (id: string) => {
        staff = staff.filter((s) => s.id !== id);
    },
    getKycStatus: async (): Promise<KYCState> => {
        return kyc;
    },
    submitKyc: async (data: Partial<KYCState>) => {
        kyc = { ...kyc, status: "pending", ...data };
    },
    getSecurityState: async (): Promise<SecurityState> => {
        // Test linking verified KYC to simulate PIN prompt requirement if needed
        return security;
    },
    getNotifications: async (): Promise<NotificationSettings> => {
        return notifications;
    },
    updateNotifications: async (data: Partial<NotificationSettings>) => {
        notifications = { ...notifications, ...data };
    },
};
