# SPED Interactive Showcase — Pages CMS pilot setup

Prepared as a starter configuration, not an end-to-end verified Pages CMS deployment.

## What stays unchanged
- Public website: https://spedtech-cloud.github.io/sped-teacher-showcase/
- Repository: https://github.com/spedtech-cloud/sped-teacher-showcase
- `resources.json`: existing catalogue (18 entries at time of inspection)
- `resources/*.html`: original activities, including the 3 newer named resources.

## First-use workflow
1. Back up `resources.json`. Consider creating a test branch first.
2. Upload `.pages.yml` to the repository root, committing to the test branch or main after review.
3. Visit https://app.pagescms.org and sign in with GitHub; install the GitHub App with access to this repository only. Select the relevant branch.
4. Open Resource catalogue, edit the metadata of one test entry, and save.
5. Inspect the resulting `resources.json` diff in GitHub. Ensure array format, original records, all optional fields, and nulls were preserved. If the diff is unexpectedly broad, revert and do not use it on main.
6. Upload a fictional standalone HTML via HTML teaching activities, using a lowercase hyphenated filename.
7. Add a corresponding catalogue record with unique `id` and both URLs set to `resources/filename.html`.
8. Save, check that the uploaded HTML exists, and open its direct Pages URL. Verify the new resource card appears on the homepage after deployment.
9. Spotlight: set the previous spotlight field false and the new one true. The public gallery currently displays the first spotlight entry if several are true.

## Deliberate limitations
- Uploading HTML to the media library is separate from adding a catalogue entry. A one-click atomic upload-and-register workflow is not promised.
- The Pages CMS media manager's auto-generated path value has **not** been verified against this gallery's strict `resources/filename.html` requirement. The preview/download URL fields are deliberately plain text; enter the verified relative path.
- Only upload reviewed HTML. Standalone HTML on the public site's origin can run JavaScript; do not upload restricted documents or personal data.
- Unlisting a resource removes it from the gallery, but does not delete its HTML file or public Git history. File removal is a separate action.
- `settings.content.merge: true` is meant to preserve unspecified keys; inspect the first saved Git diff, especially with the top-level array and existing optional fields.
- If you intend to support external resources in future, the strict local URL pattern on the starter fields must be relaxed and reviewed carefully.
