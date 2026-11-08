'use client';
import { useEffect, useRef, useState } from 'react';
import { PlanReview, type PlanReviewStep, type PlanPhase } from '@visuno/plan-review/PlanReview';

/**
 * Live example for the Plan review docs page.
 *
 * The plan the agent proposes before it starts. It mirrors the reference run
 * from the vanilla source: the demo rewrites a step, approves the plan, then
 * works through the steps — the second one hits a rate limit, waits it out and
 * retries — until it is done and the footer offers "See changes". A Replay
 * button runs it again.
 *
 * Respects prefers-reduced-motion: when motion is reduced the finished (done)
 * plan is shown at once instead of animating through it.
 */

// each step, and the line it reports once it is done
const SCRIPT: { text: string; done: string }[] = [
  { text: 'Read the pricing frames and the brand tokens', done: '6 frames and 42 tokens read' },
  { text: 'Compare against the three competitor pages', done: '3 pages compared' },
  { text: 'Simplify the plan cards to one CTA each, annual price first', done: 'Plan cards now have one CTA each' },
  { text: 'Move the FAQ below the comparison table', done: 'FAQ now sits under the table' },
  { text: 'Write a summary of every change', done: 'Summary added to Pricing v4' },
];

const START: PlanReviewStep[] = SCRIPT.map((s, i) => ({
  id: 's' + i,
  // the demo rewrites the third step, so it starts from the original wording
  text: i === 2 ? 'Simplify the plan cards to one CTA each' : s.text,
}));

const DONE: PlanReviewStep[] = SCRIPT.map((s, i) => ({
  id: 's' + i,
  text: s.text,
  edited: i === 2,
  state: 'done',
  detail: s.done,
}));

export function PlanReviewExample() {
  const [steps, setSteps] = useState<PlanReviewStep[]>(START);
  const [phase, setPhase] = useState<PlanPhase>('review');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [meta, setMeta] = useState<string | undefined>(undefined);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    if (reduce) {
      setSteps(DONE);
      setPhase('done');
      setStatus('Done in 0:07. 4 frames updated');
      setNote(undefined);
      setMeta('0:07');
      return clear;
    }

    // start fresh in review, then play the run
    setSteps(START);
    setPhase('review');
    setStatus(undefined);
    setNote(undefined);
    setMeta(undefined);

    // the working copy the run mutates, step by step
    const live: PlanReviewStep[] = START.map((s) => ({ ...s }));
    const set = (i: number, change: Partial<PlanReviewStep>) => {
      live[i] = { ...live[i], ...change };
      setSteps(live.map((s) => ({ ...s })));
    };

    let at = 2600;
    // rewrite the third step, the way the reference demo types into it
    later(() => set(2, { text: SCRIPT[2].text, edited: true }), at);
    at += 1400;

    // approve: move to running
    later(() => {
      setPhase('running');
      setNote('Running the approved plan');
      setMeta('0:00');
    }, at);
    at += 300;

    // a seconds counter while it runs
    const t0 = at;
    [1, 2, 3, 4, 5, 6, 7].forEach((s) => {
      later(() => setMeta('0:0' + s), t0 + s * 1000);
    });

    // step 0: runs, then done
    later(() => set(0, { state: 'run' }), at);
    at += 900;
    later(() => set(0, { state: 'done', detail: SCRIPT[0].done }), at);
    at += 300;

    // step 1: runs, hits a rate limit, waits it out, retries, then done
    later(() => set(1, { state: 'run' }), at);
    at += 900;
    [3, 2, 1].forEach((k) => {
      later(
        () => set(1, { state: 'retry', detail: `Rate limited by the browser tool. Retrying in ${k}s` }),
        at
      );
      at += 1000;
    });
    later(() => set(1, { state: 'run', detail: 'Retrying' }), at);
    at += 700;
    later(() => set(1, { state: 'done', detail: SCRIPT[1].done + ', after 1 retry' }), at);
    at += 300;

    // steps 2–4: run, then done
    for (let i = 2; i < SCRIPT.length; i++) {
      const idx = i;
      later(() => set(idx, { state: 'run' }), at);
      at += 800;
      later(() => set(idx, { state: 'done', detail: SCRIPT[idx].done }), at);
      at += 250;
    }

    // done: the footer offers "See changes"
    later(() => {
      setPhase('done');
      setStatus('Done. 4 frames updated');
      setNote(undefined);
    }, at);

    return clear;
  }, [runId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 16, width: '100%', maxWidth: 420 }}>
      <PlanReview
        title="Plan: redesign the pricing page"
        steps={steps}
        phase={phase}
        status={status}
        note={note}
        meta={meta}
      />
      {phase === 'done' && (
        <button
          type="button"
          className="vo-pill vo-ghost vo-sm"
          style={{ alignSelf: 'center' }}
          onClick={() => setRunId((n) => n + 1)}
        >
          Replay
        </button>
      )}
    </div>
  );
}
