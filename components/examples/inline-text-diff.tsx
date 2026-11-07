'use client';
import { useEffect, useRef, useState } from 'react';
import { InlineTextDiff, type TextPart, type EditDecision } from '@visuno/inline-text-diff/InlineTextDiff';

/**
 * Live example for the Inline text diff docs page, in the shape of the component's
 * own demo upstream: a pricing intro with four of the agent's edits. It plays the
 * story on its own — accept two edits, reject the one the agent isn't sure of, then
 * accept the rest — and replays from the start, pausing when the viewer prefers
 * reduced motion. Uses the real Visuno component.
 */
const PARTS: TextPart[] = [
  { key: 'a', from: 'Pick', to: 'Choose' },
  ' a plan that ',
  { key: 'b', from: 'fits your team', to: 'grows with your studio' },
  '. Every plan ',
  { key: 'c', from: 'includes', to: 'comes with' },
  ' unlimited projects, and ',
  {
    key: 'd',
    from: 'you can cancel at any time',
    to: 'your first month is free',
    note: 'Not in the pricing brief: there is no free month',
  },
  '.',
];

// the story: accept a and b, reject d, then accept the rest (c)
const SCRIPT: Record<string, EditDecision>[] = [
  { a: 'accepted' },
  { a: 'accepted', b: 'accepted' },
  { a: 'accepted', b: 'accepted', d: 'rejected' },
  { a: 'accepted', b: 'accepted', d: 'rejected', c: 'accepted' },
];

export function InlineTextDiffExample() {
  const [decisions, setDecisions] = useState<Record<string, EditDecision>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDecisions(SCRIPT[SCRIPT.length - 1]);
      return;
    }

    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setDecisions({});
      SCRIPT.forEach((step, i) => {
        timers.current.push(setTimeout(() => setDecisions(step), 1400 * (i + 1)));
      });
      // hold the finished state, then replay from the top
      timers.current.push(setTimeout(run, 1400 * (SCRIPT.length + 2)));
    };
    run();

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <InlineTextDiff
        title="Pricing intro"
        parts={PARTS}
        decisions={decisions}
        onDecisionsChange={setDecisions}
        doneLabel="Saved to Pricing v4"
      />
    </div>
  );
}
