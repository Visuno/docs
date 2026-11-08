'use client';

import { useEffect, useState } from 'react';
import { VisunoIcon } from '@visuno/icon/VisunoIcon';

/**
 * A floating "back to top" button. Hidden until the page is scrolled past a
 * threshold, then fades in at the bottom-right. Respects prefers-reduced-motion
 * (jumps instead of smooth-scrolling) and is keyboard-focusable.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className="vh-to-top"
      data-visible={visible || undefined}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
    >
      <VisunoIcon name="arrow-up" size="l" />
    </button>
  );
}
