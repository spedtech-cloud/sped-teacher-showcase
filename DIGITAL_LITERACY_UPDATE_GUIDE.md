# Digital Literacy Showcase — POC update

**Scope:** Refocus the existing SPED Interactive Showcase on digital literacy teaching demonstrations only. No backend, account, uploads or external service is added. The public gallery uses the existing `index.html`, `assets/` and `resources.json` structure.

## What changed

The catalogue now displays **seven local resources**: four new standalone interactive HTML files and three retained digital-literacy demonstrations. Spotlight continues to feature Digital Work Checklist. The public filters now distinguish digital skill area and teaching context.

The previous non-Digital-Literacy HTML files are **not deleted from the project**. They are simply not listed in `resources.json`. They can still be opened via a direct URL if they remain in the public repository. Delete only after a separate content-governance decision.

## Browser-only GitHub upload

1. Extract this ZIP. Do not upload the ZIP itself.
2. In the repository root, replace `index.html` and `resources.json` with the updated files.
3. In `assets/`, replace `app.js` only. Keep `styles.css` and `spotlight.css` unchanged.
4. In `resources/`, add the **four new HTML files**. Keep all existing HTML files unchanged.
5. Commit changes, then load the GitHub Pages site. Test the search, filters, Spotlight, Try It, Download HTML, and keyboard controls.

## Content and permissions

- All new activity wording and fictional examples are original demonstrations. They do not load real websites, read accounts, collect information or save data to servers.
- The notes app saves items in temporary page memory **only**; nothing persists after closing or reloading the page.
- The uploaded reference curriculum was marked **RESTRICTED** and is **not included**, quoted, attached, linked or reproduced within this public project.
- Topic examples and learning purposes are illustrative. An authorised curriculum owner or SPED educator must validate alignment before claiming it is officially mapped to curriculum outcomes.
- Review all resources for accessibility, safety, appropriateness and reuse permissions before publication. No formal WCAG or Oobee conformance claim is made.

## Resource catalogue

Fields added for digital-literacy browsing: `skillArea` (the teaching skill), and `context` (Living, Learning, Working or Online Safety). Existing core fields and local `resources/filename.html` URLs are preserved.

## Suggested first teaching trial

Start with *Find Everyday Information* (recognise and locate), then *Create and Save a Note* (sequence and organise), *Device Care and Controls* (operate and care), and *Check Before Sharing* (pause and verify). Use guided mode first, independently only when appropriate, and assess transfer to real devices.
