'use client';
import { useState, type ReactNode } from 'react';

/**
 * A live example stage for a component. Renders its children (a real Visuno React
 * component) centered on a surface, with a toggle for the Soft style
 * (data-style="soft"). The light/dark theme always follows the docs page's own
 * theme (set as data-theme on <html> by ThemeBridge) — never the browser
 * preference — and is inherited here, not toggled per preview.
 */
export function Preview({ children }: { children: ReactNode }) {
  const [soft, setSoft] = useState(true);

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-fd-border">
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/40 px-3 py-2">
        <span className="text-xs font-medium text-fd-muted-foreground">Preview</span>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => setSoft((s) => !s)}
          className="rounded-md border border-fd-border px-2 py-1 text-xs hover:bg-fd-accent"
        >
          {soft ? 'Soft' : 'Blueprint'}
        </button>
      </div>
      <div
        data-style={soft ? 'soft' : undefined}
        className="grid min-h-45 place-items-center p-8"
        style={{ background: 'var(--vo-stage)' }}
      >
        {children}
      </div>
    </div>
  );
}
