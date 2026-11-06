import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1">
      <h1 className="text-3xl font-bold mb-4">Visuno</h1>
      <p className="text-fd-muted-foreground mb-6 max-w-xl mx-auto">
        Native UI components for AI-agent products — one design, four frameworks:
        Vanilla JS, React, Angular, and Flutter.
      </p>
      <p>
        Open the{' '}
        <Link href="/docs" className="font-medium underline">
          documentation
        </Link>{' '}
        to get started.
      </p>
    </div>
  );
}
