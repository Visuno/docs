'use client';
import { useEffect, useRef, useState } from 'react';
import { VoiceCapture, type HeardWord, type VoiceCaptureState } from '@visuno/voice-capture/VoiceCapture';

/**
 * Live example for the Voice capture docs page, in the shape of the component's own
 * demo upstream: the words arrive one by one as if they were being heard, the wave
 * scrolls with a gently varying level, and once they have all arrived it settles
 * into review so the two unsure words ("toggle", "save") can be fixed. Record again
 * replays it. Respects prefers-reduced-motion by showing the finished transcript
 * at once. Uses the real Visuno component.
 */
const WORDS: Array<string | HeardWord> = [
  'Move', 'the', 'yearly', { text: 'toggle', alternatives: ['toggle', 'toddle', 'tunnel'] },
  'above', 'the', 'cards', 'and', 'make', 'the',
  { text: 'save', alternatives: ['save', 'sale', 'saving'] }, 'badge', 'say', '20%', 'off',
  'for', 'annual', 'plans',
];

export function VoiceCaptureExample() {
  const [shown, setShown] = useState(0);
  const [state, setState] = useState<VoiceCaptureState>('listening');
  const [level, setLevel] = useState(0);
  const run = useRef(0);

  useEffect(() => {
    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = ++run.current;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduced) {
      setShown(WORDS.length);
      setState('review');
      return;
    }

    setShown(0);
    setState('listening');
    // a gently wandering input level drawn into the wave
    const wave = setInterval(() => {
      if (run.current === id) setLevel(0.2 + Math.random() * 0.8);
    }, 60);
    // the words arrive one by one, then it settles into review
    let t = 700;
    for (let i = 1; i <= WORDS.length; i++) {
      timers.push(setTimeout(() => { if (run.current === id) setShown(i); }, t));
      t += 240;
    }
    timers.push(
      setTimeout(() => {
        if (run.current === id) { setState('review'); clearInterval(wave); setLevel(0); }
      }, t + 500),
    );

    return () => { timers.forEach(clearTimeout); clearInterval(wave); };
  }, [run.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const again = () => { run.current++; setTimeout(() => run.current++, 0); };

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <VoiceCapture
        words={WORDS.slice(0, shown)}
        state={state}
        onStateChange={setState}
        level={level}
        onRecordAgain={again}
      />
    </div>
  );
}
