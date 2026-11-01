const fs = require('fs');
const path = require('path');

// Read files in web/app/dashboard/sites/[id]
const dir = 'app/dashboard/sites/[id]';
function getFiles(d) {
  let results = [];
  const list = fs.readdirSync(d);
  for (const file of list) {
    const full = path.join(d, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(full);
    }
  }
  return results;
}

const files = getFiles(dir);
console.log('Scanning files:', files);

// Also scan components/templates/editor.tsx or other editor components
const otherFiles = ['components/templates/editor.tsx', 'components/editor-onboarding-modal.tsx', 'components/location-picker.tsx', 'components/menu-catalog-form.tsx'];
for (const of of otherFiles) {
  if (fs.existsSync(of)) files.push(of);
}

// Regex to find t("...")
const tCalls = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/\bt\(\s*["']([^"']+)["']/g);
  for (const m of matches) {
    tCalls.add(m[1]);
  }
}

console.log('Total unique t() keys found:', tCalls.size);

// Read translations.ts and check if keys exist
const transFile = fs.readFileSync('lib/i18n/translations.ts', 'utf8');

// Quick check for keys
const missingInType = [];
for (const key of tCalls) {
  const parts = key.split('.');
  const last = parts[parts.length - 1];
  if (!transFile.includes(last + ':')) {
    missingInType.push(key);
  }
}

console.log('Potentially missing keys in translations.ts:', missingInType);

