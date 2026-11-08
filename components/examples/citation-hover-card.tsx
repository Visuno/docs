'use client';
import { useEffect, useRef, useState } from 'react';
import { CitationHoverCard, type CitationHoverCardSource } from '@visuno/citation-hover-card/CitationHoverCard';

/**
 * Live example for the Citation hover card docs page, in the shape of the
 * component's own demo upstream: an answer with three numbered citations. On
 * its own it opens each source's card in turn, then puts it away — hovering,
 * focusing or tapping a citation still takes over. Respects
 * prefers-reduced-motion (then it stays still). Uses the real Visuno component.
 */
const TEXT =
  'Teams that show the annual price first see higher paid conversion[1], and the effect is stronger ' +
  'when the monthly price stays visible beside it[2]. Your own data shows the same pattern since the ' +
  'September update[3].';

const SOURCES: CitationHoverCardSource[] = [
  {
    mark: 'B',
    color: '#4a5a8a',
    site: 'baymard.com',
    title: 'Pricing page UX benchmark',
    quote: (
      <>
        Of 64 SaaS sites tested, those leading with the annual plan saw{' '}
        <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.
      </>
    ),
    meta: 'Read 4 days ago',
  },
  {
    mark: 'C',
    color: '#d9480f',
    site: 'cxl.com',
    title: 'Price anchoring in plan selection',
    quote: (
      <>
        When the monthly price stayed visible with a strike through,{' '}
        <mark>annual selection rose by a further 9 points</mark> in the anchored group.
      </>
    ),
    meta: 'Read 4 days ago',
  },
  {
    mark: 'CSV',
    color: 'var(--vo-pm)',
    site: 'Drive',
    title: 'Q3 conversion export.csv',
    quote: (
      <>
        Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.
      </>
    ),
    meta: 'Your file',
  },
];

export function CitationHoverCardExample() {
  const [open, setOpen] = useState<number | null>(null);
  // once the viewer takes over (hover/focus/tap), the demo stops driving it
  const mine = useRef(false);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    // show the first source after the entrance, then put it away
    timers.push(setTimeout(() => !mine.current && setOpen(0), 1400));
    timers.push(setTimeout(() => !mine.current && setOpen(null), 4200));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      style={{ width: '100%', maxWidth: 560 }}
      onPointerOver={() => (mine.current = true)}
      onFocusCapture={() => (mine.current = true)}
    >
      <CitationHoverCard
        text={TEXT}
        sources={SOURCES}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
