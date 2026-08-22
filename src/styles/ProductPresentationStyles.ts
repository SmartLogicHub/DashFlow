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
  position: relative;
  z-index: 1;
  font-family: var(--font-interface);
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}

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

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  display: flex !important;
  position: relative;
  isolation: isolate;
  height: 128px;
  min-height: 128px;
  margin: 0 0 12px;
  padding: 18px 24px;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
  border: 1px solid var(--df-home-border, var(--df-cmd-border));
  border-radius: 14px;
  color: #fff;
  background-color: #0f172a;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, .68) 0%, rgba(15, 23, 42, .34) 55%, rgba(15, 23, 42, .06) 100%),
    var(--df-hero-image, var(--df-home-scene));
  background-size: cover;
  background-position: center 50%;
  background-repeat: no-repeat;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .06);
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, .03), rgba(0, 0, 0, .14));
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero > .dashflow-hero-content {
  position: relative;
  z-index: 1;
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero .dashflow-eyebrow {
  display: block;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, .78);
  font-size: var(--df-type-label);
  font-weight: 700;
  letter-spacing: .08em;
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero h1 {
  margin: 0;
  color: rgba(255, 255, 255, .98);
  font-size: clamp(24px, 2vw, 28px);
  line-height: 1.05;
  font-weight: 760;
  letter-spacing: -.025em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, .38);
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, .88);
  font-size: var(--df-type-body);
  line-height: 1.4;
  text-shadow: 0 1px 8px rgba(0, 0, 0, .3);
}

.dashflow-context-switcher,
.dashflow-command-shell:not(.is-layout-editing) .dashflow-command-workspace,
.dashflow-command-actions .is-secondary-action {
  display: none !important;
}

.dashflow-command-actions [data-command-action="layout"] {
  display: inline-flex !important;
}

.dashflow-command-actions [data-command-action="layout"].is-active {
  color: var(--df-cmd-text) !important;
  border-color: var(--df-cmd-border) !important;
  background: var(--df-cmd-soft) !important;
}

.dashflow-widget-controls .dashflow-widget-remove {
  width: auto !important;
  min-width: 44px;
  padding: 0 8px;
  font-size: var(--df-type-label);
  font-weight: 650;
}

.dashflow-widget-controls .dashflow-widget-remove.is-confirming {
  color: var(--text-error) !important;
  background: color-mix(in srgb, var(--text-error) 10%, transparent) !important;
}

.dashflow-shell.is-mobile .dashflow-widget-controls .dashflow-widget-remove {
  width: auto !important;
  min-width: 44px;
}

.dashflow-command-shell.is-layout-editing .dashflow-command-workspace {
  display: flex !important;
  align-items: center;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget {
  border-color: color-mix(in srgb, var(--text-normal) 9%, transparent) !important;
  background: color-mix(in srgb, var(--background-primary) 94%, var(--background-secondary)) !important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  border-color: color-mix(in srgb, var(--text-normal) 18%, transparent) !important;
}

.dashflow-home-section,
.dashflow-home-areas-section {
  margin: 0;
  padding: 0;
}

.dashflow-home-section-head h2 {
  margin: 0;
  padding: 0;
  color: var(--df-home-text);
  font-size: 15px;
  line-height: 1.2;
  font-weight: 720;
  letter-spacing: -.015em;
}

.dashflow-home-recent-list > button {
  width: 100%;
  min-height: var(--df-control-touch);
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 62%, transparent);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  text-align: left;
}

.dashflow-home-recent-list > button:last-child { border-bottom: 0; }

.dashflow-home-weread:has(.dashflow-home-weread-mark) {
  color: var(--df-home-text);
  border: 1px solid var(--df-home-border);
  border-radius: 12px;
  background: var(--df-home-surface);
  box-shadow: none;
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

.dashflow-command-shell .dashflow-command-badge,
.dashflow-command-shell .dashflow-widget-kicker,
.dashflow-command-shell .dashflow-widget-kicker span,
.dashflow-command-shell .dashflow-capture-footer span,
.dashflow-command-shell .dashflow-task time,
.dashflow-command-shell .dashflow-task-priority,
.dashflow-command-shell .dashflow-progress-ring span,
.dashflow-command-shell .dashflow-task-overview-label,
.dashflow-command-shell .dashflow-task-overview-secondary-heading,
.dashflow-command-shell .dashflow-task-overview-secondary-heading span,
.dashflow-command-shell .dashflow-project-row small,
.dashflow-command-shell .dashflow-project-stat,
.dashflow-command-shell .dashflow-project-stat span,
.dashflow-command-shell .dashflow-heatmap-stat span,
.dashflow-command-shell .dashflow-heatmap-range,
.dashflow-command-shell .dashflow-heatmap-footer,
.dashflow-command-shell .dashflow-heatmap-legend,
.dashflow-command-shell .dashflow-countdown > span,
.dashflow-command-shell .dashflow-countdown > small,
.dashflow-command-shell .dashflow-stat span {
  font-size: var(--df-type-label) !important;
}

.dashflow-command-shell .dashflow-kicker,
.dashflow-command-shell .dashflow-empty {
  font-size: var(--df-type-secondary) !important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) minmax(96px, 146px) 54px !important;
  gap: 14px !important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row:has(.dashflow-project-steps) .dashflow-project-bar {
  display: none !important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat {
  min-width: 54px;
  display: grid;
  justify-items: end;
  gap: 1px;
  text-align: right;
}

.dashflow-command-shell .dashflow-grid[data-product-section="projects"] > .dashflow-widget[data-widget-type="projects"] {
  height: auto !important;
  min-height: 0 !important;
  overflow: visible !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-list {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
  align-items: start;
  gap: 10px !important;
  padding: 12px !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-row {
  min-height: 86px !important;
  padding: 12px 14px !important;
  grid-template-columns: minmax(0, 1fr) auto !important;
  grid-template-areas:
    "main stat"
    "steps steps" !important;
  column-gap: 12px !important;
  row-gap: 10px !important;
  border: 1px solid var(--df-cmd-border) !important;
  border-radius: 10px !important;
  background: var(--df-cmd-surface) !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-main { grid-area: main; }
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-steps { grid-area: steps; width: 100%; }
.dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-stat { grid-area: stat; align-self: start; }

.dashflow-editor-modal,
.dashflow-search-modal {
  font-family: var(--font-interface);
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}

.modal:has(.dashflow-editor-modal) {
  width: min(680px, calc(100vw - 36px));
  max-width: 680px;
  border-radius: 16px;
}

.modal:has(.dashflow-editor-modal) .modal-content.dashflow-editor-modal {
  padding: 26px 28px 24px;
  color: var(--text-normal);
  font-size: var(--df-type-body);
  line-height: 1.5;
}

.dashflow-editor-modal .dashflow-modal-eyebrow {
  margin: 0 0 7px;
  color: var(--text-muted);
  font-size: var(--df-type-label);
  font-weight: 700;
  letter-spacing: .12em;
}

.dashflow-editor-modal > h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 22px;
  line-height: 1.2;
  font-weight: 740;
  letter-spacing: -.025em;
}

.dashflow-editor-modal > .dashflow-modal-lead {
  max-width: 560px;
  margin: 7px 0 18px;
  color: var(--text-muted);
  font-size: var(--df-type-secondary);
  line-height: 1.55;
}

.dashflow-widget-setting-stack {
  width: min(360px, 100%);
  min-width: min(280px, 100%);
  flex-direction: column;
  align-items: stretch;
  gap: 7px;
}

.dashflow-widget-setting-stack textarea {
  width: 100%;
  min-height: 132px;
  padding: 9px 10px;
  resize: vertical;
  font-family: var(--font-monospace);
  font-size: var(--df-type-label);
  line-height: 1.5;
}

.dashflow-widget-setting-preset {
  align-self: flex-end;
  min-height: var(--df-control-compact);
}

.dashflow-task-editor > .setting-item,
.dashflow-project-editor > .setting-item,
.dashflow-habit-editor > .setting-item {
  min-height: 54px;
  padding: 10px 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 280px);
  gap: 22px;
  align-items: center;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}

.dashflow-task-editor .setting-item-name,
.dashflow-project-editor .setting-item-name,
.dashflow-habit-editor .setting-item-name {
  font-size: var(--df-type-body);
  font-weight: 650;
}

.dashflow-task-editor .setting-item-description,
.dashflow-project-editor .setting-item-description,
.dashflow-habit-editor .setting-item-description {
  color: var(--text-muted);
  font-size: var(--df-type-label);
  line-height: 1.4;
}

.dashflow-task-editor .setting-item-control,
.dashflow-project-editor .setting-item-control,
.dashflow-habit-editor .setting-item-control {
  width: 100%;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.dashflow-task-editor input[type="text"],
.dashflow-task-editor input[type="date"],
.dashflow-task-editor input[type="number"],
.dashflow-task-editor select,
.dashflow-project-editor input[type="text"],
.dashflow-project-editor input[type="date"],
.dashflow-project-editor input[type="number"],
.dashflow-project-editor select,
.dashflow-habit-editor input[type="text"],
.dashflow-habit-editor input[type="date"],
.dashflow-habit-editor input[type="number"],
.dashflow-habit-editor select {
  width: 100%;
  min-width: 0;
  min-height: var(--df-control-touch);
  border-radius: 7px;
  font-size: var(--df-type-secondary);
}

.dashflow-project-editor textarea,
.dashflow-task-editor textarea,
.dashflow-habit-editor textarea {
  width: 100%;
  min-height: 88px;
  resize: vertical;
  border-radius: 7px;
  font-size: var(--df-type-secondary);
  line-height: 1.45;
}

.dashflow-task-editor-actions,
.dashflow-habit-editor-actions {
  min-height: 48px;
  margin-top: 8px;
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--background-modifier-border);
}

.modal:has(.dashflow-project-detail) {
  width: min(720px, calc(100vw - 40px));
  max-width: 720px;
}

.dashflow-project-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.dashflow-project-detail h2 {
  margin: 0;
  color: var(--text-normal);
  font-size: 24px;
  line-height: 1.2;
  font-weight: 740;
}

.dashflow-project-detail-actions,
.dashflow-project-detail-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dashflow-project-detail-actions button,
.dashflow-project-detail-section-head > button {
  min-height: var(--df-control-compact);
  border-radius: 8px;
  font-size: var(--df-type-secondary);
}

.dashflow-project-detail-meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.dashflow-project-detail-meta-item {
  min-width: 0;
  min-height: 64px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary));
}

.dashflow-project-detail-meta-item > span,
.dashflow-project-detail-section-head span {
  color: var(--text-muted);
  font-size: var(--df-type-label);
}

.dashflow-project-detail-meta-item > strong,
.dashflow-project-detail-section-head strong {
  color: var(--text-normal);
  font-size: var(--df-type-title);
  font-weight: 700;
}

.dashflow-project-detail-progress {
  width: 100%;
  height: 5px;
  margin-bottom: 22px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--background-modifier-border);
}

.dashflow-project-detail-progress > span {
  display: block;
  height: 100%;
  background: var(--interactive-accent);
}

.dashflow-project-detail-task-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--background-modifier-border);
}

.dashflow-project-detail-task {
  min-height: 48px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid var(--background-modifier-border);
}

.modal:has(.dashflow-quick-add-modal) {
  width: min(600px, calc(100vw - 36px));
  max-width: 600px;
}

.dashflow-quick-add-composer {
  min-height: 52px;
  padding: 5px 6px 5px 11px;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  border: 1px solid color-mix(in srgb, var(--interactive-accent) 26%, var(--background-modifier-border));
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-secondary) 58%, var(--background-primary));
}

.dashflow-quick-add-composer input {
  width: 100%;
  min-height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none !important;
  outline: 0;
  font-size: var(--df-type-body);
}

.dashflow-quick-add-submit {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: var(--df-type-secondary);
  font-weight: 680;
}

.dashflow-quick-add-target {
  min-height: 34px;
  margin: 6px 2px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.dashflow-quick-add-target-copy {
  min-width: 0;
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--df-type-label);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashflow-quick-add-target-action {
  min-height: 30px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: var(--df-type-label);
}

.dashflow-quick-add-target-action:hover {
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}

.dashflow-quick-add-target-icon,
.dashflow-quick-add-target-icon svg,
.dashflow-quick-add-action-icon svg {
  width: 15px;
  height: 15px;
}

.dashflow-quick-add-section-label {
  margin-top: 14px;
  color: var(--text-faint);
  font-size: var(--df-type-label);
  font-weight: 650;
  letter-spacing: .04em;
}

.dashflow-quick-add-actions {
  margin-top: 7px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.dashflow-quick-add-action {
  min-height: 64px;
  padding: 10px;
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  text-align: left;
}

.dashflow-quick-add-action > span:last-child { min-width: 0; }
.dashflow-quick-add-action strong { display: block; font-size: var(--df-type-secondary); line-height: 1.25; }
.dashflow-quick-add-action small { display: block; margin-top: 3px; color: var(--text-muted); font-size: var(--df-type-label); line-height: 1.35; text-wrap: pretty; }

.dashflow-search-modal {
  width: min(680px, calc(100vw - 36px));
  max-width: 680px;
  border-radius: 14px;
}

.dashflow-search-modal .prompt-input { min-height: 44px; font-size: var(--df-type-title); }
.dashflow-search-modal .suggestion-container { padding: 7px; }
.dashflow-search-modal .suggestion-item { min-height: 48px; margin: 1px 0; padding: 8px 9px; border-radius: 9px; }
.dashflow-search-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 9px; align-items: center; }
.dashflow-search-item-copy { min-width: 0; }
.dashflow-search-item-copy strong,
.dashflow-search-item-copy span { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-search-item-copy strong { font-size: var(--df-type-body); }
.dashflow-search-item-copy span { margin-top: 2px; color: var(--text-muted); font-size: var(--df-type-label); }

.modal:has(.dashflow-ai-plan) { width: min(720px, calc(100vw - 36px)); max-width: 720px; }
.dashflow-ai-plan-state { min-height: 92px; margin-top: 16px; padding: 16px; display: flex; align-items: center; justify-content: center; }
.dashflow-ai-plan-output { max-height: min(52vh, 460px); margin-top: 16px; padding: 16px 17px; overflow: auto; font-size: var(--df-type-secondary); line-height: 1.65; white-space: pre-wrap; }
.dashflow-ai-plan-actions { margin-top: 12px; display: flex; justify-content: flex-end; gap: 7px; }
.dashflow-ai-plan-actions button { min-height: var(--df-control-compact); }

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

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="progress"] .dashflow-task-overview {
  min-height: 0;
  padding: 9px 14px;
  gap: 12px;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="tasks"] .dashflow-widget-body:has(> .dashflow-empty),
.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="upcoming"] .dashflow-widget-body:has(> .dashflow-empty) {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="tasks"] .dashflow-widget-body:has(> .dashflow-empty) > .dashflow-empty,
.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="upcoming"] .dashflow-widget-body:has(> .dashflow-empty) > .dashflow-empty {
  height: auto !important;
  min-height: 0 !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="projects"] .dashflow-project-list {
  padding-bottom: 8px !important;
}

.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="heatmap"] .dashflow-widget-body,
.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="countdown"] .dashflow-widget-body,
.dashflow-command-shell .dashflow-grid[data-product-section="work"] .dashflow-widget[data-widget-type="vault-stats"] .dashflow-widget-body {
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

.dashflow-command-shell .dashflow-habit-empty {
  min-height: 150px;
  display: grid;
  place-content: center;
  justify-items: center;
  padding: 22px;
  text-align: center;
}

.dashflow-command-shell .dashflow-habit-empty strong {
  font-size: var(--df-type-title);
}

.dashflow-command-shell .dashflow-habit-empty p {
  max-width: 420px;
  margin: 7px 0 14px;
  color: var(--df-cmd-muted);
  font-size: var(--df-type-secondary);
  line-height: 1.55;
}

.dashflow-command-shell .dashflow-habit-empty-action,
.dashflow-command-shell .dashflow-section-assist button {
  min-height: var(--df-control-touch);
}

@container dashflow-shell (max-width: 900px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 112px;
    min-height: 112px;
    padding: 16px 18px;
  }

  .dashflow-command-shell .dashflow-grid[data-product-section="projects"] .dashflow-project-list {
    grid-template-columns: 1fr !important;
  }
}

@container dashflow-shell (max-width: 720px) {
  .dashflow-command-shell .dashflow-grid[data-product-section="calendar"] .dashflow-calendar {
    grid-template-columns: 1fr;
  }

  .dashflow-command-shell .dashflow-grid[data-product-section="calendar"] .dashflow-calendar-agenda {
    padding-top: 12px;
    padding-left: 0;
    border-top: 1px solid var(--df-cmd-border);
    border-left: 0;
  }

  .dashflow-command-shell .dashflow-section-assist {
    grid-template-columns: 1fr;
    justify-items: stretch;
    min-height: 0;
    padding: 18px;
  }

  .dashflow-command-shell .dashflow-section-assist-icon {
    width: 40px;
    height: 40px;
  }

  .dashflow-command-shell .dashflow-section-assist button {
    width: 100%;
  }
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
  grid-template-columns: var(--df-control-touch) minmax(76px, 1fr) minmax(72px, .8fr) var(--df-control-touch);
  gap: 6px;
  border-top: 1px solid var(--df-cmd-border);
}

.dashflow-command-shell.is-mobile .dashflow-command-actions .dashflow-command-button {
  display: none !important;
}

.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="add"],
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="features"],
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="layout"],
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

.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="features"] .dashflow-command-label,
.dashflow-command-shell.is-mobile .dashflow-command-actions [data-command-action="layout"] .dashflow-command-label {
  display: inline !important;
}

@media (max-width: 760px) {
  .modal:has(.dashflow-editor-modal),
  .dashflow-search-modal {
    width: calc(100vw - 18px);
    max-width: none;
  }

  .modal:has(.dashflow-editor-modal) .modal-content.dashflow-editor-modal {
    padding: 22px 18px 20px;
  }

  .dashflow-task-editor > .setting-item,
  .dashflow-project-editor > .setting-item,
  .dashflow-habit-editor > .setting-item {
    grid-template-columns: 1fr;
    gap: 7px;
  }

  .dashflow-project-detail-head { flex-direction: column; gap: 10px; }
  .dashflow-project-detail-meta { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashflow-quick-add-target { flex-wrap: wrap; }
  .dashflow-quick-add-target-action { margin-left: auto; }
  .dashflow-quick-add-actions { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *,
  .dashflow-editor-modal *,
  .dashflow-search-modal * {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }
}
`;
