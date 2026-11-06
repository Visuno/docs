'use client';
import { useState } from 'react';
import { SegmentedControl } from '@visuno/segmented-control/SegmentedControl';

/**
 * Live example for the Segmented Control docs page.
 *
 * A controlled control as tabs, with a white knob that slides to the picked
 * option, switching a small panel below it. A second one below renders as a
 * radio group (`as="radio"`) for setting an option rather than a view.
 */
const RANGE = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const DENSITY = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'roomy', label: 'Roomy' },
];

const PANELS: Record<string, string> = {
  day: 'Friday, Oct 23',
  week: 'Week 43 — Oct 20 to 26',
  month: 'October 2026',
};

export function SegmentedControlExample() {
  const [range, setRange] = useState('day');
  const [density, setDensity] = useState('cozy');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--dm-6, 24px)',
        width: '100%',
        maxWidth: 420,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dm-3, 12px)' }}>
        <SegmentedControl
          label="Range"
          options={RANGE}
          value={range}
          onValueChange={setRange}
          id="sgc-range"
        />
        <div
          id="sgc-range-panel"
          role="tabpanel"
          aria-labelledby={`sgc-range-${range}`}
          style={{
            padding: 'var(--dm-3, 12px) var(--dm-4, 16px)',
            borderRadius: 'var(--dm-r, 12px)',
            background: 'var(--dm-surface-2, rgba(128,128,128,0.08))',
            fontSize: 14,
          }}
        >
          {PANELS[range]}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--dm-2, 8px)' }}>
        <span style={{ fontSize: 12, color: 'var(--dm-muted)' }}>As a radio group</span>
        <SegmentedControl
          label="Density"
          as="radio"
          options={DENSITY}
          value={density}
          onValueChange={setDensity}
        />
      </div>
    </div>
  );
}
