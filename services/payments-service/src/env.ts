import * as dotenv from "dotenv";
import { z } from "zod";
import { parseEnv } from "@vayva/shared";

dotenv.config();

const paymentsEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3006),
    HOST: z.string().default("0.0.0.0"),

    PAYSTACK_MOCK: z
      .string()
      .optional()
      .transform((v) => v === "true"),
    PAYSTACK_SECRET_KEY: z.string().optional(),

    STOREFRONT_URL: z.string().url().optional().default("http://localhost:3001"),

    SERVICE_URL_NOTIFICATIONS: z
      .string()
      .url()
      .optional()
      .default("http://localhost:3008"),

    REDIS_URL: z.string().url().optional().default("redis://localhost:6379"),

    REDIS_HOST: z.string().optional(),
    REDIS_PORT: z.coerce.number().int().positive().optional(),
    REDIS_PASSWORD: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.PAYSTACK_MOCK && !val.PAYSTACK_SECRET_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["PAYSTACK_SECRET_KEY"],
        message: "PAYSTACK_SECRET_KEY is required when PAYSTACK_MOCK is not true",
      });
    }
  });

export type PaymentsServiceEnv = z.infer<typeof paymentsEnvSchema>;

let env: PaymentsServiceEnv;
try {
  env = parseEnv(paymentsEnvSchema);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Invalid environment variables: ${message}`);
  process.exit(1);
}

export { env };
