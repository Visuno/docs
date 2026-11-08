'use client';
import { useEffect, useState } from 'react';
import { StatusPill } from '@visuno/status-pill/StatusPill';

/**
 * Live example for the Status pill docs page, in the shape of the component's own
 * upstream demo: a set of pills in their states, a file chip and an action,
 * and one `variant="bar"` running a progress track. Uses the real Visuno component.
 *
 * Animated, like the reference: the top pill auto-cycles through what an agent is
 * doing and the bar fills along with it, so you see the fade-between-states and the
 * growing progress track. Respects prefers-reduced-motion.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 64, flex: 'none', fontSize: 12, color: 'var(--vo-muted)' }}>{label}</span>
      {children}
    </div>
  );
}

type Step = {
  state: 'thinking' | 'reading' | 'working' | 'done';
  label: string;
  meta: string;
  progress: number;
};

const CYCLE: Step[] = [
  { state: 'thinking', label: 'Planning the change', meta: '1 of 4', progress: 10 },
  { state: 'reading', label: 'Reading repository', meta: '2 of 4', progress: 45 },
  { state: 'working', label: 'Writing tests', meta: '3 of 4', progress: 80 },
  { state: 'done', label: 'All checks passed', meta: '4 of 4', progress: 100 },
];

export function StatusPillExample() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % CYCLE.length), 1800);
    return () => clearInterval(t);
  }, []);
  const cur = CYCLE[step];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
      <Row label="Live">
        <StatusPill state={cur.state} label={cur.label} meta={cur.meta} />
      </Row>

      <Row label="States">
        <StatusPill state="waiting" label="Waiting for approval" />
      </Row>

      <Row label="File">
        <StatusPill
          state="reading"
          label="Editing"
          file={{ name: 'PricingCard.tsx', type: 'tsx' }}
        />
      </Row>

      <Row label="Action">
        <StatusPill
          state="waiting"
          label="Needs your review"
          action={{ label: 'Open', onClick: () => {} }}
        />
      </Row>

      <Row label="Bar">
        <StatusPill variant="bar" state={cur.state} label={cur.label} meta={cur.meta} progress={cur.progress} />
      </Row>
    </div>
  );
}
