'use client';
import { useEffect, useState } from 'react';
import { StepLoader } from '@visuno/step-loader/StepLoader';

/**
 * Live example for the Step Loader docs page.
 *
 * A named-steps progress list that advances on a timer from the first step
 * through to "all done", then loops. Click the row to expand the full list.
 * Respects prefers-reduced-motion (then it holds mid-run instead of animating).
 *
 * A small row of the same loader shown with each of its four glyphs sits below.
 */
const STEPS = [
  { label: 'Reading Figma frames', done: 'Read 4 frames' },
  { label: 'Generating components', done: 'Made 6 components' },
  { label: 'Writing tests', done: 'Wrote 12 tests' },
  { label: 'Running the suite', done: 'All green' },
];

const GLYPHS: { loader: 'radar' | 'dots' | 'ring' | 'bars'; name: string }[] = [
  { loader: 'radar', name: 'Radar' },
  { loader: 'dots', name: 'Dots' },
  { loader: 'ring', name: 'Ring' },
  { loader: 'bars', name: 'Bars' },
];

export function StepLoaderExample() {
  // Advance the running step on a timer, pausing on "done" before looping.
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCurrent(1);
      return;
    }
    const t = setInterval(() => {
      setCurrent((c) => (c > STEPS.length ? 0 : c + 1));
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--dm-7, 32px)',
        width: '100%',
        maxWidth: 560,
        alignItems: 'center',
      }}
    >
      <StepLoader steps={STEPS} current={current} loader="radar" defaultOpen />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--dm-6, 24px)',
          width: '100%',
          justifyItems: 'center',
        }}
      >
        {GLYPHS.map((g) => (
          <div
            key={g.loader}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--dm-3, 12px)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--dm-muted)' }}>{g.name}</span>
            <StepLoader
              steps={[{ label: `${g.name} loader` }]}
              current={0}
              loader={g.loader}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
