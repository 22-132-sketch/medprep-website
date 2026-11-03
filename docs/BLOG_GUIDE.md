# Blog: how to add an article

Articles are **real pages** at `/blog/<slug>.html`, built from one small JSON file each.

## Add an article (Windows)
1. Install Node 18+ (https://nodejs.org) once.
2. Copy `docs/blog-article-example.json` to `blog-src/<slug>.json` and fill it in.
3. Set `"status": "published"` only when the owner has approved the text.
4. In PowerShell, from the repo folder:
   ```
   node scripts/build-blog.mjs
   node scripts/build-sitemap.mjs
   ```
5. Commit `blog-src/`, `blog/` and `sitemap.xml`, then push.

## Rules for every article
| Rule | Why |
|---|---|
| One question per article, answered in `answer` (1-2 sentences) | Google answer boxes and AI answers quote the first clear answer |
| Medical or exam facts come from the owner or an official source, linked in the body | No invented clinical content |
| Real author name or `MedPREP Team`, real date | Trust signal, and needed for Article markup |
| Link to the app or trial (added automatically at the bottom) | Conversion |
| `slug`: lowercase letters, digits, hyphens | Stable URL |

`bodyHtml` may use `h2, h3, p, ul, ol, li, table, a, strong, em` only.
