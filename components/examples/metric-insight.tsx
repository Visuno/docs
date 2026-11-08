'use client';
import { useEffect, useRef, useState } from 'react';
import { MetricInsight, type MetricRange, type MetricDriver } from '@visuno/metric-insight/MetricInsight';

/**
 * Live example for the Metric insight docs page, in the shape of the component's
 * own demo on the upstream site: the "Trial to paid" rate over three ranges, with
 * a one-line read on why it moved and a breakdown of the drivers behind the jump.
 * The range cycles on its own and the "Why did it move?" button first shows the
 * agent "Looking into it" before the breakdown opens, so the whole flow plays
 * without a click. Honours prefers-reduced-motion by holding still. Uses the real
 * Visuno component.
 */
const RANGES: MetricRange[] = [
  {
    key: '7',
    label: '7d',
    points: [22.8, 23.1, 22.9, 24.6, 25.4, 25.9, 26.3],
    value: 26.3,
    change: 3.5,
    insight: 'Up all week. Most of the gain came from annual plans.',
  },
  {
    key: '30',
    label: '30d',
    points: [18.2, 18.5, 18.1, 18.9, 18.4, 18.7, 19.0, 18.6, 19.2, 19.1, 18.8, 19.4, 19.0, 19.3, 19.1, 19.6, 19.2, 21.8, 22.9, 23.4, 23.1, 24.0, 23.6, 24.4, 24.1, 24.9, 25.2, 25.6, 25.9, 26.3],
    value: 26.3,
    change: 8.1,
    insight: 'Jumped after the pricing page update on Sep 18.',
    marker: { at: 0.58, label: 'Sep 18' },
  },
  {
    key: '90',
    label: '90d',
    points: [17.1, 17.6, 17.4, 18.0, 17.8, 18.3, 18.1, 18.6, 18.2, 18.9, 19.4, 22.1, 24.0, 25.5, 26.3],
    value: 26.3,
    change: 9.2,
    insight: 'Flat for two months, then a clear step up in September.',
  },
];

const DRIVERS: MetricDriver[] = [
  { label: 'Annual plan shown first', percent: 54, color: 'var(--vo-accent-mark, var(--vo-accent))' },
  { label: 'One CTA per card', percent: 27, color: 'var(--vo-pl)' },
  { label: 'Seasonal traffic', percent: 12, color: 'var(--vo-pt)' },
  { label: 'Unexplained', percent: 7, color: 'var(--vo-faint)' },
];

export function MetricInsightExample() {
  const [range, setRange] = useState('30');
  const [open, setOpen] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const at = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    // cycle the range to show the line redraw and the number re-roll
    at(() => setRange('7'), 2600);
    at(() => setRange('90'), 5200);
    at(() => setRange('30'), 7800);
    // then the agent looks into it and opens the breakdown
    at(() => setExplaining(true), 9400);
    at(() => {
      setExplaining(false);
      setOpen(true);
    }, 10600);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <MetricInsight
        label="Trial to paid"
        ranges={RANGES}
        range={range}
        onRangeChange={setRange}
        drivers={DRIVERS}
        explaining={explaining}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
