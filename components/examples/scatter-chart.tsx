'use client';
import { useEffect, useRef, useState } from 'react';
import { ScatterChart, type ScatterRun, type ScatterSeries } from '@visuno/scatter-chart/ScatterChart';

/**
 * Live example for the Scatter chart docs page, in the shape of the component's
 * own demo: a week of agent runs as dots by cost and eval score, sized by
 * tokens, a colour and a shape per model, with median quadrants. The agent
 * rings three outliers that cost a lot for a middling score, then — unless the
 * viewer prefers reduced motion — a selection of the cheap, high-scoring corner
 * plays in and a canned "Ask the agent why" answer streams. Uses the real
 * Visuno React component.
 */
const SERIES: ScatterSeries[] = [
  { key: 'opus', label: 'Opus', shape: 'circle' },
  { key: 'sonnet', label: 'Sonnet', shape: 'square' },
  { key: 'haiku', label: 'Haiku', shape: 'triangle' },
];

// the week's runs: cost per run in dollars, eval score in %, thousands of tokens
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
const RUNS: ScatterRun[] = [];
let id = 12;
for (let i = 0; i < 15; i++) RUNS.push({ id: id++, series: 'opus', x: 0.3 + rnd(i, 1) * 0.22, y: 85 + rnd(i, 2) * 12, size: 28 + rnd(i, 3) * 30 });
for (let i = 0; i < 18; i++) RUNS.push({ id: id++, series: 'sonnet', x: 0.06 + rnd(i, 4) * 0.22, y: 79 + rnd(i, 5) * 16, size: 12 + rnd(i, 6) * 18 });
for (let i = 0; i < 12; i++) RUNS.push({ id: id++, series: 'haiku', x: 0.02 + rnd(i, 7) * 0.08, y: 64 + rnd(i, 8) * 20, size: 5 + rnd(i, 9) * 8 });
const RINGED = [id, id + 1, id + 2];
RUNS.push({ id: id++, series: 'opus', x: 0.57, y: 73, size: 61 });
RUNS.push({ id: id++, series: 'opus', x: 0.54, y: 70, size: 58 });
RUNS.push({ id: id++, series: 'sonnet', x: 0.47, y: 71, size: 44 });
RUNS.forEach((r) => {
  r.x = Math.round(r.x * 100) / 100;
  r.y = Math.round(r.y);
  r.size = Math.round(r.size);
});

const ANSWER =
  'Most are Opus runs on short tickets, with under 6 tool calls each. Sending tickets like these to Haiku would cut their cost by about 40%.';

export function ScatterChartExample() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // after the dots and the outlier rings settle, select the cheap, high-scoring corner
    timer.current = setTimeout(() => {
      setSelected(RUNS.filter((r) => r.x >= 0.03 && r.x <= 0.2 && r.y >= 88 && r.y <= 97).map((r) => r.id));
    }, 1800);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <ScatterChart
        runs={RUNS}
        series={SERIES}
        subtitle="48 runs this week, sized by tokens"
        ringed={RINGED}
        selected={selected}
        onSelectedChange={setSelected}
        onAsk={() => ANSWER}
      />
    </div>
  );
}
