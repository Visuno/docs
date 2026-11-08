'use client';
import { RadarChart } from '@visuno/radar-chart/RadarChart';

/**
 * Live example for the Radar chart docs page. This run against the baseline on
 * six eval scores: the baseline draws itself as an outline, then this run grows
 * out of the middle filled over it, weak axes flagged in words. Pointing at (or
 * tabbing to) an axis shows its two scores and the change in the line below, and
 * the legend shows and hides either series. The draw-in and the grow-in are the
 * component's own and respect prefers-reduced-motion. Uses the real Visuno React
 * component.
 */
const AXES = [
  { label: 'Accuracy', value: 88, baseline: 84 },
  { label: 'Instruction following', short: 'Instructions', value: 86, baseline: 80 },
  { label: 'Tool use', value: 62, baseline: 78 },
  { label: 'Speed', value: 74, baseline: 66 },
  { label: 'Cost efficiency', short: 'Cost', value: 82, baseline: 58 },
  { label: 'Safety', value: 91, baseline: 90 },
];

export function RadarChartExample() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <RadarChart
        axes={AXES}
        title="Eval scores"
        subtitle="Run 48 against run 41"
        pulse={2}
        note="Cheaper and faster, weaker at tool use (−16). It skipped the search tool on 7 of 40 tasks."
      />
    </div>
  );
}
