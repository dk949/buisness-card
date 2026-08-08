import { EMAIL } from "../data/card.js";

/* The only script on the page. Everything else is markup, and the whole
   bundle gets inlined into index.html at build time. The flip is pure CSS;
   this file adds the copy button and the fill-screen tap, both of which
   degrade to nothing if it fails to run. */

/* --- Copy the email ---------------------------------------------------- */

const copyBtn = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");

copyBtn?.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(EMAIL);
        copyBtn.classList.add("copied");
        copyBtn.setAttribute("aria-label", "Copied!");
        if (copyStatus) copyStatus.textContent = "Email address copied to clipboard";
        setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyBtn.setAttribute("aria-label", "Copy email address");
            if (copyStatus) copyStatus.textContent = "";
        }, 2000);
    } catch {
        /* Clipboard is unavailable outside a secure context and on some
           in-app browsers; fall back to the thing the button stands in for. */
        window.location.href = `mailto:${EMAIL}`;
    }
});

/* --- Fill the screen --------------------------------------------------- */

/* Browser chrome is the only thing on screen that is not the card, and the
   QR is the one element that gets better by being bigger. Tapping the card
   drops the chrome.

   Progressive enhancement, and the feature detection is not decorative:
   iOS Safari does not implement this on iPhone at all. The .fill buttons
   stay hidden until we know the API is there, so the card never advertises
   an action it cannot perform. */

/* Safari still ships the API prefixed, and does not return a promise. */
type FullscreenRoot = HTMLElement & { webkitRequestFullscreen?: () => void };
type FullscreenDoc = Document & {
    webkitExitFullscreen?: () => void;
    webkitFullscreenElement?: Element | null;
};

const root: FullscreenRoot = document.documentElement;
const doc: FullscreenDoc = document;

const enterFill = root.requestFullscreen?.bind(root) ?? root.webkitRequestFullscreen?.bind(root);
const leaveFill = doc.exitFullscreen?.bind(doc) ?? doc.webkitExitFullscreen?.bind(doc);

if (enterFill && leaveFill) {
    root.classList.add("can-fill");

    const filled = () => Boolean(doc.fullscreenElement ?? doc.webkitFullscreenElement);

    const toggleFill = () => {
        /* Either call can be refused (browser policy, a sandboxed iframe).
           There is nothing to recover: the page is simply as it was. */
        void Promise.resolve(filled() ? leaveFill() : enterFill()).catch(() => {});
    };

    for (const button of document.querySelectorAll(".fill")) {
        button.addEventListener("click", toggleFill);
    }

    /* The card itself is the target. Nobody hunts for a button on something
       they are holding out at arm's length, and the whole surface is the
       obvious thing to touch. Anything that already does something -- the
       links, the copy button, the turn tab -- keeps doing only that. */
    document.querySelector(".card")?.addEventListener("click", event => {
        const target = event.target;
        if (target instanceof Element && target.closest("a, button, label")) return;
        toggleFill();
    });
}
