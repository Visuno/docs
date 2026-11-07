'use client';
import { useEffect, useRef } from 'react';
import { RichTextEditor, type RichTextEditorHandle } from '@visuno/rich-text-editor/RichTextEditor';

/**
 * Live example for the Rich text editor docs page, in the shape of the component's
 * own demo upstream: a heading and a short draft about a pricing launch are typed
 * in, then the last sentence is selected and made shorter — the suggestion streams
 * in beside it (old words struck through, new ones arriving word by word) and is
 * accepted. Driven through the component's ref handle so nothing steals the page's
 * focus. A click or key of yours takes over and the editor is yours. Uses the real
 * Visuno component, and respects prefers-reduced-motion (the story is skipped).
 */
const DRAFT =
  'New pricing goes live on March 3. Starter teams get two more seats for free, and every plan now includes the agent. We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.';
const LAST = DRAFT.slice(DRAFT.indexOf('We know'));

export function RichTextEditorExample() {
  const ref = useRef<RichTextEditorHandle>(null);
  const took = useRef(false);

  useEffect(() => {
    const reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
    const stop = () => {
      took.current = true;
    };

    const type = async (t: string) => {
      for (const w of t.match(/\S+\s*/g) || []) {
        if (!alive || took.current) return;
        ref.current?.type(w);
        await wait(reduce ? 0 : 240);
      }
    };

    (async () => {
      const E = ref.current;
      if (!E) return;
      if (reduce) {
        // no motion: just place a finished draft and stop
        E.type('Pricing launch');
        E.newLine();
        E.type(DRAFT);
        return;
      }
      await wait(1400);
      if (took.current) return;
      E.format('h2');
      await type('Pricing launch');
      await wait(500);
      E.newLine();
      await wait(300);
      await type(DRAFT);
      await wait(1600);
      if (took.current) return;
      if (!E.select(LAST)) return;
      await wait(1000);
      E.ask('shorter');
      // wait for the streamed suggestion to settle, then accept
      await wait(reduce ? 200 : 3200);
      if (took.current) return;
      E.accept();
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{ width: '100%', maxWidth: 560 }}
      onPointerDownCapture={() => {
        took.current = true;
      }}
      onKeyDownCapture={() => {
        took.current = true;
      }}
    >
      <RichTextEditor ref={ref} />
    </div>
  );
}
