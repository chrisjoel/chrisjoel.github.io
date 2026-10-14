# Audit report

## Security
| Finding | Status |
| --- | --- |
| Public CV contained a phone number | Fixed: redacted copy shipped ("Phone on request"). Your original file is untouched. Layout verified unchanged. |
| No Content Security Policy, no referrer policy | Fixed: CSP and referrer meta tags added; tested with zero violations |
| CDN scripts unpinned/unverified risk | Fixed: exact versions plus SRI hashes; `check-site.mjs` fails the build if one is missing |
| Synced GitHub data could inject HTML or `javascript:` links | Fixed: text-only rendering, https-only URLs, sanitizer; tested with a malicious payload |
| Workflow had broad permissions | Fixed: read-only by default, deploy job alone has `pages`/`id-token` write, token not persisted, SHA-pinned Actions, Dependabot, timeouts, concurrency |
| Next.js dependency tree | Removed (no dependencies at all now) |
| Docker image vulnerabilities (earlier) | No longer relevant, Docker removed |
| Email public, Google Fonts shares IPs | Accepted, documented in README |

## Errors and quality
- LinkedIn URL differed between CV and site: unified to `joel-ebenka-b810651b5` (please confirm).
- "300+ learners" is from your brief and not in the CV: please confirm it.
- Tested in Chromium: intro length 13.8 s, skip, Escape, replay, once-per-session, reduced motion, EN/FR, certification dialog, no horizontal overflow at 360/390/768/1280/1920/3840 px, zero console or CSP errors, automated accessibility scan (axe) with no violations, fallback when GSAP fails to load.
- Fixed during testing: dialog was pinned to the top-left corner.

## Deviations from the brief (deliberate)
- Six real projects instead of three placeholders, with repo links and sync.
- Extra sections kept from earlier work: Experience, Education, Certifications.
- The "blur" exit of the intro is a scale and fade, to keep animation to transform and opacity only.
- Tailwind runs from its browser build (fine for a portfolio, not recommended for large production sites): a very brief unstyled flash is hidden by fading the page in.

## For you to check
- French translations are mine: please proofread.
- Open each Coursera verification link once.
- `og:url`/canonical assume `https://chrisjoel.github.io/`.
- KiloShare and the pediatric platform have no repository link; the EKS repo README is empty.
- The workflow could not be run here; it only runs on GitHub.
