# SPED Interactive Showcase — Accessibility quality assurance

**Target:** WCAG 2.2 Level AA for the public showcase, the private administrator interface and each published HTML activity, alongside relevant Singapore Digital Service Standards (DSS) guidance. **Status: target, NOT certified.** No completed Oobee audit is claimed by this package.

## Two complementary checks

1. **Oobee automated scan:** Singapore GovTech's open-source scanner identifies certain code-level problems such as unlabelled controls and potential colour-contrast failures. See [GovTech's Oobee guidance](https://www.tech.gov.sg/products-and-services/for-government-agencies/informational-services/oobee/) and [Oobee product site](https://products.tech.gov.sg/products/oobee). The hosted service's eligibility/access and scan options must be verified by the deploying team. Scan the **live** public homepage and each of the 11 standalone resource URLs after deployment. If approved IT arrangements permit, use an authenticated/local scanning workflow for the private admin portal. Do not weaken Cloudflare Access or make the portal public just to scan it.
2. **Manual testing:** Automated tools do not evaluate all WCAG criteria or whether teaching content is understandable to a particular SPED learner. Test keyboard-only operation, visible focus, zoom, reduced motion, real screen reader interactions, cognitive load and functional classroom tasks. Where possible include educators and users with relevant access needs.

## Practical release gate (record pass / fail / not applicable)

| Test | WCAG 2.2 examples | Method |
| --- | --- | --- |
| Every feature works without a mouse; no keyboard traps | 2.1.1, 2.1.2 | Tab, Shift+Tab, Enter/Space, Escape; try the preview dialog and every activity |
| Focus stays visible, is not obscured and returns to the launcher after the dialog closes | 2.4.7, 2.4.11, 2.4.3 | Keyboard test |
| Clear names, labels, instructions, required-field indication and errors | 1.3.1, 2.4.6, 3.3.2, 4.1.2 | Inspect and screen-reader test |
| Text contrast at least 4.5:1 for normal text; large text at least 3:1; important non-text UI at least 3:1 | 1.4.3, 1.4.11 | Oobee + manual check on every state (including high contrast) |
| Supports 200% zoom, 400% reflow at 320 CSS px and mobile portrait; avoids horizontal scrolling where not essential | 1.4.4, 1.4.10 | Browser zoom and viewport inspection |
| Touch targets are comfortably spaced; WCAG 2.2 minimum target size rules are checked | 2.5.8 | Manual mobile inspection |
| Content does not rely on colour or sound alone | 1.4.1, 1.2.x | Check all teaching cues |
| Motion, sound, countdown and time limits can be paused or adjusted where required; respect reduced-motion preference | 2.2.1, 2.2.2, 2.3.x | Test motion and resource-specific controls |
| Status changes are communicated to assistive technology | 4.1.3 | Test search/filter results, upload status and errors |
| Interactive media or symbols have usable text alternatives; accessible instructions are meaningful for learner profile | 1.1.1, 1.3.1 | Manual plus teacher/learner feedback |

## Screen-reader checks

- At minimum, test NVDA on Windows (Chrome/Edge) and VoiceOver on iOS/macOS if available; document device/browser combination and findings.
- Read the page by headings, landmarks, links, buttons and form controls.
- Open **Try It** then close with Escape; ensure focus returns to the triggering button.
- Test the Resource Spotlight controls and all admin publishing actions.
- With any newly published activity, assess whether an assistive-technology user can successfully complete the task; a labelled button alone is not enough.

## Publishing rule

Each new HTML resource needs a documented **manual accessibility review**, an Oobee scan when technically possible, and a plan to address findings. If an automated scan cannot be performed (e.g. unreleased standalone HTML), record **Not scanned — pending** instead of claiming compliance. Consider holding public release until critical issues are fixed. Re-run the review when resource HTML, shared CSS, admin interface or spotlight logic changes.

## References

- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C — Understanding conformance (automatic and human evaluation)](https://www.w3.org/WAI/WCAG22/Understanding/conformance)
- [Singapore DSS](https://info.standards.tech.gov.sg/control-catalog/dss/)
- [GovTech Oobee](https://www.tech.gov.sg/products-and-services/for-government-agencies/informational-services/oobee/)
