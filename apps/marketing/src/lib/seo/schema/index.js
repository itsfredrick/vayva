// src/lib/seo/schema/index.ts
import { pageTypeFor } from "../route-policy";
import { homeSchema } from "./home";
import { articleSchema } from "./article";
import { faqSchema } from "./faq";
import { webPageSchema } from "./webpage";
export function buildJsonLdFor(path, ctx) {
    const pt = pageTypeFor(path);
    switch (pt) {
        case "home":
            return homeSchema();
        case "blog_post":
            return articleSchema(path, ctx);
        case "compare_page":
            return [webPageSchema(path, ctx), faqSchema(path, ctx)];
        default:
            return webPageSchema(path, ctx);
    }
}
