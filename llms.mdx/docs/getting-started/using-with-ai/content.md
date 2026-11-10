# Using with AI (/docs/getting-started/using-with-ai)

Visuno is built for agent products, and it works well **with** coding agents too. The docs ship in
machine-readable form so an assistant can pull exact component APIs, props, and token rules instead
of guessing. This page shows what's available and how to use it.

## Machine-readable docs [#machine-readable-docs]

Every docs page is available as plain text and Markdown, and the whole site is summarised in two
`llms.txt` files that follow the [llms.txt convention](https://llmstxt.org).

| URL | What it is |
|-----|------------|
| [`/llms.txt`](/llms.txt) | An index of the docs — every page with its title and link, for an assistant to crawl. |
| [`/llms-full.txt`](/llms-full.txt) | The entire documentation inlined as one text file, ready to paste into a context window. |
| `/llms.mdx/docs/<path>` | Any single page as raw Markdown (e.g. `/llms.mdx/docs/components/status-pill`). |

These are generated from the same source as the site, so they're always in sync with the live docs.

## Give an assistant the context [#give-an-assistant-the-context]

Pick whichever fits your tool:

- **Paste a page** — grab one component's Markdown from `/llms.mdx/docs/components/<name>` and paste
  it into the chat before you ask for code. The assistant then has the exact props and examples.
- **Point at the index** — give the assistant `/llms.txt` and let it fetch the pages it needs.
- **Drop in everything** — for a big task, paste `/llms-full.txt` so the whole library is in context.

## Prompting tips [#prompting-tips]

The library has a few hard rules; stating them up front keeps generated code correct and on-brand:

- **Reuse, don't reinvent.** Ask the assistant to compose the real components (`StatusPill`, `Button`,
  `Modal`, …) rather than hand-rolling markup. If a component exists, use it.
- **Tokens only — no literals.** Tell it that all color, spacing, radius, and motion come from the
  shared `--vo-*` tokens, and that hardcoded colors or pixel radii are a bug.
- **Name the framework.** Say React, Angular, or Flutter explicitly — the props match across all
  three, but the syntax differs.
- **Respect the two switches.** Output should work in light and dark (`data-theme`) and in both the
  Blueprint and Soft styles (`data-style`) without changes.

### A prompt that works [#a-prompt-that-works]

> You are building UI with the Visuno component library. Use only Visuno components (fetch their APIs
> from `/llms.txt`), style everything through the `--vo-*` design tokens — never hardcode colors,
> spacing, or radii — and make it work in dark mode and the Soft style. Target: **React**. Build a
> run-status row using `StatusPill`.

## Building agents with Visuno [#building-agents-with-visuno]

Because the components are designed for agent interfaces, they map cleanly onto the states an AI
product moves through — thinking, reading, working, waiting for review, streaming an answer, logging
actions. Browse the **Agent status** and **Conversation** groups in the sidebar for the building
blocks, and compose them into your own flows.

<Cards>
  <Card title="Browse components" href="/docs/components/status-pill" description="APIs and live examples for every component." />
  <Card title="llms.txt" href="/llms.txt" description="The machine-readable docs index." />
</Cards>
