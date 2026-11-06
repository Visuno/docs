'use client';
import { useEffect, useReducer, useRef, useState } from 'react';
import { AgentTree, type AgentNode } from '@visuno/agent-tree/AgentTree';

/**
 * Live example for the Agent tree docs page, in the shape of the component's own
 * demo upstream.
 *
 * A run redesigning a pricing page: an orchestrator hands work to a research,
 * design and copy agent. The design agent works through its steps, one fails on
 * a token the library doesn't have, and the fix it offers waits for you; taking
 * it lets the run finish. A branch's cost is its own plus everything under it,
 * and the finished research branch starts folded.
 *
 * Respects prefers-reduced-motion: when motion is reduced it rests on the
 * finished state instead of advancing on timers.
 */

type Phase = 'start' | 'mid' | 'failed' | 'fixing' | 'copy' | 'done';

const S = (
  id: string,
  name: string,
  task: string,
  status: AgentNode['status'],
  cost: number,
  children?: AgentNode[],
  fix?: AgentNode['fix'],
): AgentNode => ({ id, name, task, status, cost, children, fix });

function treeFor(phase: Phase, onFix: () => void): AgentNode {
  const research = S('res', 'Research agent', 'Compare 3 competitor pricing pages', 'done', 0.02, [
    S('res1', 'Read the 3 pricing pages', '3 pages, 9.4k words', 'done', 0.06),
    S('res2', 'Summarise their plans', 'Notes added to Pricing v4', 'done', 0.04),
  ]);

  const d1 = (status: AgentNode['status']) =>
    S('des1', 'Update the Pro card', 'Pricing v4, frame 2', status, 0.03);
  const d2 = (status: AgentNode['status']) =>
    S('des2', 'Update the Team card', 'Pricing v4, frame 3', status, status === 'queued' ? 0 : 0.03);

  let des3: AgentNode;
  let designStatus: AgentNode['status'];
  switch (phase) {
    case 'start':
      des3 = S('des3', 'Apply library tokens', 'Colour and spacing', 'queued', 0);
      designStatus = 'running';
      break;
    case 'mid':
      des3 = S('des3', 'Apply library tokens', 'Colour and spacing', 'running', 0.02);
      designStatus = 'running';
      break;
    case 'failed':
      des3 = S('des3', 'Apply library tokens', "color.accent.600 isn't in the library", 'failed', 0.02, undefined, {
        label: 'Use color.accent.500',
        onClick: onFix,
      });
      designStatus = 'running';
      break;
    case 'fixing':
      des3 = S('des3', 'Apply library tokens', 'Using color.accent.500', 'running', 0.03);
      designStatus = 'running';
      break;
    default:
      des3 = S('des3', 'Apply library tokens', 'Colour and spacing, from the library', 'done', 0.04);
      designStatus = 'done';
  }

  const design = S('des', 'Design agent', 'Rework the plan cards in Figma', designStatus, 0.02, [
    d1('done'),
    d2(phase === 'start' ? 'running' : 'done'),
    des3,
  ]);

  const copyStatus: AgentNode['status'] = phase === 'done' ? 'done' : phase === 'copy' ? 'running' : 'queued';
  const copy = S('cop', 'Copy agent', 'Rewrite the plan descriptions', copyStatus, copyStatus === 'queued' ? 0 : 0.03);

  const rootStatus: AgentNode['status'] = phase === 'done' ? 'done' : 'running';
  return S('root', 'Orchestrator', 'Plans the work and hands it out', rootStatus, 0.04, [research, design, copy]);
}

export function AgentTreeExample() {
  const [phase, setPhase] = useState<Phase>('start');
  const [tick, replay] = useReducer((n: number) => n + 1, 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setPhase('done');
      return;
    }
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };
    setPhase('start');
    later(() => setPhase('mid'), 2000);
    later(() => setPhase('failed'), 4500); // waits here for the fix
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [tick]);

  const onFix = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('fixing');
    const a = setTimeout(() => setPhase('copy'), 2000);
    const b = setTimeout(() => setPhase('done'), 5000);
    timers.current.push(a, b);
  };

  const done = phase === 'done';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <AgentTree
        root={treeFor(phase, onFix)}
        title="Redesign the pricing page"
        defaultCollapsed={['res']}
        seconds={done ? 14 : undefined}
        summary={done ? undefined : false}
      />
      {done && (
        <button type="button" className="dm-pill dm-ghost dm-sm" onClick={replay}>
          Replay
        </button>
      )}
    </div>
  );
}
