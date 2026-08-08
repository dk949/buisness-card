# business-card

Digital business card, available at <https://hi.david-katz.dev>

Show it on a phone, let someone scan the QR, and they land on the same page on
theirs. Links back to the main site at <https://david-katz.dev>.

The deployed page is a single request: the stylesheet, the script, the QR, and
both fonts are inlined into `index.html` at build time. Roughly 43 kB, 23 kB
over the wire.

```sh
npm install
npm run dev        # localhost, regenerates the QR and font subsets first
npm run build      # -> dist/index.html
```

Contact details and the QR payload live in `data/card.ts`. Changing the URL
means updating the domain in Vercel to match and rebuilding, so the QR is
re-encoded.
