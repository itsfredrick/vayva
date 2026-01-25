const fs = require('fs');
const path = require('path');

const files = [
    "services/ai-orchestrator/src/controller.ts",
    "services/fulfillment-service/src/carriers/kwik.ts",
    "services/compliance-service/src/index.ts",
    "services/payments-service/src/controller.ts",
    "services/payments-service/src/worker.ts",
    "services/whatsapp-service/src/services/conversation.store.ts",
    "services/payments-service/src/wallet.controller.ts",
    "services/whatsapp-service/src/providers/meta.provider.ts",
    "services/whatsapp-service/src/controller.ts"
];

files.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');

    // Systemic fix for unknown error message access
    content = content.replace(/errorMessage: (e|error|err)\.message/g, (match, p1) => `errorMessage: (${p1} instanceof Error ? ${p1}.message : String(${p1}))`);
    content = content.replace(/error\.message/g, '(error instanceof Error ? error.message : String(error))');
    content = content.replace(/error\.response\?\.data/g, '((error as any).response?.data)');

    fs.writeFileSync(fullPath, content);
    console.log(`Secured error handling in ${file}`);
});
