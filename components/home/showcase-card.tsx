import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * A single advertised component: its real, live example running on a soft stage,
 * with the name and a "View" affordance, linking to the component's docs page.
 * The live demo sits in a non-interactive, clipped stage so animations play but
 * nothing inside steals the click from the card link.
 */
export function ShowcaseCard({
  title,
  slug,
  children,
}: {
  title: string;
  slug: string;
  children: ReactNode;
}) {
  return (
    <Link href={`/docs/components/${slug}`} className="vh-sc" aria-label={`${title} — view docs`}>
      <div className="vh-sc-stage" aria-hidden="true" data-style="soft">
        <div className="vh-sc-inner">{children}</div>
      </div>
      <div className="vh-sc-foot">
        <span className="vh-sc-name">{title}</span>
        <span className="vh-sc-view">
          View
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
