# Nailed It Bro — agency landing page

React + Vite single-page site with GSAP/ScrollTrigger, Motion for React and Lenis.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

`dist/` already contains a production build. Serve it with any static host
(Netlify, Vercel, GitHub Pages) or `npx vite preview`.

## Where things live

- `src/data.js` — all copy: services, concept projects, process steps, email.
- `src/lib/motion.js` — shared easing, durations and the masked heading reveal.
- `src/lib/useSmoothScroll.js` — Lenis (off for reduced motion, native on touch).
- `src/components/` — one file per section; mockups are drawn in CSS (`Mockups.jsx`).

## Before going live

- Replace `hello@naileditbro.com` in `src/data.js`.
- Set `FORM_ENDPOINT` in `src/components/Contact.jsx` (Formspree, Netlify Forms or
  your API). Until then the form opens a pre-filled email.
- The four projects are labelled as concepts. Swap in real work when you have it.
- Service list is a best guess at the six categories; edit `SERVICES` to match your brief.
