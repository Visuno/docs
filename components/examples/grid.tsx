'use client';
import { useEffect, useState } from 'react';
import { Grid, GridItem } from '@visuno/grid/Grid';

/**
 * Live example for the Grid docs page. A grid of numbered cells that cycles its
 * column count (3 → 2 → 4) so the reflow is easy to read, plus one cell that
 * spans two columns. Uses the real Visuno React component.
 */
const COLS = [3, 2, 4];

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: 56,
        background: 'var(--dm-chip)',
        borderRadius: 'var(--dm-r-box)',
        color: 'var(--dm-fg2)',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  );
}

export function GridExample() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setStep((s) => (s + 1) % COLS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Grid cols={COLS[step]} gap={3}>
        <GridItem span={2}>
          <Cell>span 2</Cell>
        </GridItem>
        <Cell>1</Cell>
        <Cell>2</Cell>
        <Cell>3</Cell>
        <Cell>4</Cell>
        <Cell>5</Cell>
      </Grid>
    </div>
  );
}
