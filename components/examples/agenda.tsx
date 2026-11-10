'use client';
import { Agenda, type AgendaItem } from '@visuno/agenda/Agenda';

/**
 * Live example for the Agenda docs page — today's schedule with a live now
 * line and the notes the agent prepared for each event. Uses the real Visuno
 * React component. Past events fade back; the now line sits after the last one
 * that is over; opening an event reveals the agent's prep and a Join action.
 */
const ITEMS: AgendaItem[] = [
  {
    time: '09:30',
    title: 'Pricing review with Maya',
    detail: '30 min · Zoom',
    past: true,
    people: [
      { initials: 'MK', color: 'var(--vo-av-l)' },
      { initials: 'SR', color: 'var(--vo-av-p)' },
    ],
  },
  {
    time: '11:00',
    title: 'Agent demo',
    detail: '45 min · Room 2',
    people: [{ initials: 'DB', color: 'var(--vo-av-t)' }],
    notes: [
      'Pulled the three latest build runs; all green since Tuesday.',
      'Drafted talking points from the pricing v4 brief.',
      'Flagged one open question on annual discounts for Maya.',
    ],
    action: { label: 'Join in 18 min' },
  },
  {
    time: '13:00',
    title: 'Export tokens to CSS',
    detail: 'Build agent',
    notes: ['Will run after the demo and open a PR against the docs repo.'],
  },
  {
    time: '16:00',
    title: 'Ship pricing v4',
    detail: 'visuno.dev/pricing',
    people: [
      { initials: 'MK', color: 'var(--vo-av-l)' },
      { initials: 'DB', color: 'var(--vo-av-t)' },
    ],
  },
];

export function AgendaExample() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <Agenda
        title="Today"
        subtitle="Friday, Oct 23"
        now="10:42"
        items={ITEMS}
        defaultOpen="Agent demo"
      />
    </div>
  );
}
