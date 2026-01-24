import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Simplified Auth Options for Marketplace Demo
// In production, this would likely share the session with the main Vayva app
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(_credentials) {
                // Real-time user table verification
                // For Development Phase, returning a mock Buyer user
                return {
                    id: "usr_buyer_demo_123",
                    name: "Demo Buyer",
                    email: "buyer@demo.com",
                    image: null
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub!;
            }
            return session;
        }
    }
};
