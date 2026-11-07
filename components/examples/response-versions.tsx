'use client';
import { useEffect, useRef, useState } from 'react';
import { ResponseVersions } from '@visuno/response-versions/ResponseVersions';

/**
 * Live example for the Response versions docs page, in the shape of the
 * component's own demo upstream: an answer writes itself in, then one
 * regenerate plays by itself so the version count and arrows show what they do
 * — unless you take over with the arrows or the regenerate button. Respects
 * prefers-reduced-motion. Uses the real Visuno component.
 */
const POOL = [
  'Pricing that grows with your team. Start free, upgrade when the work gets serious.',
  'One plan per stage of your team. No seat math, no surprises on the invoice.',
  'Design faster with an agent on every plan. Pay for what you ship, not for seats.',
  'Simple pricing for teams who ship. Free to start, fair as you grow.',
];

export function ResponseVersionsExample() {
  const [versions, setVersions] = useState<string[]>([POOL[0]]);
  const [version, setVersion] = useState(0);
  const [streaming, setStreaming] = useState(true);
  const [status, setStatus] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const took = useRef(false);

  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const regenerate = () => {
    if (streaming) return;
    took.current = true;
    const next = POOL[versions.length % POOL.length];
    setStatus('Writing a new version');
    setStreaming(true);
    setVersions((v) => [...v, next]);
    setVersion(versions.length);
    after(900, () => {
      setStreaming(false);
      setStatus('');
    });
  };

  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    // the first version finishes writing, then one regenerate plays itself
    after(reduce ? 0 : 900, () => {
      setStreaming(false);
      after(reduce ? 400 : 1900, () => {
        if (!took.current) regenerate();
      });
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <ResponseVersions
        prompt="Write a headline for the pricing page"
        versions={versions}
        version={version}
        onVersionChange={(i) => {
          took.current = true;
          setVersion(i);
        }}
        streaming={streaming}
        status={status}
        onRegenerate={regenerate}
      />
    </div>
  );
}
