/* Single source of truth for everything the build generates: the QR payload
   and the downloadable vCard. The visible markup in index.html duplicates
   some of these values on purpose (structure lives in HTML, not TS) -- keep
   the two in sync when editing. */

export const CARD_URL = "https://hi.david-katz.dev";
export const SITE_URL = "https://david-katz.dev";

export const EMAIL = "dk949.david@gmail.com";

export const PERSON = {
    first: "David",
    last: "Katz",
    title: "PhD Researcher, Compilers and HPC",
    org: "EPCC, University of Edinburgh",
    profiles: [
        "https://github.com/dk949",
        "https://www.linkedin.com/in/dk949/",
        "https://orcid.org/0009-0003-7387-6169",
    ],
} as const;

/* The mono subset is derived from the text in index.html, unioned with this
   floor so that routine copy edits cannot silently drop a glyph into the
   fallback font. Add to it only for characters a rebuild would not see. */
export const FONT_BASE_CHARS =
    " !\"'(),-./0123456789:;?@%&+="
    + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    + "abcdefghijklmnopqrstuvwxyz"
    + "·©";
