'use client';
import { BarChart } from '@visuno/bar-chart/BarChart';

/**
 * Live example for the Bar chart docs page. A week and a month of agent runs,
 * each bar split into shipped / reviewed / failed, with a range switch that
 * redraws the bars left to right and rolls the total. Uses the real Visuno
 * React component; its grow-in respects prefers-reduced-motion on its own.
 */
const SERIES = [
  { label: 'Shipped', tipLabel: 'shipped' },
  { label: 'Needed review', tipLabel: 'reviewed' },
  { label: 'Failed', tipLabel: 'failed' },
];

const RANGES = [
  {
    key: 'w',
    label: 'Week',
    bars: [
      { label: 'Mon', values: [42, 9, 2] },
      { label: 'Tue', values: [51, 12, 3] },
      { label: 'Wed', values: [48, 8, 1] },
      { label: 'Thu', values: [63, 10, 4] },
      { label: 'Fri', values: [57, 14, 2] },
      { label: 'Sat', values: [18, 3, 0] },
      { label: 'Sun', values: [12, 2, 1] },
    ],
  },
  {
    key: 'm',
    label: 'Month',
    bars: [
      { label: 'W1', values: [180, 40, 9] },
      { label: 'W2', values: [210, 44, 12] },
      { label: 'W3', values: [236, 51, 8] },
      { label: 'W4', values: [262, 48, 10] },
      { label: 'W5', values: [251, 39, 6] },
      { label: 'W6', values: [298, 52, 7] },
      { label: 'W7', values: [321, 47, 5] },
    ],
  },
];

export function BarChartExample() {
  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <BarChart
        label="Agent runs"
        series={SERIES}
        ranges={RANGES}
        defaultRange="w"
        unit="runs"
        stacked
      />
    </div>
  );
}
