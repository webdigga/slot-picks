# Claude Code Instructions

## Blog Posts

### Blog quality guidelines
- **GSC research:** Before writing, check Google Search Console (90-day lookback) for keyword opportunities and content gaps. GSC site URL: `https://slot-picks.com/`
- **E-E-A-T:** Write with Google's E-E-A-T framework in mind (Experience, Expertise, Authoritativeness, Trustworthiness). Demonstrate first-hand experience where possible, cite credible sources, include author credentials, use accurate and up-to-date information, and avoid vague or unsubstantiated claims
- **Author:** Always include author where the format supports it
- **Schema:** Ensure the article has all correct structured data/schema markup
- **SEO/GEO/AEO:** Write with search, generative, and AI engine optimisation in mind
- **FAQs:** Include FAQ sections where possible (good for featured snippets and AEO)
- **Tables:** Use nicely styled tables for tabular data
- **SVG charts:** Create inline SVG charts/diagrams where applicable to visualise data
- **Internal linking:** Link to other pages/posts on the same site
- **External linking:** Link to authoritative external sources where relevant. External links must open in a new tab (`target="_blank" rel="noopener noreferrer"`) and include a small external link icon (e.g. `↗` or an SVG) so users know they are leaving the site. **Every external URL should be verified with a curl/fetch check (expecting a 200 status) before being added to an article.** If a URL returns a non-200 status, find a working alternative. If you cannot verify URLs (e.g. no network access), still include them but flag which ones were not verified so the user can check them.
- **UK English:** Use UK spelling throughout (colour, organised, centralised, etc.)
- **Heading hierarchy:** Proper H2 -> H3 nesting, never skip levels
- **Meta description:** Under 160 characters, include the primary keyword
- **Short paragraphs:** Max 3-4 sentences, scannable with subheadings and bullet points
- **Primary keyword focus:** Each post should target a specific keyword/phrase
- **Strong opening:** Hook the reader and summarise the value in the first 2-3 sentences (helps with AI answer extraction for AEO)
- **Images:** Article images are NOT required. The news listing uses category colour bands instead of images. Brand logos for review cards remain at 250x65px.
- **Alt text:** Descriptive alt text on any SVGs/images for accessibility and SEO
- **Call to action:** Include a relevant call to action where natural
- **Reading time:** Calculate based on ~230 words per minute
- **No en/em dashes:** Never use en dashes (-) or em dashes (--) in blog content. Use commas, colons, semicolons, or rewrite the sentence instead
- **Repo structure:** Always check an existing post in this repo before writing a new one
- **Topic overlap:** Before proposing new article topics, list all existing article filenames and scan for overlap. Never propose a topic that already has a published article
- **Topical content:** Where possible, make blog content topical. If there is a big event or something notable in the calendar in the forthcoming days or weeks, reference it in the blog. This will not always be possible, so only do this when it makes sense. Always confirm the current date before referencing upcoming events — do not assume or guess the date.

## CSS
- **Mobile first:** All CSS must be mobile first. Never use `max-width` media queries. Use `min-width` only.

## What You Can Do
- Read and edit code
- Run development servers and tests
- Search and explore the codebase
- Provide guidance and suggestions

---

# Slot Picks

UK-focused expert review and information platform for online slot sites, casino reviews, prize draws, game guides, and responsible gambling content.
**Domain:** slot-picks.com

## Stack
- Eleventy 3.0 (static site generator)
- Nunjucks templating
- Tailwind CSS 3.0 + PostCSS
- Decap CMS (git-gateway backend)
- Deployed to Netlify (auto-deploy on push to main)
- Google Analytics 4

## Content Architecture

There are three product types (slots, casinos, draws) that each follow the same pattern:

### Listing Cards (appear on category listing pages)
| Type | Location | Tags | Permalink |
|------|----------|------|-----------|
| Slots | `src/slots/` | `slots`, `topRatedSlots`, `newSlots` | `false` (no individual pages) |
| Casinos | `src/casinos/` | `casinos`, `topRatedCasinos`, `newCasinos` | `false` (no individual pages) |
| Draws | `src/draws/` | `draws`, `topRatedDraws`, `newDraws` | `false` (no individual pages) |

Listing cards contain data for the card component (brand image, highlights, external URL, reviewUrl). They do NOT generate pages. The `reviewUrl` links to the review page in `src/sites/`.

### Review Pages (detailed review for each product)
| Location | Tags | Layout | Permalink |
|----------|------|--------|-----------|
| `src/sites/` | Slots: `sites`, Casinos: `casinos`, Draws: `drawReviews` | `review.html` | `/reviews/{{ title \| slugify }}/` |

**ONE review template** (`src/_includes/review.html`) handles all three types. It uses conditional checks (`'drawReviews' in tags` / `'casinos' in tags`) for breadcrumbs and badges.

**IMPORTANT:** Draw reviews use the `drawReviews` tag, NOT `draws`. Using `draws` would duplicate them on the draws listing page.

### Guides (educational content, separate from reviews)
| Type | Location | Layout | Permalink |
|------|----------|--------|-----------|
| Slot guides | `src/guides/slots/` | `game-guide.html` | `/guides/slots/{{ title \| slugify }}/` |
| Casino guides | `src/guides/casinos/` | `casino-guide.html` | `/guides/casinos/{{ title \| slugify }}/` |
| Draw guides | `src/guides/draws/` | `draw-guide.html` | `/guides/draws/{{ title \| slugify }}/` |

Guides are NOT linked from listing cards. Listing cards link to review pages only.

### News Articles
| Location | Layout | Permalink |
|----------|--------|-----------|
| `src/articles/` | `article.html` | `/news/slug-here/` |

Cross-link articles with their review pages.

## Content Counts

| Type | Count | Location |
|------|-------|----------|
| News/blog articles | 15 | `src/articles/` |
| Slot/casino/draw reviews | 30 | `src/sites/` |
| Draw listing cards | 3 | `src/draws/` |
| Slot guides | 7 | `src/guides/slots/` |
| Casino guides | 3 | `src/guides/casinos/` |
| Draw guides | 3 | `src/guides/draws/` |
| Strategy articles | 6 | `src/strategy/` |
| Comparison pages | 5 | `src/compare/` |

## Adding a New Product Type (e.g. a new draw)

1. **Listing card:** Create `src/draws/new-thing.md` with frontmatter. Tags must include `draws` plus any of `topRatedDraws`/`newDraws`.
2. **Review page:** Create `src/sites/new-thing.md` with frontmatter. Tag as `drawReviews`. Uses `review.html` layout via `sites.json`.
3. **News article (optional):** Create `src/articles/new-thing-review.md`. Tag as `news`. Add cross-links.
4. **Guide (optional):** Create `src/guides/draws/new-thing.md`. Uses `draw-guide.html` layout.
5. **Brand image:** Add as `src/_includes/static/img/new-thing.avif`. Dimensions: **250x65px**.
6. **Article image:** Add as `src/_includes/static/img/new-thing-article.avif`. Dimensions: **600x450px**.

## Blog System

- **Location:** `src/articles/`
- **Format:** Markdown with YAML frontmatter
- **Listing page:** `src/news.html` (shows articles tagged `news`, newest first)
- **Homepage:** Shows latest 4 news articles automatically
- **CMS:** Decap CMS at `/admin/` for non-technical editing
- **Frontmatter fields:** `title`, `seoTitle`, `description`, `author`, `date` (ISO 8601), `showDate`, `imageForSeo`, `imageAlt`, `type`, `tags`, `permalink`
- **Permalink convention:** `/news/slug-here/`
- **Tags:** `news`, `article`, `faq`, `privacy`
- **Reading time:** Auto-calculated (~230 words/minute)
- **Article images:** Not required (listing pages use colour bands instead of images)
- **SVG charts:** Store in `src/_includes/static/img/`, reference inline with `<img>` tags
- **External links:** The markdown-it renderer in `.eleventy.js` auto-adds `target="_blank"`, `rel="noopener noreferrer"`, and an external link icon SVG to any link starting with `http`. Just use standard markdown link syntax: `[text](https://url)`. No manual HTML needed.
- **Reference:** Always check an existing article before writing a new one

## Tag System

Tags drive collections and listing pages. Key tags:

| Tag | Used On | Effect |
|-----|---------|--------|
| `slots` | Listing cards | Appears on `/slots/` |
| `topRatedSlots` | Listing cards | Appears on `/top-rated-slots/` |
| `newSlots` | Listing cards | Appears on `/new-slots/` |
| `casinos` | Listing cards + reviews | Appears on `/casinos/`, `/top-rated-casinos/`, `/new-casinos/` |
| `draws` | Listing cards | Appears on `/draws/` |
| `topRatedDraws` | Listing cards | Appears on `/top-rated-draws/` |
| `newDraws` | Listing cards | Appears on `/new-draws/` |
| `drawReviews` | Review pages in `src/sites/` | Filtered OUT of productByTag pagination |
| `news` | Articles | Appears on `/news/` and homepage |

**CRITICAL:** `productByTag.html` paginates ALL tags except those in its filter list. Any new tag that should NOT generate a listing page must be added to the filter list in `productByTag.html`.

## Navigation
Defined in `src/_data/navigation.yaml`. Sections: Slots, Casinos, Draws, Guides, News.

## SEO
- JSON-LD structured data (Organization, WebSite, Article, Review, FAQPage, SoftwareApplication, ItemList, BreadcrumbList)
- Open Graph and Twitter Card meta tags
- Dynamic sitemap at `/sitemap.xml`
- robots.txt blocks `/admin/` and `/netlify/`, rate-limits Ahrefs/Semrush bots
- 301 redirects in `netlify.toml`

## Key Files
- `.eleventy.js` - Eleventy config, collections, filters
- `tailwind.config.js` - Tailwind config
- `netlify.toml` - Netlify deployment, redirects, headers
- `src/_data/settings.yaml` - Site settings, author info
- `src/_data/navigation.yaml` - Multi-level nav menu
- `src/_includes/review.html` - Single review template for ALL types
- `src/_includes/article.html` - Blog post layout template
- `src/_includes/partials/json-ld.html` - All structured data schemas

## Gotchas
- **Directory data files** must match the directory name (e.g. `draws/draws.json`, NOT `draws/something-else.json`)
- **Slug from title:** Permalink uses `{{ title | slugify }}`. Choose titles carefully.
- **Draw listing pages** (`top-rated-draws.html`, `new-draws.html`) are standalone files, NOT part of `productByTag.html` pagination.

## Status: Live
Ongoing content updates.
