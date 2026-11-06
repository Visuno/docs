'use client';
import { ThinkingStates } from '@visuno/thinking-states/ThinkingStates';

/**
 * Live example for the Thinking States docs page.
 *
 * The six indicators shown side by side, each a small animated mark beside a
 * status line that steps through what an agent is doing. The lines auto-rotate
 * on their own (no `current` set), so every card is inherently animated.
 */
const STEPS = ['Thinking', 'Reading 3 files', 'Planning the change', 'Writing the patch'];

const VARIANTS: { variant: 'orbit' | 'morph' | 'scan' | 'stream' | 'matrix' | 'stack'; name: string }[] =
  [
    { variant: 'orbit', name: 'Orbit' },
    { variant: 'morph', name: 'Morph' },
    { variant: 'scan', name: 'Scan' },
    { variant: 'stream', name: 'Stream' },
    { variant: 'matrix', name: 'Matrix' },
    { variant: 'stack', name: 'Stack' },
  ];

export function ThinkingStatesExample() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 'var(--dm-5, 20px)',
        width: '100%',
        maxWidth: 560,
      }}
    >
      {VARIANTS.map((v) => (
        <div
          key={v.variant}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--dm-2, 8px)',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--dm-muted)' }}>{v.name}</span>
          <ThinkingStates variant={v.variant} steps={STEPS} interval={2600} />
        </div>
      ))}
    </div>
  );
}
