'use client';
import { Tooltip } from '@visuno/tooltip/Tooltip';

/**
 * Live example for the Tooltip docs page. An editor toolbar in two groups,
 * each button with a tip and a shortcut, then a row of collaborator avatars
 * whose hover cards describe the person — one of them an agent, shown with
 * its thinking dots. Uses the real Visuno React component.
 */
const GROUPS = [
  [
    { key: 'undo', icon: 'arrow-back-up' as const, label: 'Undo', kbd: '⌘Z' },
    { key: 'redo', icon: 'arrow-forward-up' as const, label: 'Redo', kbd: '⌘⇧Z' },
    { key: 'comment', icon: 'message' as const, label: 'Comment', tip: 'Leave a comment', kbd: 'C' },
  ],
  [
    { key: 'ask', icon: 'sparkles' as const, label: 'Ask agent', tip: 'Ask the agent', kbd: '⌘J' },
    { key: 'search', icon: 'search' as const, label: 'Search', kbd: '⌘K' },
    { key: 'share', icon: 'users' as const, label: 'Share', tip: 'Share with your team' },
  ],
];

const PEOPLE = [
  {
    key: 'mira',
    initials: 'MC',
    color: 'var(--vo-av-l)',
    name: 'Mira Chen',
    role: 'Design lead',
    status: 'Editing Pricing, frame 2',
  },
  {
    key: 'theo',
    initials: 'TK',
    color: 'var(--vo-av-m)',
    name: 'Theo Kent',
    role: 'Engineer',
    status: 'Viewing the changelog',
  },
  {
    key: 'agent',
    initials: 'AI',
    color: 'var(--vo-av-p)',
    name: 'Visuno agent',
    role: 'Assistant',
    status: 'Drafting release notes',
    working: true,
  },
];

export function TooltipExample() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingBottom: 120 }}>
      <Tooltip groups={GROUPS} people={PEOPLE} note="Hover a button for its tip, or an avatar for the person." />
    </div>
  );
}
