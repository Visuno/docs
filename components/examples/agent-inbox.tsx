'use client';
import { useEffect, useRef, useState } from 'react';
import { AgentInbox, type InboxRun } from '@visuno/agent-inbox/AgentInbox';

/**
 * Live example for the Agent inbox docs page, in the shape of the component's own
 * demo upstream: every run in one list, grouped as Needs you, Running and Done. It
 * runs its own story — the compare run finishes on its own, then Approve and Retry
 * start their runs, each landing in Done — and loops. Respects reduced motion by
 * showing the finished state at once. Uses the real Visuno component.
 */
const START: InboxRun[] = [
  { id: 'pub', title: 'Publish the pricing page', agent: 'Design agent', color: 'var(--dm-av-l)', group: 'needs', detail: 'Waiting for your approval' },
  { id: 'tok', title: 'Export tokens to CSS', agent: 'Build agent', color: 'var(--dm-av-m)', group: 'needs', failed: true, detail: 'Failed: rate limited by Figma', why: 'Figma answered 429 at 10:42. Safe to retry' },
  { id: 'cards', title: 'Rework the plan cards', agent: 'Design agent', color: 'var(--dm-av-l)', group: 'running', detail: 'Editing frame 3 of 6', seconds: 102 },
  { id: 'cmp', title: 'Compare 3 competitor pages', agent: 'Research agent', color: 'var(--dm-av-t)', group: 'running', detail: 'Reading page 3 of 3', seconds: 38 },
  { id: 'copy', title: 'Rewrite plan descriptions', agent: 'Copy agent', color: 'var(--dm-av-p)', group: 'done', ended: '12m ago' },
  { id: 'aud', title: 'Audit pricing contrast', agent: 'QA agent', color: 'var(--dm-av-b)', group: 'done', ended: '25m ago' },
];

export function AgentInboxExample() {
  const [runs, setRuns] = useState<InboxRun[]>(START);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const patch = (id: string, next: Partial<InboxRun>) =>
    setRuns((rs) => rs.map((r) => (r.id === id ? { ...r, ...next } : r)));

  const run = (id: string, detail: string, delay: number) => {
    patch(id, { group: 'running', failed: false, seconds: 0, detail });
    timers.current.push(setTimeout(() => patch(id, { group: 'done', ended: 'Just now' }), delay));
  };

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setRuns((rs) => rs.map((r) => (r.group === 'running' ? { ...r, group: 'done', ended: 'Just now' } : r)));
      return;
    }
    const play = () => {
      setRuns(START);
      const t = timers.current;
      // the research run finishes on its own while you look
      t.push(setTimeout(() => patch('cmp', { group: 'done', ended: 'Just now' }), 2600));
      // approve the publish, then retry the failed export; each runs, then lands in Done
      t.push(setTimeout(() => run('pub', 'Publishing to designme.studio/pricing', 4000), 4200));
      t.push(setTimeout(() => run('tok', 'Retrying the export', 5000), 7200));
      // loop
      t.push(setTimeout(play, 16000));
    };
    play();
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <AgentInbox
        runs={runs}
        onApprove={(id) => run(id, 'Publishing to designme.studio/pricing', 4000)}
        onRetry={(id) => run(id, 'Retrying the export', 5000)}
      />
    </div>
  );
}
