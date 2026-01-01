import "next-auth";

declare module "next-auth" {
  interface User {
    storeId: string;
    storeName: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      storeId: string;
      storeName: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId: string;
    storeName: string;
    role: string;
  }
}
