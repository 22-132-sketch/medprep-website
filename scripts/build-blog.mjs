// Builds blog/<slug>.html from blog-src/<slug>.json using the site's own nav + footer (read from blog.html).
// Only files with  "status": "published"  are built, so drafts never go live by accident.
// Run (Windows or any OS, needs Node 18+):   node scripts/build-blog.mjs   then   node scripts/build-sitemap.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://register.medprepapp.me';
const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SRC = join(ROOT, 'blog-src'), OUT = join(ROOT, 'blog');
const REQUIRED = ['slug', 'title', 'description', 'question', 'answer', 'date', 'author', 'category', 'bodyHtml'];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rootRel = h => h.replace(/(href|src)="(?!https?:|#|mailto:|tel:|\/)([^"]+)"/g, '$1="/$2"');

const blog = readFileSync(join(ROOT, 'blog.html'), 'utf8');
const pick = (re, label) => { const m = blog.match(re); if (!m) throw new Error('blog.html layout changed: ' + label); return rootRel(m[0]); };
const nav = pick(/<nav id="navbar"[\s\S]*?<\/nav>\s*<div class="mobile-menu"[\s\S]*?<\/div>/, 'nav');
const footer = pick(/<footer role="contentinfo">[\s\S]*?<\/footer>/, 'footer');
const wa = pick(/<!-- WhatsApp -->\s*<a [\s\S]*?<\/a>/, 'whatsapp');
const menuJs = `<script>
function toggleMenu(){document.getElementById('mobile-menu').classList.toggle('open');}
document.addEventListener('click',function(e){var m=document.getElementById('mobile-menu'),h=document.querySelector('.nav-hamburger');if(m&&h&&!m.contains(e.target)&&!h.contains(e.target))m.classList.remove('open');});
</script>`;
const iconCss = (blog.match(/<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net[^>]+>/) || [''])[0];

if (!existsSync(SRC)) { console.log('No blog-src folder, nothing to build.'); process.exit(0); }
mkdirSync(OUT, { recursive: true });
let built = 0;
for (const f of readdirSync(SRC).filter(n => n.endsWith('.json')).sort()) {
  const p = JSON.parse(readFileSync(join(SRC, f), 'utf8'));
  if (p.status !== 'published') { console.log('skip (not published):', f); continue; }
  const miss = REQUIRED.filter(k => !p[k]); if (miss.length) throw new Error(`${f} missing: ${miss.join(', ')}`);
  if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`${f}: slug must be lowercase letters, digits, hyphens`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date)) throw new Error(`${f}: date must be YYYY-MM-DD`);
  const url = `${BASE}/blog/${p.slug}.html`, modified = p.updated || p.date;
  const authorLd = p.author === 'MedPREP Team' ? { '@type': 'Organization', name: 'MedPREP', '@id': BASE + '/#organization' } : { '@type': 'Person', name: p.author };
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: p.date, dateModified: modified, author: authorLd, publisher: { '@id': BASE + '/#organization' }, image: BASE + '/images/og-share.png', mainEntityOfPage: url };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: BASE + '/blog.html' },
    { '@type': 'ListItem', position: 3, name: p.title, item: url }] };
  const ld = o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`;
  const t = esc(p.title) + ' | MedPREP';
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${t}</title>
<meta name="description" content="${esc(p.description)}" />
<link rel="canonical" href="${url}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
${iconCss}
<link rel="stylesheet" href="/assets/blog.css" />
<link rel="icon" type="image/png" href="/images/logo-icon.png" />
<link rel="apple-touch-icon" href="/images/logo-icon.png" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="MedPREP" />
<meta property="og:locale" content="en_US" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${esc(p.description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${BASE}/images/og-share.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="article:published_time" content="${p.date}" />
<meta property="article:modified_time" content="${modified}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${esc(p.description)}" />
<meta name="twitter:image" content="${BASE}/images/og-share.png" />
${ld(article)}
${ld(crumbs)}
</head>
<body>
${nav}
<main class="article-wrap">
  <p class="crumbs"><a href="/index.html">Home</a> / <a href="/blog.html">Blog</a> / ${esc(p.title)}</p>
  <span class="article-cat">${esc(p.category)}</span>
  <h1>${esc(p.title)}</h1>
  <p class="byline">By ${esc(p.author)} &middot; <time datetime="${p.date}">${p.date}</time>${p.updated ? ` &middot; Updated <time datetime="${p.updated}">${p.updated}</time>` : ''}</p>
  <p class="lede"><strong>${esc(p.question)}</strong> ${esc(p.answer)}</p>
  <div class="article-body">
${p.bodyHtml}
  </div>
  <section class="article-cta" aria-label="Try MedPREP">
    <h2>Practise with MedPREP</h2>
    <p>MCQs, Notes and Flashcards for Pakistani medical students.</p>
    <div class="cta-row"><a class="btn-primary" href="/trial.html">Try Premium free for 1 day</a><a class="btn-secondary" href="/register.html">Register</a></div>
  </section>
  <a class="article-back" href="/blog.html">&larr; Back to the blog</a>
</main>
${footer}
${wa}
${menuJs}
</body>
</html>
`;
  writeFileSync(join(OUT, p.slug + '.html'), html);
  console.log('built blog/' + p.slug + '.html'); built++;
}
console.log(`${built} article(s) built`);
