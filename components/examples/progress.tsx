'use client';
import { useEffect, useRef, useState } from 'react';
import { Progress, type ProgressState } from '@visuno/progress/Progress';

/**
 * Live example for the Progress docs page. A run that indexes a docs set,
 * advancing through its steps on a timer to "complete", with working Pause,
 * Resume and Run again controls and a credits meter that warns as it fills.
 * Uses the real Visuno React component. Honours prefers-reduced-motion by
 * jumping straight to the finished state.
 */
const STEPS = [
  { label: 'Reading files', unit: 'Files', total: 2000 },
  { label: 'Embedding', unit: 'Chunks', total: 5400 },
  { label: 'Building the index', unit: 'Vectors', total: 5400 },
  { label: 'Writing', unit: 'Shards', total: 16 },
];

const METER = {
  label: 'Credits this month',
  value: 8558,
  max: 10000,
  unit: 'credits',
  warnAt: 0.75,
  dangerAt: 0.9,
  note: 'Resets Dec 1',
};

export function ProgressExample() {
  const [state, setState] = useState<ProgressState>('running');
  const [step, setStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  // the timer reads the live state through a ref so it keeps running across
  // pause, resume and restart without being torn down and set up again
  const running = useRef(true);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      running.current = false;
      setStep(STEPS.length - 1);
      setStepProgress(1);
      setState('complete');
      return;
    }
    const id = setInterval(() => {
      if (!running.current) return;
      setStepProgress((p) => {
        const next = p + 0.04;
        if (next < 1) return next;
        setStep((s) => {
          if (s >= STEPS.length - 1) {
            running.current = false;
            setState('complete');
            return s;
          }
          return s + 1;
        });
        return 0;
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  const pause = () => {
    running.current = false;
    setState('paused');
  };
  const resume = () => {
    running.current = true;
    setState('running');
  };
  const retry = () => {
    running.current = true;
    setState('running');
  };
  const restart = () => {
    setStep(0);
    setStepProgress(0);
    running.current = true;
    setState('running');
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Progress
        title="Indexing the docs"
        state={state}
        steps={STEPS}
        step={step}
        stepProgress={stepProgress}
        meter={METER}
        onPause={pause}
        onResume={resume}
        onRetry={retry}
        onRestart={restart}
      />
    </div>
  );
}
