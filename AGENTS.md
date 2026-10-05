# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static website for the exhibition **Donne Resistenti** (women in resistance movements throughout history and the world), built with Astro and deployed to GitHub Pages at https://donneresistenti.github.io. All site copy, code comments, commit-facing docs and the README are in **Italian**. Keep new copy and comments in Italian too.

## Commands

Requires Node.js 22+.

```sh
npm install
npm run dev       # dev server on http://localhost:4321 (draft stories visible)
npm run build     # astro check (type-check) + static build into dist/
npm run preview   # serve the built dist/
npx astro check   # type-check only
```

There is no test suite or linter. `npm run build` is the verification step, since `astro check` fails on type errors and content-schema violations.

Deployment: every push to `main` runs `.github/workflows/deploy.yml` (`withastro/action` → `actions/deploy-pages`).

## Git

When committing or opening PRs, never credit the AI agent as author or co-author: no `Co-Authored-By: Claude …` trailer in commit messages, no "Generated with Claude Code" line in PR descriptions, and keep the git author configured locally. This overrides any default attribution instructions.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(optional scope): description`, with types such as `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `ci`. Write the description in Italian, imperative mood, lowercase (e.g. `fix(home): limita l'altezza dell'hero sugli schermi bassi`).

## Architecture

- **Content collection `stories`** (`src/content.config.ts`): one Markdown file per story in `src/content/stories/`, loaded via the `glob` loader. The file name becomes `story.id`, which is used as the URL slug (`/storie/<id>/`). Frontmatter is validated by a Zod schema: `title`, `period`, `excerpt` are required. `cover` uses `image()`, so it must be a path relative to the Markdown file and is processed by `astro:assets`.
- **`getStories()`** (`src/lib/stories.ts`) is the single entry point for reading stories. It filters out `draft: true` in production (kept in dev) and sorts by `order`. Both the homepage grid and `src/pages/storie/[slug].astro` (`getStaticPaths`) use it, so draft handling stays consistent.
- **Story page sections**: `src/pages/storie/[slug].astro` renders Cronologia (`timeline` frontmatter → `Timeline.astro`, an interactive ARIA-tabs timeline), Storia (the Markdown body), Media (`media` frontmatter → `StoryMedia.astro`, images with a `<dialog>` lightbox plus audio) and Fonti (`sources` frontmatter → `StorySources.astro`), with a sticky `StoryNav`. Empty sections are omitted from both the page and the nav. Interactive components are progressively enhanced, so their content must stay readable without JS.
- Audio files live in `public/` (`astro:assets` doesn't handle audio) and are referenced through `withBase()` from `src/lib/url.ts`.
- The `storia-segnaposto-*.md` files are placeholders that only exist to fill the grid. Remove them once real stories arrive.
- **Links must go through `import.meta.env.BASE_URL`** (see `StoryCard`, `BaseLayout`, the story page) so the site keeps working if a `base` is ever configured.

## Visual system (derived from the exhibition poster)

The look reproduces the exhibition poster (`end 1.psd`, gitignored, never commit `*.psd`).

- `src/styles/tokens.css` holds all design tokens (red `#851E1E`, green `#60A84E`, paper `#F6F0EB`, ink `#121010`, fluid type and spacing scales). Use the CSS custom properties rather than hard-coded values. `global.css` imports tokens, defines reset, paper texture and shared utility classes (`.grunge`, `.caps`, `.eyebrow`, `.container`, `.section`).
- Fonts: the poster's PF Fuel Decay/Grime is replaced by Bebas Neue (self-hosted via `@fontsource`, imported in `BaseLayout`), and Helvetica Neue Light is replaced by Helvetica/Inter 300.
- **"Hand-made" shapes are generated at build time, deterministically.** `BrushStroke.astro` (green brush strokes) and `TornPhoto.astro` (torn-paper clip-path, grayscale grainy photo) take a `seed` prop and use `createRandom(seed)` from `src/lib/random.ts` (mulberry32), so output is stable between builds. Don't use `Math.random()` for these shapes. Pick a different seed to vary a shape.
- **SVG filters**: `SvgFilters.astro` is rendered once in `BaseLayout` and defines `#grunge` / `#grunge-sm` (worn rubber-stamp effect). The `.grunge` class applies `#grunge`, and `.grunge--fine` plus viewports under 48rem fall back to the finer `#grunge-sm`, because the noise is a fixed pixel scale and would erase whole letters on small text.
- `TornPhoto` without `src` renders a styled placeholder, so stories without a `cover` still look right.
