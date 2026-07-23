# Mirra Marketing Site

Landing page for Mirra. React 19 + Vite + JavaScript (JSX) + Tailwind CSS v4,
dark theme with a teal accent, fully responsive.

## Structure

- `src/components/Navbar.tsx` — sticky nav, mobile menu
- `src/components/Hero.tsx` — headline + CTA + avatar illustration
- `src/components/Features.tsx` — 6 feature cards
- `src/components/HowItWorks.tsx` — 4-step process
- `src/components/Testimonials.tsx` — **placeholder quotes**, swap before launch
- `src/components/Pricing.tsx` — Free / Pro / Enterprise tiers
- `src/components/CTA.tsx` — closing call-to-action band
- `src/components/Footer.tsx`
- `src/hooks/useScrollAnimation.ts` — IntersectionObserver-based scroll-reveal, used by every section

Tailwind is configured CSS-first via `@theme` in `src/index.css` (teal palette,
dark surfaces, the `fade-up` animation). `tailwind.config.js` mirrors those
tokens for editor tooling.

## Develop

```bash
npm install
npm run dev
```

## Build (static export)

```bash
npm run build
```

Outputs a fully static `dist/` (relative asset paths via `base: './'` in
`vite.config.ts`) — drop it behind any static host or nginx. Preview the
production build locally with `npm run preview`.

## Known placeholder content

- `src/components/Testimonials.tsx` ships with sample quotes, clearly marked
  in a comment — replace with real ones before this goes live.
- The hero visual is an inline SVG illustration, not a real avatar render.
  Swap it for an actual render/photo in `src/components/Hero.tsx` once one
  exists, or drop a `hero-avatar` image into `public/assets/` and reference it.
