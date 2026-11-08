'use client';
import { useState } from 'react';
import { Slider } from '@visuno/slider/Slider';

/**
 * Live example for the Slider docs page — a single value, a stepped scale with
 * named stops and an agent "recommended" marker, and a two-thumb range. Uses the
 * real Visuno React component; labels inherit the page text colour.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <span style={{ width: 70, flex: 'none', fontSize: 12, opacity: 0.6, paddingTop: 1 }}>{label}</span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );
}

const STOPS = [
  { value: 0, label: 'Off' },
  { value: 20, label: 'Ask' },
  { value: 40, label: 'Low' },
  { value: 60, label: 'Med' },
  { value: 80, label: 'High' },
  { value: 100, label: 'Full' },
];

export function SliderExample() {
  const [quality, setQuality] = useState(40);
  const [autonomy, setAutonomy] = useState(60);
  const [budget, setBudget] = useState<[number, number]>([20, 70]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', maxWidth: 520, margin: '20px 0', color: 'inherit' }}>
      <Row label="Value">
        <Slider label="Quality" value={quality} onValueChange={setQuality} showValue />
      </Row>

      <Row label="Steps">
        <Slider
          label="Autonomy"
          step={20}
          value={autonomy}
          onValueChange={setAutonomy}
          stops={STOPS}
          recommended={80}
          recommendedLabel="Recommended"
        />
      </Row>

      <Row label="Range">
        <Slider
          label="Budget"
          step={5}
          range={budget}
          onRangeChange={setBudget}
          format={(v) => `$${v}`}
          showValue
        />
      </Row>
    </div>
  );
}
