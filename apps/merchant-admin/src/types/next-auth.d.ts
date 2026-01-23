import "next-auth";

declare module "next-auth" {
  interface User {
    storeId: string;
    storeName: string;
    role: string | null;
    plan: string;
    trialEndsAt: Date | string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }

  interface AuthOptions {
    adapter?: unknown;
    session?: unknown;
    pages?: unknown;
    providers: any[];
    callbacks?: unknown;
    secret?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId: string;
    storeName: string;
    role: string | null;
    plan: string;
    trialEndsAt: Date | string | null;
    emailVerified: boolean;
    onboardingCompleted: boolean;
    lastActive?: number;
    error?: string;
  }
}
