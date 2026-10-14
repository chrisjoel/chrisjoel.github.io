// Sanity checks run in CI and locally: node scripts/check-site.mjs
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync('index.html', 'utf8');
const errors = [];
const fail = (m) => errors.push(m);

const m = html.match(/\/\* CONFIG:START \*\/([\s\S]*?)\/\* CONFIG:END \*\//);
if (!m) { fail('CONFIG markers not found'); }
let CONFIG, I18N;
if (m) {
  try {
    const ctx = vm.createContext({});
    vm.runInContext(m[1].replace(/\bconst (CONFIG|I18N)\b/g, 'var $1'), ctx, { timeout: 1000 });
    ({ CONFIG, I18N } = ctx);
  } catch (e) { fail('CONFIG/I18N does not evaluate: ' + e.message); }
}

if (CONFIG && I18N) {
  const https = (u, w) => { if (u && !/^https:\/\//.test(u)) fail(`${w}: not an https URL (${u})`); };
  https(CONFIG.LINKEDIN, 'LINKEDIN'); https(CONFIG.GITHUB, 'GITHUB');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(CONFIG.EMAIL)) fail('EMAIL looks invalid');
  const need = (f, w) => { if (!existsSync(f)) fail(`${w}: missing file ${f}`); };
  need(CONFIG.CV_FILE, 'CV_FILE');
  const logos = [];
  CONFIG.SKILLS.forEach((c) => c.items.forEach((i) => i.logo && logos.push(i.logo)));
  CONFIG.PROJECTS.forEach((p) => { logos.push(...p.logos); https(p.link, 'project ' + p.title); });
  CONFIG.CERTIFICATIONS.forEach((c) => { c.logo && logos.push(c.logo); https(c.url, 'cert ' + c.id); c.badge && need('assets/badges/' + c.badge, 'cert ' + c.id); });
  Object.values(CONFIG.SYNC.TOPIC_MAP).forEach((v) => v.logo && logos.push(v.logo));
  Object.values(CONFIG.SYNC.LANGUAGE_LOGOS).forEach((l) => logos.push(l));
  [...new Set(logos)].forEach((l) => need(`assets/logos/${l}.svg`, 'logo'));

  const en = Object.keys(I18N.en), fr = Object.keys(I18N.fr);
  en.filter((k) => !fr.includes(k)).forEach((k) => fail('FR missing key: ' + k));
  fr.filter((k) => !en.includes(k)).forEach((k) => fail('EN missing key: ' + k));
  const keys = new Set();
  CONFIG.SKILLS.forEach((c) => keys.add('skills.' + c.key));
  CONFIG.STATS.forEach((s) => keys.add(s.labelKey));
  [...html.matchAll(/data-i18n(?:-label)?="([^"]+)"/g)].forEach((x) => keys.add(x[1]));
  keys.forEach((k) => { if (!(k in I18N.en)) fail('used but undefined i18n key: ' + k); });
  const bi = (o, w) => { if (!o || !o.en || !o.fr) fail('missing en/fr text: ' + w); };
  CONFIG.PROJECTS.forEach((p) => bi(p.description, 'project ' + p.title));
  CONFIG.EXPERIENCE.forEach((j) => { bi(j.role, j.company); bi(j.place, j.company); bi(j.bullets, j.company);
    if (j.bullets.en?.length !== j.bullets.fr?.length) fail('bullet count differs EN/FR: ' + j.company); });
  CONFIG.EDUCATION.forEach((e) => bi(e.name, 'education'));
}

// External scripts must be pinned and carry integrity + crossorigin
for (const tag of html.match(/<script[^>]+src="https:[^"]+"[^>]*>/g) || []) {
  if (!/@\d+\.\d+\.\d+\//.test(tag)) fail('unpinned CDN version: ' + tag);
  if (!/integrity="sha384-/.test(tag) || !/crossorigin="anonymous"/.test(tag)) fail('missing SRI/crossorigin: ' + tag);
}
if (!/Content-Security-Policy/.test(html)) fail('CSP meta missing');
for (const f of ['404.html', 'robots.txt']) if (!existsSync(f)) fail('missing ' + f);

if (errors.length) { console.error('Site check FAILED:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('Site check passed.');
