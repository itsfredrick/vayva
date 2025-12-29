#!/usr/bin/env node

/**
 * Bundle Size Checker
 * 
 * Enforces performance budgets by checking build output sizes.
 * Fails CI if bundle size exceeds defined limits.
 */

import { statSync, readdirSync } from 'fs';
import { join } from 'path';

// Bundle size budgets in bytes
const BUDGETS = {
    'apps/merchant-admin/.next/static/chunks': 800 * 1024, // 800KB for admin chunks
    'apps/storefront/.next/static/chunks': 600 * 1024, // 600KB for storefront
};

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function getDirSize(dirPath) {
    let totalSize = 0;

    try {
        const files = readdirSync(dirPath);

        for (const file of files) {
            const filePath = join(dirPath, file);
            const stat = statSync(filePath);

            if (stat.isDirectory()) {
                totalSize += getDirSize(filePath);
            } else {
                totalSize += stat.size;
            }
        }
    } catch (err) {
        // Directory might not exist yet
        return 0;
    }

    return totalSize;
}

console.log('📦 Checking bundle sizes...\n');

let violations = 0;
let warnings = 0;

for (const [path, maxSize] of Object.entries(BUDGETS)) {
    const fullPath = join(process.cwd(), path);

    try {
        const size = getDirSize(fullPath);
        const percentage = ((size / maxSize) * 100).toFixed(1);

        if (size > maxSize) {
            console.error(`❌ ${path}: ${formatSize(size)} exceeds budget of ${formatSize(maxSize)} (${percentage}%)`);
            violations++;
        } else if (size > maxSize * 0.9) {
            console.warn(`⚠️  ${path}: ${formatSize(size)} is close to budget of ${formatSize(maxSize)} (${percentage}%)`);
            warnings++;
        } else {
            console.log(`✅ ${path}: ${formatSize(size)} (${percentage}% of budget)`);
        }
    } catch (err) {
        console.warn(`⚠️  Could not check ${path}: ${err.message}`);
    }
}

console.log('');

if (violations > 0) {
    console.error(`❌ ${violations} bundle size violation(s) found\n`);
    process.exit(1);
} else if (warnings > 0) {
    console.log(`✅ All bundles within budget (${warnings} warning(s))\n`);
    process.exit(0);
} else {
    console.log('✅ All bundles within budget\n');
    process.exit(0);
}
