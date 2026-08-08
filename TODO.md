# TODO

## Setup

* [x] Scaffold project with the david-katz.dev stack (Vite 6, Tailwind 4, TS)
* [x] Port Silicon + Copper theme tokens into `src/theme.css`
* [x] Extract the theme into `@dk949/site-theme`, published to npm and
      consumed by both this repo and david-katz.dev
* [x] Build-time QR generation, inlined as SVG
* [x] Build-time font subsetting, inlined as base64 (130 kB -> 14 kB)
* [x] Single-request output via the `single-file` Vite plugin
* [x] vCard download
* [-] GitHub Pages deploy workflow. Replaced by Vercel, so that we get hit
      counts out of Vercel's Observability tab. Workflow and `public/CNAME`
      removed; CI now runs typecheck only
* [x] CLAUDE.md
* [x] Redesign as an actual business card: 85x55 stock, copper foil rim and
      inner rule, foil-stamped name, copper-tinted QR, and a CSS-only flip to
      a reverse face carrying the addresses themselves. Replaces the first
      pass's silicon-die framing (fiducials, trace, via)
* [x] Tap the card to fill the screen, so the conference phone shows the card
      and not the browser

## Before going live

* [x] Create the GitHub repo and push to `trunk`
* [x] Import the repo into Vercel, preset Vite, and set the production branch
      to `trunk`
* [x] Claim `hi.david-katz.dev` in the Vercel project's Domains tab
* [x] Add DNS: `CNAME` record `hi` -> `ae8e032ad1c32231.vercel-dns-017.com`
      (Namecheap, Advanced DNS)
* [x] Verify the live page: 43282 B served, 22.9 kB over the wire, one
      request, `/CNAME` gone
* [x] Confirm the Observability tab actually reports edge requests for the
      project on the Hobby plan
* [x] Check Vercel's terms on whether a personal business card counts as
      non-commercial use. It qualifies: ToS section 4 reads "personal *or*
      non-commercial use", so the personal limb is enough and the "is
      conference networking commercial" question never arises. The docs page
      phrasing is stricter than the contract; the contract governs
* [x] Scan the QR from a real phone camera at arm's length, both schemes
* [ ] Rescan since the redesign: the modules are dark copper now, not near
      black. Still ~13:1 and still dark-on-light, but worth one real camera
* [ ] Check the flip on a real iOS Safari (`transform-style: preserve-3d` on
      a grid container is the part worth confirming). Check the fill-screen
      affordance is correctly absent there too: iPhone Safari has no
      Fullscreen API, so `.can-fill` should never be set and the glyph
      should never appear
* [ ] Add a one-line privacy note (host is Vercel, aggregate page-view counts,
      no cookies, no tracking) with an email contact
* [ ] Check the vCard imports cleanly on iOS and on Android

## Later

* [ ] Record the Observability hit count somewhere periodically. Hobby keeps
      1 month of analytics data and 1 hour of runtime logs, so a running total
      across conference seasons has to be captured by hand

* [-] Backport the Silicon + Copper favicon to david-katz.dev, which still ships
      the old Tokyo Night one. Not this repo's job; now tracked in
      `../david-katz.dev/TODO.md`
* [-] Scope Tailwind's source detection in david-katz.dev too. Same, tracked in
      `../david-katz.dev/TODO.md`
* [ ] Decide whether the role line should change after graduation
