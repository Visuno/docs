'use client';
import { useMemo, useState } from 'react';
import { SearchInput, type SearchResult } from '@visuno/search-input/SearchInput';

/**
 * Live example for the Search input docs page — the real Visuno React component
 * wired to a small in-memory index, with scope chips, recent queries and an
 * inline agent answer. Colours come from the page (currentColor / --fd-*).
 */
const INDEX: Record<string, SearchResult[]> = {
  docs: [
    { value: 'getting-started', label: 'Getting started', detail: 'Docs · Introduction', icon: 'file-text' },
    { value: 'tokens', label: 'Design tokens', detail: 'Docs · Theming', icon: 'file-text' },
    { value: 'changelog', label: 'Changelog', detail: 'Docs · Resources', icon: 'file-text' },
  ],
  code: [
    { value: 'search-input', label: 'SearchInput.tsx', detail: 'react/search-input', icon: 'code' },
    { value: 'icons', label: 'icons.tsx', detail: 'react/lib', icon: 'code' },
    { value: 'core', label: 'core.css', detail: 'vanilla/core', icon: 'code' },
  ],
  people: [
    { value: 'maya', label: 'Maya Chen', detail: 'Design lead', icon: 'user' },
    { value: 'sam', label: 'Sam Rivera', detail: 'Engineering', icon: 'user' },
  ],
};

const SCOPES = [
  { value: 'all', label: 'All' },
  { value: 'docs', label: 'Docs', icon: 'file-text' as const },
  { value: 'code', label: 'Code', icon: 'code' as const },
  { value: 'people', label: 'People', icon: 'user' as const },
];

export function SearchInputExample() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const pool = scope === 'all' ? Object.values(INDEX).flat() : INDEX[scope] ?? [];
    return pool
      .filter((r) => `${r.label} ${r.detail}`.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, scope]);

  const answer =
    query.trim() && results.length
      ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} for “${query.trim()}” in ${scope === 'all' ? 'everything' : scope}.`
      : undefined;

  return (
    <div style={{ margin: '20px 0', minHeight: 360 }}>
      <SearchInput
        placeholder="Search docs, code and people…"
        scopes={SCOPES}
        scope={scope}
        onScopeChange={setScope}
        value={query}
        onValueChange={setQuery}
        results={results}
        recent={['design tokens', 'dark mode', 'status pill']}
        answer={answer}
        onSearch={(q, s) => setQuery(q)}
        onSelect={(v) => undefined}
      />
    </div>
  );
}
