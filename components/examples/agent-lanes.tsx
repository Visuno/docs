'use client';
import { useEffect, useRef, useState } from 'react';
import { AgentLanes, type AgentLane, type AgentHandoff } from '@visuno/agent-lanes/AgentLanes';

/**
 * Live example for the Agent lanes docs page, in the shape of the component's own
 * demo upstream: three agents — a Researcher, a Designer and a Reviewer — work in
 * turn, each filling its three steps, then handing the work to the next down the
 * relay line. It loops, and respects prefers-reduced-motion by jumping to the
 * finished state. Uses the real Visuno component.
 */

interface Spec {
  key: string;
  name: string;
  icon: AgentLane['icon'];
  tone: AgentLane['tone'];
  wait: string;
  acts: string[];
  log: string[];
}

const SPECS: Spec[] = [
  {
    key: 'researcher',
    name: 'Researcher',
    icon: 'search',
    tone: 'blue',
    wait: 'Queued',
    acts: ['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'],
    log: ['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'],
  },
  {
    key: 'designer',
    name: 'Designer',
    icon: 'edit',
    tone: 'purple',
    wait: 'Waiting for the brief',
    acts: ['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'],
    log: ['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'],
  },
  {
    key: 'reviewer',
    name: 'Reviewer',
    icon: 'eye',
    tone: 'green',
    wait: 'Waiting for the designer',
    acts: ['Checking contrast', 'Checking copy', 'Signing off'],
    log: ['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'],
  },
];

const HANDOFFS = ['the brief', '4 frames'];

type LaneState = { status: AgentLane['status']; activity: string; done: number; progress?: number; logN: number };

const initial = (): LaneState[] =>
  SPECS.map((s, i) => ({ status: i === 0 ? 'working' : 'queued', activity: i === 0 ? s.acts[0] : s.wait, done: 0, logN: 0 }));

export function AgentLanesExample() {
  const [states, setStates] = useState<LaneState[]>(initial);
  const [handoff, setHandoff] = useState<AgentHandoff>();
  const [paused, setPaused] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stop = false;
    const after = (ms: number) => new Promise<void>((res) => timers.current.push(setTimeout(res, ms)));

    const set = (i: number, patch: Partial<LaneState>) =>
      setStates((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));

    async function work(i: number) {
      const spec = SPECS[i];
      set(i, { status: 'working', activity: spec.acts[0], done: 0 });
      for (let step = 0; step < 3; step++) {
        if (stop) return;
        set(i, { activity: spec.acts[step], done: step });
        await after(reduce ? 0 : 1500);
        set(i, { done: step + 1, logN: step + 1 });
      }
      set(i, { status: 'done', activity: spec.log[2] });
    }

    async function run() {
      // reset
      setStates(initial());
      setHandoff(undefined);
      await after(reduce ? 0 : 600);
      if (stop) return;
      if (reduce) {
        setStates(SPECS.map((s) => ({ status: 'done', activity: s.log[2], done: 3, logN: 3 })));
        return;
      }
      set(1, { status: 'waiting', activity: SPECS[1].wait });
      await work(0);
      for (let i = 0; i < 2; i++) {
        if (stop) return;
        setHandoff({ from: SPECS[i].key, to: SPECS[i + 1].key, what: HANDOFFS[i] });
        await after(1600);
        setHandoff(undefined);
        if (i + 2 < 3) set(i + 2, { status: 'waiting', activity: SPECS[i + 2].wait });
        await work(i + 1);
      }
      await after(2600);
      if (!stop) run();
    }

    run();
    return () => {
      stop = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const lanes: AgentLane[] = SPECS.map((s, i) => ({
    key: s.key,
    name: s.name,
    icon: s.icon,
    tone: s.tone,
    status: states[i].status,
    activity: states[i].activity,
    done: states[i].done,
    progress: states[i].progress,
    log: s.log.slice(0, states[i].logN).map((text) => ({ text })),
  }));

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <AgentLanes
        lanes={lanes}
        handoff={handoff}
        paused={paused}
        onPausedChange={setPaused}
        defaultExpanded={['researcher']}
      />
    </div>
  );
}
