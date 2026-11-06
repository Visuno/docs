'use client';
import { useEffect, useRef, useState } from 'react';
import { ErrorRecovery, type RecoveryStep } from '@visuno/error-recovery/ErrorRecovery';

/**
 * Live example for the Error recovery docs page, in the shape of the component's
 * own demo upstream: a run stops at step 2 with a 403, you pick how the agent
 * carries on — retry, skip or hand it to a person — and press Continue, and the
 * steps play out that path. This example drives it by itself so the page shows
 * the recovery without a click; it respects prefers-reduced-motion by jumping
 * straight to the recovered end state. Uses the real Visuno component.
 */

const OPTIONS = [
  { value: 'retry', label: 'Ask for edit access, then retry' },
  { value: 'skip', label: 'Skip it and post the summary' },
  { value: 'hand', label: 'Hand it over to Maya' },
];

// the three steps at rest: step 2 has failed, step 3 waits
const STOPPED: RecoveryStep[] = [
  { label: 'Pull 1,240 deals from the CRM', state: 'done', note: 'Done in 8s' },
  { label: 'Write to the Pipeline 2026 sheet', state: 'fail', note: 'Error 403: the agent lost edit access to this sheet' },
  { label: 'Post the summary in #sales', state: 'wait' },
];

// the retry path, played step by step after Continue
const RETRY: { steps: RecoveryStep[]; status: string; wait: number }[] = [
  { status: 'Recovering', wait: 1200, steps: [STOPPED[0], { label: STOPPED[1].label, state: 'run', note: 'Asking for edit access' }, STOPPED[2]] },
  { status: 'Recovering', wait: 1000, steps: [STOPPED[0], { label: STOPPED[1].label, state: 'run', note: 'Access granted, retrying' }, STOPPED[2]] },
  { status: 'Recovering', wait: 1000, steps: [STOPPED[0], { label: STOPPED[1].label, state: 'done', note: 'Wrote 1,240 rows' }, { label: STOPPED[2].label, state: 'run' }] },
  { status: 'Recovered', wait: 0, steps: [STOPPED[0], { label: STOPPED[1].label, state: 'done', note: 'Wrote 1,240 rows' }, { label: STOPPED[2].label, state: 'done', note: 'Posted to 14 people' }] },
];

const RECOVERED = RETRY[RETRY.length - 1];

export function ErrorRecoveryExample() {
  const [steps, setSteps] = useState<RecoveryStep[]>(STOPPED);
  const [status, setStatus] = useState('Stopped at step 2');
  const [open, setOpen] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function reset() {
    setSteps(STOPPED);
    setStatus('Stopped at step 2');
    setOpen(true);
  }

  function clear() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }

  // play the retry recovery, then rest for a beat and start over
  function play() {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setOpen(false);
      setSteps(RECOVERED.steps);
      setStatus(RECOVERED.status);
      return;
    }
    setOpen(false);
    let at = 0;
    const step = () => {
      const frame = RETRY[at];
      setSteps(frame.steps);
      setStatus(frame.status);
      if (at < RETRY.length - 1) {
        timers.current.push(setTimeout(() => { at += 1; step(); }, frame.wait));
      } else {
        // rest on the recovered state, then loop
        timers.current.push(setTimeout(() => { reset(); timers.current.push(setTimeout(play, 1400)); }, 2600));
      }
    };
    step();
  }

  useEffect(() => {
    timers.current.push(setTimeout(play, 1400));
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <ErrorRecovery
        title="Sync the pipeline to Sheets"
        status={status}
        steps={steps}
        options={OPTIONS}
        defaultValue="retry"
        open={open}
        onContinue={() => { clear(); play(); }}
      />
    </div>
  );
}
