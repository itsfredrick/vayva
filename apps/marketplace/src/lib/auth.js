import CredentialsProvider from "next-auth/providers/credentials";
// Simplified Auth Options for Marketplace Demo
// In production, this would likely share the session with the main Vayva app
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
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
                session.user.id = token.sub;
            }
            return session;
        }
    }
};
