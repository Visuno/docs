'use client';
import { useState } from 'react';
import { ModelPicker, type ModelOption } from '@visuno/model-picker/ModelPicker';

/**
 * Live example for the Model picker docs page, in the shape of the component's own
 * demo upstream: the same three models and figures as Model compare, with Opus at
 * capacity when it opens. Picking Opus checks it, finds it busy and offers a close
 * match on high thinking; "Use Sonnet on high" takes it. Uses the real Visuno
 * component, held in state here.
 */
const MODELS: ModelOption[] = [
  {
    id: 'opus',
    name: 'Opus 5.5',
    mark: 'O',
    color: 'var(--dm-pl)',
    note: 'Deepest reasoning, slower',
    speed: 2,
    quality: 5,
    cost: 5,
    speedDetail: '38 tokens a second',
    qualityDetail: 'Quality 5 of 5',
    costDetail: '$0.021 a reply',
  },
  {
    id: 'sonnet',
    name: 'Sonnet 5.5',
    mark: 'S',
    color: 'var(--dm-accent)',
    note: 'Balanced, the default for design work',
    speed: 4,
    quality: 4,
    cost: 2,
    speedDetail: '74 tokens a second',
    qualityDetail: 'Quality 4 of 5',
    costDetail: '$0.006 a reply',
  },
  {
    id: 'haiku',
    name: 'Haiku 5.5',
    mark: 'H',
    color: 'var(--dm-pm)',
    note: 'Fastest, for quick edits',
    speed: 5,
    quality: 3,
    cost: 1,
    speedDetail: '142 tokens a second',
    qualityDetail: 'Quality 3 of 5',
    costDetail: '$0.001 a reply',
  },
];

export function ModelPickerExample() {
  const [value, setValue] = useState('sonnet');
  const [effort, setEffort] = useState('Medium');
  const [models, setModels] = useState(MODELS);
  const [suggestion, setSuggestion] = useState<
    { text: string; actions: { label: string; onClick: () => void }[] } | undefined
  >(undefined);
  const [note, setNote] = useState('');

  const setStatus = (id: string, status: ModelOption['status'], statusText?: string) =>
    setModels((all) => all.map((m) => (m.id === id ? { ...m, status, statusText } : m)));

  const pick = (id: string) => {
    if (id !== 'opus') {
      setValue(id);
      setSuggestion(undefined);
      const m = MODELS.find((x) => x.id === id)!;
      setNote(`Set for this chat: ${m.name}, ${effort.toLowerCase()} thinking`);
      return;
    }
    // Opus is at capacity: check it, then offer a close match that starts now
    setNote('');
    setStatus('opus', 'checking', 'Checking it can take this chat');
    setTimeout(() => {
      setStatus('opus', 'busy', 'At capacity, about 20s wait');
      setSuggestion({
        text: 'Opus 5.5 is at capacity for about 20s. Sonnet 5.5 on high thinking comes close on long reviews and starts now.',
        actions: [
          { label: 'Wait for Opus', onClick: () => {} },
          {
            label: 'Use Sonnet on high',
            onClick: () => {
              setEffort('High');
              setValue('sonnet');
              setSuggestion(undefined);
              setStatus('opus', 'ready');
              setNote('Set for this chat: Sonnet 5.5, high thinking');
            },
          },
        ],
      });
    }, 1000);
  };

  return (
    <ModelPicker
      models={models}
      value={value}
      onValueChange={pick}
      effort={effort}
      onEffortChange={(e) => {
        setEffort(e);
        setNote('');
      }}
      suggestion={suggestion}
      note={note}
    />
  );
}
