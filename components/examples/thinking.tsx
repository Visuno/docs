'use client';
import { useEffect, useRef, useState } from 'react';
import { Thinking, type ThinkingStep } from '@visuno/thinking/Thinking';

/**
 * Live example for the Thinking docs page.
 *
 * The live trace an agent writes as it works: steps arrive one by one, each
 * spins while it runs and turns into a green check with what it found and how
 * long it took. Once the last step lands the header becomes a summary and the
 * trace folds itself away; a Replay button runs it again.
 *
 * Mirrors the reference run from the vanilla source. Respects
 * prefers-reduced-motion: when motion is reduced, the finished trace is shown
 * at once instead of streaming in.
 */

// each step: label, how long it runs, and what it found once done
const SCRIPT: { label: string; ms: number; result: string; time: string }[] = [
  { label: 'Open Pricing v4 in Figma', ms: 1300, result: '6 frames, 3 plan cards', time: '1.3s' },
  { label: 'Read the spacing tokens', ms: 1200, result: 'tokens.css, 9 spacing values', time: '1.2s' },
  { label: 'Measure the plan cards', ms: 1400, result: '3 cards are off the 8px grid', time: '1.4s' },
  { label: 'Check text contrast', ms: 1100, result: 'All 14 text pairs pass AA', time: '1.1s' },
  { label: 'Plan the fix', ms: 1200, result: '2 changes, about 3 minutes', time: '1.2s' },
];

const DONE: ThinkingStep[] = SCRIPT.map((s) => ({
  label: s.label,
  state: 'done',
  result: s.result,
  time: s.time,
}));

export function ThinkingExample() {
  const [steps, setSteps] = useState<ThinkingStep[]>([]);
  const [running, setRunning] = useState(true);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setSteps(DONE);
      setRunning(false);
      return;
    }

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    setSteps([]);
    setRunning(true);
    let at = 0;
    const current: ThinkingStep[] = [];

    const next = () => {
      if (at >= SCRIPT.length) {
        later(() => setRunning(false), 600);
        return;
      }
      const s = SCRIPT[at];
      // the step arrives running
      current.push({ label: s.label, state: 'running' });
      setSteps([...current]);
      later(() => {
        // then settles into done with its result and time
        current[at] = { label: s.label, state: 'done', result: s.result, time: s.time };
        setSteps([...current]);
        at += 1;
        next();
      }, s.ms);
    };

    later(next, 600);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [runId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <Thinking
        steps={steps}
        running={running}
        title="Checking the pricing page"
        summary="3 cards to fix, 2 changes planned"
      />
      {!running && (
        <button
          type="button"
          className="vo-pill vo-ghost vo-sm"
          onClick={() => setRunId((n) => n + 1)}
        >
          Replay
        </button>
      )}
    </div>
  );
}
