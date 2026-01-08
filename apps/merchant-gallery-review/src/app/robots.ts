import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SEO_CONFIG.siteUrl;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/auth/",
        "/login/",
        "/signup/",
        "/onboarding/",
        "/preview/",
        "/designer/",
        "/control-center/",
        "/ops/",
        "/invite/",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
