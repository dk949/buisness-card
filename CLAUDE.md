# business-card

Digital business card for David Katz. Single static page hosted on Vercel at **hi.david-katz.dev**, a subdomain of the main site at [david-katz.dev](https://david-katz.dev) (sibling repo: `../david-katz.dev`).

This file is the single source of truth for project intent and conventions.

## Project context

- **Use case.** David shows this page on his phone at a conference. The other person scans the on-screen QR and lands on the same page on their own phone. Everything else follows from that.
- **Two readers, two moments, two faces.** Before the scan: a stranger aiming a camera, who needs the QR and a visible destination URL to decide it is safe to scan. After the scan: the same person holding the page, for whom the QR is spent and the addresses are the point. The card's front serves the first and its back serves the second, and the whole reason it is a card that turns over is that those two moments never overlap.
- **Weight is a feature.** Conference wifi is the design constraint. The deployed page is **one request**: CSS, JS, the QR, and both fonts are inlined into `index.html` at build time. Current budget is ~53 kB raw / ~25 kB gzipped. Anything that adds a request or meaningfully grows that number needs a reason.
- **Contact.** Email `dk949.david@gmail.com`, GitHub `@dk949`, LinkedIn `https://www.linkedin.com/in/dk949/`, ORCID `0009-0003-7387-6169`. Same set as the main site.
- **Frameworks.** Intentionally avoided, as on the main site. Build-time dependencies are cheap because they never ship; runtime dependencies must justify their bytes.

## Stack

Matches `../david-katz.dev` except where the single-page/single-request goal diverges.

- **Vite 6** — single-page build, plus two local plugins in `vite.config.ts`
- **Plain HTML** — one `index.html` at the repo root, structure lives there
- **Tailwind CSS 4** — via `@tailwindcss/vite`; card styles in `src/styles.css`
- **@dk949/site-theme** — the Silicon + Copper tokens, shared with `david-katz.dev` (the only runtime dependency, and it is pure CSS)
- **TypeScript** — strict, `noUncheckedIndexedAccess`, ESNext modules, bundler resolution
- **JetBrains Mono** — variable font, subset at build time from `@fontsource-variable/jetbrains-mono`
- **Archivo** — variable font, subset and pinned at build time from `@fontsource-variable/archivo`
- **qrcode** + **subset-font** — build-time only, never reach the browser

## Commands

| Command             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Runs `predev` (generate) then the Vite dev server          |
| `npm run build`     | Runs `prebuild` (generate) then `vite build`               |
| `npm run preview`   | Preview built site                                         |
| `npm run typecheck` | `tsc --noEmit`                                             |
| `npm run prebuild`  | Regenerate QR, subset fonts, and vCard on demand           |

No API keys or env vars. The build is fully offline.

## Layout

```
index.html                  ← the page; structure lives here
data/card.ts                ← URLs, email, vCard fields, font glyph floor
scripts/generate.ts         ← prebuild: QR + font subsets + vCard
scripts/subset-font.d.ts    ← local types for the untyped subset-font package
src/
  styles.css                ← card layout, foil gradients, components
                              (tokens come from @dk949/site-theme)
  card.ts                   ← the only runtime script (copy-to-clipboard;
                              the flip is pure CSS)
  generated/                ← build-time output (gitignored)
    qr.svg                  ← inlined via <!-- @include qr -->
    fonts.css               ← @font-face with base64 subsets
public/                     ← copied to the site root
  favicon.svg
  david-katz.vcf            ← generated (gitignored)
```

## Build pipeline

`prebuild` (`scripts/generate.ts`) writes three artifacts, then `vite build` folds them into one file.

1. **QR** → `src/generated/qr.svg`. Encodes `CARD_URL` at ECC M, currently 25x25 modules. Emitted as a single `<path>` of horizontal runs rather than one `<rect>` per module, with the mandatory 4-module quiet zone baked into the `viewBox` so no stylesheet can eat it. Fills are `var(--qr-fg)` / `var(--qr-bg)` because the SVG is inlined into the document.
2. **Font subsets** → `src/generated/fonts.css`. The stock latin subsets are 130 kB combined for a page with about sixty characters on it, and roughly half of each file is variation data. The generator keeps only the glyphs the markup uses and only as much of each axis as the design needs: JetBrains Mono keeps `wght 400..700`, Archivo is pinned to a single instance (`wght 800`, `wdth 118`) because only the `h1` uses it. Result is ~14 kB for both, inlined as base64 data URIs.
3. **vCard** → `public/david-katz.vcf`. vCard 3.0 with CRLF endings, for the "save contact" download.

The `single-file` plugin in `vite.config.ts` then replaces the emitted `<link rel="stylesheet">` and `<script src>` with inline `<style>` and `<script>` and drops those chunks from the bundle. `dist/` should contain exactly three files: `index.html`, `favicon.svg`, `david-katz.vcf`.

The `html-partials` plugin is the same `<!-- @include name -->` convention as the main site, widened to also resolve `src/generated/*.svg`.

## Conventions

- **Structure in HTML, behavior in TS.** Don't render markup from TS. `src/card.ts` wires up the copy button and the fill-screen tap, and nothing else; the flip is a checkbox and a stylesheet. Both behaviours degrade to nothing if the script fails.
- **Prefixed pseudo-classes get their own rule.** `:fullscreen` and `:-webkit-full-screen` are never put in one selector list: an engine that does not know one of them discards the whole list, taking the working selector with it. Same for `::backdrop`.
- **Glyph coverage.** The mono subset is derived from the visible text in `index.html` unioned with `FONT_BASE_CHARS` in `data/card.ts`. New copy is covered automatically on the next build; a genuinely new symbol (arrows, box drawing) needs adding to the floor, or it silently falls back.
- **Tailwind scans an explicit source list.** `styles.css` opens with `@import "tailwindcss" source(none)` followed by `@source` for `index.html` and `card.ts`. Automatic detection walks the whole repo, which meant prose in `CLAUDE.md` and `TODO.md` was emitting utilities for words like "grid" and "border" (about 1.8 kB of dead CSS). **Adding a file that carries utility classes in markup means adding an `@source` line for it**, or those classes are silently never generated. `@apply` is unaffected.
- **Two sources of truth for contact info, on purpose.** `index.html` holds what is displayed; `data/card.ts` holds what the build generates (QR payload, vCard, the email the copy button writes). Update both.
- **Indentation: 2 spaces (HTML) 4 spaces (everything else)** (`.editorconfig`). LF line endings, final newline.
- **No em-dashes** in code, markup, or docs other than this file. Use hyphens.
- **Strict TS.** `noUncheckedIndexedAccess` is on.
- **Theming.** **Silicon + Copper**, identical to the main site. Light default, dark via `prefers-color-scheme`, no JS toggle. Tokens come from the `@dk949/site-theme` package (see "Shared theme"); never add a card-specific value to it. The foil gradients and the card stock are card-specific, so they live in `styles.css` as `:root` custom properties, not in the theme package.
- **The QR is tinted, never inverted.** It keeps fixed dark-on-light values in both schemes: dark copper `#3a1e08` on `#f4f5f7`, about 13:1. Plenty of phone cameras refuse inverted or low-contrast codes, and a card that will not scan is not a card. It is the one element the dark scheme does not touch.
- **Motion.** The flip, plus hover and focus transitions. No entrance animation: the page is handed to someone with a camera already pointed at it, and content that is invisible until a frame has run is a real failure mode. `prefers-reduced-motion` zeroes both `transition-duration` and `transition-delay`, because the face swap is timed to the middle of the rotation and would otherwise leave a blank card.
- **Accessibility.** Visible focus ring on everything interactive, `role="status"` live region for the copy confirmation, `aria-label` on the QR, and copied state signalled by an icon swap rather than colour alone. The hidden face is `visibility: hidden`, which takes it out of the tab order; `backface-visibility` alone does not.

## Design

Sibling to the main site, not a clone of it. Same tokens and type roles, different composition.

- **Signature.** The page is a business card as an object: one piece of stock at a real 85x55 ratio, with a milled copper foil rim and a hairline foil rule inset from it, that you **turn over** rather than scroll. The foil is a ten-stop gradient rather than a flat accent, so its highlights sit at fixed points on the element and travel across the rim as the card rotates. That sweep is what the flip buys, and it is the only animation on the page.
- **Front and back.** Front: the name foil-stamped in Archivo, the role and affiliation, the QR, the `%scan` destination, and the main-site link. Back: a mono echo of the name, the addresses themselves as a keyed list (`mail dk949.david@gmail.com`, not just `mail`), the vCard download, and the copyright. The back has to be readable to someone holding it without tapping anything.
- **The hinge.** A visually hidden `role="switch"` checkbox, sibling to `.card`, toggled by a `<label class="turn-tab">` on each face. No JavaScript is involved, so the back survives a failed script. It sits outside both faces on purpose: a control inside the hidden face stops being focusable exactly when it is needed. Both labels point at it, so it carries an explicit `aria-label` (that beats the `<label>` elements in the accessible-name computation).
- **Tap to fill the screen.** Browser chrome is the only thing on screen that is not the card, and the QR is the one element that gets better by being bigger. A click handler on `.card` toggles fullscreen on the root element; anything matching `a, button, label` is left alone, so every control keeps doing only its own job (verified by walking every leaf node under `.card`). `:fullscreen` also lifts the `--cap-w` width cap: at 22rem the card is already as wide as it wants to be, so without that the gesture would drop the chrome and change nothing. Gains about 8% linear in portrait and 13% in landscape.
- **`.fill` is the keyboard path**, and the only visible sign the gesture exists: a borderless muted glyph in the foot rail, deliberately not a second pill competing with the turn tab. It is `display: none` until `card.ts` confirms the API and adds `.can-fill` to the root, because **iOS Safari does not implement the Fullscreen API on iPhone at all** (video only). The card must never advertise an action it cannot perform. Android and iPad are fine.
- **Inherited motifs.** The mono lowercase `%label` section headings (MLIR SSA-value nod, CSS `::before`) and the per-platform brand colours on contact rows. The silicon-die framing that the first pass used (copper fiducials, trace, via) is gone: the card's own foil does that work now, and three nested frames was one too many.
- **The card is a scale model.** `main` is exactly as wide as the card and is a `container-type: inline-size` container, so `1cqw` is 1% of the card. Each face sets **one** fluid size (`max(0.5rem, 3.125cqw)` portrait, `1.974cqw` landscape) and everything on it is `em` from there. Change the card's width and the whole composition follows, the way a printed card does when you hold it further away. Adding a fixed `rem` or `px` size inside a face breaks that; the only deliberate exceptions are hairline strokes (the 1px and 2px foil rules), which should stay crisp.
- **Fitting the viewport.** Two halves, and both are needed. `main`'s width is capped by the height actually available (`calc((100svh - var(--pad-y) * 2) * 55 / 85)`, inverted in landscape), and `.card` takes an **explicit height** in `cqw` rather than an `aspect-ratio`. `aspect-ratio` is only a floor: content that does not fit grows the box past the ratio, which is exactly how the first landscape build ended up square, taller than the screen, and scrolling under the phone's address bar. Verified `scrollHeight == innerHeight` at 360x560, 400x860, 640x400, 673x310, 852x393 and 1100x720. Landscape composition starts at `min-width: 40rem`, which also catches a phone turned sideways.

## Shared theme

The Silicon + Copper tokens live in **[`@dk949/site-theme`](https://www.npmjs.com/package/@dk949/site-theme)** (source: [dk949/site-theme](https://github.com/dk949/site-theme), local checkout at `../site-theme`), consumed by this repo and by `david-katz.dev`. Neither site keeps a local copy any more.

```css
@import "@dk949/site-theme/theme.css";
```

Tailwind 4 resolves `@import` out of `node_modules`, so the `@theme` block behaves exactly as it did inline.

**The package is tokens only** — the `@theme` block and the `prefers-color-scheme` override, nothing else. Layout, components, and anything that describes a particular page belong in that site's own stylesheet. Loading the two font families is also the consumer's job; the theme only names them.

**Changing a token means releasing the package**, not editing a file here: bump the version in `../site-theme`, `npm publish`, then `npm install` in each consumer. Versioning is semver on the rendered result (patch for a colour nudge that preserves every role and contrast ratio, minor for a new token, major for removing or repurposing one). Consumers use a `^` range, so `npm ci` stays pinned by the lockfile and nothing lands on a live site until its own build runs.

Do not fetch the theme over HTTP at build time. It would make both builds depend on the deployed state of one of them.

## Git conventions

- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) format. Subject ≤50 chars. Body only when "why" isn't obvious.
- **Commit only when asked:** Do not auto-commit or proactively stage changes. Wait for explicit instruction.
- **Never push:** User retains full control over when and what gets pushed to remote.

## Hosting

**Vercel**, static build from `dist/`, deployed by Vercel's own GitHub integration on push to `trunk` (the project's production branch must be set to `trunk`; Vercel defaults to the repo default branch and would otherwise file every push as a preview). Build is `npm run build`, output directory `dist`, and `prebuild` fires off the npm lifecycle so QR/font/vCard generation needs no extra config. Node is pinned by `engines.node` in `package.json`; Vercel does not read `.nvmrc`.

GitHub Actions runs `typecheck` only (`.github/workflows/ci.yml`). It does not deploy. GitHub Pages is disabled for the repo.

**Why not Pages.** Vercel's Observability tab counts edge requests server-side, which is the whole reason for the move: a hit count with no client script, no cookies, and no second request. Vercel Web Analytics would give path and referrer breakdowns but costs an extra request for `/_vercel/insights/script.js`, so it stays off. Weight is the point of this repo.

DNS: a `CNAME` record for `hi` pointing at the per-project target Vercel issues when the domain is added, currently `ae8e032ad1c32231.vercel-dns-017.com`. Managed at Namecheap (nameservers are `dns1`/`dns2.registrar-servers.com`), under Domain List -> `david-katz.dev` -> Advanced DNS -> Host Records. Do not substitute the generic `cname.vercel-dns.com`; take whatever the Domains tab shows. The domain is claimed in the Vercel project's Domains tab; there is no `public/CNAME` file (that was a Pages mechanism). The apex `david-katz.dev` stays on the main site.

Changing the subdomain means changing `CARD_URL` in `data/card.ts` and the domain in the Vercel project together, then rebuilding so the QR is re-encoded.
