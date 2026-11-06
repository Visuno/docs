'use client';
import { useEffect, useRef, useState } from 'react';
import { ContextMeter, type ContextPart } from '@visuno/context-meter/ContextMeter';

/**
 * Live example for the Context meter docs page, in the shape of the component's
 * own upstream demo: it opens on its real numbers, new tool output lands
 * and pushes the context close to its limit with a warning, then Compact turns
 * older turns into a summary and frees room with a green result. Uses the real
 * Visuno React component. Respects prefers-reduced-motion (no auto tool output).
 */
const LIMIT = 200000;

const BASE: ContextPart[] = [
  { key: 'files', label: 'Files', tokens: 56200, color: 'var(--dm-pb)', items: 'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
  { key: 'tools', label: 'Tool output', tokens: 41800, color: 'var(--dm-pt)', items: 'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
  { key: 'chat', label: 'Chat', tokens: 32100, color: 'var(--dm-pl)', items: '48 turns with Maya Kim since 09:12' },
  { key: 'sys', label: 'Instructions', tokens: 6300, color: 'var(--dm-faint)', items: 'Studio guidelines 4.1k, pricing brief 2.2k' },
];

const set = (parts: ContextPart[], key: string, tokens: number): ContextPart[] =>
  parts.map((p) => (p.key === key ? { ...p, tokens } : p));

export function ContextMeterExample() {
  const [parts, setParts] = useState(BASE);
  const [message, setMessage] = useState<string | undefined>();
  const [tone, setTone] = useState<'warn' | 'ok'>('warn');
  const [compacted, setCompacted] = useState(false);
  const [hint, setHint] = useState('Summarises older turns');
  const before = useRef<ContextPart[]>(BASE);

  const sum = (ps: ContextPart[]) => ps.reduce((t, p) => t + p.tokens, 0);
  const k = (n: number) => (n / 1000).toFixed(1) + 'k';

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // new tool output lands and takes the context close to its limit
    const t = setTimeout(() => {
      setParts((ps) => {
        const next = set(ps, 'tools', 41800 + 38500);
        setMessage(`${Math.round((sum(next) / LIMIT) * 100)}% full. Older turns start to drop at 200k`);
        setTone('warn');
        return next;
      });
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  const onCompact = async () => {
    before.current = parts;
    const was = sum(parts);
    setHint('Summarising 48 turns');
    await new Promise((r) => setTimeout(r, 1000));
    const next = set(set(parts, 'chat', 4600), 'tools', parts[1].tokens - 13700);
    setParts(next);
    setMessage(`Freed ${k(was - sum(next))} tokens. 9 decisions kept`);
    setTone('ok');
    setHint('Older turns are now a summary');
    setCompacted(true);
  };

  const onUndo = () => {
    setParts(before.current);
    setMessage(undefined);
    setHint('Summarises older turns');
    setCompacted(false);
  };

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <ContextMeter
        parts={parts}
        limit={LIMIT}
        message={message}
        messageTone={tone}
        compacted={compacted}
        hint={hint}
        onCompact={onCompact}
        onUndo={onUndo}
      />
    </div>
  );
}
