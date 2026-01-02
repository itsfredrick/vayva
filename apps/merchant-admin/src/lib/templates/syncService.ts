import { prisma } from "@vayva/db";
import { z } from "zod";

// Schema for Manifest Validation
const ManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  author: z.string().optional(),
  previewImageUrl: z.string().url(),
  tags: z.array(z.string()),
  supportedPages: z.record(z.string(), z.boolean()),
  configSchema: z.record(z.string(), z.any()).optional(),
});

// Test Remote Sources (In real life, these would be fetch calls to raw.githubusercontent.com)
const APPROVED_SOURCES = [
  {
    id: "vayva-default",
    name: "Vayva Standard",
    description: "The clean, glass-morphism default theme for Vayva stores.",
    version: "1.0.0",
    author: "Vayva HQ",
    previewImageUrl: "https://placehold.co/600x400/000/FFF?text=Vayva+Standard",
    tags: ["minimal", "glass", "default"],
    supportedPages: { home: true, product: true, cart: true, checkout: true },
    configSchema: {
      colors: { type: "color", default: "#000000" },
      radius: { type: "number", default: 8 },
    },
  },
  {
    id: "fashion-editorial",
    name: "Editorial Fashion",
    description: "Image-heavy layout perfect for clothing brands.",
    version: "1.0.2",
    author: "Vayva Community",
    previewImageUrl:
      "https://placehold.co/600x400/333/FFF?text=Fashion+Editorial",
    tags: ["fashion", "bold", "image-centric"],
    supportedPages: { home: true, product: true, lookbook: true },
    configSchema: {
      heroLayout: { type: "select", options: ["full", "split"] },
    },
  },
];

export class TemplateSyncService {
  static async syncTemplates() {
    let synced = 0;
    let errors = 0;

    for (const source of APPROVED_SOURCES) {
      try {
        // 1. Validate
        const manifest = ManifestSchema.parse(source);

        // 2. Upsert
        await prisma.templateManifest.upsert({
          where: { id: manifest.id },
          update: {
            name: manifest.name,
            description: manifest.description,
            version: manifest.version,
            previewImageUrl: manifest.previewImageUrl,
            tags: manifest.tags,
            supportedPages: manifest.supportedPages as any,
            configSchema: (manifest.configSchema as any) || {},
            source: "oss_sync",
            updatedAt: new Date(),
          },
          create: {
            id: manifest.id,
            name: manifest.name,
            description: manifest.description,
            version: manifest.version,
            author: manifest.author,
            previewImageUrl: manifest.previewImageUrl,
            tags: manifest.tags,
            supportedPages: manifest.supportedPages as any,
            configSchema: (manifest.configSchema as any) || {},
            source: "oss_sync",
          },
        });
        synced++;
      } catch (e: any) {
        console.error(`Failed to sync template ${source.id}`, e);
        errors++;
      }
    }

    return { synced, errors };
  }
}
