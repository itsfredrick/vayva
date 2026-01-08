import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@vayva/db";
import bcrypt from "bcryptjs";

export const authOptions: any = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            memberships: {
              where: { status: "active" },
              include: { store: true },
            },
          },
        });

        if (!user || !user.isEmailVerified) {
          throw new Error("Invalid credentials or email not verified");
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Get primary store (first active membership)
        const primaryMembership = user.memberships[0];
        if (!primaryMembership) {
          throw new Error("No active store membership found");
        }

        return {
          id: user.id,
          email: user.email,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email,
          storeId: primaryMembership.storeId,
          storeName: primaryMembership.store.name,
          role: primaryMembership.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // Add custom fields to JWT on initial sign in
      if (user) {
        token.storeId = user.storeId;
        token.storeName = user.storeName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Add custom fields to session
      if (session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).storeId = token.storeId;
        (session.user as any).storeName = token.storeName;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export getServerSession for compatibility
export { getServerSession } from "next-auth";
