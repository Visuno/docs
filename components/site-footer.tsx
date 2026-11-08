import Link from 'next/link';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Global site footer, shown on every page. Keeps the home page's original
 * footer content (MIT licence, Star on GitHub, Imprint, "Powered by SDK
 * Industries") and adds a link to the machine-readable docs (llms.txt).
 */
export function SiteFooter() {
  return (
    <footer className="vh-footer vh-site-footer">
      <div className="vh-site-footer-inner">
        <div>
          Open source under the MIT licence.{" "}
          <a
            href="https://github.com/Visuno/components"
            className="vh-footer-link"
          >
            Star on GitHub
          </a>
          .{" "}
          <a href={`${base}/llms.txt`} className="vh-footer-link">
            llms.txt
          </a>
          .{" "}
          <Link href="/docs/imprint" className="vh-footer-link">
            Imprint
          </Link>
        </div>
        <a
          href="https://sdkindustries.de"
          target="_blank"
          rel="noreferrer"
          className="vh-poweredby"
        >
          <span>Powered by</span>
          {/* Theme-aware: dark-ink mark on light background, light mark on dark. */}
          <img
            className="vh-sdk-logo vh-sdk-logo-dark-ink"
            src="https://sdkindustries.de/logo-dark.svg"
            alt="SDK Industries"
            height={20}
          />
          <img
            className="vh-sdk-logo vh-sdk-logo-light-ink"
            src="https://sdkindustries.de/logo.svg"
            alt="SDK Industries"
            height={20}
          />
        </a>
      </div>
    </footer>
  );
}
