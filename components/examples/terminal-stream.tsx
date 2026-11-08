'use client';
import { useEffect, useRef, useState } from 'react';
import {
  TerminalStream,
  type TerminalEntry,
  type TerminalLine,
} from '@visuno/terminal-stream/TerminalStream';

/**
 * Live example for the Terminal stream docs page.
 *
 * The shell commands an agent runs, streaming in: each command arrives running,
 * its output prints line by line, then it settles into a check or an exit code
 * with how long it took. The agent fails a test, writes a note about it, edits
 * the file that is wrong and runs the test again until it passes; then a summary
 * folds in at the foot. A Replay button runs it again.
 *
 * Mirrors the reference run from the vanilla source. Respects
 * prefers-reduced-motion: when motion is reduced, the finished run is shown at
 * once instead of streaming in.
 */

type Step =
  | { kind: 'command'; command: string; ms: number; exit?: number; out: TerminalLine[] }
  | { kind: 'note'; text: string; ms: number }
  | { kind: 'edit'; file: string; added: number; removed: number; diff: string[]; ms: number };

const f = (name: string, kb: string) => `dist/${name.padEnd(22)}${kb.padStart(6)} kB`;

const BUILD: TerminalLine[] = [
  { text: '> acme-web@2.4.0 build', tone: 'muted' },
  { text: '> vite build', tone: 'muted' },
  'vite v6.2.1 building for production...',
  'transforming...',
  { text: '✓ 1284 modules transformed.', tone: 'ok' },
  'rendering chunks...',
  'computing gzip size...',
  ...(
    [
      ['index.html', '0.46'],
      ['assets/Home-1c9e.js', '3.12'],
      ['assets/Pricing-3f9a.js', '12.40'],
      ['assets/Cart-7b21.js', '9.86'],
      ['assets/vendor-8c1e.js', '98.12'],
      ['assets/index-4f2a.js', '42.31'],
      ['assets/index-9b7d.css', '18.92'],
    ] as const
  ).map(([n, kb]) => f(n, kb)),
  { text: '✓ built in 6.1s', tone: 'ok' },
];

const SCRIPT: Step[] = [
  {
    kind: 'command',
    command: 'npm install',
    ms: 1400,
    out: ['added 412 packages in 1.9s', 'found 0 vulnerabilities'],
  },
  { kind: 'command', command: 'npm run build', ms: 2600, out: BUILD },
  {
    kind: 'command',
    command: 'npm test',
    ms: 2200,
    exit: 1,
    out: [
      { text: 'RUN  v3.0.5 ~/acme/web', tone: 'muted' },
      { text: '✓ src/lib/cart.test.ts (14 tests)', tone: 'ok' },
      { text: '× src/lib/price.test.ts (1 failed)', tone: 'bad' },
      { text: '  × formats a yearly price', tone: 'bad' },
      { text: '    Expected: "$240/yr"', tone: 'ok' },
      { text: '    Received: "$240.00/yr"', tone: 'bad' },
      { text: 'Tests  1 failed | 23 passed (24)', tone: 'bad' },
    ],
  },
  {
    kind: 'note',
    text: 'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.',
    ms: 1500,
  },
  {
    kind: 'edit',
    file: 'src/lib/price.ts',
    added: 2,
    removed: 1,
    ms: 1300,
    diff: [
      '- return `$${n.toFixed(2)}/${per}`',
      '+ const v = Number.isInteger(n) ? String(n) : n.toFixed(2)',
      '+ return `$${v}/${per}`',
    ],
  },
  {
    kind: 'command',
    command: 'npm test',
    ms: 1900,
    out: [
      { text: '✓ src/lib/cart.test.ts (14 tests)', tone: 'ok' },
      { text: '✓ src/lib/price.test.ts (10 tests)', tone: 'ok' },
      { text: 'Tests  24 passed (24)', tone: 'ok' },
    ],
  },
];

const sec = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

// the finished run, used when motion is reduced
const DONE: TerminalEntry[] = SCRIPT.map((s) => {
  if (s.kind === 'note') return { kind: 'note', text: s.text };
  if (s.kind === 'edit')
    return { kind: 'edit', file: s.file, added: s.added, removed: s.removed, diff: s.diff, status: 'done' };
  return {
    kind: 'command',
    command: s.command,
    output: s.out,
    status: s.exit ? 'failed' : 'ok',
    exitCode: s.exit,
    duration: sec(s.ms),
  };
});

export function TerminalStreamExample() {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setEntries(DONE);
      setDone(true);
      return;
    }

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms);
      timers.current.push(t);
    };

    setEntries([]);
    setDone(false);
    const current: TerminalEntry[] = [];
    let at = 0;

    const nextStep = () => {
      if (at >= SCRIPT.length) {
        later(() => setDone(true), 400);
        return;
      }
      const s = SCRIPT[at];

      if (s.kind === 'note') {
        current.push({ kind: 'note', text: s.text });
        setEntries([...current]);
        later(() => {
          at += 1;
          nextStep();
        }, s.ms);
        return;
      }

      if (s.kind === 'edit') {
        const idx = current.length;
        current.push({ kind: 'edit', file: s.file, status: 'running' });
        setEntries([...current]);
        later(() => {
          current[idx] = {
            kind: 'edit',
            file: s.file,
            added: s.added,
            removed: s.removed,
            diff: s.diff,
            status: 'done',
          };
          setEntries([...current]);
          at += 1;
          nextStep();
        }, s.ms);
        return;
      }

      // a command: it arrives running, prints its output line by line, then settles
      const idx = current.length;
      current.push({ kind: 'command', command: s.command, output: [], status: 'running' });
      setEntries([...current]);
      const printed: TerminalLine[] = [];
      const per = s.ms / (s.out.length + 1);

      const printLine = (i: number) => {
        if (i >= s.out.length) {
          current[idx] = {
            kind: 'command',
            command: s.command,
            output: s.out,
            status: s.exit ? 'failed' : 'ok',
            exitCode: s.exit,
            duration: sec(s.ms),
          };
          setEntries([...current]);
          at += 1;
          later(nextStep, per);
          return;
        }
        printed.push(s.out[i]);
        current[idx] = {
          kind: 'command',
          command: s.command,
          output: [...printed],
          status: 'running',
          duration: sec(per * (i + 1)),
        };
        setEntries([...current]);
        later(() => printLine(i + 1), per);
      };

      later(() => printLine(0), per);
    };

    later(nextStep, 400);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [runId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <TerminalStream
          cwd="~/acme/web"
          entries={entries}
          elapsed={done ? undefined : '0:06'}
          onStop={() => {}}
          onCopy={() => {}}
        />
      </div>
      {done && (
        <button
          type="button"
          className="dm-pill dm-ghost dm-sm"
          onClick={() => setRunId((n) => n + 1)}
        >
          Replay
        </button>
      )}
    </div>
  );
}
