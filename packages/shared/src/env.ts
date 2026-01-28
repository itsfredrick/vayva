import { z } from "zod";

type RawEnv = Record<string, string | undefined>;

export function parseEnv<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  rawEnv: RawEnv = process.env as RawEnv,
): z.infer<TSchema> {
  const parsed = schema.safeParse(rawEnv);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    throw new Error(details);
  }
  return parsed.data as z.infer<TSchema>;
}
