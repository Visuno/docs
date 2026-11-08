'use client';
import { useEffect, useRef, useState } from 'react';
import { RadialGoals, type RadialGoal } from '@visuno/radial-goals/RadialGoals';

/**
 * Live example for the Radial goals docs page. Three agents, each a ring that is
 * its share of its own target, with the overall score in the middle. A Week /
 * Month switch repaints every ring; the example flips it on its own (a slow,
 * calm loop) unless the viewer prefers reduced motion. Uses the real Visuno
 * React component.
 */
const WEEK: RadialGoal[] = [
  { key: 'support', label: 'Support agent', unit: 'tickets', value: 412, target: 375 },
  { key: 'qa', label: 'QA agent', unit: 'checks', value: 136, target: 160 },
  { key: 'research', label: 'Research agent', unit: 'reports', value: 18, target: 24 },
];

const MONTH: RadialGoal[] = [
  { key: 'support', label: 'Support agent', unit: 'tickets', value: 1490, target: 1600 },
  { key: 'qa', label: 'QA agent', unit: 'checks', value: 702, target: 640 },
  { key: 'research', label: 'Research agent', unit: 'reports', value: 71, target: 96 },
];

const RANGES = [
  { value: 'w', label: 'Week' },
  { value: 'm', label: 'Month' },
];

export function RadialGoalsExample() {
  const [range, setRange] = useState<'w' | 'm'>('w');
  const paused = useRef(false);

  useEffect(() => {
    if (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // drift between the week and the month so the rings keep moving
    const id = setInterval(() => {
      if (!paused.current) setRange((r) => (r === 'w' ? 'm' : 'w'));
    }, 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{ width: '100%', maxWidth: 440 }}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <RadialGoals
        goals={range === 'w' ? WEEK : MONTH}
        subtitle={range === 'w' ? 'This week' : 'This month'}
        ranges={RANGES}
        range={range}
        onRangeChange={(r) => setRange(r as 'w' | 'm')}
      />
    </div>
  );
}
