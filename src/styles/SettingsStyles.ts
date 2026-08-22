export const SETTINGS_STYLES = `
/* v0.6.0 — Settings as a calm, product-grade surface.
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

.dashflow-theme-picker {
  padding: 14px 18px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 55%, transparent);
}
.dashflow-theme-picker > strong { display: block; color: var(--text-normal); font-size: 12.5px; font-weight: 600; }
.dashflow-theme-picker > span { display: block; margin-top: 3px; color: var(--text-muted); font-size: 11.5px; line-height: 1.5; }
.dashflow-theme-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; margin-top: 12px; }
.dashflow-theme-card {
  display: block !important;
  position: relative;
  min-width: 0;
  width: 100%;
  height: auto !important;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 9px;
  color: var(--text-normal);
  background: var(--background-primary);
  box-shadow: none;
  cursor: pointer;
  text-align: left;
  transition: transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease;
}
.dashflow-theme-card:hover { transform: translateY(-1px); border-color: var(--interactive-accent); }
.dashflow-theme-card:focus-visible { outline: 2px solid var(--interactive-accent); outline-offset: 2px; }
.dashflow-theme-card.is-selected { border-color: var(--interactive-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--interactive-accent) 18%, transparent); }
.dashflow-theme-card-artwork { height: 74px; background: center / cover no-repeat; }
.dashflow-theme-card-artwork.is-obsidian {
  background:
    linear-gradient(140deg, color-mix(in srgb, var(--interactive-accent) 28%, transparent), transparent 58%),
    var(--background-secondary);
}
.dashflow-theme-card-copy { min-height: 68px; padding: 9px 10px 10px; display: flex; flex-direction: column; gap: 3px; }
.dashflow-theme-card-copy strong { min-height: 2.6em; color: var(--text-normal); font-size: 11px; font-weight: 650; line-height: 1.3; white-space: normal; overflow-wrap: anywhere; }
.dashflow-theme-card-copy span { color: var(--text-muted); font-size: 12px; line-height: 1.45; white-space: normal; overflow: visible; text-overflow: clip; }
.dashflow-theme-card-state {
  position: absolute;
  top: 7px;
  right: 7px;
  padding: 2px 6px;
  border-radius: 99px;
  color: var(--text-normal);
  background: color-mix(in srgb, var(--background-primary) 88%, transparent);
  backdrop-filter: blur(8px);
  font-size: 11px;
  font-weight: 650;
}
.dashflow-theme-card.is-selected .dashflow-theme-card-state { color: var(--text-on-accent); background: var(--interactive-accent); }

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

.dashflow-onboarding-modal { width: min(680px, calc(100vw - 28px)); }
.dashflow-onboarding-modal .modal-content { padding: 24px; }
.dashflow-onboarding-eyebrow { color: var(--text-faint); font-size: 11px; font-weight: 700; letter-spacing: 0.14em; }
.dashflow-onboarding-modal h2 { margin: 7px 0 8px; color: var(--text-normal); font-size: 25px; letter-spacing: -0.03em; }
.dashflow-onboarding-lead { margin: 0; max-width: 580px; color: var(--text-muted); font-size: 13px; line-height: 1.65; }
.dashflow-onboarding-counts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 20px; }
.dashflow-onboarding-count { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border: 1px solid var(--background-modifier-border); border-radius: 9px; background: color-mix(in srgb, var(--background-secondary) 48%, var(--background-primary)); }
.dashflow-onboarding-count strong { color: var(--text-normal); font-size: 17px; font-variant-numeric: tabular-nums; }
.dashflow-onboarding-count span { color: var(--text-muted); font-size: 11px; }
.dashflow-onboarding-choices, .dashflow-onboarding-paths { margin-top: 22px; }
.dashflow-onboarding-choices h3, .dashflow-onboarding-paths h3 { margin: 0 0 9px; color: var(--text-normal); font-size: 12px; font-weight: 650; }
.dashflow-onboarding-choice { display: flex; width: 100%; align-items: center; gap: 11px; margin: 7px 0; padding: 11px 13px; border: 1px solid var(--background-modifier-border); border-radius: 9px; color: var(--text-normal); background: var(--background-primary); text-align: left; cursor: pointer; transition: border-color 140ms ease, background 140ms ease; }
.dashflow-onboarding-choice:hover, .dashflow-onboarding-choice[aria-pressed="true"] { border-color: var(--interactive-accent); background: color-mix(in srgb, var(--interactive-accent) 7%, var(--background-primary)); }
.dashflow-onboarding-choice-icon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 7px; color: var(--interactive-accent); background: color-mix(in srgb, var(--interactive-accent) 13%, transparent); font-size: 16px; }
.dashflow-onboarding-choice-copy { display: flex; min-width: 0; flex-direction: column; gap: 2px; }
.dashflow-onboarding-choice-copy strong { font-size: 12px; }
.dashflow-onboarding-choice-copy span { color: var(--text-muted); font-size: 11.5px; line-height: 1.4; }
.dashflow-onboarding-path { display: grid; grid-template-columns: 96px minmax(0, 1fr); align-items: center; gap: 10px; margin: 8px 0; }
.dashflow-onboarding-path label { color: var(--text-muted); font-size: 12px; }
.dashflow-onboarding-path input { width: 100%; min-width: 0; }
.dashflow-onboarding-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; }
.dashflow-onboarding-actions button { min-height: 32px; padding: 0 14px; border-radius: 7px; cursor: pointer; }
.dashflow-onboarding-actions .mod-ghost { border: 1px solid var(--background-modifier-border); color: var(--text-muted); background: transparent; }
.dashflow-onboarding-actions .mod-cta { border: 1px solid var(--interactive-accent); color: var(--text-on-accent); background: var(--interactive-accent); }

@media (max-width: 760px) {
  .dashflow-theme-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashflow-settings-guide-grid { grid-template-columns: 1fr; }
  .dashflow-settings-panel .setting-item { align-items: flex-start; gap: 10px; }
  .dashflow-settings-panel input[type="text"] { min-width: 150px; width: 100%; }
}

@media (max-width: 620px) {
  .dashflow-onboarding-counts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashflow-onboarding-path { grid-template-columns: 1fr; gap: 4px; }
}

@media (max-width: 460px) {
  .dashflow-theme-cards { grid-template-columns: 1fr; }
}
`;
