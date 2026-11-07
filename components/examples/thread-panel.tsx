'use client';
import { useEffect, useRef, useState } from 'react';
import { ThreadPanel, type Thread, type ThreadMessage } from '@visuno/thread-panel/ThreadPanel';

/**
 * Live example for the Thread panel docs page, in the shape of the component's own
 * demo upstream: three agent threads, each a tab, with the open one's reply field
 * below it. Once the panel has settled it types a follow-up by itself and sends it,
 * the agent thinks, then answers — unless the reader has started typing, which takes
 * over. Respects prefers-reduced-motion (then it fills the draft without the typing).
 * Uses the real Visuno component.
 */
const INITIAL: Thread[] = [
  {
    id: 'onboarding',
    title: 'Onboarding',
    color: 'var(--dm-ok-mark)',
    messages: [
      { from: 'user', text: 'Why is the workspace step losing people?' },
      {
        from: 'agent',
        text:
          'It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.',
        sources: [
          { label: 'Funnel data', tip: 'Amplitude, last 30 days' },
          { label: 'Session notes', tip: 'Notion, 8 interviews' },
        ],
      },
    ],
  },
  {
    id: 'tokens',
    title: 'Tokens',
    color: 'var(--dm-warn-mark)',
    messages: [
      { from: 'user', text: 'Which colours are still hard-coded?' },
      {
        from: 'agent',
        text: 'Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.',
        sources: [{ label: 'tokens.ts', tip: 'src/styles/tokens.ts' }],
      },
    ],
  },
  {
    id: 'launch',
    title: 'Launch email',
    color: 'var(--dm-faint)',
    messages: [
      { from: 'user', text: 'Draft the launch email for Friday.' },
      {
        from: 'agent',
        text: 'Two subject lines are ready. The shorter one tested better with the team.',
      },
    ],
  },
];

const REPLY = 'Can you make that change now?';

export function ThreadPanelExample() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL);
  const [cur, setCur] = useState('onboarding');
  const [draft, setDraft] = useState('');
  const took = useRef(false); // the reader took over, so the auto-demo stops

  const takeOver = () => {
    took.current = true;
  };

  const add = (threadId: string, m: ThreadMessage) =>
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, m] } : t)),
    );

  const handleSend = (text: string, threadId: string) => {
    add(threadId, { from: 'user', text });
    add(threadId, { from: 'agent', text: 'Thinking', thinking: true });
    window.setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [
                  ...t.messages.filter((m) => !m.thinking),
                  { from: 'agent', text: "On it. I'll update this thread when it's done." },
                ],
              }
            : t,
        ),
      );
    }, 1400);
  };

  // once the panel has settled, type a reply in place and send it, unless the reader
  // has already started using it; reduced motion fills the draft without the typing
  useEffect(() => {
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        if (took.current) return;
        if (reduce) {
          setDraft(REPLY);
          timers.push(
            window.setTimeout(() => {
              if (took.current) return;
              handleSend(REPLY, cur);
              setDraft('');
            }, 500),
          );
          return;
        }
        let i = 0;
        const type = () => {
          if (took.current) return;
          i += 1;
          setDraft(REPLY.slice(0, i));
          if (i < REPLY.length) {
            timers.push(window.setTimeout(type, 32 + Math.random() * 40));
          } else {
            timers.push(
              window.setTimeout(() => {
                if (took.current) return;
                handleSend(REPLY, cur);
                setDraft('');
              }, 380),
            );
          }
        };
        type();
      }, 1800),
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
    // run once, on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <ThreadPanel
        threads={threads}
        value={cur}
        onValueChange={(id) => {
          takeOver();
          setCur(id);
        }}
        draft={draft}
        onDraftChange={(text) => {
          takeOver();
          setDraft(text);
        }}
        onSend={handleSend}
        bare={false}
      />
    </div>
  );
}
