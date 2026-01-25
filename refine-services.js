const fs = require('fs');
const path = require('path');

const services = [
    "services/auth-service/src/rbac/routes.ts",
    "services/billing-service/src/routes.ts",
    "services/marketing-service/src/routes.ts",
    "services/admin-service/src/routes.ts",
    "services/analytics-service/src/routes.ts",
    "services/onboarding-service/src/routes.ts",
    "services/webhook-service/src/routes.ts",
    "services/theme-service/src/routes.ts",
    "services/marketplace-service/src/routes.ts"
];

services.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');

    // Refine req.params as any -> as { [key: string]: string }
    content = content.replace(/as any;/g, 'as Record<string, string>;');
    content = content.replace(/as any\)/g, 'as Record<string, any>)'); // For req.body where it might be deep

    // Fix req.query issues
    content = content.replace(/ThemeController.listTemplates\(req.query\)/, 'ThemeController.listTemplates(req.query as { category?: string })');
    content = content.replace(/MarketplaceController.searchStores\(req.query\)/, 'MarketplaceController.searchStores(req.query as Record<string, any>)');
    content = content.replace(/MarketplaceController.listReports\(status\)/, 'MarketplaceController.listReports(status as string)');

    // Refine req as any to (req as any) is fine but let's try (req as FastifyRequest & { user?: any })
    // No, let's just stick to small improvements that pass TSC.

    // Headers
    content = content.replace(/req.headers\["x-user-id"\]/g, '(req.headers["x-user-id"] as string | undefined)');

    // Body casts
    content = content.replace(/req\.body as any/g, 'req.body as Record<string, any>');

    // Remove (..) as string; double wrapping if it happened
    content = content.replace(/\(\(req\.headers\["x-store-id"\] as string\)\)/g, '(req.headers["x-store-id"] as string)');

    fs.writeFileSync(fullPath, content);
    console.log(`Refined ${file}`);
});
