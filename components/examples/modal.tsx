'use client';
import { useState } from 'react';
import { Modal } from '@visuno/modal/Modal';
import { Button } from '@visuno/buttons/Buttons';

/**
 * Live example for the Modal docs page. Buttons open a centred dialog over a
 * dimmed backdrop; it closes on the backdrop, the close button or Escape. One
 * opens a plain panel, the other a confirm dialog with a footer button row.
 * Uses the real Visuno React component.
 */
export function ModalExample() {
  const [view, setView] = useState<null | 'info' | 'confirm'>(null);
  const [deleted, setDeleted] = useState(false);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', width: '100%' }}>
      <Button variant="soft" size="sm" onClick={() => setView('info')}>
        Run details
      </Button>
      <Button variant="soft" size="sm" onClick={() => setView('confirm')}>
        Delete project…
      </Button>
      {deleted && <span style={{ fontSize: 13, color: 'var(--vo-muted)', alignSelf: 'center' }}>Project deleted.</span>}

      <Modal
        open={view === 'info'}
        onClose={() => setView(null)}
        title="Run details"
        subtitle="Finished in 12m 40s"
        size="sm"
      >
        <p style={{ margin: 0, fontSize: 14, color: 'var(--vo-fg2)', lineHeight: 1.5 }}>
          The agent updated 6 files across 14 steps, using 182k tokens for about
          $0.84. Everything passed; one item is left for you to review.
        </p>
      </Modal>

      <Modal
        open={view === 'confirm'}
        onClose={() => setView(null)}
        title="Delete this project?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setView(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDeleted(true);
                setView(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: 14, color: 'var(--vo-fg2)', lineHeight: 1.5 }}>
          This removes the project and all its runs. This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
