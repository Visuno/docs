'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolCall, type ToolCallItem } from '@visuno/tool-call/ToolCall';

/**
 * Live example for the Tool call docs page, in the shape of the component's own
 * demo on upstream. Two calls run one after another: each queues, then spins,
 * then settles with the time it took and its output; the reply fades in once
 * both are done, and the first call opens to show what came back. Respects
 * prefers-reduced-motion by showing the finished state at once. Uses the real
 * Visuno component.
 */
const CALLS: ToolCallItem[] = [
  {
    key: 'billing',
    server: 'billing',
    name: 'list_plan_changes',
    icon: 'coins',
    state: 'queued',
    duration: '412 ms',
    input: { since: '2026-10-01' },
    output: [
      { plan: 'Pro', price: 24 },
      { plan: 'Team', price: 48 },
    ],
  },
  {
    key: 'files',
    server: 'files',
    name: 'edit',
    icon: 'edit',
    state: 'queued',
    duration: '1.2 s',
    input: { path: 'Pricing.tsx', lines: 6 },
    output: { changed: 6, saved: true },
  },
];

const MESSAGE = 'Checking which plans changed this month before I update the pricing page.';
const REPLY = 'Two plans changed. I updated their prices and the yearly saving on the page.';

export function ToolCallExample() {
  const [calls, setCalls] = useState<ToolCallItem[]>(CALLS);
  const [open, setOpen] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const set = (fn: (prev: ToolCallItem[]) => ToolCallItem[]) => setCalls(fn);
    const at = (ms: number, run: () => void) => {
      timers.current.push(setTimeout(run, ms));
    };

    if (reduce) {
      setCalls(CALLS.map((c) => ({ ...c, state: 'done' })));
      setOpen([CALLS[0].key]);
      return () => {};
    }

    // reset, then run each call in turn: start it (running), then finish it (done)
    setCalls(CALLS.map((c) => ({ ...c, state: 'queued' })));
    setOpen([]);
    let t = 600;
    CALLS.forEach((call, i) => {
      at(t, () =>
        set((prev) => prev.map((c, j) => (j === i ? { ...c, state: 'running' } : c))),
      );
      t += 1300;
      at(t, () =>
        set((prev) => prev.map((c, j) => (j === i ? { ...c, state: 'done' } : c))),
      );
    });
    // open the first call once everything has finished, to show what came back
    at(t + 200, () => setOpen([CALLS[0].key]));

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <ToolCall
        message={MESSAGE}
        calls={calls}
        reply={REPLY}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
