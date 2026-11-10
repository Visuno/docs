# Introduction (/docs)

**Visuno** is an open-source UI component library for building agent interfaces. Every component
ships natively for **Vanilla JS**, **React**, **Angular**, and **Flutter**, built from a single
shared set of design tokens — so a component looks and behaves the same wherever you use it.

Each component in these docs has a **live preview** you can toggle between light/dark and the two
styles, plus the code for all four frameworks side by side.

## Four frameworks, one design [#four-frameworks-one-design]

| Framework | Form |
|-----------|------|
| **Vanilla JS** | Plain HTML + CSS + JS — no build step, drop it in |
| **React** | `.tsx` components (requires React 19) |
| **Angular** | Standalone components (`dm-*` selectors, Angular 17+) |
| **Flutter** | Dart widgets, themed to match the web |

The Vanilla and React versions are the reference; Angular and Flutter are native ports that mirror
the same props and behavior.

## Theming [#theming]

Every component responds to the same two switches, so your whole UI changes at once:

- **Dark mode** — `data-theme="dark"` on a parent element (web); `Brightness.dark` in the Flutter
  theme.
- **Style** — the default **Blueprint** style, or **Soft** via `data-style="soft"` (web). Blueprint
  is crisp and squared; Soft is rounded and plush.

Design tokens (`--dm-*` on the web, `DmColors`/`DmSpace`/`DmRadius` in Flutter) drive every color,
space, radius, and motion — change a token once and it flows everywhere.

## Sections [#sections]

Components are grouped by what they do in an agent product:

- **Agent status** — show what the agent is doing: live status, thinking states, reasoning trails,
  action logs, run timelines, cost and context meters.
- **Charts and tables** — present data: stat cards and more.
- **Dates** — pick and switch: segmented controls and date tools.
- **Forms and inputs** — the basics: buttons, badges, progress, tooltips.

## Get started [#get-started]

<Cards>
  <Card title="Browse components" href="/docs/components/status-pill" description="Live previews and code for every component." />
  <Card title="Components on GitHub" href="https://github.com/Visuno/components" description="The source for all four frameworks." />
</Cards>

Pick a component from the sidebar, copy the snippet for your framework, and drop it in. Pull the
shared core once (tokens + helpers), and every component you add just works.
