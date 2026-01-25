/* eslint-disable */
const fs = require('fs');
const path = require('path');

const patterns = [
    {
        // Undo botched destructuring spread
        regex: /\.\.\.\(([a-z0-9_]+)\s+as\s+any\)/gi,
        replace: '...$1'
    },
    {
        // Undo botched 'new Set' spread
        regex: /\.\.\.\(new\s+as\s+any\)\s+Set/gi,
        replace: '...new Set'
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
                console.log(`Cleaned ${fullPath}`);
            }
        }
    }
}

const targetDirs = [
    path.join(__dirname, 'apps/merchant-admin/src'),
    path.join(__dirname, 'apps/ops-console/src'),
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Scanning ${dir}...`);
        processDirectory(dir);
    }
});
