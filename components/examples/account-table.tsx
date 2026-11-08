'use client';
import { useEffect, useRef, useState } from 'react';
import { AccountTable, type AccountTableAccount } from '@visuno/account-table/AccountTable';

/**
 * Live example for the Account table docs page, in the shape of the component's
 * own demo upstream: customer accounts you can search and filter by plan, each
 * row opening to the agent's note with a Draft email button that spins until it
 * settles. One account opens on its own a moment in, unless you take over first.
 * Respects prefers-reduced-motion. Uses the real Visuno component.
 */
const ACCOUNTS: AccountTableAccount[] = [
  { name: 'Northwind', color: 'var(--vo-av-b)', plan: 'Enterprise', seats: 120, health: 92, mrr: '$14,400', note: 'Expanding. Design team added 18 seats this month.' },
  { name: 'Lumen Labs', color: 'var(--vo-av-l)', plan: 'Pro', seats: 14, health: 48, mrr: '$672', note: 'Usage fell 40% after their lead designer left. Worth a check in.' },
  { name: 'Fable & Co', color: 'var(--vo-av-m)', plan: 'Team', seats: 32, health: 81, mrr: '$1,920', note: 'Steady. Asked about the Figma sync twice.' },
  { name: 'Orbit', color: 'var(--vo-av-p)', plan: 'Pro', seats: 8, health: 67, mrr: '$384', note: 'Trial of the agent ends Friday. 3 runs so far.' },
  { name: 'Kite Health', color: 'var(--vo-av-r)', plan: 'Enterprise', seats: 64, health: 88, mrr: '$7,680', note: 'Renewal in 6 weeks, champion is happy.' },
  { name: 'Paper Plane', color: 'var(--vo-av-t)', plan: 'Team', seats: 21, health: 34, mrr: '$1,260', note: 'Two failed payments. Billing contact bounced.' },
];

export function AccountTableExample() {
  const [open, setOpen] = useState<string | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // the preview opens one account's note on its own, unless you take over first
    const t = setTimeout(() => {
      if (!touched.current) setOpen('Lumen Labs');
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <AccountTable
        accounts={ACCOUNTS}
        open={open}
        onOpenChange={(name) => {
          touched.current = true;
          setOpen(name);
        }}
        action={{
          label: 'Draft email',
          doneLabel: 'Draft ready',
          onClick: () => new Promise((resolve) => setTimeout(resolve, 800)),
        }}
      />
    </div>
  );
}
