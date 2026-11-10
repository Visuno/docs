#!/usr/bin/env node
// scripts/sync-components.mjs
// Syncs the React reference components from the sibling `components` repo into docs/visuno/,
// so the documentation can render live, interactive examples with the real component code.
//
// When Visuno/components is published as an npm package, replace this with a dependency and
// import from the package instead. For the local workspace, run:
//   node scripts/sync-components.mjs
//
// Source:  ../components/react
// Target:  ./visuno

import { cp, rm, stat } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOCS = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(DOCS, '..', 'components', 'react');
const DEST = resolve(DOCS, 'visuno');

try {
  await stat(SRC);
} catch {
  console.error(`Source not found: ${SRC}\nRun this from the Visuno workspace where ../components exists.`);
  process.exit(1);
}

// Only the component source (and its CSS) is needed to render live docs examples.
// Skip the package's own tooling: installed deps, build output, and build config —
// copying those pulls a second @types/react into the tree and feeds build-only
// files (e.g. tsup.config.ts) to the docs type-checker.
const SKIP = new Set(['node_modules', 'dist', 'tsup.config.ts']);

await rm(DEST, { recursive: true, force: true });
await cp(SRC, DEST, {
  recursive: true,
  filter: (src) => !SKIP.has(relative(SRC, src).split(sep)[0]),
});
console.log(`Synced React components: ${SRC} -> ${DEST}`);
