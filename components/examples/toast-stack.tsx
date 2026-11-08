'use client';
import { useEffect, useRef, useState } from 'react';
import { ToastStack, type StackToast } from '@visuno/toast-stack/ToastStack';

/**
 * Live example for the Toast stack docs page, in the shape of the component's own
 * demo upstream: notifications arrive on their own and stack into a deck; hover
 * (or focus) the deck to fan it out, and dismiss any toast with its close button.
 * A "Send notification" button adds one by hand. Uses the real Visuno component.
 */
const POOL: Omit<StackToast, 'id' | 'time'>[] = [
  { icon: 'circle-check', tone: 'ok', title: 'Tests passed', detail: '42 of 42 in 38s' },
  { icon: 'git-pull-request', tone: 'merge', title: 'PR #412 is ready', detail: 'Use shared spacing tokens' },
  { icon: 'brand-figma', tone: 'purple', title: 'Frames synced', detail: '6 frames from Pricing.fig' },
  { icon: 'alert-triangle', tone: 'warn', title: 'Budget at 80%', detail: '1,600 of 2,000 credits' },
  { icon: 'sparkles', tone: 'blue', title: 'Draft written', detail: 'Launch email, 2 subject lines' },
];

export function ToastStackExample() {
  const [toasts, setToasts] = useState<StackToast[]>([]);
  const next = useRef(0);

  const add = () => {
    const p = POOL[next.current % POOL.length];
    const id = next.current++;
    setToasts((prev) => {
      const aged = prev.map((t, i) => ({ ...t, time: `${(prev.length - i) * 2}m` }));
      return [...aged, { ...p, id, time: 'now' }].slice(-6);
    });
  };

  const dismiss = (id: StackToast['id']) => setToasts((prev) => prev.filter((t) => t.id !== id));

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    // seed a few, then trickle in more; reduced motion gets a static starting deck
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(add, 300));
    timers.push(setTimeout(add, 900));
    timers.push(setTimeout(add, 1500));
    if (reduce) return () => timers.forEach(clearTimeout);
    const iv = setInterval(add, 3800);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(iv);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="vo-pill vo-soft vo-sm" onClick={add}>
          Send notification
        </button>
      </div>
    </div>
  );
}
