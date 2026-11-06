# Joel Ebenka | DevOps and Cloud Engineer portfolio

Live site: **https://chrisjoel.github.io**

A single-page portfolio with an animated terminal intro (about 13 seconds, skippable), English and French, hosted free on GitHub Pages. There is **no build step and no npm dependency**: the page is one `index.html` plus an `assets/` folder.

## What is on the site

| Section | Content |
| --- | --- |
| Intro | `terraform apply` terminal, name reveal, the stack as a CI pipeline, stat counters. Skip button from second 0, Escape key, plays once per browser session, skipped with "reduce motion", "Replay intro" link in the footer |
| Hero + About | Name, role, tagline, buttons, stats, and an "about.md" card with bio, teaching and bilingual angle, quick facts |
| Skills | 5 categories with logos (Clouds, Containers & Orchestration, IaC & Config Management, CI/CD, Systems & Security), tools also used, soft skills, and a search box |
| Projects | Filterable cards with tags, an impact line, repo and live-demo links, shown as a 3D carousel (desktop default) or a grid, plus automatic sync of tagged GitHub repos |
| Experience | Timeline with key results, three visible achievements per role (expand for all), stack tags, education |
| Certifications | Four featured cards, "Show all" for the rest; resting the mouse on one pops up its details (issuer, date, ID, verify link); click, tap or Enter opens a dialog with issuer, date, credential ID and verification link |
| Contact | GitHub, email and LinkedIn buttons, copy-email button, and a form that opens your email app with the message ready (no server involved), and a "How I can help" list |

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
- **"How I can help" list:** `CONFIG.HELP` and the `help.*` keys in `I18N`.
- **Projects:** `CONFIG.PROJECTS`. Leave `link` empty to show "Repository link coming soon".
- **Experience and education:** `CONFIG.EXPERIENCE` and `CONFIG.EDUCATION`.
- **Experience globe:** `CONFIG.PLACES`. Each pin has `kind` (`work`, `edu` or `home`), `lat`/`lng`, `zoom`, a bilingual `name`, and `exp`/`edu` index lists pointing into `CONFIG.EXPERIENCE` / `CONFIG.EDUCATION`. Work pins mark the *client's* location (all roles were remote). The land dots are `CONFIG.GLOBE_DOTS` (about 5 KB, no library). A Globe/Timeline switch sits in the section header; the choice is remembered, phones and reduced-motion visitors start on the timeline.
- **Certifications:** `CONFIG.CERTIFICATIONS`. Put a badge image in `assets/badges/` and set `badge`.
- **CV:** replace `assets/Joel-Ebenka-CV.pdf`. It is public, so keep your phone number and address out of it.

Check your edits before pushing:

```bash
node scripts/check-site.mjs      # needs Node 18+, installs nothing
```

To preview locally, run `python3 -m http.server 8000` in this folder and open http://localhost:8000. (Opening the file by double-click also works, but the project sync then cannot load `projects.json`.)

## Automatic project sync

The sync is **topic-driven**: a repository appears on the site only if it carries the GitHub topic **`portfolio`** (or **`showcase`**).

**Tag a repo:** open the repository on GitHub, click the gear next to **About**, type `portfolio` in **Topics**, then **Save changes**. Extra topics such as `terraform`, `aws`, `kubernetes`, `jenkins` become filter chips and logos (see `CONFIG.SYNC.TOPIC_MAP`).

**Newest first:** projects are sorted by the last push date of their GitHub repo. A project with no repo (for example the pediatric platform) has no date, so it is listed last unless you add `date: 'YYYY-MM'` to its entry in `CONFIG.PROJECTS`.

**Stack icons are detected automatically.** (The sync also reads each repo's README, and the page falls back to keywords in the name and description, then to the GitHub icon, so a card never has no icon.) For every included repo the sync reads its languages and file list and picks logos: Terraform (`.tf`), Docker (`Dockerfile`), Jenkins (`Jenkinsfile`), GitHub Actions (`.github/workflows`), Ansible, Kubernetes, Python, Node.js, React, Netlify and more, plus keywords in the repo name, description and topics (aws, gcp, k8s...). Curated cards that list their own `logos` keep them. To support a new technology, add its SVG to `assets/logos/` and a rule in `scripts/sync-projects.mjs`.

**Linked repos stay fresh without a tag.** Repos linked from a card in `CONFIG.PROJECTS` get their date, language and stack from GitHub even when they have no `portfolio` topic. Only tagged repos create new cards.

**What happens next**
1. On every deploy, and every night at 02:17 UTC, `scripts/sync-projects.mjs` lists your public repos through the GitHub API and keeps the tagged ones (archived repos are skipped; forks are kept when tagged).
2. It writes `projects.json` into the published site.
3. The page merges it with `CONFIG.PROJECTS`: a curated card gets live facts (language, last update, stars, demo link), and a tagged repo with no curated card gets a new card automatically.

**See it immediately:** after tagging, open the repository's **Actions** tab, choose "Build and deploy to GitHub Pages", then **Run workflow**. Otherwise it appears after the next nightly run.

**If nothing changes, check:**
- The topic is exactly `portfolio` (or `showcase`) and the repo is public.
- The workflow file is on the default branch `master`; scheduled runs only run from there. GitHub also pauses scheduled workflows after 60 days without repository activity, so re-enable it in the Actions tab if that happens.
- The latest run is green. Its "Sync projects" step prints how many repos were scanned and which were synced.
- You are looking at the deployed site, not an old copy (hard refresh).

If GitHub cannot be reached, the site shows the cards in `CONFIG.PROJECTS`.

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
