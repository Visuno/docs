'use client';
import { FunnelChart } from '@visuno/funnel-chart/FunnelChart';

/**
 * Live example for the Funnel chart docs page. A signup-to-paid funnel for an
 * agent platform: each stage's bar grows in, the biggest drop is called out,
 * and the agent's note crossfades. A segment switch ("All" / "Teams" / "Solo")
 * redraws the bars top to bottom and swaps the note. Uses the real Visuno
 * React component, which draws a moment after it appears and respects
 * prefers-reduced-motion.
 */
const STAGES = ['Signed up', 'Opened a file', 'Ran the agent', 'Invited a teammate', 'Paid'];

const VIEWS = [
  {
    key: 'all',
    label: 'All',
    values: [12400, 9180, 6420, 2310, 1490],
    insight: 'The biggest drop is after the first agent run. 64% never invite a teammate.',
  },
  {
    key: 'team',
    label: 'Teams',
    values: [4100, 3570, 2980, 1890, 1210],
    insight: 'Teams convert well. Most drop off at payment, so the plan page matters most here.',
  },
  {
    key: 'solo',
    label: 'Solo',
    values: [8300, 5610, 3440, 420, 280],
    insight: 'Solo users rarely invite anyone. Try a paid plan that does not need a team.',
  },
];

export function FunnelChartExample() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <FunnelChart
        title="Signup to paid"
        stages={STAGES}
        views={VIEWS}
        defaultView="all"
        shareLabel="of signups"
      />
    </div>
  );
}
