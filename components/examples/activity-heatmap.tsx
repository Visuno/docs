'use client';
import { ActivityHeatmap, type ActivityHeatmapSeries } from '@visuno/activity-heatmap/ActivityHeatmap';

/**
 * Live example for the Activity heatmap docs page, in the shape of the
 * component's own demo on upstream demo: two series — the agent and the team —
 * each a 7x24 grid of values, with a switch that sweeps the new series in from
 * the top left. The cells fill in as a wave a moment after the card appears;
 * all of it respects prefers-reduced-motion through the component. Uses the
 * real Visuno React component.
 *
 * The values are generated the same way as the vanilla reference: busy overnight
 * for the agent (the queue runs), 10am–4pm on weekdays for the team.
 */
function gen(who: 'agent' | 'team'): number[] {
  const a: number[] = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      let v =
        who === 'agent'
          ? h >= 1 && h <= 5
            ? 0.75
            : h >= 9 && h <= 18
              ? 0.45
              : 0.15
          : h >= 9 && h <= 18
            ? 0.65
            : h >= 19 && h <= 22
              ? 0.2
              : 0.03;
      if (d >= 5) v *= who === 'agent' ? 0.8 : 0.2;
      if (who === 'agent' && d === 0 && h === 9) v = 1;
      v = Math.max(0, Math.min(1, v + Math.sin(d * 7.1 + h * 3.3) * 0.18));
      a.push(v);
    }
  }
  return a;
}

const SERIES: ActivityHeatmapSeries[] = [
  {
    key: 'agent',
    label: 'Agent',
    values: gen('agent'),
    max: 40,
    unit: 'runs',
    note: 'Busiest overnight, when the queue runs',
  },
  {
    key: 'team',
    label: 'Team',
    values: gen('team'),
    max: 25,
    unit: 'edits',
    note: 'Busiest 10am to 4pm on weekdays',
  },
];

export function ActivityHeatmapExample() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <ActivityHeatmap series={SERIES} defaultValue="agent" period="Last 4 weeks" />
    </div>
  );
}
