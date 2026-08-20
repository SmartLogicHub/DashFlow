export const PRODUCT_HIERARCHY_RESET_STYLES = `
/* v0.6.0 product hierarchy reset.
 * Keep one primary navigation while preserving the full photographic identity
 * across Home and working sections. Working pages are differentiated by their
 * content and labels, not by crushing the Hero into a shallow strip.
 */

/* Every primary section keeps a full-size photographic Hero. Older layers set
 * working sections to 88px/72px; override that compression here and preserve
 * the image aspect visually with cover rather than stretching it. */
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  display: flex !important;
  position: relative !important;
  isolation: isolate !important;
  height: 194px !important;
  min-height: 194px !important;
  margin: 0 0 12px !important;
  padding: 24px 30px !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  overflow: hidden !important;
  border: 1px solid var(--df-home-border, var(--df-cmd-border)) !important;
  border-radius: var(--df-radius-lg) !important;
  color: #fff !important;
  background-color: #0f172a !important;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, .68) 0%, rgba(15, 23, 42, .34) 55%, rgba(15, 23, 42, .06) 100%),
    var(--df-ambient-image, var(--df-home-scene)) !important;
  background-size: cover !important;
  background-position: center 50% !important;
  background-repeat: no-repeat !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .06) !important;
}
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::before {
  display: block !important;
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  pointer-events: none !important;
  background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(0,0,0,.14)) !important;
}
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  display: block !important;
  position: relative !important;
  z-index: 1 !important;
  color: rgba(255,255,255,.98) !important;
  font-size: clamp(22px, 2.2vw, 30px) !important;
  line-height: 1.05 !important;
  font-weight: 800 !important;
  letter-spacing: -.025em !important;
  text-shadow: 0 2px 14px rgba(0,0,0,.38) !important;
}

/* Built-in scenes are bundled with the plugin and injected by the presentation
 * runtime. User-selected local Vault images still override them directly. */

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

/* Preserve a real Hero on narrow windows too; reduce padding/font, not the
 * artwork into a thin strip. */
@media (max-width: 900px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 172px !important;
    min-height: 172px !important;
    padding: 20px 22px !important;
  }
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
