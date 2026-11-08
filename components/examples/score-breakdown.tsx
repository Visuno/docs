'use client';
import { useState } from 'react';
import {
  ScoreBreakdown,
  type ScoreFactor,
  type ScoreProposal,
} from '@visuno/score-breakdown/ScoreBreakdown';

/**
 * Live example for the Score breakdown docs page, in the shape of the
 * component's own demo upstream. A support agent's quality score out of 100,
 * split by four factors sized by their weight; the weakest (Speed) is flagged
 * and offers Improve, which asks the agent for a proposal and, once applied,
 * lifts that factor's points so the whole score rises. Uses the real Visuno
 * component; respects prefers-reduced-motion through the component itself.
 */
const INITIAL: ScoreFactor[] = [
  { key: 'accuracy', label: 'Accuracy', weight: 40, earned: 34, note: '2 wrong refund amounts in 120 tickets' },
  { key: 'speed', label: 'Speed', weight: 20, earned: 11, note: 'Median reply 6.4s, target under 4s', improvable: true },
  { key: 'cost', label: 'Cost', weight: 20, earned: 16, note: '$0.11 a ticket, budget $0.12' },
  { key: 'safety', label: 'Safety', weight: 20, earned: 19, note: 'No policy breaks, 1 tone flag' },
];

export function ScoreBreakdownExample() {
  const [factors, setFactors] = useState<ScoreFactor[]>(INITIAL);

  const onImprove = (f: ScoreFactor): Promise<ScoreProposal> =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            text: 'Cache the search results between steps and run the two account lookups at once.',
            gain: 'About 2.1s faster a reply',
            to: 17,
          }),
        1300,
      ),
    );

  const onApply = (f: ScoreFactor, p: ScoreProposal) => {
    setFactors((prev) =>
      prev.map((x) =>
        x.key === f.key
          ? {
              ...x,
              earned: p.to,
              note: 'Median reply 4.3s, close to the target',
              improvable: false,
              detail: 'Applied: search results are cached and the lookups run together.',
            }
          : x,
      ),
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <ScoreBreakdown
        factors={factors}
        title="Support agent quality"
        previous={77}
        since="since last week"
        defaultOpen={['speed']}
        improvingLabel="Looking at 120 slow replies"
        onImprove={onImprove}
        onApply={onApply}
      />
    </div>
  );
}
