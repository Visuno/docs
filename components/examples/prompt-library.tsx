'use client';
import { useEffect, useRef, useState } from 'react';
import { PromptLibrary, type SavedPrompt } from '@visuno/prompt-library/PromptLibrary';

/**
 * Live example for the Prompt library docs page, in the shape of the component's own
 * demo upstream: the studio's four saved prompts. It plays the story on a loop —
 * open "Rewrite a section", fill the section in, pick a friendlier tone, pause on
 * the filled prompt, then step back to the list and start over. Honours
 * prefers-reduced-motion by holding the opened, filled prompt still. Uses the real
 * Visuno component, with its open prompt and blank values held in state here.
 */
const PAGE = { label: 'Page', options: ['Pricing v4', 'Home', 'Checkout'] };

const PROMPTS: SavedPrompt[] = [
  {
    id: 'rewrite',
    title: 'Rewrite a section',
    template: 'Rewrite {section} on {page} so it reads {tone}.',
    blanks: {
      section: { label: 'Section', placeholder: 'Like the plan cards', error: 'Say which section to rewrite' },
      page: PAGE,
      tone: { label: 'Tone', options: ['clearer', 'friendlier', 'shorter'] },
    },
  },
  {
    id: 'summarize',
    title: 'Summarize feedback',
    template: 'Summarize the comments on {page} into three fixes.',
    blanks: { page: PAGE },
  },
  {
    id: 'tokens',
    title: 'Check the tokens',
    template: 'Check {page} against the {library} tokens and list what drifts.',
    blanks: { page: PAGE, library: { label: 'Library', options: ['Studio UI', 'Marketing'] } },
  },
  {
    id: 'notes',
    title: 'Write release notes',
    template: "Write release notes for {version} in the studio's voice.",
    blanks: { version: { label: 'Version', placeholder: 'Like Pricing v4', error: 'Say which version they are for' } },
  },
];

export function PromptLibraryExample() {
  const [open, setOpen] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const at = (ms: number, fn: () => void) => void timers.current.push(setTimeout(fn, ms));

    const run = () => {
      // open the first prompt and lay out its blanks
      at(700, () => setOpen('rewrite'));
      // the section is typed in
      at(2000, () => setValues({ section: 'the plan cards' }));
      // a friendlier tone is picked; now every blank has a value
      at(3100, () => setValues({ section: 'the plan cards', tone: 'friendlier' }));
      // step back to the list and loop
      at(5200, () => {
        setOpen(null);
        setValues({});
        at(1000, run);
      });
    };

    if (reduce) {
      // hold the opened, filled prompt still
      setOpen('rewrite');
      setValues({ section: 'the plan cards', tone: 'friendlier' });
    } else {
      run();
    }

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <PromptLibrary
        prompts={PROMPTS}
        subtitle="Shared with Visuno Studio"
        open={open}
        onOpenChange={setOpen}
        values={values}
        onValuesChange={setValues}
      />
    </div>
  );
}
