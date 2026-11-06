'use client';
import { useEffect, useRef, useState } from 'react';
import { RunQueue, type RunJob } from '@visuno/run-queue/RunQueue';

/**
 * Live example for the Run queue docs page — a launch-prep queue that runs
 * itself: jobs move from "Up next" to "Running" (raised, with their steps and a
 * progress bar) to "Done", one step failing and then recovering on Retry, until
 * a summary takes the running job's place. The Detailed / Compact switch is left
 * to the component. Uses the real Visuno React component. Honours
 * prefers-reduced-motion by showing the finished queue at once.
 */

type JobSeed = {
  id: string;
  title: string;
  agent: string;
  icon: RunJob['icon'];
  steps: string[];
  time: string;
  failAt?: number; // the step index that fails once, then recovers on Retry
};

const SEEDS: JobSeed[] = [
  { id: 'brief', title: 'Summarise the research', agent: 'Research agent', icon: 'brain', time: '3.1s', steps: ['Read 12 notes', 'Cluster findings', 'Write the brief'] },
  { id: 'email', title: 'Draft the launch email', agent: 'Copy agent', icon: 'spark', time: '4.2s', steps: ['Outline', 'Draft', 'Proofread'], failAt: 1 },
  { id: 'assets', title: 'Render the hero image', agent: 'Design agent', icon: 'image', time: '2.4s', steps: ['Compose', 'Render'] },
  { id: 'post', title: 'Schedule the posts', agent: 'Social agent', icon: 'send', time: 'in ~4s', steps: ['Pick slots', 'Queue'] },
];

const FINISHED: RunJob[] = SEEDS.map((s) => ({
  id: s.id,
  title: s.title,
  agent: s.agent,
  icon: s.icon,
  state: 'done',
  progress: 1,
  time: s.time,
  steps: s.steps.map((label) => ({ label, state: 'done' })),
}));

export function RunQueueExample() {
  // `tick` drives a small state machine: which job is active and how many of its
  // steps are done, plus whether the current fail step is still failed.
  const [active, setActive] = useState(0);
  const [stepsDone, setStepsDone] = useState(0);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setReduced(true);
      return;
    }
    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    let a = 0;
    let done = 0;
    const advance = () => {
      const seed = SEEDS[a];
      // a step that should fail stops the job until Retry fires
      if (seed.failAt !== undefined && done === seed.failAt) {
        setFailed(true);
        // auto-retry after a beat, as if a person pressed Retry
        later(() => {
          setFailed(false);
          done += 1;
          setStepsDone(done);
          later(advance, 700);
        }, 1400);
        return;
      }
      if (done < seed.steps.length) {
        done += 1;
        setStepsDone(done);
        later(advance, 700);
        return;
      }
      // the job is done: move to the next
      a += 1;
      done = 0;
      if (a >= SEEDS.length) {
        setFinished(true);
        return;
      }
      setActive(a);
      setStepsDone(0);
      later(advance, 600);
    };
    later(advance, 700);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const jobs: RunJob[] = reduced
    ? FINISHED
    : finished
      ? FINISHED
      : SEEDS.map((s, i) => {
          if (i < active) {
            return {
              id: s.id,
              title: s.title,
              agent: s.agent,
              icon: s.icon,
              state: 'done',
              progress: 1,
              time: s.time,
              steps: s.steps.map((label) => ({ label, state: 'done' as const })),
            };
          }
          if (i > active) {
            return {
              id: s.id,
              title: s.title,
              agent: s.agent,
              icon: s.icon,
              state: 'queued',
              time: s.time,
              steps: s.steps.map((label) => ({ label, state: 'queued' as const })),
            };
          }
          // the active job: steps up to stepsDone are done, the next is running or failed
          const isFail = failed && s.failAt !== undefined;
          const steps = s.steps.map((label, si) => {
            if (si < stepsDone) return { label, state: 'done' as const, meta: 'done' };
            if (si === stepsDone) {
              const running = isFail && si === s.failAt ? 'failed' : 'running';
              return { label, state: running as 'failed' | 'running' };
            }
            return { label, state: 'queued' as const };
          });
          return {
            id: s.id,
            title: s.title,
            agent: s.agent,
            icon: s.icon,
            state: isFail ? 'failed' : 'running',
            progress: stepsDone / s.steps.length,
            time: isFail ? undefined : s.time,
            steps,
          };
        });

  const retry = () => {
    // the live demo recovers on its own timer; this keeps the button working
    setFailed(false);
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <RunQueue
        title="Launch prep"
        jobs={jobs}
        summary="12.8s in all · 1 retry"
        onRetry={retry}
      />
    </div>
  );
}
