'use client';
import { useTheme } from 'fumadocs-ui/provider/base';
import { useEffect } from 'react';

/**
 * Bridges the docs site theme (Fumadocs / next-themes toggles `html.dark`) to the
 * Visuno design tokens, which key off `data-theme` on `:root`. Setting the attribute
 * explicitly means the components follow the docs page's chosen theme (light or dark)
 * and never fall back to the browser's `prefers-color-scheme`.
 *
 * Renders nothing.
 */
export function ThemeBridge() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    return () => {
      root.removeAttribute('data-theme');
    };
  }, [resolvedTheme]);

  return null;
}
