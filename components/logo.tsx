import Image from 'next/image';
import { appName } from '@/lib/shared';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Wordmark that follows the theme: the dark-ink logo in light mode, and the
 * light (white-wordmark) logo in dark mode. Both are rendered and CSS shows the
 * right one off the `.dark` class Fumadocs/next-themes sets on <html>, so there
 * is no hydration flash and no client JS. The gradient "V" mark is identical in
 * both files; only the "Visuno" wordmark flips.
 */
export function Logo() {
  return (
    <span className="visuno-logo" aria-label={appName}>
      <Image
        className="visuno-logo-dark-ink"
        src={`${base}/logo-with-text.png`}
        alt={appName}
        width={180}
        height={48}
        priority
        style={{ height: 40, width: 'auto' }}
      />
      <Image
        className="visuno-logo-light-ink"
        src={`${base}/logo-with-text-light.png`}
        alt={appName}
        width={180}
        height={48}
        priority
        style={{ height: 40, width: 'auto' }}
      />
    </span>
  );
}
