import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName } from '@/lib/shared';

export const metadata: Metadata = {
  metadataBase: new URL(new URL(process.env.SITE_URL || 'http://localhost:3000').origin),
  title: {
    default: `${appName} — components for agent-powered products`,
    template: `%s · ${appName}`,
  },
  description:
    'Native UI components for AI-agent products — one design across Vanilla JS, React, Angular, and Flutter.',
};

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              type: 'static',
              api: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/search`,
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
