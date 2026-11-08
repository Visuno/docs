'use client';
import { useEffect, useRef, useState } from 'react';
import { TaskTable, type Task, type TaskAction } from '@visuno/task-table/TaskTable';

/**
 * Live example for the Task table docs page, in the shape of the component's own
 * demo upstream: a small set of agent tasks you can sort and select. On its own
 * it waits a beat, picks two tasks and retries them — unless you start clicking
 * first — so the header's crossfade to the bulk actions shows itself. Uses the
 * real Visuno component; honours prefers-reduced-motion by not self-driving.
 */
const SEED: Task[] = [
  { id: '1', name: 'Audit pricing contrast', status: 'running', agent: { name: 'Design', initials: 'DS', color: 'var(--vo-av-b)' }, cost: 0.42, updated: 2 },
  { id: '2', name: 'Export tokens to CSS', status: 'done', agent: { name: 'Code', initials: 'CO', color: 'var(--vo-av-m)' }, cost: 0.18, updated: 14 },
  { id: '3', name: 'Sync Figma frames', status: 'failed', agent: { name: 'Design', initials: 'DS', color: 'var(--vo-av-b)' }, cost: 0.07, updated: 26 },
  { id: '4', name: 'Draft launch email', status: 'queued', agent: { name: 'Writer', initials: 'WR', color: 'var(--vo-av-l)' }, cost: 0, updated: 31 },
  { id: '5', name: 'Compare checkout flows', status: 'done', agent: { name: 'Research', initials: 'RE', color: 'var(--vo-av-t)' }, cost: 0.66, updated: 48 },
  { id: '6', name: 'Rename layers in Hero', status: 'running', agent: { name: 'Design', initials: 'DS', color: 'var(--vo-av-b)' }, cost: 0.11, updated: 5 },
];

export function TaskTableExample() {
  const [tasks, setTasks] = useState<Task[]>(SEED);
  const [selected, setSelected] = useState<string[]>([]);
  // once the viewer touches the table, the demo stops driving it
  const touched = useRef(false);

  const onAction = (action: TaskAction, ids: string[]) => {
    if (action === 'cancel') {
      setTasks((ts) => ts.filter((t) => !ids.includes(t.id)));
      return;
    }
    setTasks((ts) =>
      ts.map((t) => {
        if (!ids.includes(t.id)) return t;
        if (action === 'pause' && (t.status === 'running' || t.status === 'queued')) return { ...t, status: 'paused' };
        if (action === 'retry' && (t.status === 'failed' || t.status === 'paused')) return { ...t, status: 'running', updated: 0 };
        return t;
      }),
    );
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pick = setTimeout(() => {
      if (touched.current) return;
      setSelected(['3', '6']);
      const retry = setTimeout(() => {
        if (touched.current) return;
        onAction('retry', ['3', '6']);
        setSelected([]);
      }, 1900);
      timers.push(retry);
    }, 1600);
    const timers: ReturnType<typeof setTimeout>[] = [pick];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskTable
        tasks={tasks}
        selected={selected}
        onSelectedChange={(ids) => {
          touched.current = true;
          setSelected(ids);
        }}
        onAction={onAction}
        emptyAction={{ label: 'Bring them back', onClick: () => setTasks(SEED) }}
      />
    </div>
  );
}
