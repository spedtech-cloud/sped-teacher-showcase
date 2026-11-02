# SPED Interactive Showcase

A **public, static, gallery-first proof of concept** for discovering, trying, downloading and adapting interactive SPED teaching resources. This is **not** an official Ministry of Education website and is **not** a reviewed resource collection or learning management system.

## What's inside

| File / folder | Purpose |
| --- | --- |
| `index.html` | Homepage, search, filters, cards, accessible previews and resource details |
| `resources.json` | Central catalogue: one entry for every resource |
| `assets/styles.css` | Responsive visual design, including a high-contrast toggle |
| `assets/app.js` | Vanilla JavaScript search, filtering, preview, download and modal interaction |
| `resources/*.html` | Eight **independent**, fully self-contained interactive HTML exercises |
| `CONTRIBUTOR_REVIEW.md` | Manual review checklist and publication criteria (not an approval system) |

The catalogue contains eight original **demonstration** resources and one **external** example to show how an independently hosted GitHub Pages application can appear in the gallery. The external example links to The Mathy Bit's Kindergarten Maths Apps collection. It is provided solely to illustrate integration, **not** as an approved SPED teaching resource. Its content and reuse terms are controlled by the external creator.

No backend, database, accounts, tracking, API keys, Node.js or command-line installation are needed.

## Singapore SPED curriculum grounding and limitations

The seven core SPED learning domains used for filtering are **Communication and Language; Numeracy; Daily Living Skills; Social-Emotional Learning; Vocational Education; Arts; Physical Education**. These are the named domains in MOE information about SPED schools. **Teaching Supports** is a separate, non-syllabus resource type for tools such as visual timers and token boards; it is not represented as an eighth syllabus. The colour pattern activity is classified under Numeracy, not Arts.

MOE established a National SPED Curriculum with seven Teaching and Learning Syllabuses (TLSs) after launching the final two in 2024. SPED schools customise learning experiences for the desired outcomes of **Living, Learning and Working**. The catalogue provides **illustrative pedagogical connections only**: it is **not** an official mapping to TLS learning outcomes, proof of instructional efficacy, or evidence of MOE endorsement. A curriculum/subject specialist should validate each proposed learning outcome against the applicable TLS and a school's own curriculum before classroom use.

Public references (accessed 2 Nov 2026):

- [MOE — Special Education Schools / learning domains (corporate brochure)](https://www.moe.gov.sg/-/media/files/about-us/moe-corporate-brochure.pdf)
- [MOE — 2025 Committee of Supply announcements: National SPED Curriculum](https://cos.moe.gov.sg/2025-announcements/)
- [MSF — 2024 updates: SPED Numeracy and PE TLSs; enhanced digital literacy](https://www.msf.gov.sg/what-we-do/enabling-masterplans/yearly-updates/2024)
- [MSF — 2023 updates: Communication and Language; Social-Emotional Learning TLSs](https://www.msf.gov.sg/what-we-do/enabling-masterplans/yearly-updates/2023)

The displayed *teaching approaches, adaptations, observation checks and real-world transfer activities* are recommendations written for this prototype, **not quotations or formally verified TLS teaching prescriptions**. These resource notes must be independently reviewed and customised.


## Digital literacy demonstrations (three added samples)

These samples are **not an eighth MOE SPED learning domain**. They explore digital literacy as an enabling skill across existing SPED learning domains and Living, Learning and Working contexts. IMDA's [Digital Skills for Life framework](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/new-digital-skills-for-life-framework) provides a public, general-population reference for using devices, communicating online and safe online behaviour. It is **not** itself a SPED Teaching and Learning Syllabus.

| Resource | Simulated practice | Provisional SPED domain | IMDA Digital Skills for Life reference |
| --- | --- | --- | --- |
| Digital Work Checklist | Open a work app, select job card, mark checked items | Vocational Education | Set up and use smart devices (interface use only) |
| Workplace Message Practice | Select suitable recipient and message, then practise Send | Communication and Language (and vocational use) | Communicate online |
| Safe Online Choices | Respond to privacy, unsolicited message and kindness situations | Daily Living Skills (discovery category only) | Be safe, smart and kind online |

All three activities are standalone HTML demonstrations with selectable guided or independent support, simulated interactions, and no personal data collection or real messaging. They do not assess real-world independent digital capability without external observation and generalisation. The `Digital Literacy` catalogue **tag** lets educators find all three by typing `digital literacy` into Search.

**To verify school curriculum alignment**, obtain the actual Digital Literacy curriculum and map each activity to its specific outcomes, level descriptors or indicators, prerequisites, performance criteria and expected prompt levels. Update the `curriculumContext` and assessment notes only after review.

## Publish using only a web browser (Windows or Mac)

> **Important:** The GitHub website does **not** automatically publish the contents of an uploaded ZIP file. **Extract** the ZIP before uploading.

1. Sign in to [GitHub](https://github.com/) in your browser.
2. Use **+ → New repository**. Name it `sped-teacher-showcase` (or another repository name), set **Public**, and create it. A public repository makes all uploaded files visible to everyone, so use only approved public content.
3. Extract `sped-teacher-showcase.zip` on your computer. Open the extracted `sped-teacher-showcase` folder.
4. In the GitHub repository, choose **Add file → Upload files**. Drag **the contents** of the extracted folder—`index.html`, `resources.json`, `README.md`, `assets/`, and `resources/`—onto the upload area. Keep the folder structure intact. If your browser cannot upload folders, use GitHub's browser file-creation interface to add the nested files individually, preserving their paths.
5. Check that GitHub displays `index.html` and `resources.json` at the repository **root**, with `assets/` and `resources/` as subfolders. Commit the files to the default `main` branch.
6. Open the repository's **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**. Choose `main` and `/(root)`; select **Save**.
7. Once GitHub Pages has published the site, visit the URL displayed in **Settings → Pages**. For a project repository, the usual URL format is `https://USERNAME.github.io/REPOSITORY-NAME/` (note the repository name at the end).
8. Visit the homepage. Try all eleven resource previews and downloads. Also test the separate external example link. Use keyboard Tab / Shift+Tab, Enter, Escape and the high-contrast control.

The site uses **relative URLs** so it also works under project URLs rather than only at a domain root. The resource HTML files are self-contained and can be downloaded and opened on their own.

## Add a new resource (no coding tools required)

1. **Complete and record the review** against [`CONTRIBUTOR_REVIEW.md`](CONTRIBUTOR_REVIEW.md) before publication. Do not include real student data, school credentials, copyrighted images without permission, private APIs, external tracking, or unsafe scripts. Ensure the resource works independently if you intend to offer standalone downloads.
2. In GitHub, open the `resources/` folder and use **Add file → Upload files** to add, for example, `visual-matching.html`. Commit the upload. Use lowercase letters, digits and hyphens in filenames.
3. Open `resources.json` in GitHub and select the **Edit / pencil** icon. Copy an existing local entry and edit its values. Separate catalogue objects with commas and keep valid JSON syntax.
4. Set `hostingType` to `local`, `previewUrl` and `downloadUrl` both to `resources/visual-matching.html`. Use a unique `id` such as `visual-matching`.
5. Commit the change to `main`. After Pages updates, refresh the published gallery, search for the resource, open it and download it to verify it works.

### Resource catalogue format

```json
{
  "id": "visual-matching",
  "title": "Visual Matching",
  "domain": "Daily Living Skills",
  "school": "Demonstration Resource",
  "description": "Match everyday pictures.",
  "learningObjective": "Identify matching everyday objects.",
  "suggestedUse": "Try with physical objects first.",
  "curriculumContext": "Illustrative DLS application, not a verified TLS outcome mapping.",
  "instructionalApproach": "Model with real objects and fade prompts.",
  "assessmentCheck": "Observe correct matching and level of prompting.",
  "transferTask": "Match actual items during an everyday routine.",
  "reviewStatus": "Demonstration only — classroom review pending",
  "adaptations": ["Use fewer objects.", "Use familiar photographs."],
  "tags": ["Matching", "Visual Supports"],
  "hostingType": "local",
  "previewUrl": "resources/visual-matching.html",
  "downloadUrl": "resources/visual-matching.html",
  "sourceUrl": null,
  "creator": "POC demonstration team",
  "license": "Specify verified reuse permissions"
}
```

The example above is a **template** and does not become a working resource until the corresponding HTML file has been uploaded. The gallery restricts local paths to `resources/filename.html` and external URLs to HTTPS. It skips invalid catalogue entries rather than running unknown HTML in the parent webpage.

Available syllabus learning domains (exact spelling): Communication and Language; Numeracy; Daily Living Skills; Social-Emotional Learning; Vocational Education; Arts; Physical Education. **Teaching Supports** is a separate resource type, not a syllabus learning domain.

School labels are metadata only. **Do not attribute an unverified contribution to a real school.** Once an actual school has approved its attribution, use the verified name. Each school added to the catalogue automatically appears in the contributor filter.

## Link to a resource hosted elsewhere

For an external website, set `hostingType` to `external`, `previewUrl` to the **verified HTTPS URL** of its live app, and `downloadUrl` to `null` if no genuine downloadable source HTML/ZIP link is available. External resources open in a separate tab and are **not** embedded in the showcase. Set `sourceUrl` to the author's verified information or licence page if available. A download/source action will only appear if a real HTTPS download URL is provided, and may open the third-party website rather than downloading automatically.

An external example is included from The Mathy Bit and marked as independently hosted, with its ownership/licensing caveat. External sites can change or cease to work at any time. Check URLs periodically and remove unapproved or broken links.

## Troubleshooting

| Issue | Check |
| --- | --- |
| The homepage opens but shows “Unable to load the catalogue” | Verify that `resources.json` is in the same repository root as `index.html`, and its JSON has valid brackets/commas/quotes. The gallery must be accessed through **GitHub Pages**, not opened locally using a `file://` address. |
| A resource preview says the file is unavailable | Ensure the HTML file exists in `resources/`, with the **exact same lowercase filename** specified in `resources.json`. Paths are case-sensitive on GitHub Pages. |
| Download does not work | Check `downloadUrl`; it must name a real file. Test with a different browser if an organisational download policy blocks HTML files. |
| A change isn't visible | Confirm the commit is on the branch configured for GitHub Pages; refresh the website. Browser caching or Pages deployment delay can temporarily show an earlier version. |
| Site appears at a 404 URL | Confirm the repository is public, Pages is enabled, and the address includes the correct repository name and trailing slash. |
| The external example is unavailable | Open the external URL directly. Its availability and behaviour are outside this site's control. |
| An uploaded activity runs in preview but fails when downloaded | Its code may depend on other files or online resources. Prefer a self-contained HTML file; for multi-file activities, supply a true ZIP containing all dependencies, review its source, and update the catalogue appropriately. |

**Local testing:** Each file inside `resources/` can be opened directly by double-clicking its HTML file. The **gallery** needs to load `resources.json` over HTTP(S), so use the published GitHub Pages URL for gallery testing. No CLI or local web server is required by administrators.

## Security, accessibility and suitability

- Preview of local HTML uses `<iframe sandbox="allow-scripts">` without `allow-same-origin`; third-party websites open in a new tab. Do not paste contributor scripts into the parent gallery. **Sandboxing reduces risk but is not a guarantee that untrusted HTML is safe.** Review downloaded standalone HTML before opening or using it.
- Do not add identifiable student data, login credentials, internal URLs, API keys, confidential teaching materials, student photos, analytics or tracker scripts. GitHub Pages is public hosting, not a secure school repository.
- Each standalone demonstration activity uses built-in browser features only, with no network requests. The optional speech function in the communication board uses the browser speech feature when available.
- The gallery includes semantic landmarks, keyboard navigation, visible focus styling, responsive layout, high contrast, search announcements, a modal with Escape/focus return and reduced-motion support. **This is not a formal WCAG 2.1 AA or Singapore DSS compliance certification.** Conduct proper evaluation with real users and assistive technologies before deployment at scale.
- A resource should be reviewed for educational suitability, learner dignity, communication accessibility, sensory/motor needs, instructional clarity, functional reliability, privacy and licensing before use in a classroom. Adapt materials for individual learners; don't mistake a demo for an evidence-validated intervention.

## Maintenance and governance

Curation is manual: the gallery has **no** public upload feature, user registration, user data store, or admin approval dashboard. A proposed contribution must complete the review steps in [`CONTRIBUTOR_REVIEW.md`](CONTRIBUTOR_REVIEW.md); adding a catalogue entry does **not** indicate approval. A designated site maintainer should verify the creator's attribution and permission, evaluate each resource, review source files for safety, and confirm functionality and accessibility before adding entries. Record the review separately in the school's approved process.

These eleven demonstration files were created for this prototype. External content belongs to its respective creator and may have separate reuse restrictions. Do not imply external creators or schools endorse this showcase.
