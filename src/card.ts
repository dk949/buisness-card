import { EMAIL } from "../data/card.js";

/* The only script on the page. Everything else is markup, and the whole
   bundle gets inlined into index.html at build time. */

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
