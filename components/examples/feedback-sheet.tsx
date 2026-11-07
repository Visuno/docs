'use client';
import { useEffect, useRef, useState } from 'react';
import { FeedbackSheet, type Feedback, type FeedbackRating } from '@visuno/feedback-sheet/FeedbackSheet';

/**
 * Live example for the Feedback sheet docs page, in the shape of the component's own
 * demo upstream: it rates the answer down on its own, opens the sheet, picks a reason,
 * types a note, then sends it so the thank-you line lands — and loops. Clicking, picking
 * or typing is handled by the real component, which this controls. Respects reduced
 * motion by resting on the sent state. Uses the real Visuno component.
 */
const MESSAGE =
  'I tightened the hero spacing to 24px and swapped the CTA to the accent blue. The card grid now wraps at 720px.';
const REASON = 'Ignored my tokens';
const COMMENT = 'Keep our 8px spacing scale';

export function FeedbackSheetExample() {
  const [rating, setRating] = useState<FeedbackRating>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<Feedback | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const reset = () => {
    setRating(null);
    setOpen(false);
    setSelected([]);
    setComment('');
    setSending(false);
    setSent(null);
  };

  useEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = timers.current;
    const at = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    if (reduce) {
      // rest on the finished state
      setRating('down');
      setSelected([REASON]);
      setComment(COMMENT);
      setSent({ reasons: [REASON], comment: COMMENT });
      return () => t.forEach(clearTimeout);
    }

    const play = () => {
      reset();
      // rate the answer down and open the sheet
      at(1500, () => { setRating('down'); setOpen(true); });
      // pick a reason
      at(2500, () => setSelected([REASON]));
      // type the note, letter by letter
      at(3200, () => {
        COMMENT.split('').forEach((_, i) =>
          at(i * 38, () => setComment(COMMENT.slice(0, i + 1))),
        );
      });
      // send it: spinner, then fold away and the thank-you lands
      at(5300, () => setSending(true));
      at(6100, () => { setSending(false); setOpen(false); });
      at(6400, () => setSent({ reasons: [REASON], comment: COMMENT }));
      // loop
      at(10000, play);
    };
    play();
    return () => {
      t.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <FeedbackSheet
        rating={rating}
        open={open}
        selected={selected}
        comment={comment}
        sending={sending}
        sent={sent}
        onRatingChange={setRating}
        onOpenChange={setOpen}
        onSelectedChange={setSelected}
        onCommentChange={setComment}
        onSubmit={() => {}}
      >
        {MESSAGE}
      </FeedbackSheet>
    </div>
  );
}
