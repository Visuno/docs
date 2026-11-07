'use client';
import { useEffect, useRef, useState } from 'react';
import {
  DesignReview,
  type ReviewCheck,
  type ReviewMessage,
  type ReviewPhase,
} from '@visuno/design-review/DesignReview';

/**
 * Live example for the Design review docs page, in the shape of the component's own
 * demo upstream: the checks run one after another, then a teammate asks for a change,
 * the agent answers, and the teammate approves — after which the Ship button turns on.
 * It plays once on mount and respects prefers-reduced-motion (then it shows the final
 * approved state at once). Uses the real Visuno component.
 */

type Step = {
  checks: ReviewCheck[];
  messages: ReviewMessage[];
  phase: ReviewPhase;
  note?: string;
};

const MAYA = { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)' };
const AGENT = { name: 'Design agent', agent: true };

const CHECK_LABELS = ['Visual diff', 'Library tokens', 'Contrast'] as const;
const CHECK_NOTES = ['2 of 6 screens changed', 'All from the library', 'AA on every screen'] as const;

function checksUpTo(done: number, running: number): ReviewCheck[] {
  return CHECK_LABELS.map((label, i) => ({
    label,
    state: i < done ? 'ok' : i === running ? 'run' : 'wait',
    note: i < done ? CHECK_NOTES[i] : undefined,
  }));
}

const REQUEST: ReviewMessage = {
  author: MAYA,
  verdict: { label: 'Changes requested', tone: 'warn' },
  text: 'Start the plan toggle on yearly. Most people pick it.',
};
const WORKING: ReviewMessage = {
  author: AGENT,
  verdict: { label: 'Updating', busy: true },
};
const UPDATED: ReviewMessage = {
  author: AGENT,
  verdict: { label: 'Updated' },
  text: 'The toggle starts on yearly on all 6 screens.',
};
const APPROVED: ReviewMessage = {
  author: MAYA,
  verdict: { label: 'Approved', tone: 'ok', icon: 'check' },
};

// each step with how long to hold it before the next
const STEPS: { step: Step; after: number }[] = [
  { step: { checks: checksUpTo(0, 0), messages: [], phase: 'review', note: 'Running checks' }, after: 700 },
  { step: { checks: checksUpTo(1, 1), messages: [], phase: 'review', note: 'Running checks' }, after: 700 },
  { step: { checks: checksUpTo(2, 2), messages: [], phase: 'review', note: 'Running checks' }, after: 800 },
  { step: { checks: checksUpTo(3, -1), messages: [], phase: 'review', note: 'Waiting on Maya' }, after: 900 },
  { step: { checks: checksUpTo(3, -1), messages: [REQUEST], phase: 'review', note: 'The agent is on it' }, after: 1200 },
  { step: { checks: checksUpTo(3, -1), messages: [REQUEST, WORKING], phase: 'review', note: 'The agent is on it' }, after: 1300 },
  { step: { checks: checksUpTo(3, -1), messages: [REQUEST, UPDATED], phase: 'review', note: 'Waiting on Maya' }, after: 1100 },
  { step: { checks: checksUpTo(3, -1), messages: [REQUEST, UPDATED, APPROVED], phase: 'approved', note: 'Approved by Maya' }, after: 0 },
];

const FINAL = STEPS[STEPS.length - 1].step;

export function DesignReviewExample() {
  const [i, setI] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setI(STEPS.length - 1);
      return;
    }
    let acc = 0;
    for (let s = 1; s < STEPS.length; s++) {
      acc += STEPS[s - 1].after;
      const idx = s;
      timers.current.push(setTimeout(() => setI(idx), acc));
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const s = STEPS[i]?.step ?? FINAL;

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <DesignReview
        title="Pricing page v4"
        subtitle="6 screens · sent for review by the design agent"
        checks={s.checks}
        messages={s.messages}
        phase={s.phase}
        note={s.note}
        doneLabel="Live for every visitor"
      />
    </div>
  );
}
