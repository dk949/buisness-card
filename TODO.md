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
