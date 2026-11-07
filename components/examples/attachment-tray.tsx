'use client';
import { useEffect, useRef, useState } from 'react';
import { AttachmentTray, type Attachment } from '@visuno/attachment-tray/AttachmentTray';

/**
 * Live example for the Attachment tray docs page, in the shape of the component's own
 * demo upstream: three sample files are dropped in and each one uploads in its file
 * type's colour, then the agent reads it and says what it found. "Add sample files"
 * restarts it. Respects prefers-reduced-motion by snapping the files straight to read.
 * Uses the real Visuno component.
 */
const SAMPLES: { name: string; size: number; detail: string }[] = [
  { name: 'brief.pdf', size: 2.4e6, detail: '12 pages' },
  { name: 'Pricing.fig', size: 8.1e6, detail: '6 frames' },
  { name: 'signups.csv', size: 3.2e5, detail: '1,204 rows' },
];

export function AttachmentTrayExample() {
  const [files, setFiles] = useState<Attachment[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = () => {
    clear();
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start: Attachment[] = SAMPLES.map((s) => ({
      id: s.name,
      name: s.name,
      size: s.size,
      progress: reduce ? 100 : 0,
      reading: false,
      detail: reduce ? s.detail : undefined,
    }));
    setFiles(start);
    if (reduce) return;

    const patch = (id: string, next: Partial<Attachment>) =>
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...next } : f)));

    SAMPLES.forEach((s, i) => {
      const base = i * 160;
      // the upload: the ring closes and the row fills over a second or so
      for (let step = 1; step <= 20; step++) {
        timers.current.push(
          setTimeout(() => patch(s.name, { progress: step * 5 }), base + step * 55),
        );
      }
      // then the agent reads it, and says what it found
      const done = base + 20 * 55;
      timers.current.push(setTimeout(() => patch(s.name, { progress: 100, reading: true }), done));
      timers.current.push(
        setTimeout(() => patch(s.name, { progress: 100, reading: false, detail: s.detail }), done + 900),
      );
    });
  };

  useEffect(() => {
    const t = setTimeout(run, 500);
    return () => {
      clearTimeout(t);
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <AttachmentTray
        files={files}
        title="Drop files here"
        action={{ label: 'add sample files', onClick: run }}
        onRemove={(id) => setFiles((prev) => prev.filter((f) => f.id !== id))}
        onFiles={(picked) =>
          setFiles((prev) => [
            ...prev,
            ...picked.map((file) => ({
              id: file.name + file.size,
              name: file.name,
              size: file.size,
              progress: 100,
              detail: 'ready',
            })),
          ])
        }
      />
    </div>
  );
}
