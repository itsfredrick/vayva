const fs = require('fs');
const path = require('path');

const patterns = [
    {
        // Rule D: Catch block narrowing
        regex: /catch\s*\((error|err)\)/g,
        replace: 'catch ($1: any)'
    },
    {
        // Rule B: Generic unknown casts in event handlers
        regex: /\((e|event):\s*unknown\)/g,
        replace: '($1: any)'
    },
    {
        // Framework Glue: API Route request typing
        regex: /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*request:\s*unknown/g,
        replace: 'export async function $1(request: Request'
    },
    {
        // Framework Glue: NextRequest typing (if used)
        regex: /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*req:\s*any/g,
        replace: 'export async function $1(req: Request'
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
];

targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`Scanning ${dir}...`);
        processDirectory(dir);
    }
});
