'use client';
import { useState } from 'react';
import { EventCalendar, type EventCalendarEvent, type EventCalendarSuggestion } from '@visuno/event-calendar/EventCalendar';

/**
 * Live example for the Event calendar docs page — the launch week (Mon Oct 19
 * to Fri Oct 23, 2026) of events you can drag to another time or day, add to by
 * clicking free time, and open for details. The agent can look for a free slot
 * and suggest one; Book adds it. Uses the real Visuno component. `week` and
 * `now` are pinned so the demo reads the same on the server and the client.
 */
const WEEK = new Date(2026, 9, 19); // Monday
const NOW = new Date(2026, 9, 23, 10, 42); // Friday 10:42
const d = (day: number, h: number, m = 0) => new Date(2026, 9, 19 + day, h, m);

const EVENTS: EventCalendarEvent[] = [
  { id: 'kickoff', title: 'Kickoff with Maya', start: d(0, 10), end: d(0, 11), tone: 'purple', people: [{ initials: 'MK', color: 'var(--vo-av-l)' }] },
  { id: 'wireframe', title: 'Wireframe review', start: d(1, 10), end: d(1, 11, 30), tone: 'purple' },
  { id: 'tokens', title: 'Token audit', start: d(1, 14), end: d(1, 15), tone: 'green' },
  { id: 'copy', title: 'Copy pass', start: d(2, 11), end: d(2, 12), tone: 'teal' },
  { id: 'qa', title: 'Design QA', start: d(3, 14), end: d(3, 15, 30), tone: 'blue', people: [{ initials: 'DB', color: 'var(--vo-av-t)' }] },
  { id: 'review', title: 'Pricing review', start: d(4, 9, 30), end: d(4, 10), tone: 'purple', people: [{ initials: 'MK', color: 'var(--vo-av-l)' }, { initials: 'SR', color: 'var(--vo-av-p)' }] },
  { id: 'ship', title: 'Ship pricing v4', start: d(4, 16), end: d(4, 17), tone: 'blue' },
];

const SUGGESTIONS: EventCalendarSuggestion[] = [
  { id: 's1', title: 'Design review', start: d(3, 11), end: d(3, 11, 45) },
  { id: 's2', title: 'Design review', start: d(2, 15), end: d(2, 15, 45) },
];

export function EventCalendarExample() {
  const [events, setEvents] = useState(EVENTS);
  const [finding, setFinding] = useState(false);
  const [suggestions, setSuggestions] = useState<EventCalendarSuggestion[]>([]);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const ask = () => {
    setFinding(true);
    setStatus('Looking for 45 min this week…');
    setTimeout(() => {
      setFinding(false);
      setSuggestions(SUGGESTIONS);
      setStatus('Found 2 open slots');
    }, 1400);
  };

  const book = (s: EventCalendarSuggestion) => {
    setEvents(prev => [...prev, { id: s.id, title: s.title, start: s.start, end: s.end, tone: 'orange' }]);
    setSuggestions([]);
    setStatus(`Booked ${s.title}`);
  };

  const skip = (s: EventCalendarSuggestion) => {
    setSuggestions(prev => prev.filter(x => x.id !== s.id));
  };

  return (
    <div style={{ width: '100%' }}>
      <EventCalendar
        week={WEEK}
        now={NOW}
        events={events}
        onEventsChange={setEvents}
        askLabel="Find 45 min for a design review"
        onAsk={ask}
        finding={finding}
        suggestions={suggestions}
        onBook={book}
        onSkip={skip}
        status={status}
        onPrepNotes={ev => `Pulled context for “${ev.title}”: latest build is green, 3 talking points ready.`}
        onJoin={() => {}}
      />
    </div>
  );
}
