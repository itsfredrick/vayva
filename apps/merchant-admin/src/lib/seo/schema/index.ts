// src/lib/seo/schema/index.ts
import { pageTypeFor } from "../route-policy";
import { homeSchema } from "./home";
import { templateSchema } from "./template";
import { collectionSchema } from "./collection";
import { storeSchema } from "./store";
import { articleSchema } from "./article";
import { faqSchema } from "./faq";
import { webPageSchema } from "./webpage";

export function buildJsonLdFor(path: string, ctx?: Record<string, any>) {
    const pt = pageTypeFor(path);
    switch (pt) {
        case "home": return homeSchema();
        case "template_detail": return templateSchema(path, ctx);
        case "market_category":
        case "market_products":
        case "market_sellers":
            return collectionSchema(path, ctx);
        case "storefront": return storeSchema(path, ctx);
        case "blog_post": return articleSchema(path, ctx);
        case "compare_page": return [webPageSchema(path, ctx), faqSchema(path, ctx)];
        default: return webPageSchema(path, ctx);
    }
}
