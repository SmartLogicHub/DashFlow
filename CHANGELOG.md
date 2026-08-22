# Changelog

## 0.7.0 — 2026-08-22

- Rebuilds product-wide presentation ownership around one canonical responsive layer while preserving schema-8 data and Markdown truth.
- Keeps Add, Feature Hub, and Search visible in narrow Obsidian panes and centers the active navigation item.
- Adds Feature Hub search, status filters, and a clear empty-result recovery path.
- Establishes readable typography and touch targets across Work, Weekly Review, Calendar, Habits, Settings, and feature discovery.
- Replaces nested Work/Review scrolling with routed summaries and natural-height focused pages.
- Retires four legacy global polish modules and reduces measured `!important` usage from 911 to 261.
- Makes CI source archive naming derive from `manifest.json` and fails duplicate GitHub releases explicitly.

## 0.6.1 — 2026-08-20

- Validates schema-8 settings before use and preserves malformed data through the non-destructive recovery flow.
- Releases the first-run onboarding lock when the modal is dismissed without treating dismissal as completion.
- Adds a complete GitHub Release installation ZIP that preserves bundled Hero asset paths.

## 0.6.0 — 2026-08-20

- Unifies Work as the full extension Widget canvas while keeping focused section filters.
- Migrates AI credentials to Obsidian SecretStorage and redacts recovery exports.
- Adds schema-8 validation, bounded recovery snapshots, and explicit recovery actions.
- Adds timed confirmation and Undo for destructive Dashboard, Widget, layout, and Opportunity actions.
- Adds a skippable first-run onboarding modal with three starting layouts and editable workflow paths.
- Ships coordinated Alpine, Paper, and Midnight WebP Hero scenes locally; default startup no longer requests third-party image URLs.
- Aligns reproducible `npm ci` builds, release artifacts, privacy documentation, and upgrade notes.

## 0.5.6

- Runtime and product hierarchy polish, Focus, AI News, Data Filter and workflow improvements.
