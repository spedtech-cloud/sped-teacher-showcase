# SPED Interactive Showcase — Version 1.1

## Scope

This is a **frontend-only refinement** of `spedtech-cloud/sped-teacher-showcase`. It retains the 11 existing standalone HTML resources, the current catalogue order, visual identity, Spotlight, nine domain/area choices and Teaching Supports, and the public POC/privacy notices. No Cloudflare integration, backend, sign-in, upload form, tracking or database is included.

## Replace these three files

1. `index.html` (repository root)
2. `assets/app.js` (inside the existing `assets/` folder)
3. `assets/styles.css` (inside the existing `assets/` folder)

**Do not delete** `resources.json`, `assets/spotlight.css`, or any file under `resources/`. None of the 11 existing resource HTML files or their catalogue records have been altered.

### Browser-only upload procedure

1. Extract `SPED_Showcase_V1_1_Changed_Files.zip`; do **not** upload the ZIP itself.
2. In GitHub, open the repository root and upload/replace `index.html`.
3. Navigate to `assets/` and upload/replace `app.js` and `styles.css`.
4. Commit your changes to `main`.
5. Refresh `https://spedtech-cloud.github.io/sped-teacher-showcase/`, preferably with a hard refresh to avoid stale JavaScript/CSS.
6. Confirm Spotlight still shows *Digital Work Checklist*, 11 cards are listed, and a resource opens in Try It and downloads as HTML.

> No automatic GitHub write was possible: the connected GitHub integration returned HTTP 403. These replacements have **not** been committed remotely. Your existing Pages site is unchanged until you upload them.

## Functional improvements

- Cards display the learning domain, resource type, concise description, learning objective or support purpose, suggested classroom use, and clear actions. The full detail view is still available through **About this resource**.
- Detail view shows domain, type, objective, suggested use, adaptations, teaching approach, observation/assessment cues, transfer task, contributor metadata, source information, review status, and reuse permissions. Missing fields display explicit fallbacks, without invented attribution or licensing.
- Preserves local resource previews using `<iframe sandbox="allow-scripts">` **without** `allow-same-origin`. Includes reset, separate-tab link, keyboard modal closing/trapping, focus return and status messages.
- Search now includes the `learningObjective` field as well as titles, descriptions, tags, domains and classroom uses. Existing filters, including Digital Literacy, Healthy and Safe Relationships and Teaching Supports, continue to work together.
- Adds support for **manually curated** external HTTPS resource records; none have been added to the live catalogue. External sites open in a new tab and are never embedded. Their separate download action is shown only if `downloadUrl` has a direct `.html`, `.htm` or `.zip` file-style URL different from the site preview URL. A URL's file extension is not proof that its target exists or permits redistribution—verify it before publication.
- Keeps the existing high-contrast mode, reduced-motion styling, responsive card grid and focus indicators; improves button hit areas and screen-reader status text.

## Catalogue schema

No migration is needed; `resources.json` is unchanged in Version 1.1.

The renderer continues to read `learningObjective`, `suggestedUse`, `adaptations`, `hostingType`, `previewUrl`, `downloadUrl`, `sourceUrl`, `license`, `additionalDomains`, and `spotlight`. It additionally recognises these **optional** fields:

- `resourceType` — custom type text (otherwise derived from local/external and Teaching Supports).
- `reusePermission` — explicit verified reuse terms, displayed instead of the older `license` text when supplied.
- `sourceRepositoryUrl` — independent HTTPS link to the source repository, distinct from the live preview and direct download links.

Example of an external record **for reference only; not inserted into the production catalogue**:

```json
{
  "id": "approved-resource-slug",
  "title": "Approved example title",
  "description": "Describe the actual resource after review.",
  "domain": "Numeracy",
  "school": "Contributor attribution after permission is confirmed",
  "hostingType": "external",
  "previewUrl": "https://example.org/resource-app",
  "downloadUrl": null,
  "sourceUrl": null,
  "sourceRepositoryUrl": null,
  "reusePermission": "Confirm the creator's terms before publishing"
}
```

Do not add unreviewed external resources. When a valid, actual HTML/ZIP source file is available, replace `downloadUrl` only after verifying its safety, licensing and behaviour.

## Tests actually executed (local, 3 November 2026)

JavaScript syntax check (`node --check`), catalogue parsing, and Chromium rendering using an **in-memory stub** rather than a live web server:

- **Passed:** 11 local cards, Spotlight, search by learning objective, combined filters, empty state, and reset.
- **Passed:** Resource details present, Escape closes modal, initial focus on Close, focus returns after closure, and parent-modal keyboard focus wraps from first to last controls.
- **Passed:** `sandbox="allow-scripts"`, descriptive preview iframe titles, reset action assigning the original local path, Open in New Tab URL.
- **Passed:** All 11 Download HTML controls request the correct filenames and matching files exist in the project package.
- **Passed:** Controlled *test-only* external resource appears with clearly marked external link; without a valid file URL it shows no download action and explains source unavailability; a `.zip` source URL is handled separately; a site URL cannot be reused as a download URL.
- **Passed:** The 11 existing standalone HTML files rendered initially in Chromium with no uncaught JavaScript errors.
- **Passed:** High-contrast toggle and 375px mobile viewport without horizontal overflow.

**Not tested end-to-end:** actual GitHub Pages deployment, real-file browser downloads, the iframe's full resource execution over HTTP, external file reachability or licensing, manual screen-reader use, 200% zoom, Oobee automated scan, and formal WCAG 2.1 AA compliance. Browser security policy blocked local web-server navigation during this session. These must be checked on the published site.

## Governance reminder

This POC must not contain real student personal information or unapproved attribution. Treat every HTML resource as active code and review it for privacy, script behaviour, accessibility, pedagogical relevance and reuse permissions before publicly listing or enabling downloads.
