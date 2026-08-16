export const PRODUCT_HIERARCHY_RESET_STYLES = `
/* v0.5.6 product hierarchy reset.
 * One primary navigation, one photographic Home, and tools that only appear
 * when they are relevant. This intentionally overrides older continuity layers
 * that made every section look like a second landing page.
 */

/* Home is the only photographic surface. Working sections begin immediately
 * with navigation and useful content instead of a shallow cropped banner. */
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  background: none !important;
  box-shadow: none !important;
}
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::before,
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  content: none !important;
  display: none !important;
}

/* Do not request transformed/compressed Unsplash variants for the built-in
 * scenes. User-selected local Vault images already resolve to the original
 * Vault resource and remain untouched. */
.dashflow-view-container[data-dashflow-theme="alpine"] {
  --df-home-scene: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb");
}
.dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-scene: url("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9");
}
.dashflow-view-container[data-dashflow-theme="midnight"] {
  --df-home-scene: url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23");
}

/* There must be one visible navigation hierarchy. Context presets remain
 * configured in workflow settings, but the duplicated Morning/Work/Review bar
 * is not shown beside Home/Work/Review primary navigation. */
.dashflow-context-switcher {
  display: none !important;
}

/* Dashboard selection is layout infrastructure, not primary product nav.
 * Keep it available while editing layout, hide it during normal use. */
.dashflow-command-shell:not(.is-layout-editing) .dashflow-command-workspace {
  display: none !important;
}
.dashflow-command-shell.is-layout-editing .dashflow-command-workspace {
  display: flex !important;
  align-items: center !important;
}

/* Quick Add owns creation. Dedicated Project/Habit creation remains available
 * inside the relevant pages and editors without crowding every section. */
.dashflow-command-actions .is-secondary-action {
  display: none !important;
}
.dashflow-command-actions {
  gap: 4px !important;
}

/* Projects is a content page, not a fixed-height Dashboard tile. */
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] > .dashflow-widget[data-widget-type="projects"] {
  min-height: 0 !important;
  height: auto !important;
  overflow: visible !important;
}
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-list {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
  align-items: start !important;
  gap: 10px !important;
  padding: 12px !important;
}
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-row {
  min-height: 86px !important;
  padding: 12px 14px !important;
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  grid-template-areas:
    "main stat"
    "steps steps" !important;
  align-items: center !important;
  column-gap: 12px !important;
  row-gap: 10px !important;
  border: 1px solid var(--df-cmd-border) !important;
  border-radius: var(--df-radius-md) !important;
  background: var(--df-cmd-surface) !important;
}
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-main {
  grid-area: main;
  min-width: 0 !important;
}
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-steps {
  grid-area: steps;
  width: 100% !important;
}
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-stat {
  grid-area: stat;
  align-self: start !important;
}

/* Preserve readable geometry when the window narrows. */
@media (max-width: 900px) {
  .dashflow-command-bar {
    gap: 3px !important;
  }
  .dashflow-command-actions .dashflow-command-label {
    display: none;
  }
  .dashflow-command-actions .dashflow-command-button {
    width: 30px;
    padding-inline: 0 !important;
    justify-content: center;
  }
  .dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-list {
    grid-template-columns: 1fr !important;
  }
}
`;
