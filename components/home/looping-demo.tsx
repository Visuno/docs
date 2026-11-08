'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Landing-page only: keeps a live demo looping, but ONLY while it is on screen.
 * Many of the real example components play their intro animation once on mount
 * and then settle, which is fine on a docs page but looks frozen in a wall of
 * preview cards. This wrapper remounts its child on an interval by bumping a
 * React `key`, so each demo replays from the start.
 *
 * To save the browser's power with ~80 cards on the page, an IntersectionObserver
 * pauses the loop (and stops the demo running) whenever the card scrolls out of
 * view, and restarts it from the top when it comes back. It does nothing for
 * visitors who prefer reduced motion — they keep the single, settled play-through.
 */
export function LoopingDemo({
  children,
  intervalMs = 9000,
}: {
  children: ReactNode;
  intervalMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);

  // Track whether the card is in the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== 'function') {
      setVisible(true); // no observer support — just let it run
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only tick (and thus remount) while visible and motion is allowed.
  useEffect(() => {
    if (!visible) return;
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    // Replay from the top as soon as it becomes visible, then keep looping.
    setRun((r) => r + 1);
    const t = setInterval(() => setRun((r) => r + 1), intervalMs);
    return () => clearInterval(t);
  }, [visible, intervalMs]);

  // The key change unmounts and remounts the subtree, restarting its animation.
  // The wrapper is a real, full-size box (not display:contents) so the observer
  // has something to watch; while off screen we render nothing, so the demo isn't
  // animating in the background.
  return (
    <div ref={ref} style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      {visible ? <div key={run} style={{ display: 'contents' }}>{children}</div> : null}
    </div>
  );
}
