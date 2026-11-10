#!/usr/bin/env node
// Publish the static export in an isolated worktree, keeping the source checkout intact.
import { execFileSync } from 'node:child_process';
import { cp, mkdtemp, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const docs = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = new URL(process.env.SITE_URL ?? 'https://visuno.dev/');
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? siteUrl.pathname.replace(/\/$/, '');
const args = new Set(process.argv.slice(2));
if (args.has('--help')) {
  console.log('Usage: npm run deploy:branch -- [--skip-build] [--push]');
  console.log('Builds the site and commits it to deploy. --push also pushes deploy to origin.');
  process.exit(0);
}
for (const arg of args) {
  if (!['--skip-build', '--push'].includes(arg)) throw new Error(`Unknown option: ${arg}`);
}

function git(argv, cwd = docs) {
  return execFileSync('git', argv, { cwd, encoding: 'utf8' }).trim();
}
function hasRef(ref) {
  try {
    execFileSync('git', ['rev-parse', '--verify', ref], { cwd: docs, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function publish() {
  if (git(['rev-parse', '--show-toplevel']) !== docs) {
    throw new Error('Run this script from the standalone docs Git repository.');
  }
  const sourceSha = git(['rev-parse', '--short', 'HEAD']);
  git(['var', 'GIT_AUTHOR_IDENT']);
  git(['var', 'GIT_COMMITTER_IDENT']);

  if (!args.has('--skip-build')) {
    execFileSync('npm', ['run', 'build'], {
      cwd: docs,
      stdio: 'inherit',
      env: {
        ...process.env,
        NEXT_PUBLIC_BASE_PATH: basePath,
        SITE_URL: siteUrl.href,
      },
    });
  }
  const output = join(docs, 'out');
  if (!(await stat(join(output, 'index.html'))).isFile()) {
    throw new Error('Missing out/index.html. Build the static site before publishing.');
  }

  let remoteDeploy = false;
  if (args.has('--push')) {
    remoteDeploy = Boolean(git(['ls-remote', 'origin', 'refs/heads/deploy']).trim());
    if (remoteDeploy) {
      git(['fetch', 'origin', 'refs/heads/deploy:refs/remotes/origin/deploy']);
    }
  }

  const temporary = await mkdtemp(join(tmpdir(), 'visuno-docs-deploy-'));
  const worktree = join(temporary, 'site');
  let added = false;
  try {
    if (hasRef('refs/heads/deploy')) {
      git(['worktree', 'add', worktree, 'deploy']);
      added = true;
      if (remoteDeploy) git(['merge', '--ff-only', 'origin/deploy'], worktree);
    } else if (remoteDeploy) {
      git(['worktree', 'add', '-b', 'deploy', worktree, 'origin/deploy']);
      added = true;
    } else {
      git(['worktree', 'add', '--detach', worktree, 'HEAD']);
      added = true;
      git(['switch', '--orphan', 'deploy'], worktree);
    }

    // Replace the previous export, including pages removed from the source.
    for (const entry of await readdir(worktree)) {
      if (entry !== '.git') await rm(join(worktree, entry), { recursive: true, force: true });
    }
    for (const entry of await readdir(output)) {
      if (entry === '.git') throw new Error('The static output must not contain .git.');
      await cp(join(output, entry), join(worktree, entry), { recursive: true });
    }
    await writeFile(join(worktree, '.nojekyll'), '');
    if (!siteUrl.hostname.endsWith('.github.io') && siteUrl.hostname !== 'localhost') {
      await writeFile(join(worktree, 'CNAME'), siteUrl.hostname + '\n');
    }
    git(['add', '--all'], worktree);
    if (git(['status', '--porcelain'], worktree)) {
      git(['commit', '-m', `Deploy docs from ${sourceSha}`], worktree);
      console.log(`Updated deploy: ${git(['rev-parse', '--short', 'HEAD'], worktree)}`);
    } else {
      console.log('deploy already contains the latest static output; no commit needed.');
    }
    if (args.has('--push')) git(['push', 'origin', 'deploy:deploy'], worktree);
  } finally {
    if (added) git(['worktree', 'remove', '--force', worktree]);
    await rm(temporary, { recursive: true, force: true });
  }
}

publish().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
