# SPEDTech Admin Portal — Spotlight and accessibility update

**This is an extension of a prototype, not an active deployed service.** The live GitHub Pages site is unchanged until its files are manually uploaded. The portal remains unavailable until Cloudflare Access, administrator allowlist and GitHub permissions are configured.

## What changed

- Public homepage has a **Resource Spotlight** panel above the full gallery. No carousel or autoplay. Initial example: Digital Work Checklist.
- Only **one local resource at a time** can be spotlighted. Public data in `resources.json` includes an optional Boolean `spotlight`; existing entries work even without it.
- Private admin list has **Set Spotlight** and **Clear Spotlight** controls. Those securely update `resources.json` via a new `/api/spotlight` endpoint, with existing Cloudflare Access identity checks, explicit allowed-email checks, same-origin protection and GitHub revision checks.
- Basic admin accessibility enhancements: skip link, larger minimum button targets, readable text labels, keyboard focus indication and reduced-motion support.
- Public Spotlight: semantic labelled section and card, keyboard-operable actions and clear names; no automatically moving elements.
- `ACCESSIBILITY_QA.md` defines a WCAG 2.2 AA + DSS target and a manual/Oobee review procedure. **This update does not claim formal compliance or a completed Oobee scan.**

## Scope of the private admin prototype

Currently implemented: add standalone HTML, view/filter published items, remove HTML+catalogue entry, set/clear single Spotlight. **Not yet implemented:** editing previously published resource metadata, draft/review approval states, rollback, multiple featured items, and direct email/visitor submissions. The existing upload form has a review declaration but is **not** a substitute for a review process.

## How to apply

1. **Public site only**: replace the files in `public-site-update/` at their corresponding paths in the GitHub repository, adding `assets/spotlight.css`. Your eleven existing `resources/*.html` files remain unchanged. Ensure the external demonstration resource is absent from `resources.json`.
2. **Private admin (later)**: follow `START_HERE.md`. When you create the Cloudflare Worker, paste **the complete `worker.js`** into it. Worker `admin-ui.html` and `worker-server.js` are provided as readable development references; they do not need separate deployment.
3. Do not place the private admin files, token or approval records inside the public GitHub Pages repository.
4. Manually test the public gallery and the Spotlight. Use `ACCESSIBILITY_QA.md` for accessibility review and record any outstanding issues before declaring the site compliant.

## Important security limitations

- **GitHub commit history is public** and may retain removed HTML. Never publish student data, credentials or school-internal documents.
- New standalone HTML can run scripts in a browser when opened directly; manual review of code and resources remains essential.
- The two GitHub updates for uploading/removing files and catalogue entries are not atomic. A partial failure may require administrator cleanup.
- A GitHub personal access token requires least-privilege contents permissions and rotation. Keep it only in a Cloudflare Worker secret. No credential is bundled here.
