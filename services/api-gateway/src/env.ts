import * as dotenv from "dotenv";
import { z } from "zod";
import { parseEnv } from "@vayva/shared";

dotenv.config();

const apiGatewayEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  SERVICE_URL_AUTH: z.string().url(),
  SERVICE_URL_ORDERS: z.string().url(),
  SERVICE_URL_PAYMENTS: z.string().url(),
  SERVICE_URL_CORE: z.string().url(),
  SERVICE_URL_WHATSAPP: z.string().url(),
  SERVICE_URL_AI: z.string().url(),
  SERVICE_URL_APPROVALS: z.string().url(),
  SERVICE_URL_NOTIFICATIONS: z.string().url(),
  SERVICE_URL_SUPPORT: z.string().url(),
  SERVICE_URL_MERCHANT_ADMIN: z.string().url(),
  SERVICE_URL_OPS_CONSOLE: z.string().url(),
  SERVICE_URL_STOREFRONT: z.string().url(),
});

export type ApiGatewayEnv = z.infer<typeof apiGatewayEnvSchema>;

let env: ApiGatewayEnv;
try {
  env = parseEnv(apiGatewayEnvSchema);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Invalid environment variables: ${message}`);
  process.exit(1);
}

export { env };
