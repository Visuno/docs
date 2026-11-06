'use client';
import { useEffect, useRef, useState } from 'react';
import { WebSearch, type WebQuery } from '@visuno/web-search/WebSearch';

/**
 * Live example for the Web search docs page — the full reference trail from
 * the upstream demo. An agent researches usage-based billing: its first query finds
 * nothing and is asked again in other words, pages are read, skimmed or skipped
 * (paywall, blocked), then the trail folds to its summary and an answer streams
 * in citing its pages. Uses the real Visuno React component. Honours
 * prefers-reduced-motion by jumping straight to the finished trail.
 */

type Phase =
  | { q: number; pages: number } // a query is in, with `pages` of its pages revealed
  | { done: true };

const QUERIES: WebQuery[] = [
  {
    key: 'q0',
    query: 'stripe usage based billing limits 2026 enterprise tier',
    status: 'done',
    results: 0,
    time: '0.6s',
  },
  {
    key: 'q1',
    query: 'stripe usage-based billing limits',
    status: 'done',
    results: 5,
    time: '0.9s',
    rewritten: true,
    pages: [
      { title: 'Usage-based billing', domain: 'stripe.com', date: 'Oct 2026', status: 'read' },
      { title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: 'read', cite: 1 },
      { title: 'How we moved 40k customers to usage billing', domain: 'medium.com', date: 'Mar 2026', status: 'skimmed' },
      { title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', date: 'Aug 2026', status: 'paywall' },
    ],
  },
  {
    key: 'q2',
    query: 'metronome vs orb usage billing',
    status: 'done',
    results: 6,
    time: '1.1s',
    pages: [
      { title: 'Metronome vs Orb: a fair comparison', domain: 'metronome.com', date: 'Jul 2026', status: 'read', cite: 2 },
      { title: 'Orb pricing and plans', domain: 'withorb.com', date: 'Oct 2026', status: 'read' },
      { title: 'orb-billing/examples: sending usage events', domain: 'github.com', date: 'Jun 2026', status: 'read' },
      { title: 'Anyone switched from Stripe Billing to Orb?', domain: 'reddit.com', date: 'May 2026', status: 'blocked' },
    ],
  },
];

const ANSWER =
  'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.';

export function WebSearchExample() {
  const [phase, setPhase] = useState<Phase>({ q: 0, pages: 0 });
  const [answer, setAnswer] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setPhase({ done: true });
      setAnswer(ANSWER);
      return;
    }
    // build a schedule: each query appears, then its pages reveal one by one
    const steps: Phase[] = [];
    QUERIES.forEach((q, qi) => {
      steps.push({ q: qi, pages: 0 });
      (q.pages ?? []).forEach((_, pi) => steps.push({ q: qi, pages: pi + 1 }));
    });
    let i = 0;
    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    const tick = () => {
      if (i >= steps.length) {
        setPhase({ done: true });
        // stream the answer in a word at a time
        const words = ANSWER.split(' ');
        words.forEach((_, w) =>
          later(() => setAnswer(words.slice(0, w + 1).join(' ')), 400 + w * 55),
        );
        return;
      }
      setPhase(steps[i]);
      i += 1;
      later(tick, 520);
    };
    later(tick, 500);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const done = 'done' in phase;
  // show the queries and pages that the current phase has reached
  const queries: WebQuery[] = done
    ? QUERIES
    : QUERIES.slice(0, phase.q + 1).map((q, qi) => {
        if (qi < phase.q) return q;
        // the current query: before its pages reveal it is still "searching"
        if (phase.pages === 0) {
          return { ...q, status: 'searching', results: undefined, time: undefined, pages: [] };
        }
        const revealed = (q.pages ?? []).slice(0, phase.pages).map((p, pi) =>
          pi === phase.pages - 1 ? { ...p, status: 'reading' as const } : p,
        );
        return { ...q, pages: revealed };
      });

  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <WebSearch queries={queries} done={done} answer={done ? answer : undefined} bare={false} />
    </div>
  );
}
