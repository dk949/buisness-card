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
* [x] GitHub Pages deploy workflow
* [x] CLAUDE.md

## Before going live

* [ ] Create the GitHub repo and push to `trunk`
* [ ] Add DNS: `CNAME` record `hi` -> `dk949.github.io`
* [ ] Enable Pages for the repo, source "GitHub Actions", set the custom domain
* [ ] Scan the QR from a real phone camera at arm's length, both schemes
* [ ] Check the vCard imports cleanly on iOS and on Android

## Later

* [-] Backport the Silicon + Copper favicon to david-katz.dev, which still ships
      the old Tokyo Night one. Not this repo's job; now tracked in
      `../david-katz.dev/TODO.md`
* [-] Scope Tailwind's source detection in david-katz.dev too. Same, tracked in
      `../david-katz.dev/TODO.md`
* [ ] Decide whether the role line should change after graduation
