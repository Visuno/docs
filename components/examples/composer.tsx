'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Composer, type ComposerAttachment } from '@visuno/composer/Composer';

/**
 * Live example for the Composer docs page, in the shape of the component's own demo
 * upstream: it runs its own story — attach a Figma frame that can't be opened, Try
 * again to load it, type the ask, switch the mode to Edit and send, which turns the
 * message into a bubble above the box — then loops. Respects reduced motion by
 * settling on a ready, typed-in state without the play. Uses the real Visuno
 * component in controlled mode.
 */
const CONTEXTS = [
  { value: 'pricing', label: 'Pricing v4', detail: 'Figma, 6 frames', icon: 'figma' as const },
  { value: 'checkout', label: 'Checkout flow', detail: 'Figma, 4 frames', icon: 'figma' as const },
  { value: 'marketing', label: 'Marketing site', detail: 'Code, main branch', icon: 'term' as const },
];
const FRAME = 'Pricing / Desktop';
const ASK = 'Tighten the spacing on the plan cards';

export function ComposerExample() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ComposerAttachment[]>([]);
  const [mode, setMode] = useState('ask');
  const [thread, setThread] = useState<ReactNode>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
    const at = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setThread(null);
      setFiles([{ key: 'f', label: FRAME, icon: 'figma', status: 'ready' }]);
      setText(ASK);
      setMode('edit');
      return clear;
    }

    const play = () => {
      setThread(null);
      setText('');
      setMode('ask');
      // attach a frame that fails to open
      setFiles([{ key: 'f', label: FRAME, icon: 'figma', status: 'loading' }]);
      at(1000, () => setFiles([{ key: 'f', label: `${FRAME} can't be opened`, icon: 'figma', status: 'error' }]));
      // Try again: it loads, then lands ready
      at(2200, () => setFiles([{ key: 'f', label: FRAME, icon: 'figma', status: 'loading' }]));
      at(3200, () => setFiles([{ key: 'f', label: FRAME, icon: 'figma', status: 'ready' }]));
      // type the ask, a few characters at a time
      ASK.split('').forEach((_, i) => at(3800 + i * 55, () => setText(ASK.slice(0, i + 1))));
      const typed = 3800 + ASK.length * 55;
      // switch the mode to Edit, then send
      at(typed + 500, () => setMode('edit'));
      at(typed + 1400, () => {
        setThread(
          <div className="vo-cpx-ag" style={{ justifyContent: 'flex-end' }}>
            <span className="vo-fchip">{ASK}</span>
          </div>
        );
        setText('');
        setFiles([]);
      });
      at(typed + 4200, play);
    };
    play();
    return clear;
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Composer
        value={text}
        onValueChange={setText}
        attachments={files}
        onAttachmentsChange={setFiles}
        onRetry={() => setFiles([{ key: 'f', label: FRAME, icon: 'figma', status: 'loading' }])}
        contexts={CONTEXTS}
        defaultContext="pricing"
        onContextChange={() => {}}
        mode={mode}
        onModeChange={setMode}
        thread={thread}
        onDictate={() => {}}
        onSubmit={() => {}}
      />
    </div>
  );
}
