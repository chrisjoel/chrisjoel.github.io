# Joel Ebenka | DevOps and Cloud Engineer portfolio

Live site: **https://chrisjoel.github.io**

A single-page portfolio with an animated terminal intro (about 13 seconds, skippable), English and French, hosted free on GitHub Pages. There is **no build step and no npm dependency**: the page is one `index.html` plus an `assets/` folder.

## What is on the site

| Section | Content |
| --- | --- |
| Intro | `terraform apply` terminal, name reveal, the stack as a CI pipeline, stat counters. Skip button from second 0, Escape key, plays once per browser session, skipped with "reduce motion", "Replay intro" link in the footer |
| Hero | Name, role, tagline, View projects / Contact / Download CV, stats |
| Skills | 5 categories with logos: Clouds, Containers & Orchestration, IaC & Config Management, CI/CD, Systems & Security |
| Projects | Filterable cards, each linking to its repository, plus automatic sync of GitHub repos tagged `portfolio` |
| Experience | Three roles and education from the CV |
| Certifications | Clickable cards that open a dialog with issuer, date, credential ID and verification link |
| About, Contact | Teaching and bilingual angle; GitHub, email and LinkedIn icon buttons |

## Project structure

```
.
├── index.html                      # The whole site. Content is in CONFIG and I18N near the bottom
├── 404.html
├── robots.txt
├── projects.json                   # Empty seed. The workflow overwrites it on every deploy
├── assets/
│   ├── logos/                      # Tool and issuer logos (SVG)
│   ├── badges/                     # Certification badge images (PNG)
│   ├── og-image.png                # Link preview image (1200x630)
│   └── Joel-Ebenka-CV.pdf          # Public CV (phone number removed)
├── scripts/
│   ├── sync-projects.mjs           # Writes projects.json from repos tagged "portfolio"
│   └── check-site.mjs              # Content, asset, SRI and EN/FR checks (runs in CI)
├── .github/
│   ├── workflows/deploy.yml        # Check, sync, build, deploy
│   └── dependabot.yml              # Weekly updates for the pinned Actions
└── .gitignore
```

## Edit the content

Open `index.html` and look for the `EDIT HERE` comments.

- **Text, in both languages:** the `I18N` object (`en` and `fr`). Every key must exist in both.
- **Email, LinkedIn, GitHub, colors, stats:** the top of `CONFIG`.
- **Skills:** `CONFIG.SKILLS`. A `logo` is the file name in `assets/logos` without `.svg`.
- **Projects:** `CONFIG.PROJECTS`. Leave `link` empty to show "Repository link coming soon".
- **Experience and education:** `CONFIG.EXPERIENCE` and `CONFIG.EDUCATION`.
- **Certifications:** `CONFIG.CERTIFICATIONS`. Put a badge image in `assets/badges/` and set `badge`.
- **CV:** replace `assets/Joel-Ebenka-CV.pdf`. It is public, so keep your phone number and address out of it.

Check your edits before pushing:

```bash
node scripts/check-site.mjs      # needs Node 18+, installs nothing
```

To preview locally, run `python3 -m http.server 8000` in this folder and open http://localhost:8000. (Opening the file by double-click also works, but the project sync then cannot load `projects.json`.)

## Automatic project sync

Add the GitHub topic **`portfolio`** to a public repository (repository page, the gear next to "About", Topics). Every deploy and a nightly run at 02:17 UTC will:

1. Read all your repos with that topic (archived repos and forks are skipped).
2. Add language, last update, stars and demo link to the matching curated card.
3. Add a new card for tagged repos that are not in `CONFIG.PROJECTS`. Other topics (`terraform`, `aws`, `kubernetes`, ...) become filter chips and logos, see `CONFIG.SYNC.TOPIC_MAP`.

If GitHub cannot be reached, the site simply shows the cards in `CONFIG.PROJECTS`.

## Deploy to GitHub Pages

1. Create a **public** repository named exactly `chrisjoel.github.io`.
2. Push this project to `master`. Work on `feature/dev` and merge through pull requests.
3. In **Settings, Pages**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab. The run "Build and deploy to GitHub Pages" publishes the site.

Pull requests only run the checks and the build. Pushes to `master`, the nightly schedule and a manual run deploy.

If the repository has a different name or you use a custom domain, update `canonical`, `og:url`, `og:image` and the JSON-LD `url` in `index.html`.

## Security notes

- Content Security Policy (meta tag): scripts only from this site and `cdn.jsdelivr.net`, styles from this site and Google Fonts, no frames, forms or plugins.
- CDN scripts are version-pinned with Subresource Integrity hashes. If you bump a version, recompute the hash: `openssl dgst -sha384 -binary file.js | openssl base64 -A`.
- Dynamic content (including `projects.json`) is inserted as text only, and links must be `https`.
- The workflow runs with read-only permissions, only the deploy job can publish, Actions are pinned to commit SHAs and kept current by Dependabot.
- The email address is public on the page by design. Google Fonts receives visitors' IP addresses; self-host the two fonts if that matters to you.

## Credits

Tool logos from [Devicon](https://devicon.dev/) (MIT) and [Simple Icons](https://simpleicons.org/) (CC0); logos and badges remain the property of their owners. Built with [Tailwind CSS](https://tailwindcss.com/) and [GSAP](https://gsap.com/). Fonts: Inter and JetBrains Mono.

## License

Code and content are © Joel Ebenka. Please do not republish the site as a whole without permission.
