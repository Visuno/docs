'use client';
import { useEffect, useState } from 'react';
import { ArtifactCard, type ArtifactVersion } from '@visuno/artifact-card/ArtifactCard';

/**
 * Live example for the Artifact Card docs page, in the shape of the component's
 * own demo upstream: a row of buttons switches between the four variants, and
 * each one plays its writing state before it settles into the finished card —
 * so you can watch the agent make the file, then open its versions, Copy and
 * Download. Uses the real Visuno component.
 *
 * Respects prefers-reduced-motion: then the writing state is skipped and the
 * finished card is shown straight away.
 */
const VERSIONS: ArtifactVersion[] = [
  {
    title: 'Pricing page review',
    meta: 'edited 2 hours ago',
    note: 'First pass, four findings',
    content:
      '# Pricing page review\n\nv1, edited 2 hours ago\n\n## Summary\n\nPeople reach the plan table and stall. Most of what slows them down is clarity, not price.\n\n## Findings\n\n- The three plans look alike at a glance.\n- The yearly switch hides what a month costs.\n- Nothing near the buttons says you can cancel any time.\n- The FAQ repeats the plan table instead of answering doubts.\n',
  },
  {
    title: 'Pricing page review',
    meta: 'edited 40 min ago',
    note: 'Added a competitor price check',
    content:
      '# Pricing page review\n\nv2, edited 40 min ago\n\n## Summary\n\nPeople reach the plan table and stall. Team also costs more than similar plans elsewhere, and the page never says why.\n\n## Findings\n\n- The three plans look alike at a glance.\n- The yearly switch hides what a month costs.\n- Nothing near the buttons says you can cancel any time.\n- Team costs 16% more than similar plans elsewhere, and the page never says why.\n',
  },
  {
    title: 'Pricing page review',
    meta: 'edited just now',
    note: 'Fixes, ordered by impact',
    content:
      '# Pricing page review\n\nv3, edited just now\n\n## Summary\n\nPeople reach the plan table and stall. Three changes should move most of them on, and none of them touch the price.\n\n## What to fix first\n\n1. Show the monthly price beside the yearly one.\n2. Mark Team as the plan most people choose.\n3. Put “Cancel any time” under each button.\n',
  },
];

const STEPS = ['Reading the page…', 'Writing the findings…', 'Ordering the fixes…'];
const VARIANTS: { value: 'compact' | 'preview' | 'inline' | 'stack'; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'preview', label: 'Preview' },
  { value: 'inline', label: 'Inline' },
  { value: 'stack', label: 'Stack' },
];

export function ArtifactCardExample() {
  const [variant, setVariant] = useState<'compact' | 'preview' | 'inline' | 'stack'>('compact');
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  // replay the writing state whenever the variant changes, then settle
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setStep(STEPS.length - 1);
      setReady(true);
      return;
    }
    setReady(false);
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let j = 1; j < STEPS.length; j++) {
      timers.push(setTimeout(() => setStep(j), j * 1100));
    }
    timers.push(setTimeout(() => setReady(true), STEPS.length * 1100));
    return () => timers.forEach(clearTimeout);
  }, [variant]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        maxWidth: 460,
        alignItems: 'center',
      }}
    >
      <ArtifactCard
        key={variant}
        variant={variant}
        versions={VERSIONS}
        kind="Report"
        icon="file-text"
        fileName="pricing-page-review"
        state={ready ? 'ready' : 'writing'}
        status={STEPS[step]}
        progress={(step + 1) / STEPS.length}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {VARIANTS.map((vrt) => (
          <button
            key={vrt.value}
            type="button"
            className="dm-pill dm-soft dm-sm"
            aria-pressed={variant === vrt.value}
            onClick={() => setVariant(vrt.value)}
          >
            {vrt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
