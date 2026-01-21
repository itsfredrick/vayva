import "next-auth";

declare module "next-auth" {
  interface User {
    storeId: string;
    storeName: string;
    role: string;
    emailVerified: boolean;
    onboardingCompleted: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      storeId: string;
      storeName: string;
      role: string;
      onboardingCompleted: boolean;
      emailVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId: string;
    storeName: string;
    role: string;
    onboardingCompleted: boolean;
    emailVerified: boolean;
  }
}
