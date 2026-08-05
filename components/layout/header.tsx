"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { sectionIds } from "@/config/site";
import { cn } from "@/utils/cn";
import { useScrolled } from "@/hooks/use-scrolled";
import { useScrollspy } from "@/hooks/use-scrollspy";
import { useLenis } from "@/components/providers/lenis-provider";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "./logo-mark";
import { NavOverlay } from "./nav-overlay";

export function Header() {
  const scrolled = useScrolled(24);
  const pathname = usePathname();
  const active = useScrollspy(sectionIds);
  const { stop, start } = useLenis();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    if (open) {
      stop();
      document.body.style.overflow = "hidden";
    } else {
      start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, stop, start]);

  useEffect(() => setOpen(false), [pathname]);

  // Only the homepage has a full-bleed dark hero for the header to float
  // over transparently. Every other route (e.g. the light-toned /contact
  // page) starts right at the top with no dark backdrop behind it, so the
  // header must render in its solid state immediately or its warm-white
  // text disappears against a light page background.
  const solid = scrolled || open || !isHome;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color,backdrop-filter] duration-300 ease-out",
          solid
            ? "h-20 border-b border-border bg-bg/75 backdrop-blur-md"
            : "h-24 border-b border-transparent bg-transparent"
        )}
      >
        <Container className="flex h-full items-center justify-between">
          <Link href="/" aria-label="matte design — home" className="h-6 text-ink sm:h-7">
            <LogoMark animate className="h-full" />
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <ButtonLink href="/contact" size="sm" variant="ghost" className="hidden sm:inline-flex">
              Contact
            </ButtonLink>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group inline-flex h-11 items-center gap-3 text-ink"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em]">{open ? "Close" : "Menu"}</span>
              <span className="relative flex h-4 w-6 flex-col justify-between">
                <span
                  className={cn(
                    "h-px w-full bg-ink transition-transform duration-300",
                    open && "translate-y-[7px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "h-px w-full bg-ink transition-transform duration-300",
                    open && "-translate-y-[7px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <div id="site-nav">
            <NavOverlay activeSection={isHome ? active : null} onClose={() => setOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
