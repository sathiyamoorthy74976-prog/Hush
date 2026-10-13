import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const HEX = /#(?:[0-9a-fA-F]{3,8})\b/;
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.expo',
  'dist',
  'coverage',
  '.cursor',
]);
const ALLOWED = new Set([join('mobile', 'theme', 'colors.ts')]);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

describe('hex literals', () => {
  it('exist only in theme/colors.ts', () => {
    const offenders: string[] = [];
    for (const file of walk(ROOT)) {
      const rel = relative(ROOT, file).split(sep).join('/');
      if (ALLOWED.has(rel.split('/').join(sep)) || rel === 'mobile/theme/colors.ts') {
        continue;
      }
      const text = readFileSync(file, 'utf8');
      const lines = text.split(/\r?\n/);
      lines.forEach((line, i) => {
        if (HEX.test(line)) {
          offenders.push(`${rel}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
