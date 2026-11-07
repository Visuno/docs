'use client';
import { useEffect, useRef, useState } from 'react';
import { RewriteToolbar, type RewriteToolbarHandle } from '@visuno/rewrite-toolbar/RewriteToolbar';

/**
 * Live example for the Rewrite toolbar docs page, in the shape of the component's own
 * demo upstream: a short onboarding intro, where one sentence is picked, made clearer —
 * the suggestion is written in beside it (old words struck through, new ones arriving
 * word by word) — and then kept. Driven through the component's ref handle so nothing
 * steals the page's focus; a click of yours takes over. Uses the real Visuno component,
 * and respects prefers-reduced-motion (the story is skipped and the toolbar stays idle).
 */
const SENTENCES = [
  'Welcome to Visuno, a place where you and your team can work together with an agent on all of your design files in one place.',
  'To get started you will need to connect Figma, which can be done from the settings page at any time.',
  'After that, the agent will be able to read your frames and suggest improvements.',
];

// the canned rewrites, keyed by sentence index and action, as the upstream demo uses
const REWRITES: Record<number, Record<string, string>> = {
  0: {
    clear: 'Visuno is where your team and an agent design together.',
    short: 'Design with your team and an agent.',
    warm: 'Welcome in. This is where you, your team and your agent make things together.',
  },
  1: {
    clear: 'Connect Figma in Settings to get started.',
    short: 'First, connect Figma.',
    warm: 'Start by connecting Figma. It takes about a minute.',
  },
  2: {
    clear: 'Then the agent can read your frames and suggest fixes.',
    short: 'Then the agent reviews your frames.',
    warm: 'Then your agent can look through your frames and help polish them.',
  },
};

export function RewriteToolbarExample() {
  const ref = useRef<RewriteToolbarHandle>(null);
  const took = useRef(false);
  const [sel, setSel] = useState<number | null>(null);

  const onRewrite = (_sentence: string, action: string, index: number) =>
    REWRITES[index]?.[action] ?? _sentence;

  useEffect(() => {
    const reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let alive = true;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    (async () => {
      await wait(1300);
      if (!alive || took.current) return;
      setSel(0);
      await wait(1400);
      if (!alive || took.current) return;
      ref.current?.rewrite('clear');
      await wait(2800);
      if (!alive || took.current) return;
      ref.current?.accept();
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{ width: '100%', maxWidth: 520 }}
      onPointerDownCapture={() => {
        took.current = true;
      }}
    >
      <RewriteToolbar
        ref={ref}
        title="Onboarding intro"
        defaultSentences={SENTENCES}
        selected={sel}
        onSelectedChange={setSel}
        onRewrite={onRewrite}
      />
    </div>
  );
}
