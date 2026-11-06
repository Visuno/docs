'use client';
import { useEffect, useRef, useState } from 'react';
import { TraceView, type TraceSpan } from '@visuno/trace-view/TraceView';

/**
 * Live example for the Trace view docs page — the reference run from
 * upstream demo: a pricing-research agent that plans, searches its notes, fetches
 * a page (which runs long and turns amber), summarises and answers. The run
 * streams in over time with a moving playhead, then settles. Uses the real
 * Visuno React component. Honours prefers-reduced-motion by showing the finished
 * run at once.
 */
const SPANS: TraceSpan[] = [
  {
    id: 'run',
    name: 'Pricing research',
    kind: 'agent',
    start: 0,
    duration: 4.82,
    input: "Compare Northwind's plans with ours",
    output: '3 prices saved to Pricing research',
    children: [
      { id: 'plan', name: 'Plan the steps', kind: 'llm', start: 0.04, duration: 0.62, tokens: 1240, input: 'The task and 2 earlier messages', output: 'Search notes, fetch the page, summarise' },
      { id: 'notes', name: 'Search saved notes', kind: 'retrieval', start: 0.7, duration: 0.38, tokens: 910, input: '"northwind pricing", top 4', output: '4 notes, best match 0.82' },
      { id: 'fetch', name: 'fetch_page', kind: 'tool', start: 1.12, duration: 2.46, tokens: 3120, input: 'GET northwind.app/pricing', output: '200 OK, 48 KB, 3 plans' },
      {
        id: 'sum',
        name: 'Summariser',
        kind: 'agent',
        start: 3.62,
        duration: 1.02,
        input: 'The page and 4 notes',
        output: 'A 120-word summary',
        children: [
          { id: 'write', name: 'Write the summary', kind: 'llm', start: 3.66, duration: 0.94, tokens: 2380, input: 'Page text and notes, 2,050 tokens', output: '120 words, 3 prices' },
        ],
      },
      { id: 'ans', name: 'Final answer', kind: 'llm', start: 4.66, duration: 0.16, tokens: 560, input: 'The summary', output: '3 prices saved to Pricing research' },
    ],
  },
];

const END = 4.82;
const AXIS = 5;
// one second of the run every PACE seconds, so a person can follow it
const PACE = 1.5;

export function TraceViewExample() {
  const [time, setTime] = useState<number | undefined>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setTime(undefined); // the finished run
      return;
    }
    let t0 = 0;
    const step = (now: number) => {
      if (!t0) t0 = now;
      const t = Math.min(END, (now - t0) / 1000 / PACE);
      setTime(t);
      if (t < END) {
        raf.current = requestAnimationFrame(step);
      } else {
        // leave it at the finished run (no playhead)
        setTime(undefined);
      }
    };
    const start = setTimeout(() => {
      raf.current = requestAnimationFrame(step);
    }, 500);
    return () => {
      clearTimeout(start);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <TraceView title="Pricing research" spans={SPANS} time={time} axis={AXIS} />
    </div>
  );
}
