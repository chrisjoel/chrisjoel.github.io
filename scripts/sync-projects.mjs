<<<<<<< HEAD
// Writes projects.json for the portfolio.
// Usage: node scripts/sync-projects.mjs [output-path]        (default: projects.json)
//
// A repo is included when it carries the GitHub topic "portfolio" (or "showcase"), OR when it is linked
// from a card in CONFIG.PROJECTS of index.html (so its date and stack stay fresh without a tag).
// Only tagged repos create NEW cards. Archived and private repos are skipped.
// For each included repo the script also detects the stack from its files (Terraform, Docker, Jenkins, ...)
// and writes it as logo names (files in assets/logos), so automatic cards get icons like the curated ones.
// Never fails the build: if GitHub is unreachable an empty list is written.
import { readFileSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2] || 'projects.json';
const OWNER = process.env.GITHUB_OWNER || 'chrisjoel';
const TOPICS = (process.env.PORTFOLIO_TOPICS || 'portfolio,showcase').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
const token = process.env.GITHUB_TOKEN;
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'portfolio-sync', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
const api = async (path) => {
  const res = await fetch('https://api.github.com' + path, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`GitHub API returned ${res.status} for ${path}`);
  return res.json();
};

// Repos linked from curated cards in index.html
function curatedNames() {
  try {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    const block = html.match(/\/\* CONFIG:START \*\/([\s\S]*?)\/\* CONFIG:END \*\//)?.[1] || '';
    return new Set([...block.matchAll(/link:\s*'https:\/\/github\.com\/([^/']+)\/([^'/]+)'/g)]
      .filter((m) => m[1].toLowerCase() === OWNER.toLowerCase()).map((m) => m[2].replace(/\.git$/, '').toLowerCase()));
  } catch { return new Set(); }
}

async function listRepos() {
  const all = [];
  for (let page = 1; page <= 10; page++) {            // GitHub caps per_page at 100, so paginate
    const batch = await api(`/users/${encodeURIComponent(OWNER)}/repos?type=owner&sort=pushed&per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all;
}

// ---- Stack detection. Each rule returns true when the repo uses the technology. Order = display priority. ----
const word = (re) => (ctx) => re.test(ctx.text);
const has = (re) => (ctx) => ctx.paths.some((p) => re.test(p));
const lang = (...names) => (ctx) => names.some((n) => ctx.langs.includes(n));
const RULES = [
  ['terraform',         (c) => lang('HCL')(c) || has(/\.tf$/)(c) || word(/\bterraform\b/)(c)],
  ['amazonwebservices', word(/(^|[^a-z0-9])(aws|ec2|eks|s3|lambda|dynamodb|cloudfront|route53|ecr|rds)([^a-z0-9]|$)/)],
  ['googlecloud',       word(/(^|[^a-z0-9])(gcp|gcloud|gke|google[ -_]?cloud)([^a-z0-9]|$)/)],
  ['azure',             word(/(^|[^a-z0-9])azure([^a-z0-9]|$)/)],
  ['kubernetes',        (c) => word(/(^|[^a-z0-9])(k8s|kubernetes|eks|helm|kubectl)([^a-z0-9]|$)/)(c) || has(/(^|\/)(k8s|kubernetes|manifests|chart\.yaml)(\/|$)/)(c)],
  ['docker',            (c) => lang('Dockerfile')(c) || has(/(^|\/)(dockerfile|docker-compose\.ya?ml|compose\.ya?ml)$/)(c)],
  ['ansible',           has(/(^|\/)(ansible\.cfg|playbook[^/]*\.ya?ml|roles\/[^/]+\/tasks\/)/)],
  ['jenkins',           (c) => has(/(^|\/)jenkinsfile$/)(c) || word(/\bjenkins\b/)(c)],
  ['githubactions',     has(/^\.github\/workflows\/[^/]+\.ya?ml$/)],
  ['nginx',             (c) => has(/(^|\/)nginx\.conf$/)(c) || word(/\bnginx\b/)(c)],
  ['prometheus',        (c) => has(/(^|\/)prometheus\.ya?ml$/)(c) || word(/\bprometheus\b/)(c)],
  ['grafana',           word(/\bgrafana\b/)],
  ['maven',             has(/(^|\/)pom\.xml$/)],
  ['java',              lang('Java')],
  ['python',            (c) => lang('Python')(c) || has(/(^|\/)requirements\.txt$/)(c)],
  ['flask',             word(/\bflask\b/)],
  ['bash',              lang('Shell')],
  ['nextjs',            has(/(^|\/)next\.config\.[cm]?[jt]s$/)],
  ['react',             (c) => word(/\breact\b/)(c) || has(/(^|\/)src\/app\.[jt]sx$/)(c)],
  ['typescript',        (c) => lang('TypeScript')(c) || has(/(^|\/)tsconfig\.json$/)(c)],
  ['nodejs',            has(/(^|\/)package\.json$/)],
  ['javascript',        lang('JavaScript')],
  ['mongodb',           word(/\bmongo(db)?\b/)],
  ['postgresql',        word(/\bpostgres(ql)?\b/)],
  ['mysql',             word(/\bmysql\b/)],
  ['redis',             word(/\bredis\b/)],
  ['netlify',           (c) => has(/(^|\/)netlify\.toml$/)(c) || /netlify\.app/.test(c.homepage)],
  ['go',                lang('Go')],
  ['html5',             (c) => lang('HTML')(c) && c.langs.every((l) => ['HTML', 'CSS', 'SCSS'].includes(l))],
  ['css3',              (c) => lang('CSS')(c) && c.langs.every((l) => ['HTML', 'CSS', 'SCSS'].includes(l))]
];
async function detectStack(r) {
  const ctx = { text: `${r.name} ${r.description || ''} ${(r.topics || []).join(' ')}`.toLowerCase(), homepage: (r.homepage || '').toLowerCase(), langs: [], paths: [] };
  // The README usually names the tools used, so its first 6 KB also feeds the keyword rules
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(r.name)}/readme`, { headers: { ...headers, Accept: 'application/vnd.github.raw+json' }, signal: AbortSignal.timeout(20000) });
    if (res.ok) ctx.text += ' ' + (await res.text()).slice(0, 6000).toLowerCase();
  } catch {}
  try { ctx.langs = Object.keys(await api(`/repos/${OWNER}/${encodeURIComponent(r.name)}/languages`)); } catch {}
  try {   // the README often lists the stack: read the first part of it as extra keywords
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${encodeURIComponent(r.name)}/readme`, { headers: { ...headers, Accept: 'application/vnd.github.raw+json' }, signal: AbortSignal.timeout(20000) });
    if (res.ok) ctx.text += ' ' + (await res.text()).slice(0, 6000).toLowerCase();
  } catch {}
  try {
    const tree = await api(`/repos/${OWNER}/${encodeURIComponent(r.name)}/git/trees/${encodeURIComponent(r.default_branch || 'HEAD')}?recursive=1`);
    ctx.paths = (tree.tree || []).map((x) => x.path.toLowerCase());
  } catch {}
  return RULES.filter(([, test]) => { try { return test(ctx); } catch { return false; } }).map(([name]) => name).slice(0, 5);
}

try {
  const all = await listRepos();
  const curated = curatedNames();
  const picked = all.filter((r) => !r.private && !r.archived &&
    ((r.topics || []).some((t) => TOPICS.includes(t.toLowerCase())) || curated.has(r.name.toLowerCase())));
  const repos = [];
  for (const r of picked) {
    repos.push({
      name: r.name, description: r.description || '', url: r.html_url,
      homepage: /^https:\/\//.test(r.homepage || '') ? r.homepage : '',
      language: r.language || '', stars: r.stargazers_count || 0,
      topics: (r.topics || []).filter((t) => !TOPICS.includes(t.toLowerCase())).map((t) => t.toLowerCase()),
      pushedAt: r.pushed_at || '',
      tagged: (r.topics || []).some((t) => TOPICS.includes(t.toLowerCase())),
      stack: await detectStack(r)
    });
  }
  repos.sort((a, b) => String(b.pushedAt).localeCompare(String(a.pushedAt)));
  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), repos }, null, 2) + '\n');
  console.log(`Scanned ${all.length} public repo(s) of ${OWNER}; ${repos.length} included (${repos.filter((r) => r.tagged).length} tagged ${TOPICS.map((t) => '"' + t + '"').join('/')}, ${curated.size} linked from curated cards).`);
  repos.forEach((r) => console.log(`  ${r.tagged ? 'tagged ' : 'curated'}  ${r.name}  [${r.stack.join(', ') || 'no stack detected'}]`));
  if (!repos.some((r) => r.tagged)) console.warn('No tagged repos found. Add the topic "portfolio" to the repos you want on the site.');
} catch (e) {
  console.warn('sync skipped: ' + e.message);
  writeFileSync(OUT, JSON.stringify({ generatedAt: '', repos: [] }) + '\n');
=======
// Writes projects.json from the public repos of GITHUB_OWNER tagged with the topic "portfolio".
// Usage: node scripts/sync-projects.mjs [output-path]   (default: projects.json)
// Never fails the build: if GitHub is unreachable, an empty list is written and the site uses its built-in projects.
import { writeFileSync } from 'node:fs';

const OUT = process.argv[2] || 'projects.json';
const OWNER = process.env.GITHUB_OWNER || 'chrisjoel';
const TOPIC = 'portfolio';
const token = process.env.GITHUB_TOKEN;

const empty = (why) => {
  console.warn('sync skipped: ' + why);
  writeFileSync(OUT, JSON.stringify({ generatedAt: '', repos: [] }) + '\n');
};

try {
  const q = encodeURIComponent(`user:${OWNER} topic:${TOPIC}`);
  const res = await fetch(`https://api.github.com/search/repositories?q=${q}&per_page=100&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) throw new Error('GitHub API returned ' + res.status);
  const data = await res.json();
  const repos = (data.items || [])
    .filter((r) => !r.archived && !r.fork && !r.private && r.owner?.login?.toLowerCase() === OWNER.toLowerCase())
    .map((r) => ({
      name: r.name, description: r.description || '', url: r.html_url,
      homepage: /^https:\/\//.test(r.homepage || '') ? r.homepage : '',
      language: r.language || '', stars: r.stargazers_count || 0,
      topics: (r.topics || []).filter((x) => x !== TOPIC), pushedAt: r.pushed_at || ''
    }));
  writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), repos }, null, 2) + '\n');
  console.log(`synced ${repos.length} repo(s) tagged "${TOPIC}" -> ${OUT}`);
} catch (e) {
  empty(e.message);
>>>>>>> 78bce761e031bd394fe9d5b6cab53c944fc0fa23
}
