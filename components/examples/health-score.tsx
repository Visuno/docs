'use client';
import { useState } from 'react';
import { HealthScore, type HealthScoreCheck } from '@visuno/health-score/HealthScore';

/**
 * Live example for the Health score docs page. A design system's health as one
 * score with the checks behind it: a half-gauge that swings to the check you
 * point at, bars that fill in one after another, and two fixable checks whose
 * Fix button spins, then updates the score and detail. Uses the real Visuno
 * component; it self-animates and respects prefers-reduced-motion through the
 * component's own motion.
 */
const INITIAL: HealthScoreCheck[] = [
  { key: 'tokens', label: 'Token usage', score: 96, detail: 'All colours come from the library' },
  { key: 'contrast', label: 'Contrast', score: 88, detail: '2 text pairs below AA on the pricing page', fixable: true },
  { key: 'reuse', label: 'Component reuse', score: 74, detail: '11 detached instances in Checkout', fixable: true },
  { key: 'naming', label: 'Naming', score: 91, detail: 'Layer names follow the convention' },
];

const FIXED: Record<string, { score: number; detail: string }> = {
  contrast: { score: 97, detail: 'Fixed. Both pairs now pass AA' },
  reuse: { score: 93, detail: 'Fixed. Reattached 11 instances' },
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function HealthScoreExample() {
  const [checks, setChecks] = useState<HealthScoreCheck[]>(INITIAL);

  const onFix = async (check: HealthScoreCheck, index: number) => {
    await wait(900);
    const patch = FIXED[check.key ?? check.label];
    if (!patch) return;
    setChecks((prev) =>
      prev.map((c, i) => (i === index ? { ...c, score: patch.score, detail: patch.detail, fixable: false } : c)),
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <HealthScore checks={checks} title="Design system health" onFix={onFix} />
    </div>
  );
}
