'use client';
import { useEffect, useRef, useState } from 'react';
import { DetailsPanel, type DetailsPanelSection } from '@visuno/details-panel/DetailsPanel';

/**
 * Live example for the Details panel docs page, in the shape of the component's own
 * demo upstream: a run's Properties (status, owner, model, due date and labels) over
 * its Usage (tokens, cost, run time). The status, owner and model are edited in place
 * from small menus; picking a model rolls the token and cost figures to that model's
 * numbers, and the add button drops in another label. Once the panel has shown, the
 * figures count up from zero — unless a model was picked first. Uses the real Visuno
 * component, held in state here. Respects prefers-reduced-motion.
 */

// per model: [tokens, cost], matching the Vanilla demo's figures
const COST: Record<string, [number, number]> = {
  Opus: [184200, 2.76],
  Sonnet: [184200, 0.55],
  Haiku: [184200, 0.15],
};

const EXTRA_LABELS: { label: string; tone: 'yellow' | 'teal' | 'red' }[] = [
  { label: 'Q4', tone: 'yellow' },
  { label: 'A/B test', tone: 'teal' },
  { label: 'Urgent', tone: 'red' },
];

export function DetailsPanelExample() {
  const [model, setModel] = useState('Opus');
  const [tokens, setTokens] = useState(0);
  const [cost, setCost] = useState(0);
  const [labelIndex, setLabelIndex] = useState(0);
  const counted = useRef(false);

  // once the panel has shown, the figures count up — unless a model was picked already
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const show = (m: string) => {
      counted.current = true;
      setTokens(COST[m][0]);
      setCost(COST[m][1]);
    };
    if (reduce) {
      show('Opus');
      return;
    }
    const t = setTimeout(() => {
      if (!counted.current) show('Opus');
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const pickModel = (value: string) => {
    counted.current = true;
    setModel(value);
    setTokens(COST[value][0]);
    setCost(COST[value][1]);
  };

  const labels: { label: string; tone: 'blue' | 'purple' | 'yellow' | 'teal' | 'red' }[] = [
    { label: 'Pricing', tone: 'blue' },
    { label: 'Web', tone: 'purple' },
    ...EXTRA_LABELS.slice(0, labelIndex),
  ];

  const sections: DetailsPanelSection[] = [
    {
      key: 'props',
      title: 'Properties',
      rows: [
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          defaultValue: 'review',
          options: [
            { value: 'progress', label: 'In progress', color: 'var(--vo-py)' },
            { value: 'review', label: 'In review', color: 'var(--vo-accent-mark, var(--vo-accent))' },
            { value: 'shipped', label: 'Shipped', color: 'var(--vo-ok)' },
          ],
        },
        {
          key: 'owner',
          label: 'Owner',
          type: 'select',
          defaultValue: 'maya',
          options: [
            { value: 'maya', label: 'Maya Kim', avatar: { initials: 'MK', color: 'var(--vo-av-l)' } },
            { value: 'jon', label: 'Jon Ortiz', avatar: { initials: 'JO', color: 'var(--vo-av-m)' } },
            { value: 'agent', label: 'Design agent', avatar: { initials: 'DA', color: 'var(--vo-av-b)' } },
          ],
        },
        {
          key: 'model',
          label: 'Model',
          type: 'select',
          value: model,
          onValueChange: pickModel,
          options: [
            { value: 'Opus', label: 'Opus', detail: 'Best for design' },
            { value: 'Sonnet', label: 'Sonnet', detail: 'Faster, cheaper' },
            { value: 'Haiku', label: 'Haiku', detail: 'Quick edits' },
          ],
        },
        { key: 'due', label: 'Due', value: 'Oct 24' },
        {
          key: 'labels',
          label: 'Labels',
          type: 'tags',
          tags: labels,
          addLabel: 'Add label',
          onAdd: () => setLabelIndex((i) => Math.min(i + 1, EXTRA_LABELS.length)),
        },
      ],
    },
    {
      key: 'usage',
      title: 'Usage',
      rows: [
        { key: 'tokens', label: 'Tokens', type: 'number', value: tokens },
        { key: 'cost', label: 'Cost', type: 'number', value: cost, format: (n) => '$' + n.toFixed(2) },
        { key: 'time', label: 'Run time', value: '4m 12s' },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <DetailsPanel title="Pricing page redesign" kind="RUN" copyValue="run_8f2a" sections={sections} />
    </div>
  );
}
