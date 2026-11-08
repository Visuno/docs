'use client';
import { TopPages } from '@visuno/top-pages/TopPages';

/**
 * Live example for the Top pages docs page, in the shape of the component's own
 * demo on upstream: the six most visited pages of a site with their views and
 * change, a running total that rolls up, and a Views / Change sort switch that
 * slides the rows into their new order. The rows fade in and the share bars
 * fill on their own, and the component respects prefers-reduced-motion. Uses
 * the real Visuno React component.
 */
const PAGES = [
  { path: '/pricing', title: 'Pricing', views: 18420, change: 24 },
  { path: '/', title: 'Home', views: 15210, change: 3 },
  { path: '/components', title: 'Components', views: 9870, change: 41 },
  { path: '/docs/agent', title: 'Agent docs', views: 6340, change: -8 },
  { path: '/blog/soft-ui', title: 'Soft UI, the post', views: 4120, change: 112 },
  { path: '/changelog', title: 'Changelog', views: 2210, change: -14 },
];

export function TopPagesExample() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <TopPages pages={PAGES} site="visuno.dev" period="last 30 days" />
    </div>
  );
}
