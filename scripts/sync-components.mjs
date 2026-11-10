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
import { dirname, resolve } from 'node:path';
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

await rm(DEST, { recursive: true, force: true });
await cp(SRC, DEST, { recursive: true });
console.log(`Synced React components: ${SRC} -> ${DEST}`);
