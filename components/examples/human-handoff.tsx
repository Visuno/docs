'use client';
import { useEffect, useRef, useState } from 'react';
import { HumanHandoff, type HandoffPerson, type HandoffStatus } from '@visuno/human-handoff/HumanHandoff';

/**
 * Live example for the Human handoff docs page, in the shape of the component's own
 * demo upstream: the agent hands a refund to the billing team. It starts out finding
 * someone, lands on Maya (who is out), and then plays out a reassignment to Alex, who
 * takes the conversation — so the foot row moves from waiting, to warn, to joined, to
 * "with Alex". Uses the real Visuno component; respects prefers-reduced-motion.
 */
const PEOPLE: HandoffPerson[] = [
  { name: 'Alex Rivera', initials: 'AR', color: 'var(--dm-av-m)', team: 'Billing', presence: 'Available', tone: 'ok' },
  { name: 'Sam Ortiz', initials: 'SO', color: 'var(--dm-av-p)', team: 'Billing', presence: 'In a call' },
  { name: 'Maya Chen', initials: 'MC', color: 'var(--dm-av-l)', team: 'Billing', presence: 'Out until 2pm', tone: 'warn' },
];

const FACTS = [
  { label: 'Amount', value: '$588.00' },
  { label: 'Customer', value: 'Dana Lee · Pro since 2023' },
  { label: 'Order', value: '#48213 · charged twice' },
];

type Phase = { assignee: HandoffPerson | null; status: HandoffStatus };

const MAYA = PEOPLE[2];
const ALEX = PEOPLE[0];

// the story: finding → Maya is out → reassigned to Alex, who joins and takes it
const PHASES: Phase[] = [
  { assignee: null, status: { tone: 'wait', title: 'Handing off to Billing', detail: 'The agent has stopped replying to Dana' } },
  { assignee: MAYA, status: { tone: 'warn', title: 'Maya is out until 2pm', detail: 'The reply is due before then. Reassign it to someone who is free.' } },
  { assignee: ALEX, status: { tone: 'wait', title: 'Waiting for Alex to accept', detail: 'The agent has stopped replying to Dana' } },
  { assignee: ALEX, status: { tone: 'ok', title: 'Alex joined', detail: 'Reading the conversation', person: ALEX } },
  { assignee: ALEX, status: { tone: 'ok', title: 'With Alex · agent paused', detail: "The agent won't reply while Alex has it", person: ALEX } },
];

const STEP_MS = [2600, 3200, 2000, 1900, 4000];

export function HumanHandoffExample() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<HandoffPerson | null>(null);
  const [seconds, setSeconds] = useState(846);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // walk through the story unless the reader has picked someone themselves
  useEffect(() => {
    if (reduce || picked) return;
    timer.current = setTimeout(() => setStep((s) => (s + 1) % PHASES.length), STEP_MS[step]);
    return () => clearTimeout(timer.current);
  }, [step, picked, reduce]);

  // the countdown, by the second, down to the amber band and overdue
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setSeconds((s) => (s <= 0 ? 846 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [reduce]);

  const phase = picked
    ? { assignee: picked, status: { tone: 'ok', title: `With ${picked.name.split(' ')[0]} · agent paused`, detail: `The agent won't reply while ${picked.name.split(' ')[0]} has it`, person: picked } as HandoffStatus }
    : PHASES[step];

  return (
    <div style={{ width: '100%', maxWidth: 680 }}>
      <HumanHandoff
        reason="Refund over $500 needs a person"
        assignee={phase.assignee}
        finding={{ title: 'Finding someone', detail: 'Billing team' }}
        people={PEOPLE}
        onReassign={(p) => setPicked(p)}
        secondsLeft={reduce ? 840 : seconds}
        targetSeconds={900}
        summary="Dana was charged twice for her annual plan on Oct 21 and wants one charge back. The agent confirmed the duplicate, but can't refund more than $500."
        facts={FACTS}
        link={{ label: 'View conversation · 12 messages', onClick: () => {}, tip: 'Opens the whole conversation' }}
        message="Thanks, Dana. A refund this size needs someone on our billing team, so I've passed your conversation to them. They'll reply here within 15 minutes."
        messageLabel="Sent to Dana"
        onMessageChange={() => {}}
        status={phase.status}
      />
    </div>
  );
}
