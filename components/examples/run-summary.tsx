'use client';
import { useEffect, useRef, useState } from 'react';
import { RunSummary } from '@visuno/run-summary/RunSummary';

/**
 * Live example for the Run summary docs page, in the shape of the component's own
 * demo on the upstream site: the summary finishes, its stats count up and its rows
 * come in one after another. A short, looping self-demo toggles "Undo all" and then
 * resolves the one thing that needs the person, so the crossfades and the grey-out
 * are visible without interaction. Respects prefers-reduced-motion. Uses the real
 * Visuno component.
 */
const STATS = [
  { label: 'files', value: 6 },
  { label: 'steps', value: 14 },
  { label: 'tokens', value: 182, suffix: 'k' },
  { label: 'cost', value: 0.84, prefix: '$', decimals: 2 },
];

const CHANGES = [
  { file: 'PricingCard.tsx', added: 24, removed: 18 },
  { file: 'tokens.css', added: 9, removed: 2 },
  { file: 'Pricing.test.tsx', added: 31, removed: 0 },
];

export function RunSummaryExample() {
  const [undone, setUndone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fixed, setFixed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };
    // after a beat, toggle the changes off and back, then resolve the need
    at(2600, () => setUndone(true));
    at(4200, () => setUndone(false));
    at(5400, () => setBusy(true));
    at(6400, () => {
      setBusy(false);
      setFixed(true);
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const needs = [
    {
      key: 'badge',
      text: fixed
        ? 'Badge moved above the price, nothing left to review'
        : 'The yearly badge overlaps the price on mobile',
      action: fixed
        ? undefined
        : { label: 'Review', busy, onClick: () => setFixed(true) },
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <RunSummary
        subtitle="Finished in 12m 40s"
        summary="Pricing cards now use spacing tokens"
        stats={STATS}
        changes={CHANGES}
        needs={needs}
        undone={undone}
        onUndoneChange={setUndone}
        onDetails={() => {}}
        onOpenChanges={() => {}}
      />
    </div>
  );
}
