export const WORKFLOW_STYLES = `
.dashflow-context-switcher {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: -12px 4px 10px;
  min-height: 34px;
}
.dashflow-context-tabs {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-secondary) 88%, transparent);
}
.dashflow-context-tabs > button,
.dashflow-context-configure {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--text-faint);
  min-height: 28px;
  border-radius: 7px;
  padding: 4px 9px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 10px;
  font-weight: 650;
}
.dashflow-context-tabs > button:hover,
.dashflow-context-configure:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}
.dashflow-context-tabs > button.is-configured { color: var(--text-muted); }
.dashflow-context-tabs > button.is-active {
  color: var(--text-on-accent);
  background: var(--interactive-accent);
  box-shadow: 0 1px 6px color-mix(in srgb, var(--interactive-accent) 20%, transparent);
}
.dashflow-context-icon,
.dashflow-context-configure svg { width: 13px; height: 13px; }
.dashflow-context-configure {
  width: 30px;
  padding: 0;
  justify-content: center;
  border: 1px solid var(--background-modifier-border);
}
.dashflow-quick-add-target {
  margin: -4px 2px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-muted);
  font-size: 10px;
}
.dashflow-quick-add-target button {
  min-height: 26px;
  padding: 3px 8px;
  font-size: 10px;
  border-radius: 7px;
}
.dashflow-capture-destination-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  margin-top: 14px;
}
.dashflow-capture-destination-option {
  appearance: none;
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  background: var(--background-secondary);
  color: var(--text-normal);
  padding: 12px;
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 9px;
  align-items: start;
  text-align: left;
  cursor: pointer;
}
.dashflow-capture-destination-option:hover {
  border-color: color-mix(in srgb, var(--interactive-accent) 55%, var(--background-modifier-border));
  background: var(--background-modifier-hover);
}
.dashflow-capture-destination-option > span:first-child { color: var(--interactive-accent); }
.dashflow-capture-destination-option svg { width: 18px; height: 18px; }
.dashflow-capture-destination-option strong,
.dashflow-capture-destination-option small { display: block; }
.dashflow-capture-destination-option strong { font-size: 12px; }
.dashflow-capture-destination-option small { margin-top: 4px; color: var(--text-muted); font-size: 10px; line-height: 1.45; }
.dashflow-workflow-settings-modal h3 { margin-top: 20px; font-size: 12px; }
@media (max-width: 760px) {
  .dashflow-context-switcher { margin-top: -8px; overflow-x: auto; }
  .dashflow-context-tabs { flex: 1; }
  .dashflow-context-tabs > button { flex: 1; justify-content: center; padding-inline: 7px; }
  .dashflow-capture-destination-options { grid-template-columns: 1fr; }
}
`;
