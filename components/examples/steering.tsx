'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Steering,
  type SteerStep,
  type SteerMessage,
} from '@visuno/steering/Steering';

/**
 * Live example for the Steering docs page, in the shape of the component's own
 * demo on the upstream site: a run that works through four steps on the pricing
 * page while, part way through, a steer comes in ("Use our library blue, not
 * violet"). The agent takes it up, flags that the Pro card is already violet,
 * and offers to redo it; the demo taps Redo, a new step slides in, and the run
 * finishes with a summary. It loops. Respects prefers-reduced-motion by jumping
 * to the finished state and holding there. Uses the real Visuno component.
 */

type Phase =
  | 'running' // step 2 in progress
  | 'steered' // your message queued
  | 'applied' // agent took it up, asks about the Pro card
  | 'redo' // you tapped Redo, a step was added
  | 'done';

const BASE_STEPS: SteerStep[] = [
  { id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: 'done' },
  { id: 'pro', title: 'Update the Pro card', detail: 'Setting the accent to violet', status: 'running' },
  { id: 'team', title: 'Update the Team card', detail: 'Pricing v4, frame 3', status: 'queued' },
  { id: 'ship', title: 'Export to staging', detail: 'visuno.studio/pricing', status: 'queued' },
];

export function SteeringExample() {
  const [phase, setPhase] = useState<Phase>('running');
  const prefersReduced = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    prefersReduced.current =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const run = () => {
      clear();
      if (prefersReduced.current) {
        setPhase('done');
        return;
      }
      setPhase('running');
      at(1800, () => setPhase('steered'));
      at(3400, () => setPhase('applied'));
      at(5400, () => setPhase('redo'));
      at(8200, () => setPhase('done'));
      at(11500, run); // loop
    };
    run();
    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const at = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const steps = buildSteps(phase);
  const messages = buildMessages(phase, () => setPhase('redo'));
  const finished = phase === 'done';

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <Steering
        title="Redesign the pricing page"
        steps={steps}
        messages={messages}
        seconds={finished ? 14 : undefined}
        // the demo drives the run itself, so the box is read-only here
        value=""
        placeholder={finished ? 'The run has finished' : 'Steer the agent while it works'}
      />
    </div>
  );
}

function buildSteps(phase: Phase): SteerStep[] {
  const done = phase === 'done';
  const steps = BASE_STEPS.map((s) => ({ ...s }));

  // part way through, the steer lands: the Pro card's accent becomes library blue
  const steered = phase === 'applied' || phase === 'redo' || done;
  if (steered) {
    steps[1].detail = 'Setting the accent to library blue';
  }

  // once you tap Redo, a "From you" step slides in before the export
  if (phase === 'redo' || done) {
    steps.splice(3, 0, {
      id: 'redo-pro',
      title: 'Redo the Pro card',
      detail: 'Accent to library blue',
      status: 'queued',
      fromYou: true,
    });
  }

  if (done) {
    for (const s of steps) s.status = 'done';
    steps.find((s) => s.id === 'pro')!.detail = 'Accent set to library blue';
    steps.find((s) => s.id === 'team')!.detail = 'Accent set to library blue';
    const redo = steps.find((s) => s.id === 'redo-pro');
    if (redo) redo.detail = 'Accent set to library blue';
    steps.find((s) => s.id === 'ship')!.detail = 'Live on visuno.studio/pricing';
  }
  return steps;
}

function buildMessages(phase: Phase, onRedo: () => void): SteerMessage[] {
  if (phase === 'running') return [];

  const you: SteerMessage = {
    id: 'm1',
    from: 'you',
    text: 'Use our library blue, not violet',
    state: phase === 'steered' ? 'queued' : 'applied',
  };
  if (phase === 'steered') return [you];

  const asked = phase === 'redo' || phase === 'done';
  const agent: SteerMessage = {
    id: 'm2',
    from: 'agent',
    text: 'Got it. From here the accent is color.accent.500. The Pro card is already violet.',
    warn: true,
    answer: asked ? 'Added a step to redo the Pro card' : undefined,
    actions: asked
      ? undefined
      : [
          { label: 'Leave it', onClick: () => {} },
          { label: 'Redo the Pro card', onClick: onRedo },
        ],
  };
  return [you, agent];
}
