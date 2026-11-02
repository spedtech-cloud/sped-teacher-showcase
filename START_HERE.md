# SPEDTech Private Resource Administration — Setup Guide

**Status:** Working prototype code and mocked GitHub API tests. **Not deployed.** Requires Cloudflare Access configuration and a GitHub fine-grained token. Do not use with confidential school or learner data without organisational approval and a security review.

## The arrangement

- **Public showcase stays on GitHub Pages:** https://spedtech-cloud.github.io/sped-teacher-showcase/
- **Private admin portal runs separately on a Cloudflare Worker:** `https://<your-worker>.<your-account>.workers.dev/`
- **Cloudflare Access:** screens every request. The Worker also rejects anyone whose signed-in email is not in its explicit `ADMIN_EMAILS` allowlist. The public site never needs the token.
- **Spotlight:** the administrator may set or clear one featured resource, published as a static card above the gallery.
- **GitHub REST API:** when an approved administrator uploads a reviewed HTML file, the Worker adds the HTML file under `resources/` and registers it in `resources.json`. Removal unlists the resource and then deletes the current HTML file.

**Privacy:** the public GitHub repository and any published HTML are public. Git history can retain deleted files. Do not put private submissions, approval records, credentials, personal data, or a Worker token in the repository. Do not upload `worker.js` or `admin-ui.html` to GitHub Pages.

## Part A — Remove the external example now (before admin setup)

This package includes `public-site-update/resources.json`, `public-site-update/index.html` and `public-site-update/assets/app.js` prepared for the current showcase. They:

1. Remove the external Kindergarten Maths Apps entry, leaving the 11 local demonstration resources.
2. Remove external-site wording from the page.
3. Keep the Digital Literacy and Healthy and Safe Relationships discovery filters and ensure only **locally hosted HTML** can be registered by the gallery script.
4. Retain the resource contribution/removal placeholders until you give the team contact address.

In GitHub, open https://github.com/spedtech-cloud/sped-teacher-showcase and replace the corresponding files at the same paths. Use the browser **Edit/Pencil** button on each existing file to paste the replacement, or use **Add file → Upload files** where GitHub allows replacing files. Commit the changes on `main`. Verify the public site no longer displays the external example.

> GitHub's public history may still expose the previously linked URL. Removing it from the gallery is not the same as erasing history.

## Part B — Create the private admin (one-time; browser only)

### 1. Cloudflare account

Open https://dash.cloudflare.com/ and sign in or create a Cloudflare account. Enable Zero Trust if required for Access. Confirm that your organisation permits use of Cloudflare; for now, this should remain a demonstration-only project.

### 2. Create the Worker

Under **Workers & Pages**, create a new Worker (name suggestion: `spedtech-resource-admin`). Use **Edit Code** to replace the starter JavaScript with the **entire `worker.js`** file from this package. Deploy. The Worker must *not* be advertised publicly until Access is enabled; its code denies access if Access is missing, but Access should still be the first protective layer.

Only `worker.js` is needed in the Cloudflare editor: it contains the admin webpage and backend in one file. No Node.js, CLI or build process is needed on your computer.

### 3. Protect the whole Worker with Cloudflare Access

Open the Worker in **Workers & Pages → Access** and choose **Protect this Worker behind Access**. Choose **All traffic** (production **and previews**) and an authentication policy that permits only designated administrators' **exact email addresses**. Avoid a blanket email-domain allow rule unless everybody with that domain should be an admin. If your Cloudflare dashboard uses the older interface, find **Settings → Domains & Routes → workers.dev → Enable Cloudflare Access**; verify that previews are also protected.

**Do not choose Previews only.** Confirm that a signed-out/private browser session cannot view the admin page. If you cannot enable Access for your account, do **not** proceed to add a GitHub token.

### 4. Set the email allowlist privately

In **Worker → Settings → Variables and Secrets**, add:

| Name | Type | Value |
|---|---|---|
| `ADMIN_EMAILS` | Text variable or Secret | Exact authorised email address(es), separated by commas |

No email is hardcoded in the code or public website. You can start with just yourself; add other designated SPEDTech administrators later.

### 5. Create a GitHub fine-grained access token

At https://github.com/settings/personal-access-tokens/new, create a **fine-grained personal access token** with:

- Repository owner: the owner of `spedtech-cloud/sped-teacher-showcase`.
- Repository access: **Only selected repositories → sped-teacher-showcase**.
- Repository permissions: **Contents → Read and write**. Do not give it administration, secrets, workflows or access to other repositories.
- Short expiry and planned rotation. Organisation rules may require approval before the token can operate.

**Do not send this token to ChatGPT, email it, paste it into GitHub, or store it in a plain-text variable.**

Return to **Cloudflare Worker → Settings → Variables and Secrets**, add:

| Name | Type | Value |
|---|---|---|
| `GITHUB_TOKEN` | **Secret** | Your fine-grained token |

Deploy the updated configuration. The Worker uses the fixed repository `spedtech-cloud/sped-teacher-showcase` and branch `main`. If you use another branch, edit the constants near the start of `worker.js` before deploying.

### 6. Test authentication and publication

1. Open the Worker URL in a private/incognito window. Without an approved sign-in, you must not get to the admin page.
2. Sign in as an approved administrator. The page should show the 11-resource catalogue and the Spotlight controls.
3. Upload one *fictional, reviewed* standalone HTML file, complete its metadata and confirm the review checkbox.
4. Confirm its appearance on the public showcase, preview and download it.
5. Select **Set Spotlight** for the test resource and verify it appears above the public gallery. Select **Clear Spotlight** and verify it disappears.
6. Click **Remove** next to that test resource and confirm it no longer appears in the gallery.
7. Inspect your GitHub commits: you should see a file addition/deletion and a `resources.json` update. Review GitHub Pages' deployment status.

If the Worker shows a 403: check Cloudflare Access, `ADMIN_EMAILS`, the email used for login, and GitHub token permissions. If it shows a 409: another change may have happened; refresh, inspect the repository and retry. If you see an orphan file after a partial write failure, manually remove it from `resources/`.

## How SPEDTech uses the portal afterwards

**To add:** sign in → select reviewed `.html` file (150 KB maximum) → fill title, learning domain, objective, classroom use and reuse permission → tick review declaration → **Upload and publish**. An appropriate filename is automatically generated from the title.

**To spotlight:** sign in → search for an approved resource → **Set Spotlight**. Only one resource can be highlighted at a time. Choose **Clear Spotlight** to remove it.

**To remove:** sign in → search → **Remove** → confirm. The catalogue entry is removed first, then the current HTML file. GitHub commit history is not automatically erased.

**The public site is separate.** No login is required to explore and download approved materials.

## Safeguards and limitations

- Requires Cloudflare Access **and** a server-side email allowlist. Requests with no `ctx.access` are denied, even if someone knows the Worker URL.
- GitHub token is used only by Worker code, supplied through Cloudflare **Secret**, never sent to the browser.
- Mutating requests require JSON and same-origin requests; the UI uses DOM text nodes for catalogue content. Permissions are checked on every request.
- Only standalone `.html` is supported, with a 150 KB size limit. The Worker does not accept HTML/ZIP assets bundles; there is no public submission function.
- A mandatory review declaration is **not** an automated safety review. Uploaded scripts can make network requests. Only upload code that SPEDTech has actually inspected and approved. Ask IT/security staff to assess this system before production use.
- Metadata and files are written in two serial GitHub operations; a failed second operation can leave an orphaned file, which is reported. This prototype does **not** provide atomic transactions or a complete approval/audit trail.
- GitHub's authenticated user appears on commits; check GitHub privacy email settings. Do not assume that deleting a file erases all historical copies.
- On a managed school laptop, Cloudflare/GitHub access, token creation, or external hosting may be prohibited or restricted by organisational policy.
- This is a technical prototype, **not** an MOE-approved information-security implementation.

## What has been tested

- JavaScript syntax checks for `worker.js`, server logic and public gallery script.
- An automated Node.js mock-GitHub test for the authentication guard, exact-email allowlist, catalogue list, upload, duplicate protection, removal, origin protection, and audit of expected writes.

**Not tested:** your Cloudflare account, live Cloudflare Access sign-in, a real GitHub write, deployment propagation, penetration testing or formal accessibility review.

## Official documentation

- [Cloudflare — Protect Workers with Access](https://developers.cloudflare.com/workers/configuration/cloudflare-access/)
- [Cloudflare — Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Cloudflare — Worker dashboard](https://developers.cloudflare.com/workers/get-started/dashboard/)
- [GitHub — Repository file CRUD endpoints](https://docs.github.com/en/rest/repos/contents)
- [GitHub — Fine-grained personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

## Accessibility

See `ACCESSIBILITY_QA.md` for the WCAG 2.2 AA development target, Oobee scanning guidance, and required manual accessibility tests. The project has not received a formal WCAG audit or a verified Oobee report. The private admin portal must remain protected during accessibility testing.
