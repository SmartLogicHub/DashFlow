export const PRODUCT_PRESENTATION_STYLES = `
.dashflow-view-container {
  --df-type-label: 11px;
  --df-type-secondary: 12px;
  --df-type-body: 13px;
  --df-type-title: 14px;
  --df-control-compact: 32px;
  --df-control-touch: 36px;
  font-variant-numeric: tabular-nums;
}

.dashflow-command-shell {
  container: dashflow-shell / inline-size;
}

.dashflow-command-shell .dashflow-command-button {
  min-height: var(--df-control-compact);
  height: var(--df-control-compact);
  font-size: var(--df-type-secondary);
}

.dashflow-command-shell .dashflow-widget-header strong {
  font-size: var(--df-type-title) !important;
}

.dashflow-command-shell .dashflow-widget-body {
  font-size: var(--df-type-body);
  line-height: 1.5;
}

.dashflow-command-shell .dashflow-kicker,
.dashflow-command-shell .dashflow-empty {
  font-size: var(--df-type-secondary) !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="projects"] .dashflow-project-row:nth-of-type(n + 4) {
  display: none !important;
}

.dashflow-command-shell .dashflow-project-route {
  display: none !important;
  width: 100%;
  min-height: var(--df-control-compact);
  margin-top: 4px;
  border: 0;
  border-radius: 7px;
  background: var(--df-cmd-soft);
  box-shadow: none;
  color: var(--df-cmd-muted);
  font-size: var(--df-type-secondary);
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-project-route {
  display: block !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="weekly-review"] .dashflow-weekly-grid {
  display: none !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-weekly-route {
  display: inline-flex !important;
  align-items: center;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="projects"] .dashflow-widget-body,
.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="weekly-review"] .dashflow-widget-body {
  overflow: hidden !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="review"] {
  display: block !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="review"] > .dashflow-widget {
  height: auto !important;
  min-height: 0 !important;
  margin-bottom: 12px;
  overflow: visible !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="review"] > .dashflow-widget .dashflow-widget-body {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: visible !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="review"] .dashflow-weekly,
.dashflow-command-shell .dashflow-grid[data-product-section="review"] .dashflow-weekly-grid {
  height: auto !important;
  min-height: 0 !important;
}

.dashflow-command-shell.is-mobile .dashflow-command-bar {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 6px;
  overflow: visible;
  padding: 6px;
}

.dashflow-command-shell.is-mobile .dashflow-command-bar::before,
.dashflow-command-shell.is-mobile .dashflow-command-workspace {
  display: none !important;
}

.dashflow-command-shell.is-mobile .dashflow-command-nav {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0 6px 5px;
  overflow-x: auto;
  border-right: 0;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  mask-image: linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent);
}

.dashflow-command-shell.is-mobile .dashflow-command-nav .dashflow-command-button {
  min-width: max-content;
  scroll-snap-align: center;
}

.dashflow-command-shell.is-mobile .dashflow-command-actions {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin-left: 0;
  padding-top: 6px;
  display: grid !important;
  grid-template-columns: var(--df-control-touch) minmax(82px, 1fr) var(--df-control-touch);
  gap: 6px;
  border-top: 1px solid var(--df-cmd-border);
}

.dashflow-command-shell.is-mobile .dashflow-command-actions .dashflow-command-button {
  display: none !important;
}

.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="add"],
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="features"],
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="search"] {
  display: inline-flex !important;
  min-width: 0;
  width: 100%;
  height: var(--df-control-touch);
  justify-content: center;
}

.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="add"] .dashflow-command-label,
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="search"] .dashflow-command-label {
  display: none !important;
}

.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="features"] .dashflow-command-label {
  display: inline !important;
}
`;
