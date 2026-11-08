import type { ReactNode } from 'react';

/**
 * A continuous, auto-scrolling marquee of the four frameworks Visuno ships for.
 * The logos are inline SVGs drawn in a single ink color (currentColor), so they
 * render black-and-white and follow the Fumadocs theme in both light and dark.
 * The track is duplicated once and translated by -50% so the loop is seamless;
 * it pauses on hover and respects prefers-reduced-motion (handled in home.css).
 */

type Framework = { name: string; note: string; logo: ReactNode };

const FRAMEWORKS: Framework[] = [
  {
    name: 'React',
    note: 'React 18+',
    logo: (
      <svg viewBox="-24 -24 48 48" aria-hidden="true" className="vh-fs-logo">
        <circle r="4" fill="currentColor" />
        <g fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse rx="22" ry="8.4" />
          <ellipse rx="22" ry="8.4" transform="rotate(60)" />
          <ellipse rx="22" ry="8.4" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'Angular',
    note: 'Standalone, 17+',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <path
          d="M24 3 4 10l3 26 17 9 17-9 3-26z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 10 12 37h4.3l2.5-6.2h10.4L31.7 37H36zM20.5 27l3.5-8.6L27.5 27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: 'Flutter',
    note: 'Native Dart widgets',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <path
          d="M33 4 14 23l6 6L39 10zM33 23 23 33l6 6 10-10z"
          fill="currentColor"
          opacity="0.55"
        />
        <path d="M14 23 8 29l6 6 6-6z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    note: 'React — App & Pages Router',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 32V16l18 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 16v13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Remix',
    note: 'React — drop-in',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <path
          d="M11 7h16c6 0 10 3.4 10 9 0 4-2.2 6.6-5.6 7.6 3.6.7 5.2 2.8 5.2 7V41h-8v-9.2c0-2.8-1.3-4-4.6-4H19V41h-8z"
          fill="currentColor"
        />
        <path d="M29 41v-6.5c3.6 0 6.4 1.7 8 6.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Gatsby',
    note: 'React — static sites',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 10v28M10 24h28" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 3a21 21 0 0 0 0 42" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    name: 'Astro',
    note: 'React islands',
    logo: (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="vh-fs-logo">
        <path d="M24 4 35 40l-11-7-11 7z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 20c4 0 6 2.4 6 5.4 0 2-1 3.4-2.6 4.2.6-2 .2-3.6-1-4.8-1.2-1.2-5-1.2-6.4.6-.8-2.6.8-5.4 4-5.4z" fill="currentColor" />
      </svg>
    ),
  },
];

export function FrameworkSlider() {
  // Duplicate the list so the -50% translate loop is seamless.
  const track = [...FRAMEWORKS, ...FRAMEWORKS];

  return (
    <section className="vh-fs" aria-label="Frameworks we ship for">
      <div className="vh-fs-viewport">
        <ul className="vh-fs-track">
          {track.map((f, i) => (
            <li className="vh-fs-item" key={`${f.name}-${i}`} aria-hidden={i >= FRAMEWORKS.length}>
              {f.logo}
              <span className="vh-fs-meta">
                <span className="vh-fs-name">{f.name}</span>
                <span className="vh-fs-note">{f.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
