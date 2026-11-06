'use client';
import { useEffect, useReducer, useRef, useState } from 'react';
import { AgentPhases, type AgentPhase } from '@visuno/agent-phases/AgentPhases';

/**
 * Live example for the Agent phases docs page.
 *
 * One line stepping from thinking to done. It mirrors the reference run: the
 * search times out and offers Retry, reading is slow and offers Stop, and the
 * waiting phase stops the clock to ask for approval. Once done, the line reads
 * how long it took and opens to the list of phases.
 *
 * Respects prefers-reduced-motion: when motion is reduced it rests on the
 * finished, opened state instead of advancing on timers.
 */

interface Model {
  phase: AgentPhase;
  error: boolean;
  slow: boolean;
  took: Partial<Record<AgentPhase, number>>;
}

const START: Model = { phase: 'thinking', error: false, slow: false, took: {} };
const FINAL: Model = {
  phase: 'done',
  error: false,
  slow: false,
  took: { thinking: 2, searching: 3, reading: 4, waiting: 1, writing: 2 },
};

export function AgentPhasesExample() {
  const [model, setModel] = useState<Model>(START);
  const [tick, replay] = useReducer((n: number) => n + 1, 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setModel(FINAL);
      return;
    }
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };
    setModel(START);
    // thinking -> searching, which times out (waits for Retry)
    later(() => setModel({ phase: 'searching', error: false, slow: false, took: { thinking: 2 } }), 1600);
    later(() => setModel((m) => ({ ...m, error: true })), 2900);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [tick]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const after = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  // Retry clears the error and lets reading run, which turns slow
  const onRetry = () => {
    clearTimers();
    setModel({ phase: 'searching', error: false, slow: false, took: { thinking: 2 } });
    after(() => setModel({ phase: 'reading', error: false, slow: false, took: { thinking: 2, searching: 3 } }), 900);
    after(() => setModel((m) => ({ ...m, slow: true })), 2500);
  };

  // Stop or the natural wait moves on to asking for approval
  const toWaiting = () => {
    clearTimers();
    setModel({ phase: 'waiting', error: false, slow: false, took: { thinking: 2, searching: 3, reading: 4 } });
  };

  const onApprove = () => {
    clearTimers();
    setModel({ phase: 'writing', error: false, slow: false, took: { thinking: 2, searching: 3, reading: 4, waiting: 1 } });
    after(() => setModel(FINAL), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <AgentPhases
        phase={model.phase}
        took={model.took}
        defaultOpen
        error={
          model.error
            ? {
                text: 'The search timed out',
                detail: "The help centre didn't answer in 10s",
                onRetry,
              }
            : undefined
        }
        slow={
          model.slow && model.phase === 'reading'
            ? { text: 'Still working, the refund policy is a long page', onStop: toWaiting }
            : undefined
        }
        ask={
          model.phase === 'waiting'
            ? { text: 'Offer Maya a refund of $48?', onApprove, onDecline: onApprove }
            : undefined
        }
      />
      {model.phase === 'done' && (
        <button type="button" className="dm-pill dm-ghost dm-sm" onClick={replay}>
          Replay
        </button>
      )}
    </div>
  );
}
