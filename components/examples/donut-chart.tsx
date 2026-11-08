'use client';
import { DonutChart } from '@visuno/donut-chart/DonutChart';

/**
 * Live example for the Donut chart docs page. Where an agent's time went, by
 * kind of task: a ring of segments that sweep in one by one with a legend, and
 * hovering either a segment or its row highlights both and shows it in the
 * middle. The draw-in and count-up are the component's own and respect
 * prefers-reduced-motion. Uses the real Visuno React component.
 */
const SEGMENTS = [
  { label: 'Design reviews', value: 14.2 },
  { label: 'Code changes', value: 9.6 },
  { label: 'Research', value: 6.1 },
  { label: 'Copy edits', value: 3.4 },
  { label: 'Other', value: 1.7, color: 'var(--vo-faint)' },
];

export function DonutChartExample() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <DonutChart segments={SEGMENTS} label="Agent time" unit="h" />
    </div>
  );
}
