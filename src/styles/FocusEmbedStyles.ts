export const FOCUS_EMBED_STYLES = `
.dashflow-focus {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 2px;
}

.dashflow-focus-modes {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
}
.dashflow-focus-modes button {
  appearance: none;
  min-height: 28px;
  padding: 4px 7px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--text-muted);
  font-size: var(--df-font-xs, 11px);
  cursor: pointer;
}
.dashflow-focus-modes button.is-active {
  border-color: color-mix(in srgb, var(--interactive-accent) 55%, var(--background-modifier-border));
  background: color-mix(in srgb, var(--interactive-accent) 11%, var(--background-secondary));
  color: var(--text-normal);
}
.dashflow-focus-modes button:disabled { cursor: default; opacity: .58; }

.dashflow-focus-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 0 2px;
}
.dashflow-focus-time {
  font-size: clamp(34px, 5cqi, 52px);
  line-height: 1;
  letter-spacing: -.045em;
  font-variant-numeric: tabular-nums;
  font-weight: 720;
}
.dashflow-focus-status {
  color: var(--text-muted);
  font-size: var(--df-font-xs, 11px);
  letter-spacing: .06em;
}

.dashflow-focus-progress {
  height: 4px;
  overflow: hidden;
  border-radius: 99px;
  background: var(--background-modifier-border);
}
.dashflow-focus-progress > span {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: var(--interactive-accent);
  transition: width .3s linear;
}
.dashflow-focus.is-short-break .dashflow-focus-progress > span,
.dashflow-focus.is-long-break .dashflow-focus-progress > span {
  background: var(--color-green, var(--interactive-accent));
}

.dashflow-focus-actions {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) repeat(2, minmax(0, .7fr));
  gap: 6px;
}
.dashflow-focus-action {
  appearance: none;
  min-height: 32px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  background: var(--background-secondary);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 5px 8px;
  font-size: var(--df-font-xs, 11px);
  cursor: pointer;
}
.dashflow-focus-action svg { width: 13px; height: 13px; }
.dashflow-focus-action:hover:not(:disabled) { color: var(--text-normal); background: var(--background-modifier-hover); }
.dashflow-focus-action.is-primary {
  border-color: var(--interactive-accent);
  background: var(--interactive-accent);
  color: var(--text-on-accent);
}
.dashflow-focus-action:disabled { opacity: .45; cursor: default; }

.dashflow-focus-meta {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--text-faint);
  font-size: var(--df-font-xs, 11px);
}

.dashflow-magic-embed {
  height: 100%;
  min-height: 190px;
  display: flex;
  flex-direction: column;
}
.dashflow-magic-embed-message,
.dashflow-magic-embed-gate {
  min-height: 190px;
  flex: 1;
  border: 1px dashed var(--background-modifier-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-muted);
  font-size: var(--df-font-sm, 12.5px);
  line-height: 1.55;
  padding: 18px;
}
.dashflow-magic-embed-empty {
  flex-direction: column;
  gap: 8px;
}
.dashflow-magic-embed-empty strong {
  color: var(--text-normal);
  font-size: var(--df-type-title, 14px);
}
.dashflow-magic-embed-empty p {
  max-width: 46ch;
  margin: 0;
}
.dashflow-magic-embed-gate {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  gap: 10px;
  text-align: left;
  justify-content: stretch;
}
.dashflow-magic-embed-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--interactive-accent) 9%, var(--background-secondary));
  color: var(--interactive-accent);
}
.dashflow-magic-embed-icon svg { width: 17px; height: 17px; }
.dashflow-magic-embed-copy { min-width: 0; }
.dashflow-magic-embed-copy strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-normal);
  font-size: var(--df-font-sm, 12.5px);
}
.dashflow-magic-embed-copy p { margin: 4px 0 0; font-size: var(--df-font-xs, 11px); }
.dashflow-magic-embed-load,
.dashflow-magic-embed-configure,
.dashflow-magic-embed-toolbar button {
  appearance: none;
  min-height: 30px;
  border: 1px solid var(--interactive-accent);
  border-radius: 8px;
  background: var(--interactive-accent);
  color: var(--text-on-accent);
  padding: 5px 9px;
  cursor: pointer;
  font-size: var(--df-font-xs, 11px);
}
.dashflow-magic-embed-external {
  grid-column: 2 / -1;
  color: var(--text-accent);
  font-size: var(--df-font-xs, 11px);
  text-decoration: none;
}
.dashflow-magic-embed-external:hover { text-decoration: underline; }
.dashflow-magic-embed-external.is-toolbar {
  grid-column: auto;
  margin-left: auto;
  white-space: nowrap;
}

.dashflow-magic-embed-frame-wrap {
  flex: 1;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  background: var(--background-primary);
}
.dashflow-magic-embed-toolbar {
  min-height: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 7px 4px 9px;
  border-bottom: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
}
.dashflow-magic-embed-toolbar span {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-faint);
  font-size: var(--df-type-label, 11px);
}
.dashflow-magic-embed-toolbar button {
  min-height: 24px;
  border-color: var(--background-modifier-border);
  background: transparent;
  color: var(--text-muted);
  padding: 2px 7px;
}
.dashflow-magic-embed-frame {
  flex: 1;
  width: 100%;
  min-height: 0;
  border: 0;
  background: white;
}

@container (max-width: 440px) {
  .dashflow-focus-meta { flex-direction: column; align-items: flex-start; }
  .dashflow-magic-embed-gate { grid-template-columns: 34px minmax(0, 1fr); }
  .dashflow-magic-embed-load { grid-column: 1 / -1; }
  .dashflow-magic-embed-external { grid-column: 1 / -1; }
}
`;
