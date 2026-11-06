import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'Visuno';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// Visuno GitHub org. The docs repo links back to the components source.
export const gitConfig = {
  user: 'Visuno',
  repo: 'components',
  branch: 'main',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${getContentUrl(segments, page.locale)}` };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${getImageUrl(segments, page.locale)}` };
}
