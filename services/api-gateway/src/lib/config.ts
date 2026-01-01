import { EnvSchema } from "@vayva/shared";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

// Service Registry Schema
const ServiceSchema = z.object({
  AUTH: z.string().url(),
  ORDERS: z.string().url(),
  PAYMENTS: z.string().url(),
  CORE: z.string().url(),
  WHATSAPP: z.string().url(),
  AI: z.string().url(),
  APPROVALS: z.string().url(),
  NOTIFICATIONS: z.string().url(),
  SUPPORT: z.string().url(),
  MERCHANT_ADMIN: z.string().url(),
  OPS_CONSOLE: z.string().url(),
  STOREFRONT: z.string().url(),
});

const serviceConfig = ServiceSchema.safeParse({
  AUTH: process.env.SERVICE_URL_AUTH,
  ORDERS: process.env.SERVICE_URL_ORDERS,
  PAYMENTS: process.env.SERVICE_URL_PAYMENTS,
  CORE: process.env.SERVICE_URL_CORE,
  WHATSAPP: process.env.SERVICE_URL_WHATSAPP,
  AI: process.env.SERVICE_URL_AI,
  APPROVALS: process.env.SERVICE_URL_APPROVALS,
  NOTIFICATIONS: process.env.SERVICE_URL_NOTIFICATIONS,
  SUPPORT: process.env.SERVICE_URL_SUPPORT,
  MERCHANT_ADMIN: process.env.SERVICE_URL_MERCHANT_ADMIN,
  OPS_CONSOLE: process.env.SERVICE_URL_OPS_CONSOLE,
  STOREFRONT: process.env.SERVICE_URL_STOREFRONT,
});

if (!serviceConfig.success) {
  console.error("Invalid service configuration (Missing SERVICE_URL_* env vars):", serviceConfig.error.format());
  process.exit(1);
}

export const config = {
  ...parsed.data,
  services: serviceConfig.data,
};

