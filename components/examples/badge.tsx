'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@visuno/badge/Badge';

/**
 * Live example for the Badge docs page — the full reference card from
 * example.com/#c140: Tones, Colours, Sizes, Dot or icon, and Removable rows.
 * Uses the real Visuno React component.
 *
 * Animated, like the reference:
 *  - the "Running" badge pulses its dot (the component's `.vo-live` class).
 *  - a status badge auto-cycles through its states on a timer.
 *  - removable badges scale-and-fade out (`.vo-go` -> vo-bdgout keyframe) before
 *    leaving the list, with an Undo to bring them back.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 76, flex: 'none', fontSize: 12, color: 'var(--vo-muted)' }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

const CYCLE: { tone: 'neutral' | 'accent' | 'success' | 'warning'; label: string; dot: boolean; live?: boolean }[] = [
  { tone: 'neutral', label: 'Queued', dot: true },
  { tone: 'accent', label: 'Starting', dot: true },
  { tone: 'success', label: 'Running', live: true, dot: true },
  { tone: 'warning', label: 'Paused', dot: true },
  { tone: 'success', label: 'Done', dot: true },
];

const INITIAL = [
  { label: 'Production', tone: 'warning' as const },
  { label: 'Staging', tone: 'blue' as const },
  { label: 'Preview', tone: 'violet' as const },
];

export function BadgeExample() {
  // Auto-cycling status badge.
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % CYCLE.length), 1600);
    return () => clearInterval(t);
  }, []);
  const cur = CYCLE[step];

  // Removable badges with a scale-and-fade exit.
  const [items, setItems] = useState(INITIAL);
  const [leaving, setLeaving] = useState<string | null>(null);
  const remove = (label: string) => {
    setLeaving(label);
    setTimeout(() => {
      setItems((xs) => xs.filter((x) => x.label !== label));
      setLeaving(null);
    }, 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 520 }}>
      <Row label="Tones">
        <Badge>Draft</Badge>
        <Badge tone="accent">Beta</Badge>
        <Badge tone="success">Live</Badge>
        <Badge tone="warning">Degraded</Badge>
        <Badge tone="danger">Failed</Badge>
      </Row>

      <Row label="Colours">
        <Badge tone="blue">Search</Badge>
        <Badge tone="violet">Reasoning</Badge>
        <Badge tone="green">Data</Badge>
        <Badge tone="orange">Billing</Badge>
        <Badge tone="red">Urgent</Badge>
        <Badge tone="yellow">Review</Badge>
        <Badge tone="pink">Design</Badge>
        <Badge tone="teal">Ops</Badge>
      </Row>

      <Row label="Live">
        <Badge
          tone={cur.tone}
          dot={cur.dot}
          className={cur.live ? 'vo-live vo-anim' : 'vo-anim'}
        >
          {cur.label}
        </Badge>
      </Row>

      <Row label="Dot or icon">
        <Badge tone="success" dot className="vo-live">
          Running
        </Badge>
        <Badge dot>Idle</Badge>
        <Badge icon="lock">Private</Badge>
        <Badge tone="accent" icon="sparkles">
          Agent
        </Badge>
      </Row>

      <Row label="Removable">
        {items.map((b) => (
          <Badge
            key={b.label}
            tone={b.tone}
            className={leaving === b.label ? 'vo-go' : undefined}
            onRemove={() => remove(b.label)}
          >
            {b.label}
          </Badge>
        ))}
        {items.length === 0 && (
          <button type="button" className="vo-pill vo-ghost vo-sm" onClick={() => setItems(INITIAL)}>
            Undo
          </button>
        )}
      </Row>
    </div>
  );
}
