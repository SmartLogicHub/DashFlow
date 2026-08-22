# Expanded Offline Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand DashFlow from four to nine complete, Chinese-labeled themes with five new offline Hero scenes, distinct color systems, and a more readable responsive theme picker.

**Architecture:** Keep `HomeTheme`, `HERO_THEME_CHOICES`, `PersonalHomeDesignService`, and `PresentationRuntimeService` as the existing theme pipeline. Add five project-local WebP assets and extend the same typed catalog and CSS-variable contract without changing persisted schema or custom-Hero precedence.

**Tech Stack:** TypeScript, CSS variables, Obsidian APIs, Node test runner, built-in ImageGen, Python Pillow 12.3, esbuild.

---

### Task 1: Generate and normalize five offline Hero scenes

**Files:**
- Create: `assets/heroes/moss.webp`
- Create: `assets/heroes/dune.webp`
- Create: `assets/heroes/ink.webp`
- Create: `assets/heroes/blush.webp`
- Create: `assets/heroes/aurora.webp`

- [ ] **Step 1: Generate one source image per theme with built-in ImageGen**

Issue five independent built-in ImageGen calls using the shared constraints below and the theme-specific scene/palette:

```text
Use case: photorealistic-natural
Asset type: Obsidian productivity dashboard Hero background
Composition/framing: wide cinematic landscape, main detail in center/right, left 38% calm negative space for white UI copy, horizon and important subjects safe under aggressive background-cover cropping
Style/medium: premium natural editorial photography, restrained and realistic
Lighting/mood: soft atmospheric natural light, subtle mist, calm focus
Constraints: no people, no readable text, no logos, no watermark, no dominant architecture, no hard central focal object
Avoid: oversaturation, fantasy illustration, obvious AI artifacts, neon glow, exaggerated HDR, busy foreground, high-frequency texture in the left text-safe area
```

Theme-specific requests:

- `moss`: misty moss-green forest valley with a quiet stream; muted moss, pine, warm stone.
- `dune`: softly layered sand dunes near sunrise; terracotta, muted ochre, warm cream.
- `ink`: layered distant mountains and still water in natural monochrome mist; ink gray, paper white, restrained blue-gray; photographic rather than painted.
- `blush`: pale pink flowering meadow in morning mist with distant hills; dusty rose, warm gray, cream; professional and not sugary.
- `aurora`: deep navy mountains and lake under a restrained teal-green aurora; dark, calm, natural; no purple neon.

- [ ] **Step 2: Inspect each generated image**

Use `view_image` for every selected output. Reject and regenerate any image that violates the left-side text-safe area, realism, palette, or no-text constraints.

- [ ] **Step 3: Convert selected sources to project WebP assets**

Use Pillow to center-crop/resize every selected image to `1672 × 941`, convert to RGB, and save WebP quality 84 with method 6. Do not preserve source PNG files in the project.

- [ ] **Step 4: Verify image contracts**

Run a Pillow inspection that asserts all eight bundled images:

- decode successfully;
- are `1672 × 941`;
- use RGB/RGBA;
- have non-zero file size.

- [ ] **Step 5: Commit the image assets**

```bash
git add assets/heroes/moss.webp assets/heroes/dune.webp assets/heroes/ink.webp assets/heroes/blush.webp assets/heroes/aurora.webp
git commit -m "feat: add five offline theme scenes"
```

### Task 2: Expand the typed theme catalog

**Files:**
- Modify: `tests/hero-product-unification.test.ts`
- Modify: `tests/offline-hero.test.ts`
- Modify: `tests/personal-home.test.ts`
- Modify: `tests/release-metadata.test.ts`
- Modify: `src/models.ts`
- Modify: `src/product/heroThemes.ts`
- Modify: `src/product/heroScenes.ts`

- [ ] **Step 1: Write failing catalog and asset tests**

Update theme tests to require this stable order:

```ts
["alpine", "paper", "moss", "dune", "ink", "blush", "midnight", "aurora", "obsidian"]
```

Require eight asset paths, Chinese-only user-facing labels, all eight files, and an `obsidian` choice with `assetPath: null`.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because the model and catalog still expose only four themes.

- [ ] **Step 3: Implement the catalog extension**

- Extend `HomeTheme` with `moss | dune | ink | blush | aurora`.
- Update all nine `HERO_THEME_CHOICES` with Chinese labels and descriptions.
- Extend `BUNDLED_HERO_SCENES` to map all eight bundled IDs to their catalog asset paths.
- Keep existing IDs and default `alpine` unchanged.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all catalog, offline, release, and existing persistence tests PASS.

- [ ] **Step 5: Commit the catalog**

```bash
git add tests/hero-product-unification.test.ts tests/offline-hero.test.ts tests/personal-home.test.ts tests/release-metadata.test.ts src/models.ts src/product/heroThemes.ts src/product/heroScenes.ts
git commit -m "feat: expand the typed theme catalog"
```

### Task 3: Add complete palettes and responsive theme cards

**Files:**
- Modify: `tests/personal-home.test.ts`
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/services/PersonalHomeDesignService.ts`
- Modify: `src/styles/SettingsStyles.ts`
- Modify: `src/settings/DashFlowSettingsTab.ts`

- [ ] **Step 1: Write failing palette and picker tests**

Require every new `data-dashflow-theme` selector and all mandatory home/command tokens. Require a three-column desktop grid, two-column medium layout, and one-column narrow layout. Require settings copy that explains custom Hero image precedence.

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because no new palettes or responsive picker contract exists.

- [ ] **Step 3: Implement five complete palette blocks**

Add one full CSS-variable block per new theme:

- `moss`: light gray-green canvas, warm white surfaces, pine accent.
- `dune`: warm sand canvas, cream surfaces, terracotta accent.
- `ink`: paper-white canvas, cool neutral surfaces, blue-gray accent.
- `blush`: muted rose-gray canvas, warm white surfaces, berry accent.
- `aurora`: deep navy canvas, dark teal surfaces, cyan-green accent.

All blocks must define the same token set as existing themes, including command-bar variables and fallback gradients.

- [ ] **Step 4: Improve picker density and custom-image explanation**

- Change desktop cards from four columns to three.
- Keep two columns below 760px and add one column below 460px.
- Change the picker helper copy when `homeHeroImagePath` is present to explain that theme colors change immediately while the custom Hero remains.

- [ ] **Step 5: Run tests and production build**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: TypeScript and esbuild exit 0.

- [ ] **Step 6: Commit palettes and picker**

```bash
git add tests/personal-home.test.ts tests/product-presentation.test.ts src/services/PersonalHomeDesignService.ts src/styles/SettingsStyles.ts src/settings/DashFlowSettingsTab.ts
git commit -m "feat: add complete palettes for offline themes"
```

### Task 4: Verify, integrate, and install

**Files:**
- Verify: all tracked source, tests, and eight `assets/heroes/*.webp`
- Install: `main.js`, `manifest.json`, `styles.css`, `assets/heroes/*.webp`

- [ ] **Step 1: Run final feature verification**

Run: `npm test`, `npm run build`, `git diff --check`, and `git status --short`.

Expected: 0 failures, build exit 0, no whitespace errors, clean feature branch.

- [ ] **Step 2: Fast-forward merge into local `main`**

Run from the main worktree:

```bash
git merge --ff-only feat/expanded-offline-themes
```

- [ ] **Step 3: Rebuild and install exact artifacts**

Run tests and build on `main`. Back up the current installed plugin artifacts, then copy `main.js`, `manifest.json`, `styles.css`, and all eight Hero WebP assets to:

`G:\文档\于浩的知识库\.obsidian\plugins\dashflow`

Do not modify `data.json`.

- [ ] **Step 4: Verify installation hashes**

Compare SHA-256 for all copied files and verify source/installed theme asset counts match.

- [ ] **Step 5: Clean up merged branch and worktree**

Remove only `.worktrees/expanded-offline-themes` and delete only `feat/expanded-offline-themes`; preserve all other worktrees.

