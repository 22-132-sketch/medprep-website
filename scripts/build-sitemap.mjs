// Regenerates sitemap.xml from the HTML pages in this repo.
// - Skips any page containing a noindex robots tag (404, referral-status, ...)
// - lastmod = date of the last git commit that touched the file
// Run (Windows or any OS, needs Node 18+ and git):  node scripts/build-sitemap.mjs
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, relative, sep } from 'node:path';

const BASE = 'https://register.medprepapp.me';
const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'assets', 'images', 'scripts', 'docs']);
const META = { // changefreq / priority; anything not listed gets monthly / 0.6
  'index.html': ['weekly', '1.0'], 'features.html': ['monthly', '0.9'], 'register.html': ['monthly', '0.9'],
  'download.html': ['monthly', '0.9'], 'about.html': ['monthly', '0.8'], 'trial.html': ['monthly', '0.7'],
  'leaderboard.html': ['daily', '0.7'], 'blog.html': ['weekly', '0.7'], 'pathways.html': ['monthly', '0.6'],
  'success-stories.html': ['monthly', '0.6'], 'contact.html': ['monthly', '0.5'],
  'privacy.html': ['yearly', '0.3'], 'terms.html': ['yearly', '0.3'],
};

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p, out); }
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

const urls = [];
for (const file of walk(ROOT).sort()) {
  const html = readFileSync(file, 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) continue;
  const rel = relative(ROOT, file).split(sep).join('/');
  let lastmod = '';
  try { lastmod = execSync(`git log -1 --format=%cs -- "${rel}"`, { cwd: ROOT }).toString().trim(); } catch {}
  if (!lastmod) lastmod = new Date().toISOString().slice(0, 10);
  const loc = rel === 'index.html' ? BASE + '/' : `${BASE}/${rel}`;
  const [freq, prio] = META[rel] || ['monthly', '0.6'];
  urls.push({ loc, lastmod, freq, prio });
}
urls.sort((a, b) => (b.prio - a.prio) || a.loc.localeCompare(b.loc));

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.prio}</priority>\n  </url>`).join('\n') + '\n</urlset>\n';
writeFileSync(join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
