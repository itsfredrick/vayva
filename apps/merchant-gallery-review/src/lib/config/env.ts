import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional().default("redis://localhost:6379"),

  // App URLs
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_DOMAIN: z.string().default("vayva.ng"),

  // Auth / Secrets
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(), // In Vercel usage often optional, but good to validate if local

  // WhatsApp
  WHATSAPP_ACCESS_TOKEN: z.string().min(1).optional(), // Optional for now if not strictly integrated yet
  WHATSAPP_VERIFY_TOKEN: z.string().min(1).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),

  // Payment (Nigeria First)
  PAYSTACK_SECRET_KEY: z.string().startsWith("sk_").optional(),
  PAYSTACK_PUBLIC_KEY: z.string().startsWith("pk_").optional(),

  // Misc
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Admin Break Glass
  ADMIN_ALLOWLIST: z.string().optional().describe("Comma separated emails"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  // In development we might want to warn, but in production we must crash
  if (process.env.NODE_ENV === "production" || process.env.STRICT_ENV) {
    throw new Error("Invalid environment variables");
  }
}

export const env = _env.success ? _env.data : (process.env as any);
