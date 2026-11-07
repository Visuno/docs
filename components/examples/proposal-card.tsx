'use client';
import { useEffect, useState } from 'react';
import {
  ProposalCard,
  type ProposalOption,
  type ProposalValue,
} from '@visuno/proposal-card/ProposalCard';

/**
 * Live example for the Proposal card docs page, in the shape of the component's own
 * demo on upstream: a suggested contrast fix with a confidence meter that fills in a
 * moment after the card appears, two other options behind a fold, and Accept / Not now
 * with an Undo. Uses the real Visuno component.
 *
 * The example nudges itself once (opening the options and picking the second one) so
 * the page shows the motion without a click, then leaves control to the viewer. It
 * respects prefers-reduced-motion by skipping that self-animation.
 */
const FROM: ProposalValue = { color: '#c9cfd8', label: '#C9CFD8', badge: '2.1 : 1', tone: 'bad' };

const OPTIONS: ProposalOption[] = [
  {
    color: '#5b6472',
    label: '#5B6472',
    badge: '5.9 : 1',
    tone: 'ok',
    name: 'Suggested',
    description: 'Balanced with the primary',
    confidence: 84,
  },
  {
    color: '#475161',
    label: '#475161',
    badge: '7.4 : 1',
    tone: 'ok',
    name: 'Darker',
    description: 'Stronger than the primary',
    confidence: 62,
  },
  {
    color: '#116ff8',
    label: '#116FF8',
    badge: '4.6 : 1',
    tone: 'ok',
    name: 'Accent outline',
    description: 'Competes with the CTA',
    confidence: 41,
  },
];

export function ProposalCardExample() {
  const [open, setOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setOpen(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <ProposalCard
        title="Raise contrast on the secondary button"
        subtitle="Pricing, frame 2 of 3"
        from={FROM}
        options={OPTIONS}
        open={open}
        onOpenChange={setOpen}
        acceptedLabel="Applied to 3 buttons"
      />
    </div>
  );
}
