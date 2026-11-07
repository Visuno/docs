'use client';
import { useEffect, useRef, useState } from 'react';
import { VoiceOrb, type VoiceState } from '@visuno/voice-orb/VoiceOrb';

/**
 * Live example for the Voice orb docs page, in the shape of the component's own demo
 * on the upstream site: it plays a short scripted call so the orb, the status and the
 * caption move on their own. It never opens the microphone or makes a sound — the
 * level is a made-up voice curve. Respects prefers-reduced-motion: it then holds a
 * still frame on "Listening" rather than running the loop. Uses the real Visuno
 * component.
 */

type Turn = { speaker: 'You' | 'Agent'; text: string };

const TURNS: Turn[] = [
  { speaker: 'You', text: 'Make the yearly price the default on the pricing page.' },
  { speaker: 'Agent', text: 'Done. Yearly is now the default on all three plans in Pricing v4.' },
  { speaker: 'You', text: 'Show the yearly saving in green too.' },
  { speaker: 'Agent', text: 'Added. The saving shows in green under each yearly price.' },
];

const HINT = 'Talk to the agent about Pricing v4';

export function VoiceOrbExample() {
  const [state, setState] = useState<VoiceState>('idle');
  const [level, setLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState<{ speaker: string; text: string; id?: string } | undefined>();
  const [elapsed, setElapsed] = useState(0);

  const run = useRef(0);
  const talking = useRef(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // the orb follows a level: a made-up voice while someone talks, a faint idle while
  // it listens. With reduced motion it stays still at zero.
  useEffect(() => {
    if (reduce.current) return;
    let raf = 0;
    const tick = (t: number) => {
      const to = talking.current
        ? 0.5 + 0.28 * Math.sin(t / 90) * Math.sin(t / 233) + 0.16 * Math.sin(t / 57)
        : state === 'listening' && !muted
          ? 0.05 + 0.03 * Math.sin(t / 420)
          : 0;
      setLevel((l) => l + (Math.max(0, to) - l) * 0.18);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, muted]);

  // the elapsed clock, while the chat is live
  useEffect(() => {
    if (state === 'idle' || state === 'ended') return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  const wait = (ms: number, id: number) =>
    new Promise<void>((res) => setTimeout(() => res(), reduce.current ? Math.min(ms, 200) : ms)).then(
      () => id === run.current,
    );

  async function talk(id: number) {
    for (let i = 0; i < TURNS.length; i++) {
      const turn = TURNS[i];
      if (turn.speaker === 'You') {
        setState('listening');
        if (!(await wait(1200, id))) return;
        talking.current = true;
        setCaption({ speaker: 'You', text: turn.text, id: `t${i}` });
        if (!(await wait(2200, id))) return;
        talking.current = false;
        setState('thinking');
        if (!(await wait(1300, id))) return;
      } else {
        setState('speaking');
        talking.current = true;
        setCaption({ speaker: 'Agent', text: turn.text, id: `t${i}` });
        if (!(await wait(2000, id))) return;
        talking.current = false;
        setState('listening');
        if (!(await wait(400, id))) return;
      }
    }
    setState('ended');
  }

  const start = () => {
    const id = ++run.current;
    setElapsed(0);
    setMuted(false);
    setCaption(undefined);
    setState('listening');
    void talk(id);
  };

  const restart = () => start();

  const end = () => {
    run.current++;
    talking.current = false;
    setState('ended');
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
      <VoiceOrb
        state={state}
        level={level}
        muted={muted}
        onMutedChange={setMuted}
        mutedNotice
        caption={state === 'idle' || state === 'ended' ? undefined : caption}
        hint={HINT}
        elapsed={elapsed}
        onStart={start}
        onEnd={end}
        onRestart={restart}
      />
    </div>
  );
}
