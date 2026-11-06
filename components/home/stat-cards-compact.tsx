'use client';
import { StatCards } from '@visuno/stat-cards/StatCards';

/**
 * A compact Stat cards demo for the landing showcase. The preview stage is
 * narrow (roughly a third of a row on desktop), so the real four-up grid would
 * squeeze each card until the label wraps and the change chip clips. Here we
 * show two KPIs stacked in a single column: each card gets the full stage
 * width, the label stays on one line, and the "+12.4%" chip sits beside the
 * number instead of overflowing. The full four-up version with the period
 * switch lives on the component's docs page. Uses the real Visuno component.
 */
const STATS = [
  {
    key: 'runs',
    icon: 'spark' as const,
    label: 'Agent runs',
    values: [{ value: 1842, change: 12.4, points: [980, 1120, 1070, 1260, 1410, 1550, 1842] }],
  },
  {
    key: 'success',
    icon: 'check' as const,
    label: 'Success rate',
    suffix: '%',
    values: [{ value: 97, change: 1.1, points: [94, 95, 95, 96, 96, 97, 97] }],
  },
];

const PERIODS = [{ label: '7 days', compare: 'vs previous 7 days' }];

export function StatCardsCompact() {
  return (
    <div className="sc-compact">
      <StatCards stats={STATS} periods={PERIODS} defaultPeriod={0} />
      <style>{`
        /* Full-width, single-column layout tuned for the narrow preview stage. */
        .sc-compact {
          width: 100%;
        }
        .sc-compact .dm-scx-grid {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        /* keep the label on one line so "Agent runs" never breaks awkwardly */
        .sc-compact .dm-scx-k {
          white-space: nowrap;
        }
        /* let the number and its change chip wrap gracefully if ever tight */
        .sc-compact .dm-scx-v {
          flex-wrap: wrap;
          row-gap: 4px;
        }
      `}</style>
    </div>
  );
}
