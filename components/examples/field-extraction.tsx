'use client';
import { useEffect, useRef, useState } from 'react';
import {
  FieldExtraction,
  FieldZone,
  type ExtractedField,
} from '@visuno/field-extraction/FieldExtraction';

/**
 * Live example for the Field extraction docs page, in the shape of the component's
 * own demo upstream: the agent reads an invoice, revealing one field at a time with
 * a scan line between each, lighting the source region as each one lands. The last
 * field is unsure, so it asks the person to check it; once every field is sure the
 * Send button turns on, and pressing it runs through sending and sent. Uses the real
 * Visuno component. Respects prefers-reduced-motion by revealing everything at once.
 */

// the fields the agent finds, in the order it reads them off the page
const FIELDS: ExtractedField[] = [
  { key: 'no', label: 'Invoice no.', value: 'NW-2041', confidence: 0.99 },
  { key: 'date', label: 'Issued', value: '3 Oct 2026', confidence: 0.97 },
  { key: 'total', label: 'Total', value: '$11,480.00', confidence: 0.98 },
  { key: 'due', label: 'Due by', value: '1? Nov 2026', confidence: 0.41, suggestion: '1? Nov 2026' },
];

// the invoice on the left; the parts the fields come from are wrapped in FieldZone
const Page = (
  <>
    <div className="vo-fex-top">
      <b>Northwind Studio</b>
      <span className="vo-muted">Invoice</span>
    </div>
    <FieldZone field="no">
      <span className="vo-muted">Invoice no.</span> <span className="vo-num">NW-2041</span>
    </FieldZone>
    <FieldZone field="date">
      <span className="vo-muted">Issued</span> <span className="vo-num">3 Oct 2026</span>
    </FieldZone>
    <div className="vo-fex-tb">
      <div className="vo-fex-li"><span>Design system audit</span><span className="vo-num">$4,800.00</span></div>
      <div className="vo-fex-li"><span>Pricing page redesign</span><span className="vo-num">$6,200.00</span></div>
      <div className="vo-fex-li"><span>Agent setup, 2 seats</span><span className="vo-num">$480.00</span></div>
    </div>
    <FieldZone field="total" className="vo-fex-tot">
      <span>Total due</span><span className="vo-num">$11,480.00</span>
    </FieldZone>
    <FieldZone field="due" className="vo-fex-smudge">
      <span className="vo-muted">Due by</span> <span className="vo-num">1? Nov 2026</span>
    </FieldZone>
  </>
);

type SendState = 'idle' | 'sending' | 'sent';

export function FieldExtractionExample() {
  const [count, setCount] = useState(0);
  const [reading, setReading] = useState(false);
  const [status, setStatus] = useState('Reading page 1');
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [sendState, setSendState] = useState<SendState>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // reveal the fields one by one, with a scan line between each
  useEffect(() => {
    const reduced =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const push = (fn: () => void, at: number) => timers.current.push(setTimeout(fn, reduced ? 0 : at));

    setReading(true);
    push(() => setReading(false), 300);
    FIELDS.forEach((_, i) => {
      push(() => {
        setFields(FIELDS.slice(0, i + 1));
        if (i === FIELDS.length - 1) setStatus('1 field needs a look');
      }, 600 + i * 620);
    });

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // the person checks the unsure field: mark it fixed and confirm all fields
  const onFix = (key: string, value: string) => {
    const day = /\d\d/.test(value) ? value : '14 Nov 2026';
    setFields((fs) => fs.map((f) => (f.key === key ? { ...f, value: day, fixed: true } : f)));
    setStatus('All fields confirmed');
  };

  const onSend = () => {
    setSendState('sending');
    timers.current.push(
      setTimeout(() => {
        setSendState('sent');
        setStatus('1 row added to Invoices 2026');
      }, 800)
    );
  };

  const replay = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFields([]);
    setSendState('idle');
    setStatus('Reading page 1');
    setCount((n) => n + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <FieldExtraction
        page={Page}
        fields={fields}
        reading={reading}
        status={status}
        checkHint="Type the day you see"
        onFix={onFix}
        sendLabel="Send to Sheets"
        sendState={sendState}
        sentLabel="Added to Invoices"
        onSend={onSend}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button type="button" className="vo-pill vo-soft vo-sm" onClick={replay}>
          Replay
        </button>
      </div>
    </div>
  );
}
