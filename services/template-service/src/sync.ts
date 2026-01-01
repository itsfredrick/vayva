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
            await prisma.template.upsert({
              where: { slug: manifest.slug },
              create: {
                slug: manifest.slug,
                name: manifest.name,
                category: manifest.category,
                tags: manifest.tags,
                licenseKey: manifest.license.key,
                licenseName: manifest.license.name,
                repoUrl: manifest.license.repo,
                version: manifest.version, // Initial version
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

            // TODO: Handle Asset storage (preview images) here later
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
          where: { slug: `gh-${repo.name}` }, // Temporary slug
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
