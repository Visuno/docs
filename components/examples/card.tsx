'use client';
import { useState } from 'react';
import { Card } from '@visuno/card/Card';
import { Badge } from '@visuno/badge/Badge';

/**
 * Live example for the Card docs page. Shows the three faces of a card:
 *  - a full card with a header (title, subtitle, a status badge in the end
 *    slot), a body and a footer of actions;
 *  - an interactive card whose whole surface is the hit target — it lifts on
 *    hover, takes focus, and counts its own taps.
 * Uses the real Visuno React component.
 */
export function CardExample() {
  const [opens, setOpens] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 420 }}>
      <Card
        title="Nightly run"
        subtitle="Finished 4 minutes ago"
        action={<Badge tone="success" dot className="vo-live">Live</Badge>}
        footer={
          <>
            <button type="button" className="vo-pill vo-ghost vo-sm">Dismiss</button>
            <button type="button" className="vo-pill vo-sm" data-variant="accent">Open run</button>
          </>
        }
      >
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          A card is a surface you drop other components onto — a header, a body and a footer, each
          optional. Put anything inside: text, badges, charts, a table.
        </p>
      </Card>

      <Card interactive onClick={() => setOpens((n) => n + 1)}>
        <span className="vo-crd-t">Interactive card</span>
        <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--vo-muted)' }}>
          The whole card is the hit target — it lifts on hover and takes focus.
          {opens > 0 && ` Opened ${opens}×.`}
        </p>
      </Card>
    </div>
  );
}
