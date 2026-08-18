import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');

console.log('🔍 Auditing all JavaScript / JSX imports in:', srcDir);

let errorsFound = 0;

function auditDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      auditDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineNum) => {
        const match = line.match(/from\s+['"]([^'"]+)['"]/);
        if (match) {
          const importPath = match[1];
          if (importPath.startsWith('.')) {
            const dirOfFile = path.dirname(fullPath);
            const resolved = path.resolve(dirOfFile, importPath);
            const exists =
              fs.existsSync(resolved) ||
              fs.existsSync(resolved + '.jsx') ||
              fs.existsSync(resolved + '.js') ||
              fs.existsSync(resolved + '.svg') ||
              fs.existsSync(resolved + '.css') ||
              fs.existsSync(path.join(resolved, 'index.jsx')) ||
              fs.existsSync(path.join(resolved, 'index.js'));

            if (!exists) {
              console.error(`❌ BROKEN IMPORT at ${fullPath}:${lineNum + 1} -> ${importPath}`);
              errorsFound++;
            }
          }
        }
      });
    }
  }
}

auditDir(srcDir);
if (errorsFound === 0) {
  console.log('✅ ALL IMPORTS VERIFIED. 0 broken import paths.');
} else {
  console.error(`⚠️ Found ${errorsFound} broken imports.`);
}
