import { APP_URL } from "@/lib/constants";
export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/dashboard/", "/ops-console/", "/merchant-admin/"],
        },
        sitemap: `${APP_URL}/sitemap.xml`,
    };
}
