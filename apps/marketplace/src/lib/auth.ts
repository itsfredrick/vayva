import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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
    pages: {
        signIn: "/signin",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const email = (credentials?.email || "").trim().toLowerCase();
                const password = credentials?.password || "";
                if (!email || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        firstName: true,
                        lastName: true,
                    },
                });

                if (!user) return null;

                const ok = await bcrypt.compare(password, user.password);
                if (!ok) return null;

                const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

                return {
                    id: user.id,
                    name,
                    email: user.email,
                    image: null,
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
