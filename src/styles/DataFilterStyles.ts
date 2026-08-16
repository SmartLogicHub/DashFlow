export const DATA_FILTER_STYLES = `
.dashflow-data-filter {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-height: 100%;
}

.dashflow-data-filter-segmented {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.dashflow-data-filter-label {
  color: var(--text-faint);
  font-size: var(--df-font-xs, 11px);
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.dashflow-data-filter-segmented > div {
  display: flex;
  gap: 4px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.dashflow-data-filter-segmented > div::-webkit-scrollbar { display: none; }

.dashflow-data-filter-segmented button,
.dashflow-data-filter-reset {
  appearance: none;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
  color: var(--text-muted);
  min-height: 28px;
  border-radius: 7px;
  padding: 4px 9px;
  font-size: var(--df-font-xs, 11px);
  cursor: pointer;
}

.dashflow-data-filter-segmented button:hover,
.dashflow-data-filter-reset:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}

.dashflow-data-filter-segmented button.is-active {
  color: var(--text-on-accent);
  border-color: var(--interactive-accent);
  background: var(--interactive-accent);
}

.dashflow-data-filter-toolbar {
  display: grid;
  grid-template-columns: minmax(110px, 1fr) minmax(100px, .8fr) 30px;
  gap: 6px;
}

.dashflow-data-filter-toolbar select,
.dashflow-data-filter-search input {
  width: 100%;
  min-width: 0;
  min-height: 30px;
  border-radius: 7px;
  font-size: var(--df-font-xs, 11px);
}

.dashflow-data-filter-reset {
  width: 30px;
  padding: 0;
  display: grid;
  place-items: center;
}
.dashflow-data-filter-reset svg { width: 14px; height: 14px; }

.dashflow-data-filter-search {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(110px, .6fr);
  gap: 6px;
}

.dashflow-data-filter-summary {
  color: var(--text-faint);
  font-size: var(--df-font-xs, 11px);
  padding: 1px 2px;
}

.dashflow-data-filter-results {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: auto;
}

.dashflow-data-filter-result {
  appearance: none;
  width: 100%;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 6px 7px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-normal);
  text-align: left;
  cursor: pointer;
}

.dashflow-data-filter-result:hover {
  border-color: var(--background-modifier-border);
  background: var(--background-modifier-hover);
}

.dashflow-data-filter-result-icon {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: var(--text-muted);
  background: var(--background-secondary);
}
.dashflow-data-filter-result-icon svg { width: 13px; height: 13px; }

.dashflow-data-filter-result.is-project .dashflow-data-filter-result-icon { color: var(--interactive-accent); }
.dashflow-data-filter-result.is-habit .dashflow-data-filter-result-icon { color: var(--color-green, var(--interactive-accent)); }

.dashflow-data-filter-result-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.dashflow-data-filter-result-copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--df-font-sm, 12.5px);
  font-weight: 650;
}
.dashflow-data-filter-result-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
  font-size: var(--df-font-xs, 11px);
}

.dashflow-data-filter-result-kind {
  color: var(--text-faint);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .06em;
}

.dashflow-data-filter-empty,
.dashflow-data-filter-more {
  color: var(--text-muted);
  font-size: var(--df-font-xs, 11px);
  line-height: 1.55;
  padding: 12px 8px;
}
.dashflow-data-filter-more {
  padding-top: 7px;
  color: var(--text-faint);
}

@container (max-width: 470px) {
  .dashflow-data-filter-segmented { grid-template-columns: 1fr; gap: 4px; }
  .dashflow-data-filter-toolbar { grid-template-columns: 1fr 1fr 30px; }
  .dashflow-data-filter-search { grid-template-columns: 1fr; }
  .dashflow-data-filter-result-kind { display: none; }
  .dashflow-data-filter-result { grid-template-columns: 24px minmax(0, 1fr); }
}

@media (max-width: 760px) {
  .dashflow-data-filter-toolbar { grid-template-columns: 1fr 1fr 30px; }
  .dashflow-data-filter-search { grid-template-columns: 1fr; }
}
`;
