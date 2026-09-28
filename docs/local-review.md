# Local design review — 2026-09-28

This is an English-language proposal for the Canadian company, requested as a local preview. The existing live site has not been deployed or modified.

## Implementation

- Astro 7.3.4, matching the installed version in the Logos company site; pnpm 11.19.0.
- Shared `Base.astro` layout, separate header/footer and five homepage sections.
- Mint UI 0.6.1, installed from its immutable release with the authoritative installer. The vendor is unchanged; site-specific layout and styling live in `public/styles/site.css`.
- Dark background, mint accent, Manrope typography and the corporate flow artwork connect the two sites visually. Actual English Flag Quiz screens lead the Labs design.
- Proposed headline: “A little learning. A wider world.” The original emphasis on everyday practice and human judgement in an AI-enabled world informs the new copy.
- Company name, address and public email addresses are retained from the original website. No invented download counts, reviews or Google Play availability claims were added.
- Product previews support Quiz, Study and Discover. Links go to the verified App Store listing and existing support/privacy pages.

## Verification

- Astro static build and `scripts/verify-site.mjs` passed. Checks cover English locale, noindex, company details, one main heading, unique IDs, local assets, anchors, crawler exclusions and Mint runtime-only output.
- Browser checks at 1280px, 768px, 390px and 320px found no document horizontal overflow. Desktop, tablet and phone compositions were visually reviewed.
- All three product preview states were exercised; image, caption and selected state update together.
- Mobile menu opens, closes on navigation, and closes with Escape while restoring focus to its summary. Tablet navigation uses the same menu at widths where desktop links no longer fit.
- Reduced-motion styling disables transitions and smooth scrolling; the shared Mint reveal controller respects the media preference. Content is present in static HTML.
- The browser verified the public Apple listing for Flag Quiz | LOGOS, including the developer name and feature descriptions. See `asset-sources.md` for details and asset provenance.

## Preview and publishing boundary

Preview: `http://127.0.0.1:4333/` using `pnpm dev`. Build with `pnpm build`, then run `pnpm check`.

Only the feature branch `codex/learning-labs-redesign` receives source-control changes. `main`, live-domain settings and the existing root `CNAME` are unchanged. The new Astro build remains noindex; deploying generated assets and enabling indexing require a separate publication request.
