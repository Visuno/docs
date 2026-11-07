'use client';
import { useEffect, useRef, useState } from 'react';
import { PermissionGate, type PermissionScope } from '@visuno/permission-gate/PermissionGate';

/**
 * Live example for the Permission gate docs page, in the shape of the component's
 * own demo on the upstream site: the agent asks to edit Figma, you hold back the
 * risky "Publish library" scope and allow the rest, and once allowed the gate
 * shows the agent working under the grant. It loops, and pauses for reduced
 * motion. Uses the real Visuno component.
 */
const SCOPES: PermissionScope[] = [
  { key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' },
  { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' },
  {
    key: 'publish',
    label: 'Publish library',
    detail: 'Affects 4 other files',
    risk: 'Risky',
    riskDetail: 'Checkout, Marketing site, Email kit and Docs use this library',
  },
];

type Phase = 'asking' | 'working' | 'done';

export function PermissionGateExample() {
  const [phase, setPhase] = useState<Phase>('asking');
  const [ticked, setTicked] = useState<string[]>(['read', 'edit']);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const after = (ms: number, fn: () => void) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    const loop = () => {
      setPhase('asking');
      setTicked(['read', 'edit']);
      after(2600, () => setPhase('working'));
      after(5200, () => setPhase('done'));
      after(8200, loop);
    };
    loop();

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <PermissionGate
        bare={false}
        title="Allow the agent to edit Figma?"
        subtitle="It needs this to apply the pricing fixes"
        scopes={SCOPES}
        value={ticked}
        onValueChange={setTicked}
        status={phase === 'asking' ? 'asking' : 'allowed'}
        working={phase === 'working'}
        allowedTitle={
          phase === 'done' ? 'Done. 6 frames edited' : undefined
        }
        allowedDetail={
          phase === 'done'
            ? 'On a new page. Plan toggle published'
            : 'Editing Plan cards · 2 of 6'
        }
        meta={phase === 'working' ? '0:03' : phase === 'done' ? '0:06' : undefined}
      />
    </div>
  );
}
