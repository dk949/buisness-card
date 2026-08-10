/* Prebuild: produces the three artifacts the page cannot express as markup.
 *
 *   src/generated/qr.svg    inline QR for the card URL (one <path>, no runtime lib)
 *   src/generated/fonts.css @font-face rules with the subsetted fonts inlined
 *   public/david-katz.vcf   the "save contact" download
 *
 * Everything here runs at build time, so none of these dependencies reach the
 * browser. The point of the whole file is that the shipped page is one
 * request: the QR is markup, and the fonts are data URIs inside the CSS that
 * the single-file plugin folds into index.html.
 */

import { create as createQr } from "qrcode";
import subsetFont from "subset-font";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { CARD_URL, EMAIL, FONT_BASE_CHARS, PERSON, SITE_URL } from "../data/card.js";

const ROOT = resolve(import.meta.dirname, "..");
const GENERATED = resolve(ROOT, "src/generated");
/* Everything in public/ is generated and gitignored, so a fresh clone has no
   such directory to write into. */
const PUBLIC = resolve(ROOT, "public");
const MARKUP = readFileSync(resolve(ROOT, "index.html"), "utf8");

/* --- QR ---------------------------------------------------------------- */

/* Drawn as one path of horizontal runs rather than a rect per module: same
   pixels, roughly a third of the bytes. viewBox units are modules, so CSS
   decides the rendered size. QUIET_ZONE is the mandatory 4-module margin --
   baking it into the viewBox means no stylesheet can accidentally eat it.
   The fill colours are CSS vars because the SVG is inlined into the page. */
const QUIET_ZONE = 4;

function qrSvg(text: string): string {
    const { modules } = createQr(text, { errorCorrectionLevel: "M" });
    const { size, data } = modules;

    const runs: string[] = [];
    for (let y = 0; y < size; y++) {
        let x = 0;
        while (x < size) {
            if (!data[y * size + x]) {
                x++;
                continue;
            }
            const start = x;
            while (x < size && data[y * size + x]) x++;
            const run = x - start;
            runs.push(`M${start + QUIET_ZONE} ${y + QUIET_ZONE}h${run}v1h-${run}z`);
        }
    }

    const span = size + QUIET_ZONE * 2;
    console.log(`  QR: ${text} (${size}x${size} modules, ecc M)`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${span} ${span}" `
        + `shape-rendering="crispEdges" role="img" aria-label="QR code linking to ${text}">`
        + `<rect width="${span}" height="${span}" fill="var(--qr-bg)"/>`
        + `<path fill="var(--qr-fg)" d="${runs.join("")}"/>`
        + `</svg>\n`;
}

/* --- Fonts ------------------------------------------------------------- */

/* Subsetting is where the page's weight actually goes. The stock latin
   subsets are 130 kB combined for a page with about sixty characters on it,
   and roughly half of each file is variation data for axes this card barely
   moves. So: keep only the glyphs the markup uses, and keep only as much of
   each axis as the design asks for.
     mono    - weight range 400..700 (body and semibold labels)
     display - pinned to one instance, the h1's weight and width
   Result is ~10 kB for both faces. */

type FaceSpec = {
    family: string;
    file: string;
    chars: string;
    /* Pin an axis with a number, keep a slice of it with a range. */
    axes: Record<string, number | { min: number; max: number; default: number }>;
    descriptors: string[];
};

/* Tags are dropped rather than parsed: this only needs the set of characters
   that end up on screen, and a superset is harmless. */
function visibleText(html: string): string {
    return html
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

const uniqueChars = (...sources: string[]): string =>
    [...new Set(sources.join(""))].sort().join("");

const h1Text = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(MARKUP)?.[1]?.trim() ?? "";
if (!h1Text) throw new Error("generate: index.html has no <h1> to subset the display face against");

const FACES: FaceSpec[] = [
    {
        family: "JetBrains Mono Variable",
        file: "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
        chars: uniqueChars(FONT_BASE_CHARS, visibleText(MARKUP)),
        axes: { wght: { min: 400, max: 700, default: 400 } },
        descriptors: ["font-weight: 400 700;", "font-style: normal;"],
    },
    {
        /* Only the h1 is set in the display face, so it only needs the name's
           glyphs at exactly one weight and width. Because the instance is
           pinned, the 118% width is baked into the outlines and styles.css
           must not also set font-stretch. */
        family: "Archivo Variable",
        file: "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
        chars: uniqueChars(h1Text),
        axes: { wght: 800, wdth: 118 },
        descriptors: ["font-weight: 800;", "font-style: normal;"],
    },
];

async function fontsCss(): Promise<string> {
    const blocks: string[] = [];
    for (const face of FACES) {
        const original = readFileSync(resolve(ROOT, "node_modules", face.file));
        const subset = await subsetFont(original, face.chars, {
            targetFormat: "woff2",
            variationAxes: face.axes,
        });
        const saved = Math.round((1 - subset.length / original.length) * 100);
        console.log(
            `  ${face.family}: ${face.chars.length} glyphs, `
            + `${kb(original.length)} -> ${kb(subset.length)} (-${saved}%)`,
        );

        blocks.push([
            "@font-face {",
            `    font-family: "${face.family}";`,
            ...face.descriptors.map(d => `    ${d}`),
            "    font-display: swap;",
            `    src: url(data:font/woff2;base64,${subset.toString("base64")}) format("woff2");`,
            "}",
        ].join("\n"));
    }
    return `/* Generated by scripts/generate.ts -- do not edit. */\n\n${blocks.join("\n\n")}\n`;
}

/* --- vCard ------------------------------------------------------------- */

/* vCard 3.0 rather than 4.0: iOS and Android both import 3.0 without
   complaint, which is the only property that matters for a file someone taps
   once at a conference. CRLF line endings are required by the spec and some
   Android importers do enforce it. */
function vcard(): string {
    return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${PERSON.last};${PERSON.first};;;`,
        `FN:${PERSON.first} ${PERSON.last}`,
        `TITLE:${PERSON.title}`,
        `ORG:${PERSON.org}`,
        `EMAIL;TYPE=INTERNET,PREF:${EMAIL}`,
        `URL:${SITE_URL}`,
        ...PERSON.profiles.map(url => `URL:${url}`),
        "END:VCARD",
        "",
    ].join("\r\n");
}

/* --- Run --------------------------------------------------------------- */

const kb = (bytes: number): string => `${(bytes / 1024).toFixed(1)} kB`;

mkdirSync(GENERATED, { recursive: true });
writeFileSync(resolve(GENERATED, "qr.svg"), qrSvg(CARD_URL));
writeFileSync(resolve(GENERATED, "fonts.css"), await fontsCss());
mkdirSync(PUBLIC, { recursive: true });
writeFileSync(resolve(PUBLIC, "david-katz.vcf"), vcard());
