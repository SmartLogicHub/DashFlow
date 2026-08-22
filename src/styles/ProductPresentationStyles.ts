export const PRODUCT_PRESENTATION_STYLES = `
.dashflow-view-container {
  --df-type-label: 11px;
  --df-type-secondary: 12px;
  --df-type-body: 13px;
  --df-type-title: 14px;
  --df-control-compact: 32px;
  --df-control-touch: 36px;
}

.dashflow-command-shell {
  container: dashflow-shell / inline-size;
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
