# docs

This is a Next.js application generated with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs).

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

## GitHub Pages

This folder is the root of the `Visuno/docs` repository. Its
`.github/workflows/deploy-pages.yml` workflow builds pull requests. On pushes to
`main`, it commits the static output to the `deploy` branch, pushes that branch,
and publishes its contents through GitHub Pages. You can also run it manually
from the Actions tab on `main`.

In `Visuno/docs`, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions** before the first deployment. The default site URL is
https://visuno.github.io/docs/. The workflow reads the Pages base path, so asset
URLs also work if Pages is configured with a custom domain.
The `deploy` branch contains only the generated site and `.nojekyll`. Keep Pages
set to **GitHub Actions**: pushes made with the workflow's `GITHUB_TOKEN` do not
trigger branch-based Pages builds, so the workflow explicitly uploads and
deploys the branch's contents. The workflow needs permission to write to
`deploy`; branch rules must allow the GitHub Actions bot to push there.

The build checks out `Visuno/components` at `main` alongside this repository
because `npm run build` syncs its React examples from `../components/react`.
Changes in the components repository alone do not trigger a docs deployment;
run the docs workflow manually to publish them.

To build the same static output locally from this workspace:

```bash
npm ci
NEXT_PUBLIC_BASE_PATH=/docs SITE_URL=https://visuno.github.io/docs/ npm run build
```

To build and commit the latest site to the local `deploy` branch:

```bash
npm run deploy:branch
```

To also push the branch to `origin`:

```bash
npm run deploy:branch -- --push
```

The script creates `deploy` on its first run, preserves deployment history,
removes obsolete output files, and skips the commit when nothing changed. It
uses a temporary Git worktree, so your source branch and uncommitted files stay
in place. Configure your Git author name and email before running it locally.
Use `--skip-build` to commit an existing `out/` export. Local builds default to
the `/docs` base path and `https://visuno.github.io/docs/` site URL; set
`NEXT_PUBLIC_BASE_PATH` (including an empty value for root hosting) and `SITE_URL`
to override them.

The generated site is in `out/`; serve it with a static web server mounted at
`/docs/` (or omit `NEXT_PUBLIC_BASE_PATH` when hosting at the root). Search runs
in the browser using the exported index. Markdown is available at the explicit
`/llms.mdx/docs/<slug>/content.md` URLs, prefixed with the site's base path;
GitHub Pages cannot perform the former Accept-header or `.md` proxy rewrites.
`npm start` requires a Next.js server build and cannot serve this static export.

## Explore

In the project, you can see:

- `lib/source.ts`: Code for content source adapter, [`loader()`](https://fumadocs.dev/docs/headless/source-api) provides the interface to access your content.
- `lib/layout.shared.tsx`: Shared options for layouts, optional but preferred to keep.

| Route                     | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `app/(home)`              | The route group for your landing page and other pages. |
| `app/docs`                | The documentation layout and pages.                    |
| `app/api/search/route.ts` | The Route Handler for search.                          |

### Fumadocs MDX

Collections are defined with the [Macro API](https://fumadocs.dev/docs/mdx/macro) in `lib/source.ts`.

Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
