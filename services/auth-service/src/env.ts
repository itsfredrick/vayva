import { z } from "zod";
import { parseEnv } from "@vayva/shared";

const envSchema = z.object({
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    PORT: z.coerce.number().int().positive().default(3011),
    HOST: z.string().default("0.0.0.0"),

    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM_EMAIL: z.string().optional(),
    AUTH_OTP_FROM_EMAIL: z.string().optional(),
});

export type AuthServiceEnv = z.infer<typeof envSchema>;

export function getEnv(rawEnv: Record<string, string | undefined> = process.env as Record<string, string | undefined>): AuthServiceEnv {
    return parseEnv(envSchema, rawEnv);
}
