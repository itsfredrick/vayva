import {
  KycDetails,
  MerchantProfile,
  NotificationPrefs,
  SecurityState,
  StaffMember,
  StoreProfile,
} from "@/types/account";

// Test Data
let profile: MerchantProfile = {
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

let kyc: KycDetails = {
  status: "not_started",
};

const security: SecurityState = {
  lastPasswordChange: new Date(
    Date.now() - 1000 * 60 * 60 * 24 * 30,
  ).toISOString(), // 30 days ago
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

let notifications: NotificationPrefs = {
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
  getProfile: async (): Promise<MerchantProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return profile;
  },

  updateProfile: async (data: Partial<MerchantProfile>): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    profile = { ...profile, ...data };
  },

  getStoreProfile: async (): Promise<StoreProfile> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return store;
  },

  updateStoreProfile: async (data: Partial<StoreProfile>): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    store = { ...store, ...data };
  },

  getStaff: async (): Promise<StaffMember[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return staff;
  },

  inviteStaff: async (email: string, role: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    staff.push({
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0],
      email,
      role: role as any,
      status: "invited",
      joinedAt: new Date().toISOString(),
    });
  },

  removeStaff: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    staff = staff.filter((s) => s.id !== id);
  },

  getKycStatus: async (): Promise<KycDetails> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return kyc;
  },

  submitKyc: async (data: any): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    kyc = { ...kyc, status: "pending", ...data };
  },

  getSecurityState: async (): Promise<SecurityState> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Test linking verified KYC to simulate PIN prompt requirement if needed
    return security;
  },

  getNotifications: async (): Promise<NotificationPrefs> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return notifications;
  },

  updateNotifications: async (
    data: Partial<NotificationPrefs>,
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    notifications = { ...notifications, ...data };
  },
};
