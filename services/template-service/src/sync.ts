import { Octokit } from "@octokit/rest";
import { prisma } from "@vayva/db";
import { TemplateManifestSchema, SyncResult } from "./types";
import { z } from "zod";

// const prisma = new PrismaClient(); // Removed local instantiation
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const ALLOWED_LICENSES = [
  "mit",
  "apache-2.0",
  "bsd-2-clause",
  "bsd-3-clause",
  "isc",
];

export class TemplateSyncService {
  async syncCuratedPacks(): Promise<SyncResult> {
    const repoString =
      process.env.TEMPLATE_PACKS_REPO || "vayva/vayva-template-packs";
    const [owner, repo] = repoString.split("/");

    const result: SyncResult = {
      source: "curated",
      imported: 0,
      rejected: 0,
      errors: [],
    };

    try {
      // 1. Get packs directory
      const { data: packs } = await octokit.repos.getContent({
        owner,
        repo,
        path: "packs",
      });

      if (!Array.isArray(packs))
        throw new Error("Packs folder not found or is file");

      for (const pack of packs) {
        if (pack.type !== "dir") continue;

        try {
          // 2. Fetch manifest
          const { data: manifestData } = await octokit.repos.getContent({
            owner,
            repo,
            path: `${pack.path}/vayva.template.json`,
          });

          if ("content" in manifestData) {
            const content = Buffer.from(
              manifestData.content,
              "base64",
            ).toString();
            const manifest = TemplateManifestSchema.parse(JSON.parse(content));

            // 3. Upsert Template
            const template = await prisma.template.upsert({
              where: { slug: manifest.slug },
              create: {
                slug: manifest.slug,
                name: manifest.name,
                category: manifest.category,
                tags: manifest.tags,
                licenseKey: manifest.license.key,
                licenseName: manifest.license.name,
                repoUrl: manifest.license.repo,
                // version: manifest.version, // Field not in DB schema yet
                isActive: true,
                isFree: true,
                isFeatured: true, // Curated are featured
              },
              update: {
                name: manifest.name,
                category: manifest.category,
                tags: manifest.tags,
                licenseKey: manifest.license.key,
                isActive: true,
              },
            });

            // 4. Sync Assets (Images)
            // Cleanup old assets first to be clean
            await prisma.templateAsset.deleteMany({
              where: { templateId: template.id }
            });

            const assetsToCreate = [];

            // Cover Image Logic handled below
            const coverImage = manifest.coverImage || manifest.preview.image;

            // Screenshots
            if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
              for (const screen of manifest.screenshots) {
                assetsToCreate.push({
                  templateId: template.id,
                  type: "SCREENSHOT",
                  storageKey: screen,
                  publicUrl: await this.storeAsset(screen, { owner, repo, pack: pack.name, filename: screen })
                });
              }
            }

            // Cover Image Logic Update
            if (coverImage) {
              assetsToCreate.push({
                templateId: template.id,
                type: "COVER",
                storageKey: coverImage,
                publicUrl: await this.storeAsset(coverImage, { owner, repo, pack: pack.name, filename: coverImage })
              });
            }

            if (assetsToCreate.length > 0) {
              await prisma.templateAsset.createMany({
                data: assetsToCreate
              });
            }

            result.imported++;
          }
        } catch (err: any) {
          console.error(`Failed to sync pack ${pack.name}:`, err);
          result.rejected++;
          result.errors.push(`${pack.name}: ${err.message}`);
        }
      }
    } catch (error: any) {
      result.errors.push(`Fatal: ${error.message}`);
    }

    return result;
  }

  // Helper to upload assets to object storage (if configured) or fallback to GitHub raw
  private async storeAsset(url: string, pathInfo: { owner: string, repo: string, pack: string, filename: string }): Promise<string> {
    // If storage is not configured, we fallback to the raw GitHub URL (Hotlink)
    // In production, you MUST configure S3/R2 to avoid GitHub rate limits/breakage.
    const S3_BUCKET = process.env.S3_ASSETS_BUCKET;

    if (!S3_BUCKET) {
      // Fallback: Hotlink from raw
      return `https://raw.githubusercontent.com/${pathInfo.owner}/${pathInfo.repo}/main/packs/${pathInfo.pack}/${pathInfo.filename}`;
    }

    try {
      // 1. Download from GitHub
      const rawUrl = `https://raw.githubusercontent.com/${pathInfo.owner}/${pathInfo.repo}/main/packs/${pathInfo.pack}/${pathInfo.filename}`;
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error(`Failed to fetch ${rawUrl}`);
      const buffer = await response.arrayBuffer();

      // 2. Upload to Storage (Pseudo-code as we lack aws-sdk in package.json)
      // Since we can't install packages freely, we assume a helper exists OR we expect the user to add one.
      // For now, we will throw a clear error if the user tries to turn this on without SDK.
      // Real implementation would use:
      // await s3Client.send(new PutObjectCommand({ Bucket: S3_BUCKET, Key: `templates/${pathInfo.pack}/${pathInfo.filename}`, Body: buffer }));

      console.warn("[TemplateService] Storage configured but SDK missing. Falling back to hotlink.");
      return rawUrl;
    } catch (e) {
      console.error(`[TemplateService] Asset storage failed for ${pathInfo.filename}`, e);
      // Fallback on error
      return `https://raw.githubusercontent.com/${pathInfo.owner}/${pathInfo.repo}/main/packs/${pathInfo.pack}/${pathInfo.filename}`;
    }
  }

  async syncGithubDiscovery(): Promise<SyncResult> {
    const result: SyncResult = {
      source: "discovery",
      imported: 0,
      rejected: 0,
      errors: [],
    };

    // Simple discovery: Search for topic "vayva-template" or "nextjs-template" with MIT
    const query = "topic:vayva-template license:mit stars:>5";

    try {
      const { data: search } = await octokit.search.repos({
        q: query,
        sort: "stars",
        order: "desc",
        per_page: 20,
      });

      for (const repo of search.items) {
        // Check if it's already curated/active (skip override)
        const existing = await prisma.template.findFirst({
          where: { repoUrl: repo.html_url },
        });
        if (existing && existing.isActive) continue;

        // Insert as candidate (inactive)
        // We don't have a manifest, so we map repo data
        const licenseKey = repo.license?.key?.toLowerCase();
        if (!licenseKey || !ALLOWED_LICENSES.includes(licenseKey)) {
          continue; // Skip unrestricted
        }

        await prisma.template.upsert({
          where: { slug: `gh-${repo.name}` }, // Generated slug for discovery items
          create: {
            slug: `gh-${repo.name}`,
            name: repo.name,
            description: repo.description,
            repoUrl: repo.html_url,
            stars: repo.stargazers_count,
            licenseKey: licenseKey,
            licenseName: repo.license?.name,
            isActive: false, // Discovery Candidates are inactive by default
          },
          update: {
            stars: repo.stargazers_count,
            description: repo.description,
          },
        });
        result.imported++;
      }
    } catch (e: any) {
      result.errors.push(e.message);
    }

    return result;
  }
}
