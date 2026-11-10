'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SegmentedControl } from '@visuno/segmented-control/SegmentedControl';
import { cx } from '@visuno/lib/cx';
import { Icon } from '@visuno/lib/icons';
import { Swap } from '@visuno/lib/motion';

/**
 * Live example for the Segmented Control docs page.
 *
 * A "Pricing launch" planner driven from React state: the control switches the
 * panel below it between a day agenda, a week list and a month grid, with a
 * Today button and prev/next steppers. Picking a day in the week or month view
 * opens that day. This mirrors the reference demo and exercises the real panel
 * styles the component ships with.
 */

type View = 'day' | 'week' | 'month';
type Ev = [time: string, title: string, detail: string, color: string];

// the pricing launch in October 2026. Today is Friday the 23rd
const TODAY = new Date(2026, 9, 23, 12);
const DAY = 864e5;
const at = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const same = (a: Date, b: Date) => iso(a) === iso(b);
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);
const mon = (d: Date) => at(d, -((d.getDay() + 6) % 7));

// launch week is written out; the days around it are drawn from the work that leads up to it and follows it
const E: Record<string, Ev[]> = {
  '2026-10-19': [['10:00', 'Kickoff with Maya', 'Pricing v4 brief', 'var(--vo-pl)'], ['15:00', 'Brief the agents', 'Build and copy agents', 'var(--vo-pm)']],
  '2026-10-20': [['10:00', 'Wireframe review', 'Pricing v4, frames 1 to 6', 'var(--vo-pl)'], ['11:30', 'Copy for the plan cards', 'Copy agent', 'var(--vo-pt)'], ['14:00', 'Token audit', 'Build agent', 'var(--vo-pm)']],
  '2026-10-21': [['11:00', 'Copy pass', 'Plan cards and FAQ', 'var(--vo-pt)']],
  '2026-10-22': [['14:00', 'Design QA', 'Pricing v4, all frames', 'var(--vo-pb)'], ['16:30', 'Fix contrast issues', 'Build agent', 'var(--vo-pm)']],
  '2026-10-23': [['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--vo-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--vo-pm)'], ['16:00', 'Ship pricing v4', 'visuno.dev/pricing', 'var(--vo-pb)']],
  '2026-10-24': [],
  '2026-10-25': [],
};

const POOL: [string, string, string][] = [
  ['Design crit', 'Pricing frames', 'var(--vo-pl)'],
  ['Token audit', 'Build agent', 'var(--vo-pm)'],
  ['Copy pass', 'Plan cards', 'var(--vo-pt)'],
  ['Stakeholder check-in', 'Weekly', 'var(--vo-pb)'],
  ['User interviews', 'Three sessions', 'var(--vo-pl)'],
  ['Conversion review', 'Trial to paid', 'var(--vo-pb)'],
  ['Research synthesis', 'Notes and quotes', 'var(--vo-pt)'],
  ['Fix review notes', 'Build agent', 'var(--vo-pm)'],
];
const TIMES = ['09:30', '10:00', '11:30', '13:00', '14:00', '15:30', '16:00'];

// events for a day: the written-out ones, or a stable pseudo-random set seeded by the date
function events(d: Date): Ev[] {
  const k = iso(d);
  if (E[k]) return E[k];
  if (d.getDay() === 0 || d.getDay() === 6) return (E[k] = []);
  let h = (Math.floor(+d / DAY) * 2654435761) >>> 0;
  const nx = (m: number) => { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; return h % m; };
  const n = [0, 1, 1, 2, 2, 3][nx(6)];
  const t = new Set<string>();
  while (t.size < n) t.add(TIMES[nx(TIMES.length)]);
  return (E[k] = [...t].sort().map(tm => { const e = POOL[nx(POOL.length)]; return [tm, e[0], e[1], e[2]] as Ev; }));
}

const evLabel = (d: Date, n: number) =>
  `${fmt(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${n ? n + (n === 1 ? ' event' : ' events') : 'nothing planned'}`;

const RANGE_LABEL: Record<View, (d: Date) => string> = {
  day: d => fmt(d, { weekday: 'long', month: 'short', day: 'numeric' }),
  week: d => {
    const a = mon(d), b = at(a, 4);
    return fmt(a, { month: 'short', day: 'numeric' }) + ' – ' + (a.getMonth() === b.getMonth() ? b.getDate() : fmt(b, { month: 'short', day: 'numeric' }));
  },
  month: d => fmt(d, { month: 'long', year: 'numeric' }),
};

// a day in the week or the month opens that day
function Panel({ view, date, open }: { view: View; date: Date; open: (d: Date) => void }) {
  if (view === 'day') {
    const ev = events(date);
    return ev.length ? (
      <div className="vo-sgc-day">
        {ev.map(([t, n, d, c]) => (
          <div key={t} className="vo-sgc-ev" style={{ '--vo-c': c } as CSSProperties}>
            <span className="vo-num vo-muted">{t}</span>
            <i />
            <span className="vo-t">{n}<span>{d}</span></span>
          </div>
        ))}
      </div>
    ) : (
      <div className="vo-sgc-none">Nothing planned</div>
    );
  }
  if (view === 'week') {
    return (
      <div className="vo-sgc-wk">
        {Array.from({ length: 5 }, (_, i) => at(mon(date), i)).map(d => {
          const ev = events(d);
          return (
            <button key={iso(d)} type="button" aria-label={evLabel(d, ev.length)} onClick={() => open(d)}
              className={cx('vo-sgc-wr', same(d, TODAY) && 'vo-now', !ev.length && 'vo-none')}>
              <span className="vo-d">{fmt(d, { weekday: 'short' })} {d.getDate()}</span>
              {ev.length ? (
                <>
                  <span className="vo-e" style={{ '--vo-c': ev[0][3] } as CSSProperties}><i /><span>{ev[0][1]}</span></span>
                  {ev.length > 1 && <span className="vo-more">+{ev.length - 1} more</span>}
                </>
              ) : (
                <span className="vo-e">Nothing planned</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
  const first = new Date(date.getFullYear(), date.getMonth(), 1, 12);
  const lead = (first.getDay() + 6) % 7;
  const len = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return (
    <div className={cx('vo-sgc-mo', lead + len > 35 && 'vo-r6')}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="vo-w" aria-hidden="true">{w}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {Array.from({ length: len }, (_, i) => {
        const d = at(first, i), n = events(d).length;
        return (
          <button key={i} type="button" aria-label={evLabel(d, n)} onClick={() => open(d)}
            className={cx('vo-d', 'vo-num', n && 'vo-e', same(d, TODAY) && 'vo-now', same(d, date) && !same(d, TODAY) && 'vo-on')}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControlExample() {
  const [view, setView] = useState<View>('day');
  const [date, setDate] = useState(TODAY);

  // the panel on show, and the one it replaced while that fades out under the new one, so no frame is empty
  const key = view + iso(date);
  const [layers, setLayers] = useState([{ key, view, date, gone: false }]);
  if (layers[layers.length - 1].key !== key) {
    setLayers([...layers.filter(l => !l.gone).slice(-1).map(l => ({ ...l, gone: true })), { key, view, date, gone: false }]);
  }
  useEffect(() => {
    if (!layers.some(l => l.gone)) return;
    const t = setTimeout(() => setLayers(ls => ls.filter(l => !l.gone)), 260);
    return () => clearTimeout(t);
  }, [layers]);

  // previous and next step by the view's unit; Today comes back to the 23rd
  const step = (k: number) => setDate(d =>
    view === 'day' ? at(d, k) : view === 'week' ? at(d, 7 * k) : new Date(d.getFullYear(), d.getMonth() + k, 1, 12));
  const open = (d: Date) => { setDate(d); setView('day'); };

  return (
    <div data-vo="" className="vo-sgc vo-panel" style={{ width: '100%' }}>
      <div className="vo-sgc-h">
        <div className="vo-sgc-ht"><b>Pricing launch</b></div>
        <SegmentedControl
          id="launch-view"
          label="View"
          value={view}
          onValueChange={v => setView(v as View)}
          options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
        />
      </div>
      <div className="vo-sgc-bar">
        <span className="vo-sgc-r" aria-live="polite"><Swap>{RANGE_LABEL[view](date)}</Swap></span>
        <button type="button" className="vo-pill vo-ghost vo-sm vo-sgc-td" onClick={() => setDate(TODAY)}>Today</button>
        <button type="button" className="vo-ib vo-sgc-pv" aria-label={'Previous ' + view} onClick={() => step(-1)}><Icon name="chevron-left" size="xs" /></button>
        <button type="button" className="vo-ib vo-sgc-nx" aria-label={'Next ' + view} onClick={() => step(1)}><Icon name="chevron-right" size="xs" /></button>
      </div>
      <div className="vo-sgc-p" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
        {layers.map((l, i) => (
          <div key={l.key} className={cx('vo-sgc-in', l.gone ? 'vo-gone' : i > 0 && 'vo-fresh')} inert={l.gone} aria-hidden={l.gone || undefined}>
            <Panel view={l.view} date={l.date} open={open} />
          </div>
        ))}
      </div>
    </div>
  );
}
