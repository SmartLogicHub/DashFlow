export const SETTINGS_STYLES = `
/* v0.5.6 — Settings as a calm, product-grade surface.
 * Replaces the orphaned Aurora settings layer. Neutral surfaces + a single
 * accent, hairline separators, and tabular figures — no hard-coded palette. */
.dashflow-settings-page {
  max-width: 880px;
  margin: 0 auto;
  padding: 28px 12px 72px;
}

.dashflow-settings-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 22px 24px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 14px;
  background:
    radial-gradient(420px 220px at 94% -20%, color-mix(in srgb, var(--interactive-accent) 10%, transparent), transparent 72%),
    color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary));
}
.dashflow-settings-hero h2 { margin: 0 0 5px; color: var(--text-normal); font-size: 22px; font-weight: 600; letter-spacing: -0.02em; }
.dashflow-settings-hero p { margin: 0; max-width: 640px; color: var(--text-muted); font-size: 13px; line-height: 1.55; }

.dashflow-settings-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 14px;
  padding: 4px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary));
}
.dashflow-settings-tab {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  flex: 1;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 140ms ease, color 140ms ease;
}
.dashflow-settings-tab:hover { color: var(--text-normal); background: var(--background-modifier-hover); }
.dashflow-settings-tab.is-active {
  color: var(--text-normal);
  background: var(--background-primary);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--text-normal) 4%, transparent);
}
.dashflow-settings-tab svg { width: 14px; height: 14px; }

.dashflow-home-theme-preview {
  margin-bottom: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-primary) 92%, var(--background-secondary));
}
.dashflow-home-theme-preview strong { color: var(--text-normal); font-size: 15px; font-weight: 600; letter-spacing: -0.01em; }
.dashflow-home-theme-preview span { color: var(--text-muted); font-size: 12px; }

.dashflow-settings-panel {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-primary) 90%, var(--background-secondary));
}
.dashflow-settings-panel-head {
  padding: 15px 18px 11px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent);
}
.dashflow-settings-panel-head strong { display: block; color: var(--text-normal); font-size: 13px; font-weight: 600; }
.dashflow-settings-panel-head span { display: block; margin-top: 3px; color: var(--text-muted); font-size: 11.5px; line-height: 1.5; }
.dashflow-settings-panel .setting-item {
  margin: 0 !important;
  padding: 14px 18px !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 55%, transparent) !important;
  border-radius: 0 !important;
  background: transparent !important;
}
.dashflow-settings-panel .setting-item:last-child { border-bottom: 0 !important; }
.dashflow-settings-panel .setting-item-name { font-size: 12.5px; font-weight: 600; }
.dashflow-settings-panel .setting-item-description { max-width: 520px; color: var(--text-muted); font-size: 11.5px; }
.dashflow-settings-panel input[type="text"] { min-width: 230px; border-radius: 6px; background: var(--background-primary); }

.dashflow-settings-advanced { margin-top: 18px; }
.dashflow-settings-advanced > summary { cursor: pointer; padding: 4px 2px; color: var(--text-muted); font-size: 12.5px; font-weight: 600; }
.dashflow-settings-guide-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 14px 2px 0; }
.dashflow-settings-code-card {
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary));
}
.dashflow-settings-code-card h3 { margin: 0 0 8px; color: var(--text-normal); font-size: 12.5px; font-weight: 600; }
.dashflow-settings-code-card pre {
  margin: 0;
  padding: 12px;
  overflow: auto;
  border-radius: 6px;
  color: var(--text-normal);
  background: var(--background-primary-alt);
  font-size: 11px;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
}
.dashflow-settings-code-card p { margin: 9px 0 0; color: var(--text-muted); font-size: 11.5px; line-height: 1.5; }

@media (max-width: 760px) {
  .dashflow-settings-guide-grid { grid-template-columns: 1fr; }
  .dashflow-settings-panel .setting-item { align-items: flex-start; gap: 10px; }
  .dashflow-settings-panel input[type="text"] { min-width: 150px; width: 100%; }
}
`;
