import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
import { resolve } from "path";

/* Same `<!-- @include name -->` convention as david-katz.dev, widened to
   also resolve build-generated fragments (the QR). */
const INCLUDE_DIRS = [resolve(__dirname, "src/partials"), resolve(__dirname, "src/generated")];
const INCLUDE_RE = /<!--\s*@include\s+([\w-]+)\s*-->/g;

function htmlPartials(): Plugin {
    return {
        name: "html-partials",
        transformIndexHtml: {
            order: "pre",
            handler(html, ctx) {
                return html.replace(INCLUDE_RE, (_, name: string) => {
                    for (const dir of INCLUDE_DIRS) {
                        try {
                            return readFileSync(resolve(dir, `${name}.svg`), "utf8");
                        } catch { /* try the next extension */ }
                        try {
                            return readFileSync(resolve(dir, `${name}.html`), "utf8");
                        } catch { /* try the next directory */ }
                    }
                    throw new Error(`html-partials: ${ctx.path}: no partial named ${name}`);
                });
            },
        },
        handleHotUpdate({ file, server }) {
            if (INCLUDE_DIRS.some(dir => file.startsWith(dir))) {
                server.ws.send({ type: "full-reload" });
            }
        },
    };
}

/* Folds the CSS and JS bundles into index.html so the deployed card is a
   single request. The fonts are already base64 data URIs inside the
   generated CSS, so nothing else is left to fetch. On conference wifi the
   round trips cost more than the bytes do. */
function singleFile(): Plugin {
    return {
        name: "single-file",
        enforce: "post",
        generateBundle(_options, bundle) {
            const html = bundle["index.html"];
            if (!html || html.type !== "asset") return;

            const consumed: string[] = [];
            const lookup = (href: string) => bundle[href.replace(/^\//, "")];

            let source = String(html.source)
                .replace(/<link\b[^>]*\brel="stylesheet"[^>]*>/g, tag => {
                    const href = /\bhref="([^"]+)"/.exec(tag)?.[1];
                    const asset = href ? lookup(href) : undefined;
                    if (!href || asset?.type !== "asset") return tag;
                    consumed.push(asset.fileName);
                    return `<style>${String(asset.source).trim()}</style>`;
                })
                .replace(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g, (tag, src: string) => {
                    const chunk = lookup(src);
                    if (chunk?.type !== "chunk") return tag;
                    consumed.push(chunk.fileName);
                    return `<script type="module">${chunk.code.trim()}</script>`;
                });

            for (const name of consumed) delete bundle[name];
            html.source = source;
        },
    };
}

export default defineConfig({
    plugins: [htmlPartials(), tailwindcss(), singleFile()],
    build: {
        cssCodeSplit: false,
        modulePreload: false,
        rollupOptions: {
            input: { card: resolve(__dirname, "index.html") },
        },
    },
});
