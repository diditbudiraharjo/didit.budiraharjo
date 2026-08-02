import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-xl flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-ink sm:text-6xl">
        This page wandered off.
      </h1>
      <p className="mt-4 max-w-md text-ink-dim">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bg transition-transform hover:scale-105"
      >
        Back home
      </Link>
    </section>
  );
}
