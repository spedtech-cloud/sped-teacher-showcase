# SPED Interactive Showcase — Accessibility update (3 Nov 2026)

## Scope

A targeted refinement of the existing Version 1.1 static GitHub Pages showcase. This change **removes** the optional High Contrast UI entirely, without changing the default branding or catalogue. The site continues to target WCAG 2.1 AA, alongside relevant Singapore Government Digital Service Standards (DSS). **It is not certified as conformant.**

## Files to replace

- `index.html` — High Contrast button removed; `<main>` can be focused via skip link.
- `assets/app.js` — the High Contrast click handler removed; resource action controls have resource-specific accessible names.
- `assets/styles.css` — old contrast-mode rules removed; adjusted minimum font sizes of small metadata and strengthened default focus/target styles.
- `assets/spotlight.css` — removed obsolete contrast-mode style.
- `resources/safe-online-choices.html` — dropdown constrained to container width to prevent narrow-screen overflow.

`resources.json` and the other ten standalone resources are **unchanged**. No account, backend, analytics or external dependency was added.

## Executed checks

Local Chromium in-memory tests (the browser environment blocks local serving):

- Homepage loads 11 catalogue entries and Digital Work Checklist Spotlight with no uncaught page JS errors.
- Contrast mode button and all contrast-mode references removed.
- Search by learning objective, combined filters, reset and polite result-count announcements worked.
- Local preview iframe retains `sandbox="allow-scripts"` and a descriptive title; Reset Preview worked with mocked network availability.
- Escape closes preview and details modal; initial focus, Tab wrap at dialog edges and focus restoration worked.
- All 11 Download HTML controls generated the intended paths, and all corresponding HTML files existed in the package. **Actual browser file saves were not verified** because the in-memory browser tests intercept the action.
- At 320px and 375px, no horizontal document scrolling on the public gallery. A simulated 200% zoom also showed no overall overflow; this is not a full browser zoom/resize-text audit.
- All 11 standalone resource pages loaded without uncaught initial JavaScript errors.
- At a 320px viewport, all 11 standalone resource pages had no horizontal document overflow after the Safe Online Choices fix.
- Basic script-based checks found no visibly unnamed button/form controls or obvious text contrast failures on the static initial state of the standalone resources. A heuristic text-contrast sample on the gallery found no failures. **These checks are not a complete colour-contrast assessment.**

## Still requires human and broader tooling validation

- Oobee/axe scan against the deployed site, **including all 11 individual resources** and their interactive states.
- Keyboard-only task completion within each standalone activity (not just initial load).
- Screen-reader testing, preferably NVDA with Chrome/Edge on Windows, and VoiceOver on iOS.
- Full 200% text-resize and 400% zoom/reflow testing across all resources.
- Manual checks for meaning without colour, reading order, instructions, error feedback, and button/pointer targets in **every interactive state**.
- Real HTTPS GitHub Pages preview, direct download and browser save testing after deployment.

## How to publish

Use GitHub's website to upload the updated root `index.html`, `assets/app.js`, `assets/styles.css`, `assets/spotlight.css` and `resources/safe-online-choices.html`, keeping the folder paths. Do not upload the ZIP itself to the repository. No other resource, catalogue, or admin file is required.
