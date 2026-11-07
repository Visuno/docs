'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnswerActionBar,
  type AnswerVersion,
  type ReadingState,
} from '@visuno/answer-action-bar/AnswerActionBar';

/**
 * Live example for the Answer action bar docs page, in the shape of the
 * component's own upstream demo: an answer streams in, then plays its own short
 * story — it reads aloud, the reader hears a wrong number and rates it down,
 * picks a reason, rides out a dropped connection while a new version is written,
 * and copies the fix. One version keeps its own rating. Uses the real Visuno
 * React component.
 *
 * Respects prefers-reduced-motion: when motion is reduced, the answer is shown
 * finished at once and the auto-played story does not run.
 */

// the versions a regenerate writes, in turn. `changed` marks the phrase that
// changed from the version before; $24 to $19 a month saves 21%
const POOL: AnswerVersion[] = [
  {
    text: 'Pro is $24 a month, or $19 a month when billed yearly. That saves 15%, and yearly is the option the new pricing page shows first.',
    meta: 'Sonnet 5.5 · 6.2s',
  },
  {
    text: 'Pro is $24 a month, or $19 a month billed yearly, which saves 21%, or $60 a year. The new pricing page shows the yearly price first.',
    changed: '21%, or $60 a year',
    meta: 'Sonnet 5.5 · 4.8s',
  },
];

const QUESTION = 'How much do people save on the yearly Pro plan?';

const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function AnswerActionBarExample() {
  const [versions, setVersions] = useState<AnswerVersion[]>([POOL[0]]);
  const [cur, setCur] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const [reading, setReading] = useState<ReadingState>('idle');
  const [status, setStatus] = useState('');
  const [statusTone, setStatusTone] = useState<'warn' | 'ok' | undefined>(undefined);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  // regenerate writes the second version; a dropped connection is retried once
  const regenerate = useCallback(
    (withNote: boolean) => {
      setStreaming(true);
      setStatusTone(undefined);
      setStatus('Writing a new version' + (withNote ? ' with your note' : ''));
      later(() => {
        setStatusTone('warn');
        setStatus("Couldn't reach Sonnet 5.5. Retrying in 2s");
        later(() => setStatus("Couldn't reach Sonnet 5.5. Retrying in 1s"), 1000);
        later(() => {
          setStatusTone(undefined);
          setStatus('Writing a new version' + (withNote ? ' with your note' : ''));
          later(() => {
            setVersions([POOL[0], POOL[1]]);
            setCur(1);
            setStreaming(false);
            setStatusTone('ok');
            setStatus('Version 2 fixes the saving: 21%, not 15%');
          }, 900);
        }, 2000);
      }, 1200);
    },
    [later],
  );

  // the preview's story: stream in, listen, rate it down, say why, ride out a
  // dropped connection, land on the fix
  const play = useCallback(() => {
    if (reduceMotion()) {
      setVersions([POOL[0], POOL[1]]);
      setCur(1);
      setStatusTone('ok');
      setStatus('Version 2 fixes the saving: 21%, not 15%');
      return;
    }
    setStreaming(true);
    later(() => setStreaming(false), 1400);
    later(() => setReading('playing'), 2600);
    later(() => setReading('paused'), 6400);
    later(() => {
      // the reader hears the wrong number and rates the version down
      setVersions((prev) => prev.map((x, i) => (i === 0 ? { ...x, rating: 'down' } : x)));
      setReading('idle');
    }, 7400);
    later(() => regenerate(true), 9400);
  }, [later, regenerate]);

  useEffect(() => {
    play();
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [play]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 480 }}>
      <AnswerActionBar
        question={QUESTION}
        versions={versions}
        version={cur}
        onVersionChange={setCur}
        streaming={streaming}
        reading={reading}
        onReadingChange={setReading}
        onRegenerate={() => regenerate(false)}
        onReason={() => {}}
        status={status}
        statusTone={statusTone}
      />
    </div>
  );
}
