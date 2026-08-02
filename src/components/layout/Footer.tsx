import Link from "next/link";
import { site, navLinks } from "@/lib/data/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-xl py-20">
        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display max-w-md text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              Have a project in mind? Let&apos;s build something that moves.
            </p>
            <Link
              href="/contact"
              data-cursor-hover
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Start a project
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Sitemap
            </p>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-dim transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-dim">
              Connect
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-ink-dim transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-ink-dim transition-colors hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line pt-8 text-xs text-ink-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p>{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
