'use client';
import { StatCards } from '@visuno/stat-cards/StatCards';

/**
 * Live example for the Stat cards docs page. Four KPIs for an agent
 * platform, each with its own icon, colour, change and sparkline, and a
 * period switch ("7 days" / "30 days") that rolls the numbers and redraws
 * the lines. Uses the real Visuno React component.
 */
const STATS = [
  {
    key: 'runs',
    icon: 'sparkles' as const,
    label: 'Agent runs',
    values: [
      { value: 1842, change: 12.4, points: [980, 1120, 1070, 1260, 1410, 1550, 1842] },
      { value: 7320, change: 8.1, points: [5200, 5600, 5900, 6100, 6600, 6950, 7320] },
    ],
  },
  {
    key: 'latency',
    icon: 'clock' as const,
    label: 'Avg latency',
    suffix: 's',
    values: [
      { value: 2, change: -6.5, points: [3.1, 2.9, 2.8, 2.6, 2.4, 2.3, 2.1] },
      { value: 2, change: -3.2, points: [2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.2] },
    ],
  },
  {
    key: 'cost',
    icon: 'coins' as const,
    label: 'Cost',
    prefix: '$',
    values: [
      { value: 486, change: 4.2, points: [210, 240, 275, 330, 390, 440, 486] },
      { value: 1930, change: 9.7, points: [1100, 1280, 1420, 1560, 1700, 1830, 1930] },
    ],
  },
  {
    key: 'success',
    icon: 'check' as const,
    label: 'Success rate',
    suffix: '%',
    values: [
      { value: 97, change: 1.1, points: [94, 95, 95, 96, 96, 97, 97] },
      { value: 96, change: 0.4, points: [95, 95, 95, 96, 96, 96, 96] },
    ],
  },
];

const PERIODS = [
  { label: '7 days', compare: 'vs previous 7 days' },
  { label: '30 days', compare: 'vs previous 30 days' },
];

export function StatCardsExample() {
  return (
    <div style={{ width: '100%' }}>
      <StatCards stats={STATS} periods={PERIODS} defaultPeriod={0} />
    </div>
  );
}
