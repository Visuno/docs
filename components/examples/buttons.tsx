'use client';
import { useState } from 'react';
import { Button, ButtonCopy } from '@visuno/buttons/Buttons';

/**
 * Live example for the Buttons docs page, mirroring the component's own sheet on
 * upstream demo: a row of every variant, the three sizes, and the running states —
 * a button whose onClick returns a promise so it drives its own busy -> done
 * animation, a green `success` done face, a `pressed` toggle, and a copy button.
 * Uses the real Visuno components.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 64, flex: 'none', fontSize: 12, color: 'var(--vo-muted)' }}>{label}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>{children}</div>
    </div>
  );
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ButtonsExample() {
  const [on, setOn] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 480 }}>
      <Row label="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="accent">Accent</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="line">Line</Button>
        <Button variant="ghost">Ghost</Button>
      </Row>

      <Row label="Sizes">
        <Button variant="accent" size="sm">Small</Button>
        <Button variant="accent">Default</Button>
        <Button variant="accent" size="lg">Large</Button>
      </Row>

      <Row label="States">
        <Button
          variant="primary"
          icon="spark"
          busyLabel="Publishing"
          doneLabel="Published"
          onClick={() => wait(1200)}
        >
          Publish
        </Button>
        <Button
          variant="accent"
          success
          busyLabel="Saving"
          doneLabel="Saved"
          onClick={() => wait(1200)}
        >
          Save
        </Button>
        <Button variant="soft" pressed={on} onClick={() => setOn((v) => !v)}>
          Preview
        </Button>
        <Button variant="accent" disabled>Disabled</Button>
      </Row>

      <Row label="Copy">
        <ButtonCopy text="https://example.com" label="Copy link" />
      </Row>
    </div>
  );
}
