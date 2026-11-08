import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShowcaseCard } from '@/components/home/showcase-card';
import './home.css';

// Live, self-animating examples — the real Visuno components.
import { StatusPillExample } from '@/components/examples/status-pill';
import { ThinkingExample } from '@/components/examples/thinking';
import { ThinkingStatesExample } from '@/components/examples/thinking-states';
import { ReasoningTrailExample } from '@/components/examples/reasoning-trail';
import { AgentPhasesExample } from '@/components/examples/agent-phases';
import { StepLoaderExample } from '@/components/examples/step-loader';
import { ActionLogExample } from '@/components/examples/action-log';
import { ContextMeterExample } from '@/components/examples/context-meter';
import { BrowserSessionExample } from '@/components/examples/browser-session';
import { WebSearchExample } from '@/components/examples/web-search';
import { TraceViewExample } from '@/components/examples/trace-view';
import { RunQueueExample } from '@/components/examples/run-queue';
import { RunCostExample } from '@/components/examples/run-cost';
import { ToastExample } from '@/components/examples/toast';
import { StatCardsCompact } from '@/components/home/stat-cards-compact';
import { SegmentedControlExample } from '@/components/examples/segmented-control';
import { ButtonsExample } from '@/components/examples/buttons';
import { BadgeExample } from '@/components/examples/badge';
import { ProgressExample } from '@/components/examples/progress';
import { TooltipExample } from '@/components/examples/tooltip';

export const metadata: Metadata = {
  title: 'Components for agent-powered products',
  description:
    'A documented UI component library for AI-agent products, shipped natively for Vanilla JS, React, Angular, and Flutter from one shared set of design tokens.',
};

/**
 * Landing page in the spirit of the component-library index it documents: a quiet
 * hero with a copy-ready install line and two live, self-animating components; the
 * frameworks we ship; and the full library — every component advertised as a live
 * preview card that links into its docs. Page chrome uses Fumadocs --color-fd-*
 * tokens for strong contrast in both themes; live stages use the Visuno --dm-*
 * system so the components look exactly as they ship.
 */

const FRAMEWORKS = [
  { name: 'Vanilla JS', note: 'No build step — drop it in' },
  { name: 'React', note: 'Requires React 19' },
  { name: 'Angular', note: 'Standalone, 17+' },
  { name: 'Flutter', note: 'Native Dart widgets' },
];

type Entry = { title: string; slug: string; demo: React.ReactNode };
type Category = { n: string; title: string; blurb: string; items: Entry[] };

const CATEGORIES: Category[] = [
  {
    n: '01',
    title: 'Agent status',
    blurb: 'Show what the agent is doing, how far along it is, and what it just did.',
    items: [
      { title: 'Status pill', slug: 'status-pill', demo: <StatusPillExample /> },
      { title: 'Thinking', slug: 'thinking', demo: <ThinkingExample /> },
      { title: 'Thinking states', slug: 'thinking-states', demo: <ThinkingStatesExample /> },
      { title: 'Reasoning trail', slug: 'reasoning-trail', demo: <ReasoningTrailExample /> },
      { title: 'Agent phases', slug: 'agent-phases', demo: <AgentPhasesExample /> },
      { title: 'Step loader', slug: 'step-loader', demo: <StepLoaderExample /> },
      { title: 'Action log', slug: 'action-log', demo: <ActionLogExample /> },
      { title: 'Context meter', slug: 'context-meter', demo: <ContextMeterExample /> },
      { title: 'Browser session', slug: 'browser-session', demo: <BrowserSessionExample /> },
      { title: 'Web search', slug: 'web-search', demo: <WebSearchExample /> },
      { title: 'Trace view', slug: 'trace-view', demo: <TraceViewExample /> },
      { title: 'Run queue', slug: 'run-queue', demo: <RunQueueExample /> },
      { title: 'Run cost', slug: 'run-cost', demo: <RunCostExample /> },
      { title: 'Toast', slug: 'toast', demo: <ToastExample /> },
    ],
  },
  {
    n: '02',
    title: 'Charts and tables',
    blurb: 'Compact ways to show numbers the agent produced or is tracking.',
    items: [{ title: 'Stat cards', slug: 'stat-cards', demo: <StatCardsCompact /> }],
  },
  {
    n: '03',
    title: 'Dates',
    blurb: 'Switches and ranges for time and selection.',
    items: [
      { title: 'Segmented control', slug: 'segmented-control', demo: <SegmentedControlExample /> },
    ],
  },
  {
    n: '04',
    title: 'Forms and inputs',
    blurb: 'The building blocks people act through: buttons, badges, feedback.',
    items: [
      { title: 'Buttons', slug: 'buttons', demo: <ButtonsExample /> },
      { title: 'Badge', slug: 'badge', demo: <BadgeExample /> },
      { title: 'Progress', slug: 'progress', demo: <ProgressExample /> },
      { title: 'Tooltip', slug: 'tooltip', demo: <TooltipExample /> },
    ],
  },
];

const COMPONENT_COUNT = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

export default function HomePage() {
  return (
    <main className="visuno-home">
      {/* Hero */}
      <section className="vh-hero">
        <div className="vh-hero-copy">
          <h1 className="vh-h1">Components for agent-powered products</h1>
          <p className="vh-sub">
            {COMPONENT_COUNT} documented components in Vanilla&nbsp;JS, React, Angular, and
            Flutter — built from one shared set of design tokens, so the look and behavior stay
            identical wherever you build.
          </p>
          <div className="vh-actions">
            <Link href="/docs" className="vh-cta">
              Open the docs
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="vh-mark" aria-hidden="true">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
            alt=""
            width={520}
            height={460}
            priority
            className="vh-mark-img"
          />
        </div>
      </section>

      {/* Frameworks */}
      <section className="vh-frameworks">
        {FRAMEWORKS.map((f) => (
          <div key={f.name} className="vh-fw">
            <div className="vh-fw-name">{f.name}</div>
            <div className="vh-fw-note">{f.note}</div>
          </div>
        ))}
      </section>

      {/* Full library — every component advertised as a live preview */}
      <section className="vh-lib">
        {CATEGORIES.map((cat) => (
          <div key={cat.n}>
            <div className="vh-lib-head">
              <span className="vh-lib-n">{cat.n}</span>
              <h2 className="vh-lib-title">{cat.title}</h2>
              <span className="vh-lib-blurb">{cat.blurb}</span>
            </div>
            <ul className="vh-sc-grid">
              {cat.items.map((it) => (
                <li key={it.slug}>
                  <ShowcaseCard title={it.title} slug={it.slug}>
                    {it.demo}
                  </ShowcaseCard>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <footer className="vh-footer">
        <div>
          Open source under the MIT licence.{' '}
          <a href="https://github.com/Visuno/components" className="vh-footer-link">
            Star on GitHub
          </a>
          .{' '}
          <Link href="/docs/imprint" className="vh-footer-link">
            Imprint
          </Link>
        </div>
        <a
          href="https://sdkindustries.de"
          target="_blank"
          rel="noreferrer"
          className="vh-poweredby"
        >
          <span>Powered by</span>
          {/* Theme-aware: dark-ink mark on light background, light mark on dark. */}
          <img
            className="vh-sdk-logo vh-sdk-logo-dark-ink"
            src="https://sdkindustries.de/logo-dark.svg"
            alt="SDK Industries"
            height={20}
          />
          <img
            className="vh-sdk-logo vh-sdk-logo-light-ink"
            src="https://sdkindustries.de/logo.svg"
            alt="SDK Industries"
            height={20}
          />
        </a>
      </footer>
    </main>
  );
}
