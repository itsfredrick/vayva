export interface MerchantProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface StoreProfile {
  name: string;
  category: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  isPublished: boolean;
}

export type StaffRole = "admin" | "manager" | "support";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: "active" | "invited";
  joinedAt: string;
}

export type KycStatus = "not_started" | "pending" | "verified" | "failed";

export interface KycDetails {
  status: KycStatus;
  bvn?: string;
  nin?: string;
  submittedAt?: string;
}

export interface SecurityState {
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  walletPinSet: boolean;
  activeSessions: Array<{
    id: string;
    device: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
  }>;
}

export interface NotificationPrefs {
  email: {
    orders: boolean;
    payouts: boolean;
    waApprovals: boolean;
    lowStock: boolean;
  };
  whatsapp: {
    orders: boolean;
    payouts: boolean;
  };
}
