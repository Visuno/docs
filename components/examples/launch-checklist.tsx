'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LaunchChecklist,
  type LaunchCheck,
} from '@visuno/launch-checklist/LaunchChecklist';

/**
 * Live example for the Launch checklist docs page, in the shape of the component's
 * own demo on the upstream site: the agent runs the six checks one by one, two of
 * them fail with a Fix button, and once everything passes the action turns into
 * "Ship it". It self-runs once after mounting (respecting prefers-reduced-motion)
 * and can be re-run from the button. Uses the real Visuno component.
 */

// [label, failure reason (null = passes), note once it passes]
const DATA: [string, string | null, string][] = [
  ['Contrast meets AA', null, 'All 14 text pairs pass'],
  ['Uses library tokens', '3 raw hex values in the FAQ', 'Swapped to color.text.muted'],
  ['Responsive at 375px', null, 'No overflow on 3 breakpoints'],
  ['Alt text on images', '2 icons have no label', 'Added labels from the layer names'],
  ['Links resolve', null, '12 of 12 links return 200'],
  ['Copy matches the brief', null, 'Prices and plan names match'],
];

const initial = (): LaunchCheck[] =>
  DATA.map(([label]) => ({ label, state: 'wait' }));

export function LaunchChecklistExample() {
  const [checks, setChecks] = useState<LaunchCheck[]>(initial);
  const [running, setRunning] = useState(false);
  const [shipped, setShipped] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reduced =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, reduced ? 0 : ms);
        timers.current.push(t);
      }),
    [reduced],
  );

  const setRow = useCallback(
    (i: number, next: Partial<LaunchCheck>) =>
      setChecks((cs) => cs.map((c, j) => (j === i ? { ...c, ...next } : c))),
    [],
  );

  const fix = useCallback(
    async (i: number) => {
      setRow(i, { state: 'run', note: 'Fixing', onFix: undefined });
      await wait(900);
      setRow(i, { state: 'ok', note: DATA[i][2] });
    },
    [wait, setRow],
  );

  const run = useCallback(async () => {
    setRunning(true);
    setShipped(false);
    setChecks(initial());
    await wait(120);
    for (let i = 0; i < DATA.length; i++) {
      setRow(i, { state: 'run', note: 'Checking' });
      await wait(520 + Math.random() * 300);
      const [, fail, pass] = DATA[i];
      if (fail) setRow(i, { state: 'bad', note: fail, onFix: () => fix(i) });
      else setRow(i, { state: 'ok', note: pass });
    }
    setRunning(false);
  }, [wait, setRow, fix]);

  // run once on its own after the entrance; the fixes are left to the viewer
  useEffect(() => {
    const t = setTimeout(() => run(), reduced ? 0 : 900);
    timers.current.push(t);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const started = checks.some((c) => c.state !== 'wait');
  const allOk = started && checks.every((c) => c.state === 'ok');

  const action = shipped
    ? { label: 'Shipped to production', disabled: true }
    : allOk
      ? { label: 'Ship it', accent: true, onClick: () => setShipped(true) }
      : {
          label: running ? 'Checking' : started ? 'Run again' : 'Run checks',
          icon: (running ? 'refresh' : started ? 'refresh' : 'play') as 'play' | 'refresh',
          disabled: running,
          onClick: run,
        };

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <LaunchChecklist
        title="Ready to ship pricing?"
        checks={checks.map((c, i) =>
          c.state === 'bad' ? { ...c, onFix: () => fix(i) } : c,
        )}
        status={shipped ? 'Shipped to production' : undefined}
        action={action}
      />
    </div>
  );
}
