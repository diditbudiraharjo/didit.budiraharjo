import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import { site, navigation, socials } from "@/config/site";
import { Container } from "@/components/ui/container";
import { LogoMark } from "./logo-mark";

export function Footer() {
  return (
    <footer className="tone-light border-t border-border bg-bg text-ink">
      <Container className="grid gap-12 py-20 md:grid-cols-[1.3fr_1fr_1fr] md:py-28">
        <div>
          <LogoMark className="h-7" />
          <p className="mt-6 max-w-xs text-muted">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex items-center gap-2 font-display text-lg font-medium hover:opacity-70"
          >
            {site.email}
            <LuArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>

        <nav aria-label="Sections">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Sections</h2>
          <ul className="mt-5 space-y-3">
            {navigation.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted transition-colors hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Company</h2>
          <ul className="mt-5 space-y-3">
            <li>
              <Link href="/contact" className="text-muted transition-colors hover:text-ink">
                Contact
              </Link>
            </li>
            {socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col justify-between gap-2 py-6 sm:flex-row">
          <p className="text-xs text-muted">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono text-xs text-muted">DESIGN · BRAND · DEVELOP</p>
        </Container>
      </div>
    </footer>
  );
}
