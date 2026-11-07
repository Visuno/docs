'use client';
import { useEffect, useRef, useState } from 'react';
import { DesignTuner } from '@visuno/design-tuner/DesignTuner';

/**
 * Live example for the Design tuner docs page, in the shape of the component's own demo
 * on the upstream site: the sample pricing card shows beside its sliders and, a beat after
 * it mounts, the agent tunes it once on its own — walking each value to a target, turning
 * that row's value accent, then dropping a note on what it changed. Reaching for a slider
 * or the button first cancels the self-run. Respects prefers-reduced-motion by skipping the
 * walk and snapping to the tuned values. Uses the real Visuno component.
 */

const TUNED: Record<string, number> = { rad: 20, pad: 24, gap: 14, sh: 0.05 };
const START: Record<string, number> = { rad: 16, pad: 18, gap: 12, sh: 0.08 };

export function DesignTunerExample() {
  const [values, setValues] = useState<Record<string, number>>(START);
  const [status, setStatus] = useState('Edited by you');
  const [active, setActive] = useState<string | undefined>();
  const [tuning, setTuning] = useState(false);
  const [note, setNote] = useState<string | undefined>();
  const [label, setLabel] = useState('Tune with agent');
  const touched = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const wait = (ms: number) => new Promise<void>((r) => { const t = setTimeout(r, ms); timers.current.push(t); });

  const reduce = () =>
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const run = async () => {
    if (tuning) return;
    touched.current = true;
    setTuning(true);
    setStatus('Agent is tuning');
    setNote(undefined);
    const keys = Object.keys(TUNED);
    if (reduce()) {
      setValues(TUNED);
    } else {
      for (const k of keys) {
        setActive(k);
        const from = START[k];
        const to = TUNED[k];
        for (let i = 1; i <= 12; i++) {
          const e = 1 - Math.pow(1 - i / 12, 3);
          setValues((v) => ({ ...v, [k]: from + (to - from) * e }));
          await wait(52);
        }
        await wait(120);
        setActive(undefined);
      }
    }
    setNote('Matched the 4px grid and your card tokens. Softer shadow so the CTA leads.');
    setTuning(false);
    setStatus('Tuned by agent');
    setLabel('Tune again');
  };

  useEffect(() => {
    const t = setTimeout(() => { if (!touched.current) run(); }, reduce() ? 0 : 1600);
    timers.current.push(t);
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHand = (v: Record<string, number>) => {
    touched.current = true;
    setValues(v);
    setStatus('Edited by you');
  };

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <DesignTuner
        values={values}
        onValuesChange={onHand}
        status={status}
        active={active}
        tuning={tuning}
        note={note}
        actionLabel={label}
        onTune={run}
      />
    </div>
  );
}
