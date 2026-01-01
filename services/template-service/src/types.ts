import { z } from "zod";

export const TemplateManifestSchema = z.object({
  slug: z.string(),
  name: z.string(),
  category: z.string(), // 'Fashion', 'General', etc.
  tags: z.array(z.string()),
  license: z.object({
    key: z.string(),
    name: z.string(),
    repo: z.string().optional(),
  }),
  version: z.string(),
  preview: z.object({
    image: z.string(),
    accent: z.string().optional(),
  }),
  layout: z
    .object({
      sections: z.array(z.string()),
      styleVariant: z.string().optional(),
    })
    .optional(),
  themeTokens: z.record(z.string()).optional(),
});

export type TemplateManifest = z.infer<typeof TemplateManifestSchema>;

export interface SyncResult {
  source: string;
  imported: number;
  rejected: number;
  errors: string[];
}
