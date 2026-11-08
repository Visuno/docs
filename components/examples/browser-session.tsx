'use client';
import { useEffect, useReducer, useRef, useState } from 'react';
import { BrowserSession, type BrowserStep } from '@visuno/browser-session/BrowserSession';

/**
 * Live example for the Browser session docs page.
 *
 * The agent browsing for pricing, step by step: it searches, opens the site,
 * goes to the pricing page and then stops at a cookie banner covering the
 * table, asking before it touches it. Allow closing it lets the agent finish
 * and read the three prices; Pause and Take over stay live throughout.
 *
 * Respects prefers-reduced-motion: when motion is reduced it rests on the
 * finished state instead of advancing on timers.
 */

type Phase = 'search' | 'home' | 'pricing' | 'blocked' | 'reading' | 'done';

const PAGES: Record<string, string> = {
  search: 'northwind pricing',
  home: 'northwind.app',
  pricing: 'northwind.app/pricing',
};

function stepsFor(phase: Phase): BrowserStep[] {
  const done = (label: string, detail?: string): BrowserStep => ({ label, state: 'done', detail });
  const run = (label: string, detail?: string): BrowserStep => ({ label, state: 'running', detail });
  const wait = (label: string, detail?: string): BrowserStep => ({ label, state: 'waiting', detail });
  const queued = (label: string): BrowserStep => ({ label, state: 'queued' });

  switch (phase) {
    case 'search':
      return [run('Search "northwind pricing"'), queued('Open northwind.app'), queued('Click "Pricing"'), queued('Read the plans table'), queued('Extract prices')];
    case 'home':
      return [done('Search "northwind pricing"'), run('Open northwind.app'), queued('Click "Pricing"'), queued('Read the plans table'), queued('Extract prices')];
    case 'pricing':
      return [done('Search "northwind pricing"'), done('Open northwind.app'), run('Click "Pricing"'), queued('Read the plans table'), queued('Extract prices')];
    case 'blocked':
      return [done('Search "northwind pricing"'), done('Open northwind.app'), done('Click "Pricing"'), wait('Read the plans table', 'A cookie banner covers the table'), queued('Extract prices')];
    case 'reading':
      return [done('Search "northwind pricing"'), done('Open northwind.app'), done('Click "Pricing"'), done('Read the plans table', '3 plans, priced per seat'), run('Extract prices', '3 of 3 prices')];
    case 'done':
      return [done('Search "northwind pricing"'), done('Open northwind.app'), done('Click "Pricing"'), done('Read the plans table', '3 plans, priced per seat'), done('Extract prices', '$8, $16 and $32 per seat')];
  }
}

// a tiny wireframe of the page the agent is on
function Page({ phase }: { phase: Phase }) {
  if (phase === 'search') {
    return (
      <div className="vo-bws-pg">
        <div className="vo-bws-q">northwind pricing</div>
        <div className="vo-bws-res"><b>Northwind · Docs your team reads</b><span>northwind.app</span></div>
        <div className="vo-bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
        <div className="vo-bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div>
      </div>
    );
  }
  if (phase === 'home') {
    return (
      <div className="vo-bws-pg">
        <div className="vo-bws-nav"><b>Northwind</b><span>Product</span><span>Pricing</span><span>Docs</span></div>
        <div className="vo-bws-hd">Docs your team actually reads</div>
        <span className="vo-bws-ln" style={{ width: '92%' }} />
        <span className="vo-bws-ln" style={{ width: '68%' }} />
        <span className="vo-bws-cta">Start free</span>
      </div>
    );
  }
  // pricing, blocked, reading and done all show the pricing page
  const hit = phase === 'reading' || phase === 'done';
  return (
    <div className="vo-bws-pg">
      <div className="vo-bws-nav"><b>Northwind</b><span>Product</span><span className="vo-on">Pricing</span><span>Docs</span></div>
      <div className="vo-bws-hd">Plans and pricing</div>
      <span className="vo-bws-ln" style={{ width: '78%' }} />
      <div className="vo-bws-tb">
        <div><span>Plan</span><span>Per seat, monthly</span></div>
        <div><span>Starter</span><span className={'vo-num' + (hit ? ' vo-hit' : '')}>$8</span></div>
        <div><span>Team</span><span className={'vo-num' + (hit ? ' vo-hit' : '')}>$16</span></div>
        <div><span>Business</span><span className={'vo-num' + (hit ? ' vo-hit' : '')}>$32</span></div>
      </div>
      <span className="vo-bws-ln" style={{ width: '64%' }} />
    </div>
  );
}

export function BrowserSessionExample() {
  const [phase, setPhase] = useState<Phase>('search');
  const [tick, replay] = useReducer((n: number) => n + 1, 0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setPhase('done');
      return;
    }
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };
    setPhase('search');
    later(() => setPhase('home'), 1800);
    later(() => setPhase('pricing'), 3200);
    later(() => setPhase('blocked'), 4400); // waits here for Allow
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [tick]);

  const onAllow = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('reading');
    const t = setTimeout(() => setPhase('done'), 1600);
    timers.current.push(t);
  };

  const search = phase === 'search';
  const url = search ? PAGES.search : phase === 'home' ? PAGES.home : PAGES.pricing;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <BrowserSession
        title="Pricing research"
        url={url}
        search={search}
        steps={stepsFor(phase)}
        summary="Done · 3 prices saved to Pricing research"
        ask={phase === 'blocked' ? { label: 'Allow closing it', onAllow } : undefined}
      >
        <Page phase={phase} />
      </BrowserSession>
      {phase === 'done' && (
        <button type="button" className="vo-pill vo-ghost vo-sm" onClick={replay}>
          Replay
        </button>
      )}
    </div>
  );
}
