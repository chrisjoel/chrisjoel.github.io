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

## Design pass and sync review (October 22)
- **Why the portfolio did not sync:** none of the public repositories had the GitHub topic `portfolio`, so the sync had nothing to pick up. The `30-Day-Terraform-challenge-` repo is a fork, which the first version of the script skipped even when tagged.
- **Sync fixes:** the script now uses the user repos endpoint with pagination (more reliable than the search endpoint, which can lag), accepts `portfolio` or `showcase`, keeps tagged forks, ignores topic case, and prints what it synced. Checked against the approach in the dev.to article (scheduled job, topic filter, public repo API): same model; ours adds pagination, a build-time fallback and no committed files.
- **Design:** hero and About merged; experience as a timeline with highlights, expandable bullets and stack tags; soft skills added; project cards gained tags, an impact line and demo links; certifications collapsed to four with "Show all"; contact gained a copy-email button and a mailto-based form; active nav link and scroll progress bar added. KiloShare now links to its repo and live demo.
- **Retested:** zero console/CSP errors, no overflow from 360 to 3840 px, axe scan clean, EN/FR, expand/collapse and form flows.

## Carousel and extras (November 2)
- Added a CSS-3D projects carousel with a Grid/Carousel switch, a skills search box and a "How I can help" list. No new library or CDN, so CSP and integrity hashes are unchanged.
- Performance: only transform and opacity animate, no autoplay, no `will-change`, layout shift while navigating measured at 0. Reduced-motion and phone visitors get the grid by default.
- Accessibility: labelled carousel region, only the front card's links are focusable, slide changes announced politely; axe scan clean in carousel mode.
- Not added on purpose: a WebGL/3D globe (extra library, heavier on old phones).

## Carousel drag, motion, order and stack icons (November 2)
- Carousel: drag with mouse or finger (cards follow the pointer and snap), sideways trackpad scroll; clicks that end a drag are ignored.
- Motion: skill tiles pop in one after another, certification cards rise in with a staggered delay, shine sweep and badge tilt on hover, dialog fade-in. Transform and opacity only; all off for reduced-motion visitors.
- Experience: roles are collapsed to dates, highlight chips and stack tags; "Show details" expands the bullets (section is about half as tall).
- Projects are sorted newest first by repo push date. Dates in CONFIG are only fallbacks.
- Sync: now detects each repo's stack from its languages and files (verified against mocked GitHub data), so tagged repos get icons like curated cards. 14 more logos added (Devicon, MIT). Linked repos are refreshed without needing a tag.

## Hover certificates, stack icons, motion (November 3)
- Certificates: a details card pops up when the mouse rests on a certificate (or on keyboard focus) and stays open while the pointer is over it, so the Verify link is clickable. Click, tap or Enter still opens the dialog, which is what touch and screen-reader users get. Hidden from assistive tech to avoid duplication.
- Stack icons: new cards now get icons from three sources in order: the sync's file/README detection, GitHub topics, keywords in the name and description; if all are empty a GitHub icon is shown. Tested with repos that have no stack files.
- Motion: slow drifting glows, animated heading underlines, cursor spotlight on cards, light sweep on primary buttons, drawing timeline with popping dots, staggered project cards, sheen on the hero name, animated nav underline. All transform/opacity/gradient based, and disabled for reduced motion.

## Experience globe with education pins (November 4)
- Custom canvas globe (about 1,700 land dots, 5 KB, no library, so CSP and SRI are unchanged). Drag to rotate; pins, chips and the details panel stay in sync; arcs run from the home base.
- Pins: New Zealand, Houston, Delaware (client locations), Douala and Yaounde (education/home). Chips below the globe are the keyboard and screen-reader route.
- Switch: Globe or Timeline, stored in localStorage. Default is Globe on desktop, Timeline on phones and for reduced motion.
- Performance: drawing stops when the globe is off-screen or the tab is hidden (0 redraws measured). Draw time per frame was not measured separately.
- To confirm: EST LaSalle and Orange Digital Center are listed only as "Cameroon" in the CV and are attached to Yaounde.
