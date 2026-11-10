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

Deployment is manual. The `deploy` branch contains the generated static site,
`.nojekyll`, and a `CNAME` for the custom domain https://visuno.dev/. GitHub Pages
serves this branch directly; no GitHub Actions deployment workflow is required.

In `Visuno/docs`, set **Settings → Pages → Build and deployment → Source** to
**Deploy from a branch**, select **deploy**, and use **/ (root)**.

From this standalone docs repository, with the `Visuno/components` checkout
alongside it at `../components`, run:

```bash
npm ci
npm run deploy:branch -- --push
```

The script syncs the React examples from `../components/react`, builds the
latest site, creates or updates `deploy`, commits changed output, and pushes
the branch to `origin`. Configure your Git author name and email before running
it. To update only the local branch, omit `--push`. Use `--skip-build` to publish
an existing `out/` export.

The script preserves deployment history, removes obsolete files, and skips the
commit when output is unchanged. It uses a temporary Git worktree, keeping your
source branch and uncommitted files in place. It does not commit or push source
changes to `main`; commit and push those separately when needed.

Local builds default to the root of `https://visuno.dev/`. To publish to a
GitHub project site instead:

```bash
SITE_URL=https://visuno.github.io/docs/ npm run deploy:branch -- --push
```

The base path defaults to the path in `SITE_URL`; `NEXT_PUBLIC_BASE_PATH` can
override it. A custom hostname produces a `CNAME` file; a `*.github.io` URL
does not. Update the Pages custom-domain setting when changing the hostname.

The generated site is in `out/`. Search runs in the browser using the exported
index. Markdown is available at the explicit
`/llms.mdx/docs/<slug>/content.md` URLs, prefixed with the site's base path.
GitHub Pages cannot perform Accept-header or `.md` proxy rewrites.
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
