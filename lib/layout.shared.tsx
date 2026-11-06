import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-with-text.png`}
          alt={appName}
          width={180}
          height={48}
          priority
          style={{ height: 40, width: 'auto' }}
        />
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
