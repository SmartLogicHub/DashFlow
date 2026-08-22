export const FEATURE_HUB_STYLES = `
.modal:has(.dashflow-feature-hub) {
  width: min(920px, calc(100vw - 32px));
  max-width: 920px;
}
.modal:has(.dashflow-feature-hub) > .modal-header-button { display: none; }

.dashflow-feature-hub {
  --df-hub-border: var(--background-modifier-border);
  --df-hub-muted: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: min(78vh, 760px);
  overflow: hidden;
  padding: 4px 2px 12px;
}

.dashflow-feature-hub-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.dashflow-feature-hub-head h2 { margin: 3px 0 0; }
.dashflow-feature-hub-close {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  color: var(--text-muted);
}
.dashflow-feature-hub-close svg { width: 16px; height: 16px; }
.dashflow-feature-hub-lead { margin: -8px 0 0; color: var(--df-hub-muted); line-height: 1.65; }

.dashflow-feature-hub-tools {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  align-items: center;
  gap: 10px;
}
.dashflow-feature-hub-search-wrap {
  position: relative;
  min-width: 0;
}
.dashflow-feature-hub-search-icon {
  position: absolute;
  top: 50%;
  left: 11px;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
  transform: translateY(-50%);
}
.dashflow-feature-hub-search-icon svg { width: 15px; height: 15px; }
.dashflow-feature-hub-search {
  box-sizing: border-box;
  width: 100%;
  min-height: 36px;
  padding: 7px 12px 7px 34px;
  border: 1px solid var(--df-hub-border);
  border-radius: 9px;
  background: var(--background-primary);
  color: var(--text-normal);
  font-size: 13px;
}
.dashflow-feature-hub-filters {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px;
  border: 1px solid var(--df-hub-border);
  border-radius: 9px;
  background: var(--background-secondary);
}
.dashflow-feature-hub-filters button {
  min-height: 32px;
  padding: 4px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: 11px;
}
.dashflow-feature-hub-filters button.is-active {
  background: var(--background-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
  color: var(--text-normal);
}
.dashflow-feature-hub-search:focus-visible,
.dashflow-feature-hub-filters button:focus-visible,
.dashflow-feature-hub-empty button:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
.dashflow-feature-hub-results {
  min-height: 0;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}
.dashflow-feature-hub-empty {
  min-height: 220px;
  display: grid;
  place-content: center;
  justify-items: center;
  padding: 32px;
  color: var(--text-muted);
  text-align: center;
}
.dashflow-feature-hub-empty strong { color: var(--text-normal); font-size: 14px; }
.dashflow-feature-hub-empty p { margin: 7px 0 14px; font-size: 12px; }
.dashflow-feature-hub-empty button { min-height: 34px; padding: 6px 13px; border-radius: 8px; }

.dashflow-feature-hub-group { display: flex; flex-direction: column; gap: 9px; }
.dashflow-feature-hub-group-title {
  margin: 0;
  color: var(--df-hub-muted);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .09em;
  text-transform: uppercase;
}
.dashflow-feature-hub-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.dashflow-feature-hub-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto 18px;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 72px;
  padding: 11px 12px;
  border: 1px solid var(--df-hub-border);
  border-radius: 12px;
  background: var(--background-primary);
  box-shadow: none;
  color: var(--text-normal);
  text-align: left;
  cursor: pointer;
  transition: border-color 140ms ease, background-color 140ms ease, transform 140ms ease;
}
.dashflow-feature-hub-item:hover {
  border-color: color-mix(in srgb, var(--interactive-accent) 45%, var(--df-hub-border));
  background: var(--background-primary-alt);
  transform: translateY(-1px);
}
.dashflow-feature-hub-item:focus-visible,
.dashflow-feature-hub-close:focus-visible,
.dashflow-command-actions .dashflow-feature-action:focus-visible {
  outline: 2px solid var(--interactive-accent);
  outline-offset: 2px;
}
.dashflow-feature-hub-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--background-secondary);
  color: var(--interactive-accent);
}
.dashflow-feature-hub-icon svg { width: 17px; height: 17px; }
.dashflow-feature-hub-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
.dashflow-feature-hub-copy strong { font-size: 13px; font-weight: 720; }
.dashflow-feature-hub-copy small {
  overflow: hidden;
  color: var(--df-hub-muted);
  font-size: 11.5px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dashflow-feature-hub-status { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }
.dashflow-feature-hub-badge {
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--background-secondary);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}
.dashflow-feature-hub-badge.is-added,
.dashflow-feature-hub-badge.is-configured { background: color-mix(in srgb, var(--color-green) 14%, transparent); color: var(--color-green); }
.dashflow-feature-hub-badge.is-disabled { background: color-mix(in srgb, var(--color-orange) 14%, transparent); color: var(--color-orange); }
.dashflow-feature-hub-badge.is-needs-configuration { background: color-mix(in srgb, var(--color-red) 12%, transparent); color: var(--color-red); }
.dashflow-feature-hub-arrow { display: grid; place-items: center; color: var(--text-faint); }
.dashflow-feature-hub-arrow svg { width: 14px; height: 14px; }

.dashflow-command-actions .dashflow-feature-action {
  display: flex!important;
  width: auto!important;
  padding-inline: 8px!important;
}
.dashflow-command-actions .dashflow-feature-action .dashflow-command-label { display: inline!important; }

.dashflow-section-assist {
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 150px;
  padding: 24px;
  border: 1px dashed color-mix(in srgb, var(--interactive-accent) 32%, var(--background-modifier-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--background-primary-alt) 82%, transparent);
}
.dashflow-section-assist-icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--interactive-accent) 12%, transparent);
  color: var(--interactive-accent);
}
.dashflow-section-assist-icon svg { width: 20px; height: 20px; }
.dashflow-section-assist strong { display: block; font-size: 15px; }
.dashflow-section-assist p { margin: 5px 0 0; color: var(--text-muted); font-size: 12.5px; line-height: 1.55; }
.dashflow-section-assist button { min-height: 34px; padding: 6px 13px; border-radius: 8px; }
.dashflow-section-assist button:focus-visible { outline: 2px solid var(--interactive-accent); outline-offset: 2px; }

.dashflow-project-view-switcher {
  grid-column: 1 / -1;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  padding: 4px;
  overflow-x: auto;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: var(--background-primary-alt);
}
.dashflow-project-view-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  min-height: 32px;
  padding: 5px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  box-shadow: none;
  color: var(--text-muted);
  font-size: 12px;
}
.dashflow-project-view-button svg { width: 14px; height: 14px; }
.dashflow-project-view-button small { color: var(--text-faint); font-size: var(--df-type-label, 11px); }
.dashflow-project-view-button.is-active {
  background: var(--background-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
  color: var(--text-normal);
}
.dashflow-project-view-button.is-missing:not(.is-active) { opacity: .72; }
.dashflow-project-view-button:focus-visible { outline: 2px solid var(--interactive-accent); outline-offset: 1px; }
.dashflow-project-view-switcher + .dashflow-section-assist { grid-row: 2 / span 3; }

@media (max-width: 760px) {
  .modal:has(.dashflow-feature-hub) { width: calc(100vw - 20px); }
  .dashflow-feature-hub-tools { grid-template-columns: 1fr; }
  .dashflow-feature-hub-filters { overflow-x: auto; }
  .dashflow-feature-hub-filters button { flex: 1 0 auto; }
  .dashflow-feature-hub-grid { grid-template-columns: 1fr; }
  .dashflow-feature-hub-item { grid-template-columns: 34px minmax(0, 1fr) auto 18px; }
  .dashflow-command-actions .dashflow-feature-action { display: flex!important; }
  .dashflow-section-assist { grid-template-columns: 40px minmax(0, 1fr); padding: 18px; }
  .dashflow-section-assist button { grid-column: 1 / -1; justify-self: stretch; }
}
`;
