'use client';
import { SourceStack, type StackSource } from '@visuno/source-stack/SourceStack';

/**
 * Live example for the Source stack docs page, in the shape of the component's
 * own demo upstream: an answer with its sources folded into a quiet pill. The
 * component opens itself once on its own (after a short pause) and staggers the
 * rows in; it respects prefers-reduced-motion internally, so no extra wiring is
 * needed here. Uses the real Visuno component.
 */
const SOURCES: StackSource[] = [
  { kind: 'web', title: 'Baymard: pricing page UX', host: 'baymard.com', relevance: 0.92, mark: 'B', color: 'var(--dm-pb)', onOpen: () => {} },
  { kind: 'web', title: 'Annual vs monthly anchoring study', host: 'cxl.com', relevance: 0.88, mark: 'C', color: 'var(--dm-pp)', onOpen: () => {} },
  { kind: 'file', title: 'Q3 conversion export.csv', host: 'Drive', relevance: 0.84, mark: 'CSV', color: 'var(--dm-pm)', onOpen: () => {} },
  { kind: 'figma', title: 'Pricing v4, frame 2', host: 'Figma', relevance: 0.8, mark: 'F', color: 'var(--dm-pl)', onOpen: () => {} },
  { kind: 'web', title: 'Stripe billing docs', host: 'stripe.com', relevance: 0.66, mark: 'S', color: 'var(--dm-pl)', onOpen: () => {} },
  { kind: 'file', title: 'Pricing research notes', host: 'Notion', relevance: 0.61, mark: 'N', color: 'var(--dm-fg2)', onOpen: () => {} },
  { kind: 'figma', title: 'Checkout flow', host: 'Figma', relevance: 0.52, mark: 'F', color: 'var(--dm-pl)', onOpen: () => {} },
  { kind: 'web', title: 'NN/g on price framing', host: 'nngroup.com', relevance: 0.48, mark: 'N', color: 'var(--dm-fg2)', onOpen: () => {} },
];

export function SourceStackExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <SourceStack sources={SOURCES}>
          Annual plans convert about 18% better when the monthly price is shown crossed out next to them.
        </SourceStack>
      </div>
    </div>
  );
}
