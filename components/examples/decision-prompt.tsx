'use client';
import { useEffect, useRef, useState } from 'react';
import { DecisionPrompt, type DecisionQuestion } from '@visuno/decision-prompt/DecisionPrompt';

/**
 * Live example for the Decision prompt docs page, in the shape of the component's
 * own demo on the upstream site: the agent asks a few quick questions before it
 * starts a redesign. It self-animates — picking an option and continuing on a
 * gentle loop, then settling into the summary and starting — and respects
 * prefers-reduced-motion (it holds on the first question when motion is reduced).
 * Uses the real Visuno component.
 */
const QUESTIONS: DecisionQuestion[] = [
  {
    question: 'Which frames should the agent redesign?',
    label: 'Frames',
    options: [
      { label: 'Pricing only', detail: '1 frame' },
      { label: 'Pricing and checkout', detail: '3 frames' },
      { label: 'The whole flow', detail: '9 frames' },
    ],
  },
  {
    question: 'How bold can the changes be?',
    label: 'Scope',
    options: [
      { label: 'Polish spacing and type', detail: 'Safe' },
      { label: 'Rework the layout', detail: 'Medium' },
      { label: 'Fresh direction', detail: 'Bold' },
    ],
  },
  {
    question: 'Where should the result go?',
    label: 'Output',
    options: [
      { label: 'New Figma page', detail: 'Keeps the original' },
      { label: 'Branch in the repo', detail: 'Opens a PR' },
      { label: 'Both', detail: 'Recommended' },
    ],
  },
];

// one full pass: ask all three, show the summary, start, then reset
const PICKS = [1, 2, 2];

export function DecisionPromptExample() {
  // `round` remounts the prompt to replay from the first question
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [started, setStarted] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return; // hold on the first question, no auto-play

    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    // walk the answers in one at a time, then settle and start
    at(900, () => setAnswers([PICKS[0]]));
    at(1900, () => setAnswers([PICKS[0], PICKS[1]]));
    at(2900, () => setAnswers([PICKS[0], PICKS[1], PICKS[2]]));
    at(4200, () => setStarted(true));
    at(6200, () => {
      setAnswers([]);
      setStarted(false);
      setRound((r) => r + 1);
    });

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [round]);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <DecisionPrompt
        key={round}
        questions={QUESTIONS}
        answers={answers}
        started={started}
        startLabel="Starting the redesign"
        startedLabel="Redesign under way"
        bare
      />
    </div>
  );
}
