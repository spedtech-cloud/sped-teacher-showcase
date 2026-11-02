# Resource Contribution & Review Checklist (POC)

**Status:** Administrator guidance for a public SPED teaching-resource showcase. This is a suggested workflow, **not** an MOE approval policy, accessibility certification or automatic safety check.

## Before publishing a resource

Record: resource title and version; creator / contributing school (if confirmed); reviewer name and role; review date; licence or permission; exact source file name; link to a retained review record in the organisation’s approved system. Do not publish reviewer personal details or confidential student information on the public site.

| Gate | Minimum checks | Record |
| --- | --- | --- |
| **1. Purpose and curriculum** | Objective/purpose is clear; choose one of MOE's seven SPED learning domains, or **Teaching Supports** for non-TLS tools; assess fit with the school's curriculum; **do not claim specific TLS outcomes without validating against the actual syllabus**. | Pass / Revise / Reject |
| **2. Learner access and dignity** | Adaptable for communication and AAC, cognition, sensory, motor and literacy needs; understandable language, usable feedback, culturally appropriate examples; no stigmatising content. | Pass / Revise / Reject |
| **3. Teaching and assessment** | Clear instructions; appropriate models/prompts; suggested adaptation; observable learner response; concrete and meaningful generalisation beyond screen interaction. | Pass / Revise / Reject |
| **4. Privacy and safety** | No identifiable student information, internal credentials or school data; verify links/scripts do not transmit user data; evaluate any untrusted or external dependencies. | Pass / Revise / Reject |
| **5. Intellectual property** | Verify ownership or licence for the HTML, icons, images, symbols and sounds; document permission to redistribute and adapt; do not imply a school's authorship without its consent. | Pass / Revise / Reject |
| **6. Functionality** | Verify resource loads on desktop and mobile, functions offline if claimed, has working buttons/reset, and downloadable files contain all dependencies. | Pass / Revise / Reject |
| **7. Accessibility** | Keyboard access, visible focus, labels, contrast, zoom/text scaling, reduced motion when relevant; test with intended assistive technology and learners. Do not claim WCAG conformance without a formal audit. | Pass / Revise / Reject |
| **8. External resources** | Verify live URL, provenance, licence, data practices and content; mark as independently hosted; remove if unavailable or no longer suitable. | Pass / Revise / Reject / N/A |

## Decision

- **Approved for catalogue:** all relevant gates passed and designated reviewer signs off. This is an internal editorial decision, **not** evidence of MOE endorsement or general classroom suitability.
- **Needs revision:** stop publication until changes are made and the resource is checked again.
- **Not approved:** do not include in public catalogue.
- **Prototype-only example:** may remain clearly marked as an illustrative demonstration, but must not be presented as classroom-reviewed or recommended.

## Minimum catalogue metadata

Use the fields in `resources.json`: `title`, `domain`, `school`, `description`, `learningObjective`, `curriculumContext`, `suggestedUse`, `instructionalApproach`, `assessmentCheck`, `transferTask`, `adaptations`, `tags`, `reviewStatus`, `hostingType`, `previewUrl`, `downloadUrl`, `creator`, and `license`. For an external resource, also document `sourceUrl` where it exists. **Do not set `reviewStatus` to an approved claim unless the actual review and authorisation have occurred.**

## Relevant public context

- [MOE: National SPED Curriculum (2025)](https://cos.moe.gov.sg/2025-announcements/)
- [MOE: Seven SPED learning domains](https://www.moe.gov.sg/-/media/files/about-us/moe-corporate-brochure.pdf)
- [MSF: 2023 Communication & Language and Social-Emotional Learning syllabuses](https://www.msf.gov.sg/what-we-do/enabling-masterplans/yearly-updates/2023)
- [MSF: 2024 Numeracy and PE syllabuses](https://www.msf.gov.sg/what-we-do/enabling-masterplans/yearly-updates/2024)

**Maintenance:** Recheck content and external links periodically or whenever a source, licence or school curriculum changes.

## Additional checks for digital literacy resources

- [ ] Record the exact school Digital Literacy outcome / strand, if supplied. Otherwise label alignment **provisional**.
- [ ] Keep digital literacy as a cross-domain skill or search tag, not a claim that it is an eighth National SPED Curriculum TLS.
- [ ] Check whether the demonstration measures actual device skills, communication or digital decisions—or only simulated recognition / tapping.
- [ ] Provide meaningful differentiation (including prompts, AAC / alternative access, reading level, and opportunities for independent practice).
- [ ] Confirm that no real passwords, personal identification, staff numbers, internal accounts or messages are collected, transmitted or stored.
- [ ] Include a transfer task with an approved platform and a safe, supervised real-life context.

Public reference: [IMDA Digital Skills for Life](https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2024/new-digital-skills-for-life-framework), a general digital competency framework, not a SPED curriculum.
