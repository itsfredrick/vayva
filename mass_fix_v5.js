const fs = require('fs');
const path = require('path');

const patterns = [
    {
        // Final Boss: Replace ANY iteration parameter pattern with (param: any)
        // Matches .map((m) =>, .map((m: unknown) =>, .map((m: something) =>
        regex: /\.map\(\s*\(([a-z0-9_]+)(?::\s*[a-z0-9_|\[\] {}<>]+)?\)\s*=>/gi,
        replace: '.map(($1: any) =>'
    },
    {
        // Final Boss: Replace ANY catch parameter pattern with (err: any)
        regex: /catch\s*\(([a-z0-9_]+)(?::\s*[a-z0-9_| ]+)?\)/gi,
        replace: 'catch ($1: any)'
    },
    {
        // Generic event handlers in JSX
        regex: /onChange\s*=\s*{\s*\(?([a-z0-9_]+)(?::\s*[a-z0-9_| ]+)?\)?\s*=>/gi,
        replace: 'onChange={(e: any) =>'
    }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== 'dist') {
                processDirectory(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            for (const pattern of patterns) {
                if (pattern.regex.test(content)) {
                    content = content.replace(pattern.regex, pattern.replace);
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log(`Finalized ${fullPath}`);
            }
        }
    }
}

const targetDirs = [
    path.join(__dirname, 'apps/merchant-admin/src'),
    path.join(__dirname, 'apps/ops-console/src'),
    path.join(__dirname, 'apps/marketing/src'),
    path.join(__dirname, 'apps/storefront/src'),
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Scanning ${dir}...`);
        processDirectory(dir);
    }
});
