'use client';
import { useEffect, useRef, useState } from 'react';
import { RunCost, type RunCostStatus } from '@visuno/run-cost/RunCost';

/**
 * Live example for the Run cost docs page, in the shape of the component's own
 * upstream demo: the spend climbs from zero and the bar fills, the tokens
 * and tool calls behind it count up, and the run pauses when it reaches the 90%
 * cap, turning the status amber and the button into "Raise cap". The toggle and
 * the button are wired, so you can raise the cap and watch it run to the budget.
 *
 * The spend is driven by a requestAnimationFrame ramp (a smooth per-frame climb).
 * The bar fill has NO CSS width transition, so it tracks the per-frame value
 * exactly and glides with the number instead of lagging behind a transition that
 * keeps restarting. Respects prefers-reduced-motion (it shows a paused run at once).
 */
const BUDGET = 2000;
const CAP_AT = 90;
const RATE = 150; // credits per second

export function RunCostExample() {
  const [run, setRun] = useState({ used: 0, inT: 0, outT: 0, tools: 0 });
  const [status, setStatus] = useState<RunCostStatus>('idle');
  const [capOn, setCapOn] = useState(true);

  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const capOnRef = useRef(capOn);
  capOnRef.current = capOn;

  const stop = () => {
    if (raf.current != null) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const start = () => {
    stop();
    setStatus('running');
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000); // clamp long frames
      last.current = now;
      setRun((r) => {
        const cap = capOnRef.current ? (BUDGET * CAP_AT) / 100 : BUDGET;
        const next = Math.min(BUDGET, r.used + RATE * dt);
        if (next >= cap) {
          stop();
          setStatus(cap < BUDGET ? 'paused' : 'spent');
          return {
            used: cap,
            inT: Math.round(cap * 16),
            outT: Math.round(cap * 4),
            tools: Math.floor(cap / 150),
          };
        }
        return {
          used: next,
          // tokens and tool calls scale with the spend, so they climb in step
          inT: r.inT + RATE * dt * 16,
          outT: r.outT + RATE * dt * 4,
          tools: Math.floor(next / 150),
        };
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRun({ used: (BUDGET * CAP_AT) / 100, inT: 14200, outT: 3600, tools: 7 });
      setStatus('paused');
      return;
    }
    const t = setTimeout(start, 900);
    return () => {
      clearTimeout(t);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAction = () => {
    if (status === 'running') {
      stop();
      setStatus('stopped');
      return;
    }
    if (status === 'spent' || run.used >= BUDGET) {
      setRun({ used: 0, inT: 0, outT: 0, tools: 0 });
    }
    if (status === 'paused') setCapOn(false);
    start();
  };

  return (
    // The component's own CSS now transitions the bar fill width, so it glides
    // with the rAF ramp without a docs-only override.
    <div style={{ width: '100%', maxWidth: 360 }}>
      <RunCost
        used={run.used}
        budget={BUDGET}
        capAt={CAP_AT}
        capOn={capOn}
        onCapChange={setCapOn}
        status={status}
        rows={[
          { label: 'Input tokens', value: run.inT },
          { label: 'Output tokens', value: run.outT },
          { label: 'Tool calls', value: run.tools },
        ]}
        onAction={onAction}
        bare={false}
      />
    </div>
  );
}
