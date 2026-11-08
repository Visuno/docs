'use client';
import { useEffect, useRef, useState } from 'react';
import { DraftReview, type DraftPhase } from '@visuno/draft-review/DraftReview';

/**
 * Live example for the Draft review docs page, in the shape of the component's own
 * demo upstream: it plays the whole story on a loop — send, get stopped by the
 * missing attachment, attach it, send for real, and let the undo window run down —
 * then starts over. Uses the real Visuno component. Respects prefers-reduced-motion
 * by holding on the draft instead of animating through the beats.
 */
const BODY =
  "Hi Maya,\n\nHere's what changed on the pricing page: one button per plan, the yearly price first, and the FAQ under the comparison table. The full list is in the attached summary.\n\nReady for your sign-off when you are.";

export function DraftReviewExample() {
  const [phase, setPhase] = useState<DraftPhase>('draft');
  const [warn, setWarn] = useState(false);
  const [attached, setAttached] = useState(false);
  const [undoLeft, setUndoLeft] = useState(5);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setWarn(true);
      return;
    }
    let alive = true;
    const wait = (ms: number) => new Promise<void>((r) => timers.current.push(setTimeout(r, ms)));

    async function run() {
      while (alive) {
        setPhase('draft');
        setWarn(false);
        setAttached(false);
        await wait(1600);
        // send: stopped by the missing attachment
        setWarn(true);
        await wait(1800);
        // attach the summary, then send for real
        setAttached(true);
        setWarn(false);
        await wait(1400);
        setPhase('sending');
        await wait(900);
        // sent, with a window to undo
        setPhase('undo');
        for (let k = 5; k > 0; k--) {
          setUndoLeft(k);
          await wait(1000);
          if (!alive) return;
        }
        setPhase('sent');
        await wait(2400);
      }
    }
    run();
    return () => {
      alive = false;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <DraftReview
        subtitle="After the pricing review with Maya"
        to={[{ name: 'Maya Kim', initials: 'MK', color: 'var(--vo-av-l)' }]}
        subject="Pricing v4: what changed"
        body={BODY}
        attachments={attached ? [{ name: 'Pricing v4 summary.pdf', size: '240 KB' }] : []}
        phase={phase}
        undoLeft={undoLeft}
        warning={
          warn
            ? {
                text: 'You mention an attachment, but nothing is attached.',
                actions: [
                  { label: 'Send anyway', onClick: () => setWarn(false) },
                  { label: 'Attach the summary', primary: true, onClick: () => { setAttached(true); setWarn(false); } },
                ],
              }
            : undefined
        }
        onSend={() => {}}
        onDiscard={() => setPhase('discarded')}
        onUndo={() => setPhase('draft')}
      />
    </div>
  );
}
