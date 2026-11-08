'use client';
import { useEffect, useRef, useState } from 'react';
import { CodeViewer, type CodeFile } from '@visuno/code-viewer/CodeViewer';

/**
 * Live example for the Code viewer docs page, in the shape of the component's own
 * demo upstream: two files the agent changed, its changed lines marked. On its
 * own it opens the note on one changed line after a beat (unless you take over
 * first or prefer reduced motion), the way the preview does. Uses the real
 * Visuno component.
 */
const FILES: CodeFile[] = [
  {
    name: 'PlanCard.tsx',
    lines: [
      { code: [['k', 'import'], ' { Button } ', ['k', 'from'], ' ', ['s', '"@/ui/button"'], ';'] },
      { code: '' },
      { code: [['k', 'export function'], ' ', ['f', 'PlanCard'], '({ plan }) {'] },
      {
        code: [['cm', '  // One CTA per card, annual price first']],
        changed: true,
        note: 'The agent removed the second link here. The design review said two CTAs split attention.',
      },
      { code: [['k', '  return'], ' ('] },
      { code: [['tg', '    <Card'], ' ', ['at', 'padding'], '=', ['s', '"lg"'], ['tg', '>']] },
      {
        code: [['tg', '      <Price'], ' ', ['at', 'value'], '={plan.annual} ', ['at', 'was'], '={plan.monthly} ', ['tg', '/>']],
        changed: true,
        note: 'Shows the monthly price crossed out next to the annual one. This is the change behind the 18% lift.',
      },
      {
        code: [['tg', '      <Button'], ' ', ['at', 'variant'], '=', ['s', '"primary"'], ['tg', '>'], '{plan.cta}', ['tg', '</Button>']],
        changed: true,
        note: 'Swapped the custom button for the shared one, so it picks up the library tokens.',
      },
      { code: [['tg', '    </Card>']] },
      { code: '  );' },
      { code: '}' },
    ],
  },
  {
    name: 'tokens.css',
    lines: [
      { code: [['f', ':root'], ' {'] },
      {
        code: ['  --text-muted: ', ['s', '#5b6472'], ';'],
        changed: true,
        note: 'Was #c9cfd8. Contrast on white goes from 2.1 to 5.9, which passes AA.',
      },
      { code: ['  --radius-card: ', ['s', '16px'], ';'] },
      {
        code: ['  --space-card: ', ['s', '24px'], ';'],
        changed: true,
        note: 'Matched to the 4px grid. Was 18px.',
      },
      { code: '}' },
    ],
  },
];

export function CodeViewerExample() {
  const [line, setLine] = useState<number | null>(null);
  // once the viewer asks about a line on its own, it stops nudging
  const touched = useRef(false);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setTimeout(() => {
      if (!touched.current) setLine(6);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const change = (k: number | null) => {
    touched.current = true;
    setLine(k);
  };

  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <CodeViewer files={FILES} line={line} onLineChange={change} />
    </div>
  );
}
