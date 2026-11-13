# Production Fix Report: clickmastersartificialintelligencecompany.com

Date: 16 November 2026 · Branch: `updated-crm-funt` (base `16a4ffb`) · Next.js 16.2.9 (App Router, Turbopack)

## 1. Executive summary

| # | Reported issue | Status |
|---|---|---|
| 1 | 7 JavaScript chunks returning HTTP 500 | **FIXED BUT NOT FULLY VERIFIED.** The root cause was reproduced locally and a skew-safe deploy script is ready. It has not been deployed because there is no server access. |
| 2 | 3 content pages returning HTTP 502 | **BLOCKED.** All 3 return 200 live today. There is no app-level defect. Confirming the root cause needs the nginx and PM2 logs. |
| 3 | Homepage title "Artificial Development company" | **FIXED BUT NOT FULLY VERIFIED.** Verified on a local production build; not yet deployed. |
| 4 | 18 meta descriptions over 155 characters | **FIXED BUT NOT FULLY VERIFIED.** Verified locally (all now 148–155); not yet deployed. |
| 5 | 1 title at 63 characters | **FIXED BUT NOT FULLY VERIFIED.** Now 59 characters, verified locally; not yet deployed. |
| + | Header logo text showed "Artificial Development company" (found during the audit) | **FIXED BUT NOT FULLY VERIFIED** |
| + | 41 pages had no `og:title` or `og:description` (found during the audit) | **FIXED BUT NOT FULLY VERIFIED** |
| + | 266 pages had an `og:url` with a trailing slash that did not match the canonical and pointed at a 308 redirect (found in the second pass) | **FIXED BUT NOT FULLY VERIFIED** |

None of the code changes are live. This machine has no SSH key, deploy credentials or CI pipeline for the production server (209.145.61.86, nginx 1.24 on Ubuntu, Next.js server behind it, no CDN in front). Phases 9 and 10, deployment and live verification, are **BLOCKED** until someone with server access runs the deploy (section 8).

## 2. Original reported problems vs. what the live site shows now

The live site was crawled fresh: all 406 sitemap URLs, every internal link and every `/_next/static` asset they reference.

| Problem | Live today |
|---|---|
| `2t5ij_09z-mgk.js`, `2z3h7klu0uh4k.js`, `32fzyspcodkr_.js` → 500 | These now return **404**. They belong to an older build. No live page references them any more: every asset referenced by all 406 pages returns 200 JavaScript. |
| The other 4 chunk names | Not available. They are not in the repo and the audit export was not provided. `issues_overview_report.xlsx` is an older Screaming Frog export with no chunk data. |
| `/glossary/embeddings`, `/nlp-development-cost`, `/build-vs-buy-ai` → 502 | All return **200**. They are prerendered (`x-nextjs-cache: HIT`) and render with 0 console errors. |
| Homepage title | Still `Artificial Development company` (not yet deployed) |
| Over-long metadata | Exactly 18 descriptions over 155 characters and 1 title over 60, as the audit reported |

## 3. Confirmed root causes

### 3.1 Chunk 500s: building inside the live directory (reproduced)

Experiment: I started the original build with `next start`, ran `next build` again in the same folder while it was serving, and probed it every 2 seconds.

- During the build, the running server returned **HTTP 500 for its own chunk URLs** (2 of 14 probes), the same symptom the audit recorded.
- After the build, the **old process kept running old code against the new `.next` folder**. Its ISR regeneration rewrote the homepage, and the old title came back. That mixed state is how HTML ends up referencing chunks that no longer exist. Once the old files are gone, those chunks return 404, which is what the 3 known chunks return live today.
- The same pattern on clickmastersapplicationdevelopment.com fits a shared `git pull && npm run build && restart` routine.

Not independently confirmed on production: I have no access to the server's deploy history or logs. nginx and Next headers show no CDN and no cached 500 responses. `/_next/static` is served by Next with `immutable` caching, and there is no middleware or proxy file that could interfere.

### 3.2 Page 502s: upstream unavailable (probable, not confirmed)

- A 502 from nginx means the Node process did not answer.
- The three pages are static and prerendered. They have no data dependency at request time, and the CMS calls are cached and have timeouts.
- Rendering them locally and in production gives 200 with no errors.
- An in-place build did **not** produce 502s locally. Pages stayed 200.
- The most likely cause is a restart window or crash during a deploy, at the same time as the chunk errors. This needs the nginx `error.log` (`connect() failed` / `upstream prematurely closed`) and `pm2 logs` from the audit date to confirm.

### 3.3 Homepage title and header brand: CMS admin label used as branding (confirmed)

- Commit `1f12eae` ("added crm funt") changed two things. The root `title` became `config?.website.name || …`, and the Navbar logo text became `siteName || 'ClickMasters'`.
- The public CMS endpoint returns `website.name = "Artificial Development company"`, an internal site label. That value became the title of every page without its own title, and the visible header logo text.

### 3.4 Metadata lengths (confirmed)

- The 16 neural-canvas pages and 1 glossary term store descriptions of 157–165 characters in JSON.
- `/ai-development/manufacturing` has a 63-character title and a 159-character description in `data/ai-development-pages-data.ts`.

## 4. Files modified

| File | Change |
|---|---|
| `lib/site.ts` | Added the code-owned constants `SITE_TITLE`, `SITE_DESCRIPTION` and `SITE_OG_NAME`. |
| `app/layout.tsx` | The title and description use those constants instead of the CMS `website.name`. The Navbar no longer receives the CMS name. The CMS logo, favicon, colours and navigation still work. |
| `app/page.tsx` | The homepage sets title and description explicitly, so OG tags pick them up. |
| `lib/cms/erp-edits.ts` | `withEditedPageSeo` fills any **missing** `og:title`, `og:description`, `og:url`, `og:site_name` and `og:type` from the page's own title, description and canonical. Values a route sets explicitly always win. It also normalizes `og:url` the same way canonicals are normalized, with no trailing slash. |
| `data/ai-development-pages-data.ts` | Manufacturing title and description. |
| `content/pages/neural-canvas/*.json` (16) and `content/glossary/terms/ai-for-healthcare.json` | `seo.description`. Exactly one line changed per file. |
| `scripts/deploy.sh` (new) | Skew-safe release deploy with smoke test, atomic switch, verification and rollback. |

There are no design, layout, copy, dependency or config changes. `next.config.ts` is unchanged.

## 5. Before and after metadata

**Homepage title:** `Artificial Development company` → `ClickMasters | AI Development Company`

**Title over 60 characters:** `/ai-development/manufacturing`
`AI Development for Manufacturing | Industrial AI | ClickMasters` (63) → `Manufacturing AI Development | Industrial AI | ClickMasters` (59). This keeps the primary keyword, the "industrial AI" secondary keyword and the brand. The breadcrumb label on that page uses the same field.

**Descriptions.** Each was rewritten from the page's hero copy and sections, kept its pricing and conversion hook, and is unique across the site.

| URL | Before | Chars | After | Chars |
|---|---|---|---|---|
| /ai-agent-development-company | AI agent development company: single and multi-agent systems with tool integration, approval gates, memory and security hardening. From $45K. Fixed-price, full IP. | 163 | AI agent development company building single and multi-agent systems with tool use, approval gates, memory and security hardening. From $45K, fixed-price. | 154 |
| /ai-api-development | AI API development: inference, LLM, RAG and streaming APIs with auth, rate limiting, versioning, observability and cost controls. From $15K. Fixed-price, full IP. | 162 | ClickMasters AI API development: inference, LLM, RAG and streaming APIs with auth, rate limiting, versioning and cost controls. From $15K, fixed-price. | 151 |
| /ai-automation-services | AI automation services: document processing, ticket triage, AP automation and agent workflows integrated with your ERP and CRM. From $15K. Fixed-price, full IP. | 160 | AI automation services for document processing, ticket triage, AP automation and agent workflows, integrated with your ERP and CRM. From $15K, fixed-price. | 155 |
| /ai-chatbot-development | AI chatbot development: customer service, helpdesk, sales and knowledge assistants grounded in your data and connected to your CRM. From $8K. Fixed-price. Full IP. | 163 | ClickMasters AI chatbot development: customer service, helpdesk and sales assistants grounded in your data and linked to your CRM. From $8K, fixed-price. | 153 |
| /ai-consulting-services | AI consulting services: opportunity assessments, AI strategy, discovery, technical advisory and fractional Chief AI Officer. From $15K fixed-price or $200–$400/hr. | 163 | AI consulting services from engineers who build: opportunity assessments, AI strategy, technical advisory and a fractional Chief AI Officer. From $15K. | 151 |
| /ai-mlops-services | MLOps services: experiment tracking, model registry, CI/CD for ML, drift monitoring, feature stores and automated retraining. From $15K. Fixed-price, full IP. | 158 | MLOps services by ClickMasters: experiment tracking, model registry, ML CI/CD, drift monitoring and automated retraining. From $15K. Fixed-price, full IP. | 154 |
| /ai-model-fine-tuning | AI model fine-tuning services: LoRA/QLoRA, full fine-tuning, instruction tuning and embedding fine-tuning on your data. From $5K. Fixed-price, you own the weights. | 163 | AI model fine-tuning services: LoRA/QLoRA, full, instruction and embedding tuning on your data, tested against a baseline. From $5K; you own the weights. | 153 |
| /ai-recommendation-engine-development | AI recommendation engine development: collaborative, content-based, hybrid, embedding and real-time personalization systems. From $40K. Fixed-price, full IP. | 157 | AI recommendation engine development: collaborative, content-based, hybrid and real-time personalization, measured with A/B tests. From $40K, fixed-price. | 154 |
| /ai-saas-development | AI SaaS development: multi-tenant AI products with tenant data isolation, usage metering, billing and AI cost controls. MVPs from $40K. Fixed-price, full IP. | 157 | ClickMasters AI SaaS development: multi-tenant AI products with data isolation, usage metering, billing and cost controls. MVPs from $40K, fixed-price. | 151 |
| /computer-vision-development | Computer vision development: object detection, visual quality inspection, image segmentation and edge deployment trained on your imagery. From $40K. Fixed-price. | 161 | Computer vision development: object detection, quality inspection, segmentation and edge deployment, trained on your imagery. From $40K, fixed-price. | 149 |
| /natural-language-processing-services | NLP services: text classification, named entity recognition, sentiment analysis, information extraction and summarization built on your data. From $20K. Fixed-price. | 165 | Natural language processing services: text classification, entity recognition, sentiment analysis, extraction and summarization. From $20K, fixed-price. | 152 |
| /predictive-analytics-services | Predictive analytics services: churn prediction, lead scoring, demand and revenue forecasting, fraud and risk models. Projects from $35K. Fixed-price, full IP. | 159 | Predictive analytics services: churn prediction, lead scoring, demand and revenue forecasting, and fraud and risk models. From $35K. Fixed-price, full IP. | 154 |
| /rag-development-services | RAG development services: document Q&A, hybrid search, conversational and agentic RAG grounded in your knowledge with citations. From $25K. Fixed-price, full IP. | 161 | RAG development services: document Q&A, hybrid search and agentic RAG grounded in your knowledge, with source citations. From $25K. Fixed-price, full IP. | 153 |
| /responsible-ai-compliance | Responsible AI and compliance services: bias testing, explainability, AI governance, NIST AI RMF and EU AI Act readiness documentation. From $15K. Fixed-price. | 159 | Responsible AI and compliance services: bias testing, explainability, AI governance, plus NIST AI RMF and EU AI Act readiness. From $15K, fixed-price. | 150 |
| /semantic-search-development | Semantic search development: embedding-based and hybrid search that finds content by meaning across documents, products and knowledge bases. Fixed-price, full IP. | 162 | ClickMasters semantic search development: embedding-based and hybrid search that finds documents, products and knowledge by meaning. Fixed-price, full IP. | 154 |
| /sentiment-analysis-services | Sentiment analysis services: standard and aspect-based sentiment models for reviews, surveys, tickets and social data, tuned to your domain. From $20K. Fixed-price. | 164 | Sentiment analysis services: standard and aspect-based models for reviews, surveys, tickets and social data, tuned to your domain. From $20K, fixed-price. | 154 |
| /glossary/ai-for-healthcare | AI for healthcare applies ML, NLP, computer vision and generative AI to clinical care, documentation and hospital operations. Definition, use cases, from $40K. | 159 | AI for healthcare applies ML, NLP, computer vision and generative AI to clinical care, documentation and hospital operations. Definition, use cases, cost. | 154 |
| /ai-development/manufacturing | AI development for manufacturing from $35K. Computer vision quality inspection, predictive maintenance, process optimization & demand forecasting. Fixed-price. | 159 | AI development for manufacturing from $35K: computer vision quality inspection, predictive maintenance, process optimization and demand forecasting. | 148 |

These pages build `og:description` and `twitter:description` from the same field, so those changed too.

## 6. Commands executed (summary)

- Audit: `git status/log`, read `package.json`, `next.config.ts`, layouts, routes and CMS libraries. `curl` checks of live headers, chunks and pages. Read-only queries of the public CMS endpoint. Full live crawl script (406 URLs plus links and assets).
- Checks: `npx eslint .`, `npx tsc --noEmit`, and `npm run build` three times: baseline, with changes, and with `NEXT_DEPLOYMENT_ID`.
- Verification: `next start -p 3100` followed by the same crawl, the in-place rebuild probe, and headless Chrome over the DevTools protocol (console, exceptions, failed requests, with scrolling).

## 7. Build and test results

| Check | Baseline (HEAD) | After changes |
|---|---|---|
| ESLint | 0 errors, 14 warnings (unused variables) | 0 errors, the same 14 warnings |
| TypeScript | pass | pass |
| `next build` | pass, 413 static pages | pass, 413 static pages |
| Local crawl, 406 URLs | n/a | all 200; 0 titles over 60; 0 descriptions over 155; 0 duplicate titles or descriptions; one H1 per page; canonicals self-referencing; no noindex; valid JSON-LD; 0 pages missing OG (was 41); 0 broken links or assets; no internal links pointing at redirects |
| Browser: `/`, the 3 former 502 pages, `/ai-development/manufacturing`, `/about` | n/a | 0 console errors, 0 hydration warnings, 0 failed requests |
| Title after ISR regeneration (the path that brought the bad title back) | n/a | stays `ClickMasters \| AI Development Company` |
| `NEXT_DEPLOYMENT_ID` on Next 16.2.9 | n/a | `data-dpl-id`, `?dpl=` on assets and the `x-nextjs-deployment-id` header all confirmed |

**Second verification pass**, after a clean rebuild:
- `og:url` equals the canonical on all 406 sitemap pages. Before: 266 mismatched locally and 307 live.
- Each page has exactly one title, description, canonical, `og:title`, `og:description` and `og:site_name`.
- Compared page by page against the live site, the only changes are the intended ones: 2 titles, 18 descriptions and the OG additions. H1s, canonicals, robots, internal links and JSON-LD are unchanged on every page.
- Unknown URLs return 404 with `noindex`.
- The API routes respond correctly: send-mail returns 405 on GET and 400 on an empty POST; erp-edits and cms-live return 200.
- The server log has 0 errors.
- A headless browser over 18 pages, covering every template, showed 0 console errors, 0 hydration errors and 0 failed requests.
- My own code review found 3 problems, all fixed: an unused constant, partial OG data when the ERP sets only one OG field, and a SHA race in `deploy.sh`.

No automated test suite exists in the project, so there was nothing further to run. The 14 lint warnings are pre-existing unused imports in UI components. I left them alone to avoid touching visual components.

## 8. Deployment: BLOCKED (needs server access)

The production deploy process is not in the repo. There is no CI, Dockerfile, PM2 ecosystem file or nginx config here. `scripts/deploy.sh` is written for the stack the live headers show (nginx → PM2 → `next start`), and **the paths and names in it must be checked against the server before its first run.**

What it does:
1. Clones the branch into `releases/<timestamp>-<sha>`. The live release is never touched while it builds.
2. Runs `npm ci` and `NEXT_DEPLOYMENT_ID=<sha> npm run build`.
3. Copies every older release's `/_next/static` files into the new release. It never overwrites and never deletes, so cached HTML keeps resolving its chunks.
4. Smoke-tests the new build on a spare port. It checks `/`, the 3 former 502 pages and `/sitemap.xml`, and confirms every homepage chunk returns 200. It aborts with the live site untouched if any check fails.
5. Switches the `current` symlink atomically, runs `pm2 reload`, then confirms the live process reports the new deployment id.
6. Keeps the 5 newest releases for rollback.

The first run needs these env vars: `APP_DIR`, `REPO_URL`, `PM2_APP_NAME` (and `PORT` if it is not 3000). It also needs the production `.env` placed at `$APP_DIR/shared/.env`. Before the first run, also do the following:
- Merge this branch to the deploy branch (`main`).
- Point the PM2 process at `$APP_DIR/current`. The script prints the exact command if PM2 keeps an old working directory.
- Expect a brief restart gap: `pm2 reload` of a single fork-mode process still restarts it. To remove that window, which may explain the 502s, run blue/green on two ports behind an nginx `upstream`, or use `proxy_next_upstream` retries.

**CDN cache actions:** none. There is no CDN in front of the site; responses come straight from nginx with no CDN headers. If one is added later, purge only HTML after a deploy. `/_next/static` is content-hashed and immutable.

## 9. Post-deploy verification checklist (Phase 10, not yet run)

```bash
U=https://clickmastersartificialintelligencecompany.com
curl -s $U/ | grep -o '<title>[^<]*'                    # ClickMasters | AI Development Company
curl -s $U/ | grep -o 'data-dpl-id="[^"]*"'              # the deployed git sha
for p in /glossary/embeddings /nlp-development-cost /build-vs-buy-ai; do curl -s -o /dev/null -w "$p %{http_code}\n" $U$p; done
for c in $(curl -s $U/ | grep -o '/_next/static/[^"?]*\.js' | sort -u); do curl -s -o /dev/null -w "%{http_code} %{content_type} $c\n" $U$c; done
```

Then re-crawl the sitemap and compare against section 7.

## 10. Remaining and pre-existing issues (not changed)

| Issue | Why it was not changed | Action needed |
|---|---|---|
| `https://www.…` fails with a **TLS certificate error**. DNS points www at the server, but the certificate does not cover it, so the www→apex redirect never runs. | SSL change on the server; needs authorization | `certbot --expand -d clickmastersartificialintelligencecompany.com -d www.clickmastersartificialintelligencecompany.com` (or equivalent) |
| nginx's http→https 301, and Next's trailing-slash 308s, carry no security headers | Fix belongs in the nginx config | Add the headers in the nginx `server` blocks with `always` |
| `/contact-us/` (and other legacy paths with a trailing slash) redirect in 2 hops: `/contact-us/` → `/contact-us` → `/contact` | Next normalizes the trailing slash before custom redirects; changing that is global and risky. No internal link uses these URLs. | Optional: one-hop rules in nginx |
| `/nlp-development-cost` and `/build-vs-buy-ai` titles say "2025" | Content and pricing decision | Review the year and pricing copy |
| The CMS site name is still "Artificial Development company" | It is ERP data, not code, and the site no longer uses it for branding | Rename it in the ERP for tidiness |
| `TODO.md` lists a `useScroll` hydration error | Already guarded in code; the browser check showed no error | Item can be closed |
| 14 ESLint unused-variable warnings | Not bugs; they are in visual components | Optional cleanup |

## 11. Rollback

- **Code:** these changes are uncommitted on `updated-crm-funt`. Discard them with `git checkout -- <file>`, or after committing, `git revert <commit>`.
- **Deploy:** run `APP_DIR=… PM2_APP_NAME=… scripts/deploy.sh --rollback`. This points `current` at the previous release and reloads PM2. Old releases and their assets are kept.

## 12. Not independently verified

- Anything on production: the deploy, live titles and descriptions after deploy, and live chunk and page status after deploy.
- The production root cause of the chunk 500s and page 502s. Chunk 500s were reproduced locally; 502s need the server logs.
- The 4 unnamed chunk URLs. Every asset referenced by the live site today returns 200.
- `scripts/deploy.sh` end to end. Its syntax was checked and its deployment-id check was verified, but it has not run on the real server.
