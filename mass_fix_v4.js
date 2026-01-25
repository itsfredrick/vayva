const fs = require('fs');
const path = require('path');

const patterns = [
    {
        // Rule B: Iteration over unknown (Explicitly typed as unknown)
        regex: /\.map\(\s*\(([a-z0-9_]+):\s*unknown\)\s*=>/gi,
        replace: '.map(($1: any) =>'
    },
    {
        // Rule B: Iteration over unknown (Untyped)
        regex: /\.map\(\s*\(([a-z0-9_]+)\)\s*=>/gi,
        replace: '.map(($1: any) =>'
    },
    {
        // Rule D: Catch block with explicit unknown
        regex: /catch\s*\(([a-z0-9_]+):\s*unknown\)/gi,
        replace: 'catch ($1: any)'
    },
    {
        // Rule B: Generic unknown in event handlers
        regex: /\((e|event|val|v|data|item):\s*unknown\)/g,
        replace: '($1: any)'
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
                console.log(`Updated ${fullPath}`);
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
