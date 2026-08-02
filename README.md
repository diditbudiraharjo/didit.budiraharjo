# NUMA — Design & Motion Studio

A production-ready marketing site for a fictional design & motion studio, built to
showcase a modern, animation-forward agency experience: scroll-driven reveals,
a WebGL hero, a GSAP pinned horizontal gallery, and full case-study routing.

## Stack

- **Next.js 16** (App Router, TypeScript, static generation)
- **Tailwind CSS 4**
- **Framer Motion** for scroll reveals, page/menu transitions, and micro-interactions
- **GSAP + ScrollTrigger** for the pinned horizontal "Featured Work" scroller
- **React Three Fiber + drei** for the animated hero blob
- **Lenis** for inertial smooth scrolling

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (static export of all routes)
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Structure

```
src/
  app/                 routes (home, /about, /work, /work/[slug], /contact)
  components/
    layout/            navbar, footer, smooth scroll, cursor
    sections/          page sections (Hero, Services, WorkGrid, ...)
    ui/                small reusable primitives (RevealText, Marquee, ...)
  lib/
    data/              site copy & case study content
    motion.ts          shared Framer Motion variants
  hooks/                media query / reduced-motion hooks
```

## Notes

All copy, branding, and case studies in this project are original and fictional —
this is a from-scratch build inspired by the structure and motion language of
modern design-studio websites, not a copy of any specific live site.
