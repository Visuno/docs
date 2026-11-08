'use client';
import { LineChart } from '@visuno/line-chart/LineChart';

/**
 * Live example for the Line chart docs page. Two series of monthly active
 * editors — this year against last — with the solid main line drawn in from the
 * left over a soft fill, the big number counting up, a pointer readout that
 * follows the cursor and a legend that toggles the series (one always stays on).
 * Uses the real Visuno React component.
 */
const POINTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SERIES = [
  {
    key: 'this',
    label: 'This year',
    values: [820, 860, 910, 980, 1040, 1130, 1210, 1180, 1320, 1460, 1540, 1620],
  },
  {
    key: 'last',
    label: 'Last year',
    values: [610, 640, 660, 700, 690, 760, 800, 790, 850, 880, 910, 960],
  },
];

export function LineChartExample() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <LineChart
        label="Active editors"
        series={SERIES}
        points={POINTS}
        axis={['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']}
        unit="editors"
        compareLabel="vs last year"
      />
    </div>
  );
}
