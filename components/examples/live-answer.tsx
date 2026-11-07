'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LiveAnswer,
  type AnswerSource,
  type AnswerTurn,
} from '@visuno/live-answer/LiveAnswer';

/**
 * Live example for the Live answer docs page, in the shape of the component's
 * own upstream demo: a question is answered by a turn that thinks, then streams
 * its text in word by word with numbered citations, then settles with a sources
 * list and suggested follow-ups. Picking a follow-up adds a new turn below and
 * streams its answer the same way. Uses the real Visuno React component.
 *
 * Respects prefers-reduced-motion: when motion is reduced, each answer is shown
 * finished at once instead of streaming in.
 */

const SOURCES: AnswerSource[] = [
  { n: 1, title: 'Funnel data', detail: 'Amplitude, last 30 days', mark: 'F', color: '#7a5af8' },
  { n: 2, title: 'Session notes', detail: 'Notion, 8 interviews', mark: 'N', color: '#0ea5a4' },
  { n: 3, title: 'Onboarding.fig', detail: 'Figma, step 2', mark: 'S', color: '#f97316' },
];

const THOUGHTS = [
  'Read the funnel for the last 30 days',
  'Matched the drop to the interview notes',
  'Checked step 2 in Onboarding.fig',
];

// each answer, keyed by the question that asks for it ('' is the first turn)
const ANSWERS: Record<string, string> = {
  '':
    'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].',
  'Show the drop-off by device':
    'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
  'Draft a fix for the workspace step':
    'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].',
};

const FIRST_Q = 'Where are people dropping off in onboarding?';
const FOLLOW_UPS = ['Show the drop-off by device', 'Draft a fix for the workspace step'];

const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function LiveAnswerExample() {
  const [turns, setTurns] = useState<AnswerTurn[]>([
    { key: 0, question: FIRST_Q, state: 'waiting' },
  ]);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  // thinks, then streams the answer word by word, then settles on done
  const run = useCallback(
    (index: number, question: string, withFollowUps: boolean) => {
      const full = ANSWERS[question] ?? '';
      const patch = (t: Partial<AnswerTurn>) =>
        setTurns((prev) => prev.map((x, i) => (i === index ? { ...x, ...t } : x)));

      if (reduceMotion()) {
        patch({ state: 'done', text: full, thoughts: THOUGHTS, thoughtFor: 2, sources: SOURCES });
        if (withFollowUps) setShowFollowUps(true);
        return;
      }

      patch({ state: 'thinking', thoughts: THOUGHTS, thoughtFor: 2 });
      later(() => {
        patch({ state: 'answering', text: '', thoughts: THOUGHTS, thoughtFor: 2 });
        const words = full.split(' ');
        let at = 0;
        const step = () => {
          at += 1;
          patch({ state: 'answering', text: words.slice(0, at).join(' ') });
          if (at < words.length) {
            later(step, 55 + Math.random() * 45);
          } else {
            later(() => {
              patch({ state: 'done', text: full, sources: SOURCES });
              if (withFollowUps) later(() => setShowFollowUps(true), 300);
            }, 120);
          }
        };
        step();
      }, 1300);
    },
    [later],
  );

  useEffect(() => {
    run(0, '', true);
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [run]);

  const onFollowUp = (question: string) => {
    setShowFollowUps(false);
    setTurns((prev) => {
      const index = prev.length;
      later(() => later(() => run(index, question, false), 450), 0);
      return [...prev, { key: index, question, state: 'waiting' }];
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 440 }}>
      <LiveAnswer
        turns={turns}
        followUps={showFollowUps ? FOLLOW_UPS : undefined}
        onFollowUp={onFollowUp}
      />
    </div>
  );
}
