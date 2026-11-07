'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ChangeReview,
  type ChangedFile,
  type HunkDecision,
} from '@visuno/change-review/ChangeReview';

/**
 * Live example for the Change review docs page, in the shape of the component's
 * own demo upstream: three changed files, each a few hunks of a diff. It plays
 * itself — keeping one hunk at a time, then stepping to the next file — so the
 * review reads as if someone were working through it, and holds once everything
 * is kept. Honours prefers-reduced-motion by settling everything at once. Uses
 * the real Visuno component.
 */
const FILES: ChangedFile[] = [
  {
    name: 'PricingCard.tsx',
    path: 'src/PricingCard.tsx',
    hunks: [
      {
        title: 'Use the shared button',
        lines: [
          { kind: 'ctx', line: 14, text: '  return (' },
          { kind: 'del', line: 15, text: '    <button className="cta-old">' },
          { kind: 'add', line: 15, text: '    <Button variant="primary">' },
          { kind: 'ctx', line: 16, text: '      {plan.cta}' },
        ],
      },
      {
        title: 'Drop the second CTA',
        lines: [
          { kind: 'del', line: 22, text: '    <a href="/contact">Talk to sales</a>' },
          { kind: 'ctx', line: 22, text: '  </Card>' },
        ],
      },
    ],
  },
  {
    name: 'tokens.css',
    path: 'src/tokens.css',
    hunks: [
      {
        title: 'Raise muted text contrast',
        lines: [
          { kind: 'ctx', line: 8, text: ':root {' },
          { kind: 'del', line: 9, text: '  --text-muted: #c9cfd8;' },
          { kind: 'add', line: 9, text: '  --text-muted: #5b6472;' },
          { kind: 'ctx', line: 10, text: '  --radius-card: 16px;' },
        ],
      },
    ],
  },
  {
    name: 'pricing.mdx',
    path: 'src/pricing.mdx',
    hunks: [
      {
        title: 'Move the FAQ below the table',
        lines: [
          { kind: 'del', line: 31, text: '<FAQ />' },
          { kind: 'ctx', line: 31, text: '<CompareTable />' },
          { kind: 'add', line: 32, text: '<FAQ />' },
        ],
      },
    ],
  },
];

const keyOf = (f: ChangedFile, k: number) => f.hunks[k].key ?? `${f.name}#${k}`;
// every hunk, in review order, as [file index, hunk key]
const STEPS = FILES.flatMap((f, i) => f.hunks.map((_, k) => [i, keyOf(f, k)] as const));

export function ChangeReviewExample() {
  const [file, setFile] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, HunkDecision>>({});
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      // settle everything at once, no walk-through
      setDecisions(Object.fromEntries(STEPS.map(([, key]) => [key, 'kept'])));
      setFile(FILES.length - 1);
      return;
    }

    let step = 0;
    const tick = () => {
      const [i, key] = STEPS[step];
      setFile(i);
      setDecisions((d) => ({ ...d, [key]: 'kept' }));
      step++;
      if (step < STEPS.length) timer.current = setTimeout(tick, 1100);
    };
    timer.current = setTimeout(tick, 900);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <ChangeReview
        files={FILES}
        file={file}
        onFileChange={setFile}
        decisions={decisions}
        onDecisionsChange={setDecisions}
      />
    </div>
  );
}
