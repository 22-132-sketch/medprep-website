# Progress: website + admin (session of 4 Nov 2026)

Scope: `medprep-website` and `medprep-admin` only. Work on `main`, small commits, no force-push.

## Done
| Item | Repo | Result |
|---|---|---|
| 3.3 Trial = 1 day | admin | `TRIAL_DAYS` 3 to 1 (`js/premium.js`); "3-Day" strings in `student-detail.html` and comments updated. Messages built from `TRIAL_DAYS` now say "1-day" automatically |
| 3.3 Trial = 1 day | website | `trial.html` (title, description, h1, lead, success text) and `register.html` link text |
| 5.1 Open Graph | website | Full `og:*` + `twitter:*` on all 13 indexable pages; new `images/og-share.png` (1200x630). `404` and `referral-status` untouched |
| 5.2 JSON-LD | website | `Organization` + `WebSite` on home; `BreadcrumbList` on 12 inner pages |
| 5.3 Sitemap + robots | website | `scripts/build-sitemap.mjs` regenerates `sitemap.xml` (real lastmod from git, skips noindex pages). `robots.txt` unchanged for now |
| 5.5 Blog structure | website | `scripts/build-blog.mjs` + `assets/blog.css` + `docs/BLOG_GUIDE.md`. No articles written |
| 5.7 Performance | website | Tabler icons pinned to 3.49.0 (was `@latest`) + CDN preconnect |
| 5.8 Owner checklist | website | `docs/OWNER_CHECKLIST.md` |

## Also done (after owner answers)
| Item | Result |
|---|---|
| 3.4 Legal | `privacy.html` and `terms.html` updated, effective 4 Nov 2026. Added Firebase, Sentry replay, Resend, WhatsApp, flashcard sync, trial, guest mode, deletion, payment methods. Fixed wrong domain `medprep.pk`. Name "Exonovo" and the Gmail kept |
| 5.6 GEO | `llms.txt` added; `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended |

## Owner to confirm
| Item | Why |
|---|---|
| Sentry masking | Policy says text and inputs are masked by default. Confirm in the Sentry project settings |
| Guest mode wording | Written as "where available", since guest mode is not built yet |
| Payment wording | Read as: any method is fine if the money reaches the bank account (bank transfer, JazzCash, Easypaisa). Bank details unchanged |
| Lawyer review | Recommended before launch. Not legal advice |

## Deviations and notes
- **FAQ added to the home page** (16 questions after the 4 Nov expansion: OSPE, MCQ explanations, MCQ count, study tools; owner-approved) with matching `FAQPage` JSON-LD. The visible price follows `assets/js/pricing.js`; the JSON-LD text says PKR 1,700, so update it if the price changes.
- **No `Course` / `EducationalOrganization` markup:** not enough verified facts on the site. `Organization` has no `legalName` or `contactPoint` yet, pending the 3.4 answers.
- **Admin "Ending soon / ended" filter** (`js/trial-requests.js`, window of 2 days) now matches every active 1-day trial. Left as is; tell me if you want a shorter window.
- **Sitemap lastmod** uses the last git commit date per file, so today's tag edits moved every date to 3 Nov 2026.
- **5.7 not measured:** no browser in this environment, so no before/after Lighthouse numbers. Fonts are still on Google Fonts (preconnect + `display=swap` already present). Steps in `OWNER_CHECKLIST.md` item 12.
- **App locked-screen text** (`firebase.js`) still says "3-day": left for the later app session, as instructed.
- **5.4 and MedPREP-APP** not touched, as instructed.
- **Update by hand when they change:** the "7,800+ MCQs" figure (FAQ + `llms.txt`) and the PKR 1,700 text in the FAQ markup.
- **Not yet on `features.html`:** OSPE. Offered to the owner as a next step.

## Session 2b: plans (website)
| Item | Result |
|---|---|
| Price table | `assets/js/pricing.js` now holds `PLANS` (full 1,699; mcq_fc / notes_fc / ospe 999; upgrade 700). `data-price="plan-<key>"` fills any span. Full replaces the old 1,700 (`active-num` = 1,699) |
| Pricing section | `index.html`: three 999 cards + Full card (best value). "Save PKR 1,298" is NOT used: the true claim is "any two 999 plans cost more than Full" |
| Register | `register.html`: 5-option selector (4 plans + Upgrade to Full, +700), `?plan=` preselects, amount follows the plan. Registration doc now has `planKey`, `upgrade`, `amount` (matches the admin amount check) |
| Text | FAQ JSON-LD + visible FAQ, `terms.html`, `llms.txt` updated and consistent |
| Not changed | Next-session prices (3,500 / 500 month) untouched |
| Launch | Held on branch `plans-website`, not on `main`, until the rules are deployed (students could otherwise buy a partial plan the admin cannot grant yet) |
