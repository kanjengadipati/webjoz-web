import fs from 'fs';
import path from 'path';

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

const otherFiles = ['components/templates/editor.tsx', 'components/editor-onboarding-modal.tsx', 'components/location-picker.tsx', 'components/menu-catalog-form.tsx'];
for (const ofile of otherFiles) {
  if (fs.existsSync(ofile)) files.push(ofile);
}

const tCalls = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/\bt\(\s*["']([^"']+)["']/g);
  for (const m of matches) {
    tCalls.add(m[1]);
  }
}

console.log('Total unique t() keys found:', tCalls.size);

const transFile = fs.readFileSync('lib/i18n/translations.ts', 'utf8');

const missingInType = [];
for (const key of tCalls) {
  const parts = key.split('.');
  const last = parts[parts.length - 1];
  if (!transFile.includes(last + ':')) {
    missingInType.push(key);
  }
}

console.log('Potentially missing keys in translations.ts:', missingInType);
