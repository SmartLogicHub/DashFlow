export const AI_NEWS_STYLES = `
.dashflow-ai-news {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.dashflow-ai-news-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.dashflow-ai-news-kicker {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-faint);
  font-size: var(--df-type-label, 11px);
  letter-spacing: .06em;
  text-transform: uppercase;
}
.dashflow-ai-news-kicker span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dashflow-ai-news-refresh {
  appearance: none;
  border: 1px solid var(--background-modifier-border);
  background: transparent;
  color: var(--text-muted);
  width: 28px;
  height: 26px;
  padding: 0;
  border-radius: 7px;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.dashflow-ai-news-refresh:hover { color: var(--text-normal); background: var(--background-modifier-hover); }
.dashflow-ai-news-refresh svg { width: 13px; height: 13px; }
.dashflow-ai-news-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  overflow: auto;
}
.dashflow-ai-news-item {
  border: 1px solid var(--background-modifier-border);
  border-radius: 10px;
  padding: 8px 9px;
  background: color-mix(in srgb, var(--background-primary) 96%, var(--background-secondary));
  color: var(--text-normal);
  text-decoration: none!important;
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
}
.dashflow-ai-news-item:hover {
  border-color: color-mix(in srgb, var(--interactive-accent) 40%, var(--background-modifier-border));
  background: var(--background-modifier-hover);
}
.dashflow-ai-news-rank {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--interactive-accent) 10%, transparent);
  color: var(--interactive-accent);
  font-size: var(--df-type-label, 11px);
  font-weight: 750;
}
.dashflow-ai-news-main { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dashflow-ai-news-title {
  font-size: 11.5px;
  font-weight: 650;
  line-height: 1.35;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dashflow-ai-news-reason {
  color: var(--text-muted);
  font-size: var(--df-type-label, 11px);
  line-height: 1.45;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.dashflow-ai-news-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-faint);
  font-size: var(--df-type-label, 11px);
}
.dashflow-ai-news-score {
  margin-left: auto;
  color: var(--interactive-accent);
  font-variant-numeric: tabular-nums;
}
.dashflow-ai-news-warning,
.dashflow-ai-news-empty {
  color: var(--text-faint);
  font-size: var(--df-type-label, 11px);
  line-height: 1.5;
}
.dashflow-ai-news-warning { margin-top: auto; }
.dashflow-ai-news-empty {
  min-height: 100px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 12px;
  border: 1px dashed var(--background-modifier-border);
  border-radius: 10px;
}
@container dashflow-widget (max-width: 360px) {
  .dashflow-ai-news-reason { -webkit-line-clamp: 1; }
  .dashflow-ai-news-score { display: none; }
}
`;
