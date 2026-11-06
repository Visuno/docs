'use client';
import { useEffect, useState } from 'react';
import { ReasoningTrail, type ReasoningTrailView } from '@visuno/reasoning-trail/ReasoningTrail';

/**
 * Live example for the Reasoning trail docs page, in the shape of the component's
 * own upstream demo: the agent's plan works through its steps while a
 * header counts the seconds, and a row of buttons switches between the plan, the
 * notes, the sources and the edits. Uses the real Visuno React component.
 *
 * Animated, like the reference: the plan advances one step at a time and the
 * header shimmers and counts while it runs, then settles on "Reasoned for Ns".
 * Respects prefers-reduced-motion (it shows the finished plan at once).
 */
const PLAN_LABELS: { label: string; detail: string }[] = [
  { label: 'Open the onboarding file', detail: '4 frames' },
  { label: 'Compare it with the design system', detail: '12 components' },
  { label: 'Find spacing that breaks the 8px grid', detail: '3 frames' },
  { label: 'Draft fixes for review', detail: 'Ready' },
];

const NOTES = [
  'The hero card uses 20px padding, every other card uses 24px.',
  'Mobile frames already follow the grid, desktop drifted.',
  'Two buttons use a hard-coded grey instead of a token.',
];

const SOURCES = [
  { label: 'Onboarding.fig', kind: 'figma' as const, tip: 'Figma, 4 frames read' },
  { label: 'tokens.ts', kind: 'ts' as const, tip: 'src/styles/tokens.ts, 212 lines' },
  { label: 'Card.tsx', kind: 'tsx' as const, tip: 'src/components/Card.tsx, 2 edits' },
  { label: 'Spacing guide', kind: 'web' as const, tip: 'example.com/guide/spacing' },
];

const EDITS = [
  { file: 'Card.tsx', detail: '2 lines', removed: ['padding: 20px;'], added: ['padding: var(--space-6);'] },
  { file: 'Button.tsx', detail: '1 line', removed: ['color: #8a8a8a;'], added: ['color: var(--text-dim);'] },
];

const VIEWS: { value: ReasoningTrailView; label: string }[] = [
  { value: 'plan', label: 'Plan' },
  { value: 'notes', label: 'Notes' },
  { value: 'sources', label: 'Sources' },
  { value: 'edits', label: 'Edits' },
];

export function ReasoningTrailExample() {
  const [done, setDone] = useState(0); // finished plan steps
  const [running, setRunning] = useState(true);
  const [view, setView] = useState<ReasoningTrailView>('plan');

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDone(PLAN_LABELS.length);
      setRunning(false);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= PLAN_LABELS.length; i++) {
      timers.push(setTimeout(() => setDone(i), i * 1500));
    }
    timers.push(setTimeout(() => setRunning(false), (PLAN_LABELS.length + 1) * 1500));
    return () => timers.forEach(clearTimeout);
  }, []);

  const plan = PLAN_LABELS.map((p, i) => ({
    label: p.label,
    detail: p.detail,
    state: (i < done ? 'done' : i === done && running ? 'now' : 'next') as 'done' | 'now' | 'next',
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 440 }}>
      <ReasoningTrail
        running={running}
        plan={plan}
        notes={NOTES}
        sources={SOURCES}
        edits={EDITS}
        view={view}
        onViewChange={setView}
        bare={false}
      />
      <div className="dm-seg2" role="group" aria-label="View" style={{ display: 'inline-flex', gap: 2, padding: 3, borderRadius: 'var(--dm-r-pill)', background: 'var(--dm-chip)' }}>
        {VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            aria-pressed={view === v.value}
            onClick={() => setView(v.value)}
            style={{
              height: 26,
              padding: '0 11px',
              borderRadius: 'var(--dm-r-pill)',
              fontSize: 12.5,
              color: view === v.value ? 'var(--dm-fg)' : 'var(--dm-fg2)',
              background: view === v.value ? 'var(--dm-surface)' : 'transparent',
              fontWeight: view === v.value ? 500 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
