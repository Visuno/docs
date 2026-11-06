'use client';
import { useEffect, useRef, useState } from 'react';
import { AgentRunTimeline, type TimelineStep } from '@visuno/agent-run-timeline/AgentRunTimeline';

/**
 * Live example for the Agent run timeline docs page — the reference run from
 * upstream demo: an agent updating a pricing page, planning, reading files,
 * searching Figma, editing, running tests (which fail, then pass on a retry) and
 * opening a PR and posting to Slack. The run streams in over time with a moving
 * playhead, then settles on the finished run. Uses the real Visuno React
 * component. Honours prefers-reduced-motion by showing the finished run at once.
 */
const STEPS: TimelineStep[] = [
  { label: 'Plan the change', icon: 'spark', kind: 'model', start: 0, duration: 1.6, cost: 0.03 },
  { label: 'Read 6 files', icon: 'file-text', kind: 'tool', start: 1.6, duration: 2.2, cost: 0.02 },
  { label: 'Search Figma', brand: 'figma', kind: 'app', start: 1.9, duration: 1.4, cost: 0.01 },
  { label: 'Edit PricingCard', icon: 'edit', kind: 'model', start: 4, duration: 2.4, cost: 0.06 },
  { label: 'Run tests', icon: 'term', kind: 'tool', start: 6.5, duration: 1.5, cost: 0.01, failed: true, tag: '2 failed', note: '2 tests failed' },
  { label: 'Run tests again', icon: 'refresh', kind: 'tool', start: 8.1, duration: 1.9, cost: 0.01, retry: true },
  { label: 'Open a PR on GitHub', brand: 'github', kind: 'app', start: 10.1, duration: 1, cost: 0.02 },
  { label: 'Post to Slack', brand: 'slack', kind: 'app', start: 11.1, duration: 0.6, cost: 0.01 },
];

const END = 11.7;
const SPAN = 12;
// one second of the run every PACE seconds, so a person can follow it
const PACE = 1.6;

export function AgentRunTimelineExample() {
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
        setTime(undefined); // leave it at the finished run (playhead at the finish)
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
    <div style={{ width: '100%', maxWidth: 560 }}>
      <AgentRunTimeline
        title="Run 4821, update the pricing page"
        steps={STEPS}
        time={time}
        span={SPAN}
      />
    </div>
  );
}
