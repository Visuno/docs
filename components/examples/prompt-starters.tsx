'use client';
import { useEffect, useState } from 'react';
import { PromptStarters, type Starter } from '@visuno/prompt-starters/PromptStarters';

/**
 * Live example for the Prompt starters docs page, in the shape of the component's
 * own demo upstream: two sets of four starters that Shuffle swaps between, and a
 * card is picked on a timer so its prompt types itself into the field. Respects
 * prefers-reduced-motion (the component types all at once; the auto-pick stops).
 * Uses the real Visuno component.
 */
const SETS: Starter[][] = [
  [
    { icon: 'grid', tone: 'blue', title: 'Audit a page', description: 'Check the pricing page for spacing and contrast', prompt: 'Audit pricing for spacing and contrast' },
    { icon: 'edit', tone: 'purple', title: 'Rewrite copy', description: 'Make the onboarding intro shorter', prompt: 'Make the onboarding intro shorter' },
    { icon: 'code', tone: 'green', title: 'Export tokens', description: 'Turn colour and spacing into CSS variables', prompt: 'Export the tokens as CSS variables' },
    { icon: 'layers', tone: 'orange', title: 'Compare frames', description: 'Diff the mobile and desktop frames', prompt: 'Diff the mobile and desktop frames' },
  ],
  [
    { icon: 'chart', tone: 'teal', title: 'Explain a metric', description: 'Why did activation drop last week', prompt: 'Why did activation drop last week?' },
    { icon: 'mail', tone: 'pink', title: 'Draft an email', description: 'Announce the new pricing to customers', prompt: 'Announce the new pricing by email' },
    { icon: 'alert', tone: 'red', title: 'Find a bug', description: 'Trace why checkout logs people out', prompt: 'Fix checkout logging people out' },
    { icon: 'figma', tone: 'purple', title: 'Build from Figma', description: 'Turn the hero frame into code', prompt: 'Build the hero frame in React' },
  ],
];

export function PromptStartersExample() {
  const [set, setSet] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  // pick a card on a timer so its prompt types into the field, then clear it; a
  // shuffle resets the loop. Skipped when the viewer prefers reduced motion.
  useEffect(() => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const starters = SETS[set];
    const pickT = setTimeout(() => setPicked(starters[0].title), 900);
    const clearT = setTimeout(() => setPicked(null), 4200);
    return () => {
      clearTimeout(pickT);
      clearTimeout(clearT);
    };
  }, [set]);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <PromptStarters
        starters={SETS[set]}
        value={picked}
        onValueChange={setPicked}
        onSend={() => setPicked(null)}
        onShuffle={() => {
          setPicked(null);
          setSet((s) => (s + 1) % SETS.length);
        }}
      />
    </div>
  );
}
