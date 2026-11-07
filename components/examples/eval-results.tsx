'use client';
import { useEffect, useRef, useState } from 'react';
import { EvalResults, type EvalCase, type EvalStatus } from '@visuno/eval-results/EvalResults';

/**
 * Live example for the Eval results docs page, in the shape of the component's own
 * demo upstream: a suite runs case by case, the price check fails against the last
 * run, its details open, the fix reruns just that case, and all eight pass. Then it
 * resets and plays again. Uses the real Visuno component.
 *
 * Respects prefers-reduced-motion: with it on, the run resolves at once and the
 * loop does not restart on its own.
 */

interface Spec {
  id: string;
  name: string;
  time: string;
  bad?: boolean;
  expected?: string;
  got?: string;
  source?: string;
}

const SPEC: Spec[] = [
  { id: 'seat', name: 'Names the Pro seat limit', time: '0.6s' },
  {
    id: 'price',
    name: 'Prices match the billing table',
    time: '0.9s',
    bad: true,
    expected: '$24 a seat, billed yearly',
    got: '$29 a seat, billed yearly',
    source: 'Billing table, Pro row',
  },
  { id: 'disc', name: 'Mentions the yearly discount', time: '0.5s' },
  { id: 'unl', name: 'Makes no “unlimited” claims', time: '0.4s' },
  { id: 'sso', name: 'Team plan lists SSO', time: '0.5s' },
  { id: 'grade', name: 'Reads at grade 8 or below', time: '0.7s' },
  { id: 'cta', name: 'One call to action per plan', time: '0.5s' },
  { id: 'card', name: 'Free plan says no card is needed', time: '0.6s' },
];

const PREV_PASSED = 8;

export function EvalResultsExample() {
  const [cases, setCases] = useState<EvalCase[]>(() =>
    SPEC.map((s) => ({ id: s.id, name: s.name, status: 'pass' as EvalStatus })),
  );
  const [running, setRunning] = useState(false);
  const [subtitle, setSubtitle] = useState('Copy agent · 8 cases · run 2h ago');
  const [open, setOpen] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'fail'>('all');

  const fixed = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, reduce ? 0 : ms);
        timers.current.push(t);
      });

    const settle = (spec: Spec): EvalCase => ({
      id: spec.id,
      name: spec.name,
      status: spec.bad && !fixed.current ? 'fail' : 'pass',
      time: spec.time,
      expected: spec.expected,
      got: spec.got,
      source: spec.source,
      fix: spec.bad
        ? { label: 'Use $24 and rerun', onClick: () => {} }
        : undefined,
    });

    let cancelled = false;

    async function story() {
      // a run checks the cases one after another; the price check fails until it is fixed
      fixed.current = false;
      setFilter('all');
      setOpen([]);
      setRunning(true);
      setCases(SPEC.map((s) => ({ id: s.id, name: s.name, status: 'queued' })));
      await wait(600);

      for (let i = 0; i < SPEC.length; i++) {
        if (cancelled) return;
        setCases((prev) =>
          prev.map((k, j) => (j === i ? { ...k, status: 'running' } : k)),
        );
        await wait(reduce ? 0 : 320);
        setCases((prev) => prev.map((k, j) => (j === i ? settle(SPEC[j]) : k)));
      }

      setRunning(false);
      setSubtitle('Copy agent · 8 cases · run just now');
      await wait(1400);

      // see one fail against the last run, filter to it, open it, take the fix
      if (cancelled) return;
      setFilter('fail');
      await wait(900);
      setOpen(['price']);
      await wait(1400);

      // the fix changes the copy to the billing table's price and reruns that case
      fixed.current = true;
      setCases((prev) =>
        prev.map((k) => (k.id === 'price' ? { ...k, status: 'running' } : k)),
      );
      setOpen([]);
      await wait(reduce ? 0 : 900);
      if (cancelled) return;
      setCases((prev) =>
        prev.map((k) => (k.id === 'price' ? settle(SPEC[1]) : k)),
      );
      await wait(1200);
      setFilter('all');
      await wait(2000);

      if (!cancelled && !reduce) story();
    }

    story();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <EvalResults
      title="Pricing copy evals"
      subtitle={subtitle}
      cases={cases}
      running={running}
      onRun={() => {}}
      previousPassed={PREV_PASSED}
      filter={filter}
      onFilterChange={setFilter}
      open={open}
      onOpenChange={setOpen}
    />
  );
}
