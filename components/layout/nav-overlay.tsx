"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "motion/react";
import { LuArrowUpRight } from "react-icons/lu";
import { navigation, site } from "@/config/site";
import { motionTokens } from "@/config/motion";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Container } from "@/components/ui/container";
import { NavLink } from "./nav-link";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: motionTokens.stagger, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.slow, ease: [...motionTokens.ease.outExpo] },
  },
};

type Props = { activeSection: string | null; onClose: () => void };

export function NavOverlay({ activeSection, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(true, ref);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: [...motionTokens.ease.outExpo] }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg"
    >
      <Container className="flex min-h-full flex-col justify-between pb-12 pt-32 sm:pb-16">
        <motion.nav aria-label="Primary" variants={container} initial="hidden" animate="show">
          <ul className="space-y-1 sm:space-y-2">
            {navigation.map((nav) => (
              <motion.li key={nav.href} variants={item} className="border-b border-border py-3 sm:py-4">
                <NavLink
                  href={nav.href}
                  label={nav.label}
                  active={activeSection === nav.href.split("#")[1]}
                  onNavigate={onClose}
                  className="font-display text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink hover:text-ink"
                />
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 flex flex-col gap-8 sm:mt-24 sm:flex-row sm:items-end sm:justify-between"
        >
          <motion.div variants={item}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">Start a project</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-2 inline-flex items-center gap-2 font-display text-xl font-medium text-ink hover:opacity-70 sm:text-2xl"
            >
              {site.email}
              <LuArrowUpRight aria-hidden className="size-5" />
            </a>
          </motion.div>
          <motion.div variants={item}>
            <NavLink
              href="/contact"
              label="Contact →"
              onNavigate={onClose}
              className="font-display text-xl font-medium text-ink hover:text-ink"
            />
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
}
