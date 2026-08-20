export const DEEPSEEK_POLISH_STYLES = `
/* v0.6.0 — selectively absorbed DeepSeek visual polish.
 * Keep one motion owner and one Hero owner; this layer only refines surfaces,
 * typography and theme integration. */

/* Light presets must still respect a dark Obsidian window. */
.theme-dark .dashflow-view-container[data-dashflow-theme="alpine"],
.theme-dark .dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-canvas: var(--background-primary);
  --df-home-surface: var(--background-primary);
  --df-home-surface-2: var(--background-secondary);
  --df-home-border: var(--background-modifier-border);
  --df-home-border-strong: color-mix(in srgb, var(--background-modifier-border) 65%, var(--text-muted));
  --df-home-text: var(--text-normal);
  --df-home-muted: var(--text-muted);
  --df-home-faint: var(--text-faint);
  --df-home-reading: var(--background-primary);
  --df-home-reading-2: var(--background-secondary);
  --df-cmd-bg: var(--background-primary);
  --df-cmd-surface: var(--background-primary);
  --df-cmd-soft: var(--background-secondary);
  --df-cmd-border: var(--background-modifier-border);
  --df-cmd-border-strong: color-mix(in srgb, var(--background-modifier-border) 65%, var(--text-muted));
  --df-cmd-text: var(--text-normal);
  --df-cmd-muted: var(--text-muted);
  --df-cmd-faint: var(--text-faint);
}

/* Reduce display-weight heaviness without changing geometry. */
.dashflow-command-shell.is-personal-home .dashflow-hero h1,
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  font-weight: 700 !important;
}

.dashflow-home-hero-actions button,
.dashflow-command-button,
.dashflow-context-tabs > button,
.dashflow-context-configure,
.dashflow-data-filter-toolbar button,
.dashflow-data-filter-field input,
.dashflow-data-filter-field select {
  border-radius: 6px !important;
}

/* Background-layered cards + hairlines. Motion remains owned by the shared
 * InteractionMotionStyles so this layer deliberately does not set transform. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  border: 1px solid color-mix(in srgb, var(--text-normal) 9%, transparent) !important;
  border-radius: 12px !important;
  background: color-mix(in srgb, var(--background-primary) 92%, var(--background-secondary)) !important;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--text-normal) 4%, transparent) !important;
  transition-property: border-color, box-shadow, transform !important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  border-color: color-mix(in srgb, var(--text-normal) 18%, transparent) !important;
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--text-normal) 5%, transparent),
    0 10px 24px color-mix(in srgb, var(--text-normal) 9%, transparent) !important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header {
  border-bottom-color: color-mix(in srgb, var(--text-normal) 7%, transparent) !important;
}

/* Home surfaces use the same quiet hairline language. */
.dashflow-home-card,
.dashflow-home-weread {
  box-shadow: 0 1px 2px color-mix(in srgb, var(--text-normal) 4%, transparent) !important;
}
.dashflow-personal-home .dashflow-home-card,
.dashflow-personal-home .dashflow-home-weread,
.dashflow-personal-home .dashflow-home-section {
  animation: df-card-enter 360ms cubic-bezier(.16, 1, .3, 1) both;
}

/* Small metadata stays readable instead of dropping below 10px. */
.dashflow-data-filter-result-kind,
.dashflow-ai-news-warning,
.dashflow-ai-news-empty {
  font-size: 10px !important;
}
.dashflow-data-filter-result-copy strong,
.dashflow-home-card-head > span,
.dashflow-home-card-actions > span,
.dashflow-context-tabs > button,
.dashflow-context-configure {
  font-weight: 600 !important;
}

/* Figures should not jump horizontally as data changes. */
.dashflow-progress-ring strong,
.dashflow-project-stat strong,
.dashflow-countdown strong,
.dashflow-countdown-value,
.dashflow-focus-time,
.dashflow-stat strong,
.dashflow-vault-stats strong,
.dashflow-home-status-metrics strong,
.dashflow-home-weread-copy p {
  font-variant-numeric: tabular-nums;
}

.dashflow-focus-time { font-weight: 700 !important; }
.dashflow-magic-embed-icon { border-radius: 8px !important; }

@media (prefers-reduced-motion: reduce) {
  .dashflow-personal-home .dashflow-home-card,
  .dashflow-personal-home .dashflow-home-weread,
  .dashflow-personal-home .dashflow-home-section {
    animation: none !important;
  }
}
`;
