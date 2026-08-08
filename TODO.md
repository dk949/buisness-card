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
* [ ] Confirm the Observability tab actually reports edge requests for the
      project on the Hobby plan
* [ ] Check Vercel's terms on whether a personal business card counts as
      non-commercial use, since Hobby is non-commercial only
* [ ] Add a one-line privacy note (host is Vercel, aggregate page-view counts,
      no cookies, no tracking) with an email contact
* [ ] Scan the QR from a real phone camera at arm's length, both schemes
* [ ] Check the vCard imports cleanly on iOS and on Android

## Later

* [-] Backport the Silicon + Copper favicon to david-katz.dev, which still ships
      the old Tokyo Night one. Not this repo's job; now tracked in
      `../david-katz.dev/TODO.md`
* [-] Scope Tailwind's source detection in david-katz.dev too. Same, tracked in
      `../david-katz.dev/TODO.md`
* [ ] Decide whether the role line should change after graduation
