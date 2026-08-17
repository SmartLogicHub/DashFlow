export const LEARNING_STYLES = `
.dashflow-learning-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--df-cmd-text, var(--text-normal));
}

.dashflow-learning-head,
.dashflow-learning-section,
.dashflow-learning-metric,
.dashflow-learning-goal {
  border: 1px solid var(--df-cmd-border, var(--background-modifier-border));
  background: var(--df-cmd-surface, var(--background-primary));
  border-radius: var(--df-radius-lg, 14px);
}

.dashflow-learning-head {
  min-height: 116px;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}
.dashflow-learning-head-copy { min-width: 0; }
.dashflow-learning-eyebrow {
  display: block;
  margin-bottom: 5px;
  color: var(--interactive-accent);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: .1em;
}
.dashflow-learning-head h2 { margin: 0; font-size: 22px; letter-spacing: -.025em; }
.dashflow-learning-head p { margin: 7px 0 0; max-width: 720px; color: var(--text-muted); font-size: 12px; line-height: 1.55; }
.dashflow-learning-actions,
.dashflow-learning-goal-actions {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.dashflow-learning-button,
.dashflow-learning-icon-button {
  appearance: none;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
  color: var(--text-normal);
  border-radius: 8px;
  cursor: pointer;
}
.dashflow-learning-button {
  min-height: 32px;
  padding: 5px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 650;
}
.dashflow-learning-button.is-primary {
  border-color: var(--interactive-accent);
  color: var(--text-on-accent);
  background: var(--interactive-accent);
}
.dashflow-learning-button:hover,
.dashflow-learning-icon-button:hover { filter: brightness(1.04); }
.dashflow-learning-button svg,
.dashflow-learning-icon-button svg { width: 14px; height: 14px; }
.dashflow-learning-icon-button {
  width: 30px;
  height: 30px;
  padding: 0;
  display: grid;
  place-items: center;
}

.dashflow-learning-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.dashflow-learning-metric { padding: 12px 14px; min-width: 0; }
.dashflow-learning-metric small { display: block; color: var(--text-muted); font-size: 10px; font-weight: 650; }
.dashflow-learning-metric strong { display: block; margin-top: 5px; font-size: 24px; line-height: 1; font-variant-numeric: tabular-nums; }
.dashflow-learning-metric span { display: block; margin-top: 7px; color: var(--text-faint); font-size: 9.5px; line-height: 1.4; }

.dashflow-learning-section { overflow: hidden; }
.dashflow-learning-section > header {
  min-height: 48px;
  padding: 9px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid var(--df-cmd-border, var(--background-modifier-border));
}
.dashflow-learning-section > header h3 { margin: 0; font-size: 12.5px; }
.dashflow-learning-section > header p { margin: 0; max-width: 62%; color: var(--text-faint); font-size: 9.5px; text-align: right; }

.dashflow-learning-goals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 9px;
  padding: 10px;
}
.dashflow-learning-goal { padding: 13px 14px; border-radius: 11px; }
.dashflow-learning-goal-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.dashflow-learning-goal-top small { display: block; color: var(--text-muted); font-size: 9.5px; }
.dashflow-learning-goal-top strong { display: block; margin-top: 3px; font-size: 14px; }
.dashflow-learning-goal-outcome { margin: 10px 0; color: var(--text-muted); font-size: 11px; line-height: 1.55; }
.dashflow-learning-next {
  padding: 9px 10px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--interactive-accent) 8%, var(--background-secondary));
}
.dashflow-learning-next span { display: block; color: var(--interactive-accent); font-size: 8.5px; font-weight: 800; letter-spacing: .1em; }
.dashflow-learning-next strong { display: block; margin-top: 3px; font-size: 11px; line-height: 1.45; }
.dashflow-learning-goal-stats {
  margin: 9px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  color: var(--text-faint);
  font-size: 9.5px;
}

.dashflow-learning-lower {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr);
  gap: 12px;
}
.dashflow-learning-session-list,
.dashflow-learning-mistakes,
.dashflow-learning-evidence {
  display: flex;
  flex-direction: column;
  padding: 6px 10px 10px;
}
.dashflow-learning-session-row,
.dashflow-learning-evidence-row {
  appearance: none;
  width: 100%;
  min-height: 46px;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 70%, transparent);
  background: transparent;
  color: var(--text-normal);
  cursor: pointer;
  text-align: left;
}
.dashflow-learning-session-row {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  padding: 6px 3px;
}
.dashflow-learning-session-row:hover,
.dashflow-learning-evidence-row:hover { background: var(--background-modifier-hover); }
.dashflow-learning-kind {
  width: fit-content;
  padding: 3px 6px;
  border-radius: 99px;
  color: var(--text-muted);
  background: var(--background-secondary);
  font-size: 9px;
  font-weight: 700;
}
.dashflow-learning-kind.is-baseline,
.dashflow-learning-kind.is-assessment { color: var(--interactive-accent); background: color-mix(in srgb, var(--interactive-accent) 10%, transparent); }
.dashflow-learning-session-copy { min-width: 0; }
.dashflow-learning-session-copy strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; }
.dashflow-learning-session-copy small { display: block; margin-top: 2px; color: var(--text-faint); font-size: 9.5px; }
.dashflow-learning-session-result { min-width: 48px; display: grid; justify-items: end; }
.dashflow-learning-session-result strong { font-size: 13px; }
.dashflow-learning-session-result small,
.dashflow-learning-session-result em { color: var(--text-faint); font-size: 8.5px; font-style: normal; }
.dashflow-learning-session-result em { color: var(--text-error); }

.dashflow-learning-mistake {
  min-height: 43px;
  padding: 7px 3px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 70%, transparent);
}
.dashflow-learning-mistake strong { font-size: 10.5px; line-height: 1.4; }
.dashflow-learning-mistake span { color: var(--text-muted); font-size: 9px; }
.dashflow-learning-mistake small { grid-column: 1 / -1; color: var(--text-faint); font-size: 8.5px; }
.dashflow-learning-mistake.is-repeated strong { color: var(--text-error); }

.dashflow-learning-evidence-row {
  padding: 7px 4px;
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
}
.dashflow-learning-evidence-row svg { width: 13px; height: 13px; color: var(--interactive-accent); }
.dashflow-learning-evidence-row strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10.5px; }
.dashflow-learning-evidence-row small { color: var(--text-faint); font-size: 9px; }

.dashflow-learning-empty {
  min-height: 72px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-muted);
}
.dashflow-learning-empty p { margin: 0; font-size: 10.5px; line-height: 1.5; }

.dashflow-learning-goal-editor textarea,
.dashflow-learning-session-editor textarea { min-height: 76px; }

@media (max-width: 900px) {
  .dashflow-learning-head { align-items: flex-start; flex-direction: column; }
  .dashflow-learning-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dashflow-learning-lower { grid-template-columns: 1fr; }
  .dashflow-learning-section > header { align-items: flex-start; flex-direction: column; }
  .dashflow-learning-section > header p { max-width: 100%; text-align: left; }
}

@media (max-width: 560px) {
  .dashflow-learning-metrics { grid-template-columns: 1fr; }
  .dashflow-learning-goals { grid-template-columns: 1fr; }
  .dashflow-learning-session-row { grid-template-columns: 48px minmax(0, 1fr); }
  .dashflow-learning-session-result { grid-column: 2; grid-row: 2; display: flex; gap: 6px; justify-self: start; }
}
`;
