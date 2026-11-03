# SPED Interactive Showcase — Digital Literacy Focus (POC)

This is a public, static GitHub Pages resource gallery for Singapore SPED educators. It preserves multiple learning domains while **spotlighting Digital Literacy**. It is not an official MOE platform, an evaluated instructional intervention, or a formally WCAG-certified site.

## Resource collection

The catalogue contains **15 standalone HTML resources**: **7 relevant to Digital Literacy** (3 existing cross-domain activities plus 4 new activities) and **8 other resources**. There are no external websites in the current catalogue. Nothing is connected to student accounts, learning records or a backend.

Use **All resources** to explore every activity and **Digital Literacy focus** for the current POC priority. Domain and contributor filters remain available; on mobile, use **Show filters**. Spotlight features **Digital Work Checklist**.

Learning domains: Communication and Language; Numeracy; Daily Living Skills; Social-Emotional Learning; Vocational Education; Arts; Physical Education. Additional discovery areas: Digital Literacy, Healthy and Safe Relationships. **Teaching Supports** is a non-syllabus resource type.

Each activity must be reviewed for learner suitability, learning purpose, rights, privacy, security and accessibility before classroom use. Classroom independence and transfer to authentic contexts must be assessed separately from success in a simulated HTML activity.

## Files and folders

- `index.html` — homepage and accessible gallery layout.
- `resources.json` — catalogue of approved public resource descriptions and paths.
- `assets/app.js` — search, filters, Spotlight and full-page activity links.
- `assets/styles.css` — responsive layout including mobile controls.
- `assets/spotlight.css` — featured resource styling.
- `resources/*.html` — independent interactive learning resources (15 files).
- `CONTRIBUTOR_REVIEW.md` — contributor safety and suitability review checklist.

**Restricted curriculum documents must not be uploaded into this public repository.** This POC uses original demonstration wording and does not reproduce internal source tables or assert formal KLO-level alignment.

## Update through GitHub website (no CLI)

1. Open `https://github.com/spedtech-cloud/sped-teacher-showcase`.
2. To add an approved resource, upload its standalone HTML file under `resources/` using GitHub's browser interface.
3. Add one validated metadata entry to `resources.json` with a unique `id`, correct `domain`, and relative paths such as `resources/example.html` for `previewUrl` and `downloadUrl`.
4. Use `additionalDomains: ["Digital Literacy"]` to make a cross-domain activity discoverable under the Digital Literacy filter without reclassifying its primary domain.
5. To remove a resource from the **gallery**, remove its entry in `resources.json`. To remove a publicly accessible HTML file entirely, separately delete the file in `resources/` and consider the implications of public Git history.
6. Commit the changes to `main`; GitHub Pages normally republishes the updated site automatically. Refresh and test Try It, Download, search, Spotlight and mobile layout.

For this version, upload and replace `index.html`, `resources.json`, `assets/app.js`, `assets/styles.css`, and `assets/spotlight.css`. **Do not delete any resource HTML files**. The four new activities must already exist in `resources/`; their filenames are listed in `resources.json`.

## Accessibility and privacy

Targets WCAG 2.1 AA design principles (keyboard operation, accessible labels, focus, reduced motion, responsive text, screen-reader announcements and full-page teaching activities). No formal WCAG or Oobee conformance claim has been made. Each downloaded HTML activity needs its own audit.

The showcase uses no accounts, cookies, visitor analytics or third-party scripts in the gallery. Local activities open as standalone pages in new tabs with `rel="noopener noreferrer"`; unlike the previous sandboxed previews, they run with normal same-origin browser permissions. Review HTML and JavaScript carefully before publishing any contributed activity. The website is public: do not include real student personal information, confidential educational materials, private file URLs, tokens or restricted curriculum files.

The contribution/removal contact address is currently unconfigured and shown as a disabled placeholder.
