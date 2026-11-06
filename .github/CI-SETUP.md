# Docs CI — GitHub App setup

The docs site build (`.github/workflows/deploy-pages.yml`) checks out the **private**
`Visuno/components` repo to pull the reference component source. The default `GITHUB_TOKEN`
cannot read a different private repo, so CI uses a **GitHub App** to mint a short-lived,
read-only token for `components`.

This is a one-time setup. Do it once, then the workflow runs on its own.

## 1. Create the App (org-owned)

1. Go to **https://github.com/organizations/Visuno/settings/apps** → **New GitHub App**.
2. **Name:** `Visuno Docs CI` (any unique name).
3. **Homepage URL:** `https://github.com/Visuno` (anything valid).
4. **Webhook:** uncheck **Active** (no webhook needed).
5. **Permissions → Repository permissions → Contents:** `Read-only`.
6. Leave everything else default. Create the App.
7. On the App's page, note the **App ID** (a number near the top).
8. Scroll to **Private keys** → **Generate a private key**. A `.pem` file downloads — keep it safe.

## 2. Install the App on the org

1. On the App's page → **Install App** → install into the **Visuno** org.
2. Choose **Only select repositories** → select **`components`** (and `docs` if you like).

## 3. Add the two secrets to the `docs` repo

At **https://github.com/Visuno/docs/settings/secrets/actions** → **New repository secret**:

| Secret name | Value |
|---|---|
| `VISUNO_DOCS_APP_ID` | The numeric **App ID** from step 1.7 |
| `VISUNO_DOCS_APP_PRIVATE_KEY` | The **entire contents** of the `.pem` file (including the `-----BEGIN…` / `-----END…` lines) |

> Tip: `gh secret set VISUNO_DOCS_APP_PRIVATE_KEY --repo Visuno/docs < path/to/key.pem`
> and `gh secret set VISUNO_DOCS_APP_ID --repo Visuno/docs --body "<APP_ID>"`.

## 4. Enable GitHub Pages (if not already)

At **https://github.com/Visuno/docs/settings/pages** → **Source:** `GitHub Actions`.

## Done

Push to `docs` `main` (or run the workflow via **Actions → Run workflow**). The build will:
mint an App token → check out `Visuno/components` with it → `npm run build` (the prebuild
syncs `../components/react` into `docs/visuno`) → deploy to Pages.

To revoke access later, uninstall the App from the org or delete its private key.
