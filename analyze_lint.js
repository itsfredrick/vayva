const fs = require('fs');
const report = JSON.parse(fs.readFileSync('lint_report.json', 'utf8'));

const summary = {
    production: { errors: 0, warnings: 0, files: [] },
    marketing: { errors: 0, warnings: 0, files: [] },
    glue: { errors: 0, warnings: 0, files: [] },
    tooling: { errors: 0, warnings: 0, files: [] },
    ignored: { errors: 0, warnings: 0, files: [] }
};

report.forEach(file => {
    const path = file.filePath;
    let category = 'production';

    if (path.includes('marketing')) category = 'marketing';
    else if (path.includes('singularity_fix') || path.includes('test') || path.includes('scripts')) category = 'tooling';
    else if (path.includes('route.ts') || path.includes('middleware.ts') || path.includes('server.ts')) category = 'glue';
    else if (path.includes('.next') || path.includes('dist') || path.includes('playwright-report')) category = 'ignored';

    const errors = file.messages.filter(m => m.severity === 2).length;
    const warnings = file.messages.filter(m => m.severity === 1).length;

    summary[category].errors += errors;
    summary[category].warnings += warnings;
    if (errors > 0) {
        summary[category].files.push({ path: path.split('/').pop(), count: errors });
    }
});

console.log(JSON.stringify(summary, null, 2));
