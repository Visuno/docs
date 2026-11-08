'use client';
import { useEffect, useRef, useState } from 'react';
import { ActionLog, type Action } from '@visuno/action-log/ActionLog';

/**
 * Live example for the Action log docs page, in the shape of the component's own
 * upstream demo: the log grows one tool call at a time, each one running
 * before it lands done with a time, then the header switches from a spinner to a
 * green "5 steps, Xs". Each row opens to show its output pane. Uses the real
 * Visuno React component. Respects prefers-reduced-motion (it shows the finished
 * log at once).
 */
type Raw = {
  icon: Action['icon'];
  title: string;
  detail?: string;
  time: string;
  output: string;
};

const STEPS: Raw[] = [
  {
    icon: 'file-text',
    title: 'Read <code>Pricing.tsx</code>',
    detail: 'src/pages, 212 lines',
    time: '0.4s',
    output: 'export function Pricing() {\n  return <Grid cols={3} gap={20}>…',
  },
  {
    icon: 'search',
    title: 'Searched Figma for <code>Button</code>',
    detail: '6 matches in Components.fig',
    time: '1.1s',
    output: 'Button / Primary\nButton / Secondary\nButton / Ghost  +3',
  },
  {
    icon: 'edit',
    title: 'Edited <code>PricingCard.tsx</code>',
    detail: '+18 − 7 lines',
    time: '2.3s',
    output:
      '<span class="vo-x">- gap: 20px;</span>\n<span class="vo-a">+ gap: var(--space-6);</span>',
  },
  {
    icon: 'term',
    title: 'Ran <code>npm test</code>',
    detail: '24 tests passed',
    time: '3.2s',
    output: '✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed',
  },
  {
    icon: 'pr',
    title: 'Opened a pull request',
    detail: '#412, Use shared spacing tokens',
    time: '0.6s',
    output: 'feat/pricing-spacing → main\n3 commits, ready for review',
  },
];

// The raw HTML strings are rendered through a wrapper so <code>/<span> read as
// markup, which is what the component's title/detail/output accept (ReactNode).
const html = (s: string) => <span dangerouslySetInnerHTML={{ __html: s }} />;

export function ActionLogExample() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCount(STEPS.length);
      setDone(true);
      return;
    }
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setCount(0);
      setDone(false);
      for (let i = 1; i <= STEPS.length; i++) {
        timers.current.push(setTimeout(() => setCount(i), i * 950));
      }
      timers.current.push(setTimeout(() => setDone(true), (STEPS.length + 1) * 950));
      timers.current.push(setTimeout(run, (STEPS.length + 4) * 950));
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const actions: Action[] = STEPS.slice(0, count).map((a, i) => {
    const latest = !done && i === count - 1;
    return {
      icon: a.icon,
      title: html(a.title),
      detail: a.detail ? html(a.detail) : undefined,
      output: html(a.output),
      state: latest ? 'running' : 'done',
      time: latest ? undefined : a.time,
    };
  });

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <ActionLog actions={actions} running={!done} bare={false} />
    </div>
  );
}
