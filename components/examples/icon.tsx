'use client';
import { useMemo, useState } from 'react';
import { VisunoIcon, ICON_NAMES } from '@visuno/icon/VisunoIcon';

/**
 * Live example for the Icon docs page — a searchable grid over the full set
 * (~5,200 names) using the real Visuno React component. Icons inherit the page
 * text colour via `currentColor`. Click a tile to copy its name.
 */

// A hand-picked starter set shown before you search.
const FEATURED = [
  'chevron-right', 'search', 'circle-check', 'alert-triangle', 'bell', 'settings',
  'user', 'users', 'calendar', 'clock', 'star', 'heart', 'bolt', 'sparkles',
  'rocket', 'folder', 'file-text', 'photo', 'mail', 'send', 'trash', 'pencil',
  'copy', 'external-link', 'eye', 'lock', 'world', 'terminal-2', 'code', 'database',
  'chart-line', 'filter', 'bookmark', 'home', 'command', 'moon', 'palette', 'wand',
];

export function IconExample() {
  const [q, setQ] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  // Show the whole set, with the hand-picked ones first; filter as you type.
  const names = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query) return ICON_NAMES.filter((n) => n.includes(query)).slice(0, 600);
    const seen = new Set(FEATURED);
    return [...FEATURED, ...ICON_NAMES.filter((n) => !seen.has(n))].slice(0, 600);
  }, [q]);

  const copy = (name: string) => {
    try {
      navigator.clipboard?.writeText(name);
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', margin: '20px 0', color: 'inherit' }}>
      {/* Search */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search ${ICON_NAMES.length.toLocaleString()} icons…`}
        aria-label="Search icons"
        style={{
          width: '100%', boxSizing: 'border-box', padding: '9px 12px', fontSize: 14,
          color: 'inherit', background: 'transparent', border: '1px solid var(--fd-border)',
          borderRadius: 8, outline: 'none',
        }}
      />

      {/* Grid */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
          gap: 8, maxHeight: 560, minHeight: 360, overflow: 'auto',
        }}
      >
        {names.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => copy(n)}
            title={`Copy "${n}"`}
            style={{
              display: 'grid', justifyItems: 'center', gap: 8, padding: '14px 6px 10px',
              background: copied === n ? 'var(--fd-accent)' : 'transparent',
              border: '1px solid var(--fd-border)', borderRadius: 8,
              color: 'inherit', cursor: 'pointer', font: 'inherit',
            }}
          >
            <VisunoIcon name={n} size="l" />
            <span
              style={{
                fontSize: 10.5, lineHeight: 1.2, opacity: 0.6, maxWidth: '100%',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {copied === n ? 'Copied!' : n}
            </span>
          </button>
        ))}
        {names.length === 0 && (
          <span style={{ gridColumn: '1 / -1', fontSize: 13, opacity: 0.6, padding: 16 }}>
            No icons match “{q}”.
          </span>
        )}
      </div>
    </div>
  );
}
