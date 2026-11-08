'use client';
import { useState } from 'react';
import { NumberField } from '@visuno/number-field/NumberField';

/**
 * Live example for the Number field docs page — the real Visuno React
 * component. Shows a plain counter, a unit field with limits, and a disabled
 * one. Colours follow the page text (currentColor / Fumadocs tokens).
 */
export function NumberFieldExample() {
  const [qty, setQty] = useState(2);
  const [opacity, setOpacity] = useState(60);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 28,
        alignItems: 'flex-start',
        margin: '20px 0',
        color: 'inherit',
      }}
    >
      <NumberField label="Quantity" value={qty} min={1} max={99} onChange={setQty} />
      <NumberField
        label="Opacity"
        value={opacity}
        min={0}
        max={100}
        step={5}
        unit="%"
        onChange={setOpacity}
      />
      <NumberField label="Seats" defaultValue={10} min={1} max={50} size="sm" />
      <NumberField label="Locked" value={8} min={0} max={20} disabled />
    </div>
  );
}
