// Removes the Vanilla framework from component MDX pages:
//  1) drops 'Vanilla' from `<Tabs items={[...]}>` arrays
//  2) removes each `<Tab value="Vanilla"> ... </Tab>` block (and surrounding blank lines)
// Idempotent. Pass --write to apply; otherwise dry-run (reports changes).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const write = process.argv.includes('--write');
const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', 'content', 'docs', 'components');

function stripVanilla(src) {
  let out = src;

  // 1) Remove 'Vanilla' (with optional trailing comma/space) from items arrays.
  out = out.replace(/items=\{\[([^\]]*)\]\}/g, (m, inner) => {
    const items = inner
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s.replace(/['"]/g, '') !== 'Vanilla');
    return `items={[${items.join(', ')}]}`;
  });

  // 2) Remove the <Tab value="Vanilla"> ... </Tab> block, plus trailing blank lines.
  out = out.replace(
    /\n*<Tab value="Vanilla">[\s\S]*?<\/Tab>\n*/g,
    '\n\n',
  );

  return out;
}

let changed = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
  const p = join(dir, f);
  const src = readFileSync(p, 'utf8');
  const next = stripVanilla(src);
  if (next !== src) {
    changed++;
    const hadTab = /<Tab value="Vanilla">/.test(src);
    const stillHas = /Vanilla/.test(next);
    console.log(`${write ? 'fixed' : 'would fix'}: ${f}${stillHas ? '  ⚠ still mentions Vanilla' : ''}${hadTab ? '' : '  (array only)'}`);
    if (write) writeFileSync(p, next);
  }
}
console.log(`\n${changed} file(s) ${write ? 'changed' : 'to change'}.`);
