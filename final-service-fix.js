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
    "services/marketplace-service/src/routes.ts",
    "services/catalog-service/src/routes.ts",
    "services/orders-service/src/routes.ts",
    "services/payments-service/src/routes.ts",
    "services/approvals-service/src/routes.ts",
    "services/notifications-service/src/routes.ts"
];

services.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');

    // Refine req.body when used directly
    content = content.replace(/req\.body\b(?!\s+as)/g, 'req.body as any');
    // Refine req.query when used directly
    content = content.replace(/req\.query\b(?!\s+as)/g, 'req.query as any');

    // Cleanup double wrapping etc.
    content = content.replace(/req\.body as any as any/g, 'req.body as any');
    content = content.replace(/req\.query as any as any/g, 'req.query as any');

    fs.writeFileSync(fullPath, content);
    console.log(`Final polish for ${file}`);
});
