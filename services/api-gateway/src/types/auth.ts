import "@fastify/jwt";

export interface UserPayload {
    sub: string;
    email?: string;
    aud: "merchant" | "customer" | "ops" | "ops-pre-mfa";
    role?: string;
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: UserPayload;
        user: UserPayload;
    }
}

declare module "fastify" {
    interface FastifyRequest {
        user: UserPayload;
    }
}
