'use client';
import { useState } from 'react';
import { DatePicker, type DatePickerRange } from '@visuno/date-picker/DatePicker';

/**
 * Live example for the Date picker docs page. Two controls: a single-day field
 * that opens a calendar with quick picks and a box that understands "next
 * friday", and the same component in `range` mode — two months with ready-made
 * ranges, a live preview as you hover, and Apply. Uses the real Visuno
 * component. `today` is pinned so the demo reads the same on the server and the
 * client.
 */
const TODAY = new Date(2026, 9, 23);

export function DatePickerExample() {
  const [day, setDay] = useState<Date | null>(TODAY);
  const [range, setRange] = useState<DatePickerRange>({
    start: new Date(2026, 9, 1),
    end: new Date(2026, 9, 23),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vo-6, 24px)', width: '100%', maxWidth: 420 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vo-2, 8px)' }}>
        <span style={{ fontSize: 12, color: 'var(--vo-muted)' }}>Single day</span>
        <DatePicker today={TODAY} value={day} onValueChange={setDay} defaultMonth={TODAY} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vo-2, 8px)' }}>
        <span style={{ fontSize: 12, color: 'var(--vo-muted)' }}>Date range</span>
        <DatePicker range today={TODAY} rangeValue={range} onRangeChange={setRange} />
      </div>
    </div>
  );
}
