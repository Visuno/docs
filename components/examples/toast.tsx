'use client';
import { useState } from 'react';
import { Toast, type ToastData } from '@visuno/toast/Toast';

/**
 * Live example for the Toast docs page, in the shape of the component's own demo on
 * upstream demo: a row of buttons that each set a different toast into state, so one
 * toast shows at a time and a new id slides the next one in while the last slips
 * away. Uses the real Visuno component.
 */
const TOASTS: ToastData[] = [
  { id: 1, tone: 'success', title: 'Deploy succeeded', description: 'Live in production.' },
  {
    id: 2,
    tone: 'error',
    title: 'Build failed',
    description: 'Two tests did not pass.',
    action: { label: 'Retry', onClick: () => {}, variant: 'primary' },
  },
  { id: 3, tone: 'info', title: 'New version available', description: 'Reload to update.' },
  { id: 4, tone: 'loading', title: 'Uploading assets', description: '12 of 40 files.' },
];

export function ToastExample() {
  const [current, setCurrent] = useState<ToastData | null>(TOASTS[0]);

  // Each click spawns a fresh toast object so the same one can be shown again
  // right after it was dismissed (a new identity re-triggers the slide-in).
  const spawn = (t: ToastData) => setCurrent({ ...t });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
        {TOASTS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="vo-pill vo-soft vo-sm"
            onClick={() => spawn(t)}
          >
            {t.tone === 'success' ? 'Success' : t.tone === 'error' ? 'Error' : t.tone === 'info' ? 'Info' : 'Loading'}
          </button>
        ))}
      </div>
      <Toast toast={current} onDismiss={() => setCurrent(null)} />
    </div>
  );
}
