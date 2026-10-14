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
}
