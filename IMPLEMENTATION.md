# Kristina's Treehouse — Implementation Notes

## Overview

A personal website built with [Astro](https://astro.build), deployed on GitHub Pages. It combines a knowledge base, reading notes, projects, stories, essays, development logs, and small life moments into a single quiet space.

---

## ✅ Implemented Features

### Site Structure
- **Homepage** with title, introduction, recent activity feed, section grid, and "Currently" snapshot
- **8 sections**: Knowledge, Reading, Ideas, Stories, Thoughts, Interlude, Notes, Archive
- **Individual article pages** with title, publish/update dates, tags, and rendered Markdown content
- **Archive page** — browse all entries chronologically (year → month)

### Design
- Light blue palette (`#FAFCFF` background, `#7AAEDB` accent)
- Serif titles (Cormorant Garamond), sans-serif body (Inter), monospace code (JetBrains Mono)
- Sticky header with translucent backdrop blur
- Max 800px article width, 900px home page
- Minimal: no shadows, no heavy cards, no flashy animations
- Subtle hover states and transitions only (fade, color, underline)

### Content Architecture
- **Content separate from code**: all articles go in `content/` at project root
- **Style parameters in one file**: edit `src/styles/theme.css` to change colors, fonts, spacing
- **Activity feed auto-generated**: the homepage timeline is built automatically from your Markdown articles

### Navigation
- Fixed top nav with all 8 section links on one line (responsive)
- First letters of nav items spell **KRISTINA** (easter egg — not mentioned anywhere in the UI)
- Active section is highlighted

### Deployment
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on push to `main`
- Uses the official `withastro/action` for zero-config GitHub Pages deployment

---

## 🚧 To Be Implemented (Future Work)

These are features that could be added later:

- [ ] **Dark mode** — the theme.css structure makes this straightforward (add a `[data-theme="dark"]` block)
- [ ] **RSS / Atom feed** — for readers who want to subscribe
- [ ] **Search** — client-side search over all articles (e.g. with Pagefind)
- [ ] **Tag pages** — browse all articles by tag across sections
- [ ] **Backlinks** — show which articles link to the current one
- [ ] **Custom domain** — configure a custom domain in GitHub Pages settings
- [ ] **Image support** — add an image or photograph to articles
- [ ] **Comments** — lightweight comment system (e.g. Giscus)
- [ ] **Table of contents** — auto-generated TOC for longer articles
- [ ] **"Random article" button** — serendipitous browsing
- [ ] **Analytics** — privacy-friendly visitor stats (e.g. Plausible)

---

## How to Use

### Quick Start

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview the built site locally
npm run preview
```

### Adding Content

**To add a new article**, create a Markdown file in the right section folder:

```
content/
  knowledge/
    my-new-note.md    ← add here
```

Each file needs frontmatter at the top:

```yaml
---
title: "Your Article Title"
date: 2026-07-15
updated: 2026-07-15       # optional — only if different from date
tags: [tag1, tag2, tag3]   # optional
description: "A brief description shown in listings."  # optional
---

Your content goes here. Write in Markdown.

## Headings work as expected

- Lists too
- And **bold** and *italic*

`inline code` and code blocks are styled with JetBrains Mono.
```

The homepage activity feed is built automatically from your Markdown articles — just add a `.md` file to any section folder and it will appear in the timeline. The 15 most recent articles are shown.

### Customizing Styles

**All visual parameters are in `src/styles/theme.css`.** You don't need to touch any component code to change:

| What | Where in `theme.css` |
|---|---|
| Colors (bg, text, accent, etc.) | `:root` → `/* ===== Colors ===== */` |
| Fonts (serif, sans, mono) | `:root` → `/* ===== Typography ===== */` |
| Font sizes | `:root` → `/* Font sizes */` |
| Max content width | `:root` → `/* ===== Spacing ===== */` |
| Header height & blur | `:root` → `/* ===== Header ===== */` |
| Animation speed | `:root` → `/* ===== Transitions ===== */` |

### Customizing the "Currently" Section

Edit `content/currently.json`. Each group has a `heading` and a list of `items` with `label`/`text` pairs. Add, remove, or reorder groups and items to reflect what you're reading, building, thinking, or listening to.

### Customizing the Homepage Introduction

Edit the text inside `<section class="intro">` in `src/pages/index.astro`.

### Changing Section Descriptions

Edit the `SECTIONS` array in `src/utils/content.ts`. Each section has a `slug`, `label`, and `description`.

### Deploying to GitHub Pages

1. Push to the `main` branch — the GitHub Action in `.github/workflows/deploy.yml` will build and deploy automatically
2. Go to your repository's **Settings → Pages** and ensure the source is set to **GitHub Actions**
3. You may need to update `site` and `base` in `astro.config.mjs` to match your GitHub username and repo name

---

## File Map

### Files you'll edit often (content & style)
```
content/                      ← All your articles live here
  profile.json                ← About, education, contact info
  friends.json                ← Blogroll / friend links
  currently.json              ← "Currently reading/building/..." content
  knowledge/*.md
  reading/*.md
  ideas/*.md
  stories/*.md
  thoughts/*.md
  interlude/*.md
  notes/*.md
  archive/*.md

src/styles/theme.css           ← Colors, fonts, spacing — all in one place
content/currently.json         ← "Currently reading/building/..." content
content/profile.json           ← About, education, contact info
content/friends.json           ← Friend links
src/pages/index.astro          ← Homepage intro text
src/utils/content.ts           ← Section descriptions
```

### Files you'll rarely touch (code)
```
src/layouts/BaseLayout.astro   ← HTML shell
src/components/Header.astro    ← Navigation
src/components/Footer.astro    ← Footer
src/components/RecentActivity.astro  ← Activity feed component
src/components/SectionGrid.astro     ← Section grid component
src/pages/[section]/index.astro      ← Section listing template
src/pages/[section]/[slug].astro     ← Article template
```

### Config & deployment
```
astro.config.mjs               ← Astro config (site URL, base path)
package.json                   ← Dependencies & scripts
.github/workflows/deploy.yml   ← GitHub Pages deployment
```

---

## Suggestions

1. **Start small.** Add a few articles in the sections you use most often. The site feels better with real content than with placeholder text.

2. **Write for yourself first.** This is a personal archive, not a publication. Imperfect notes are better than no notes.

3. **Update articles over time.** Each article shows both a "Published" and "Updated" date. Revisit and improve your notes as you learn more — living documents, not static posts.

4. **Keep the activity feed fresh.** The homepage timeline is built from your most recent articles, so publishing something new keeps the homepage feeling alive, even if you don't add content daily.

5. **Don't over-decorate.** The design is intentionally minimal. Before adding a new visual element, ask: "Does this help the content, or does it compete with it?"

6. **Back up your content.** The `content/` directory is plain Markdown files. They're portable to any static site generator, note-taking app, or wiki. You're never locked in.

7. **Consider a custom domain later.** GitHub Pages supports custom domains (e.g., `kristinastreehouse.com`). It's a nice touch when you're ready — just add a CNAME record and update `astro.config.mjs`.
