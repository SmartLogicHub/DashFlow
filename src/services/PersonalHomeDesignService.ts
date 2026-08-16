const STYLE_ID = "dashflow-personal-home-v041";

export const PERSONAL_HOME_STYLES = `
/* v0.4.1 Visual Reset — Personal Home is calm, content-led, and photo-optional. */
.dashflow-view-container[data-dashflow-theme="alpine"] {
  --df-home-canvas: #f8fafc;
  --df-home-surface: #ffffff;
  --df-home-surface-2: #f1f5f9;
  --df-home-border: rgba(15, 23, 42, 0.08);
  --df-home-border-strong: rgba(15, 23, 42, 0.16);
  --df-home-text: #0f172a;
  --df-home-muted: #64748b;
  --df-home-faint: #94a3b8;
  --df-home-accent: #0284c7;
  --df-home-accent-soft: rgba(2, 132, 199, 0.08);
  --df-home-reading: #ffffff;
  --df-home-reading-2: #f8fafc;
  --df-home-scene: url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #f8fafc;
  --df-cmd-surface: #ffffff;
  --df-cmd-soft: #f1f5f9;
  --df-cmd-border: rgba(15, 23, 42, 0.08);
  --df-cmd-border-strong: rgba(15, 23, 42, 0.16);
  --df-cmd-text: #0f172a;
  --df-cmd-muted: #64748b;
  --df-cmd-faint: #94a3b8;
  --df-cmd-purple: #6366f1;
}
.dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-canvas: #faf8f5;
  --df-home-surface: #ffffff;
  --df-home-surface-2: #f4efe6;
  --df-home-border: rgba(77, 65, 48, 0.08);
  --df-home-border-strong: rgba(77, 65, 48, 0.16);
  --df-home-text: #292524;
  --df-home-muted: #78716c;
  --df-home-faint: #a8a29e;
  --df-home-accent: #78350f;
  --df-home-accent-soft: rgba(120, 53, 15, 0.08);
  --df-home-reading: #ffffff;
  --df-home-reading-2: #faf8f5;
  --df-home-scene: url("https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #faf8f5;
  --df-cmd-surface: #ffffff;
  --df-cmd-soft: #f4efe6;
  --df-cmd-border: rgba(77, 65, 48, 0.08);
  --df-cmd-border-strong: rgba(77, 65, 48, 0.16);
  --df-cmd-text: #292524;
  --df-cmd-muted: #78716c;
  --df-cmd-faint: #a8a29e;
  --df-cmd-purple: #78350f;
}
.dashflow-view-container[data-dashflow-theme="midnight"] {
  --df-home-canvas: #090d12;
  --df-home-surface: #0f1720;
  --df-home-surface-2: #15222e;
  --df-home-border: rgba(255, 255, 255, 0.08);
  --df-home-border-strong: rgba(255, 255, 255, 0.16);
  --df-home-text: #f1f5f9;
  --df-home-muted: #94a3b8;
  --df-home-faint: #64748b;
  --df-home-accent: #38bdf8;
  --df-home-accent-soft: rgba(56, 189, 248, 0.12);
  --df-home-reading: #0f1720;
  --df-home-reading-2: #15222e;
  --df-home-scene: url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #090d12;
  --df-cmd-surface: #0f1720;
  --df-cmd-soft: #15222e;
  --df-cmd-border: rgba(255, 255, 255, 0.08);
  --df-cmd-border-strong: rgba(255, 255, 255, 0.16);
  --df-cmd-text: #f1f5f9;
  --df-cmd-muted: #94a3b8;
  --df-cmd-faint: #64748b;
  --df-cmd-purple: #38bdf8;
}
.dashflow-view-container[data-dashflow-theme="obsidian"] {
  --df-home-canvas: var(--background-primary);
  --df-home-surface: var(--background-primary);
  --df-home-surface-2: var(--background-secondary);
  --df-home-border: var(--background-modifier-border);
  --df-home-border-strong: color-mix(in srgb, var(--background-modifier-border) 65%, var(--text-muted));
  --df-home-text: var(--text-normal);
  --df-home-muted: var(--text-muted);
  --df-home-faint: var(--text-faint);
  --df-home-accent: var(--interactive-accent);
  --df-home-accent-soft: color-mix(in srgb, var(--interactive-accent) 12%, transparent);
  --df-home-reading: var(--background-primary);
  --df-home-reading-2: var(--background-secondary);
  --df-home-scene: linear-gradient(135deg, color-mix(in srgb, var(--interactive-accent) 28%, var(--background-primary)), var(--background-secondary));
}

.dashflow-view-container.dashflow-personal-home-active { background: var(--df-home-canvas)!important; }
.dashflow-command-shell.is-personal-home { width: min(1160px, calc(100% - 28px))!important; margin: 0 auto!important; padding: 12px 0 80px!important; }

/* Compact atmospheric Hero. Photo is ambience, not the product itself. */
.dashflow-command-shell.is-personal-home .dashflow-hero {
  position: relative;
  isolation: isolate;
  height:194px!important;
  min-height: 194px!important;
  margin: 0 0 12px!important;
  padding: 24px 30px!important;
  display: flex!important;
  align-items: flex-end!important;
  justify-content: flex-start!important;
  overflow: hidden;
  border: 1px solid var(--df-home-border)!important;
  border-radius: 14px!important;
  color: #fff!important;
  background-color: #0f172a!important;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, 0.74) 0%, rgba(15, 23, 42, 0.40) 56%, rgba(15, 23, 42, 0.08) 100%),
    var(--df-home-image, var(--df-home-scene))!important;
  background-size: cover!important;
  background-position: center 50%!important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero::before {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.16)); pointer-events: none;
}
.dashflow-command-shell.is-personal-home .dashflow-hero > * { position: relative; z-index: 1; }
.dashflow-home-hero-content { width: min(660px, 85%); display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
.dashflow-home-hero-date { margin-bottom: 7px; color: rgba(255, 255, 255, 0.95); font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.dashflow-command-shell.is-personal-home .dashflow-hero h1 {
  margin: 0!important; color: #fff!important; font-size: clamp(28px, 4.2vw, 40px)!important; line-height: 1.1!important; font-weight: 800!important; letter-spacing: -0.035em!important; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.40)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero p { margin: 7px 0 0!important; max-width: 540px; color: rgba(255, 255, 255, 0.94)!important; font-size: 13px!important; line-height: 1.5!important; letter-spacing: 0!important; text-transform: none!important; text-shadow: 0 1px 6px rgba(0, 0, 0, 0.35)!important; }
.dashflow-home-hero-actions { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
.dashflow-home-hero-actions button { height: 32px; padding: 0 14px; border: 1px solid rgba(255, 255, 255, 0.32)!important; border-radius: 7px!important; color: #fff!important; background: rgba(15, 23, 42, 0.36)!important; box-shadow: none!important; backdrop-filter: blur(10px); font-size: 11.5px; font-weight: 650; cursor: pointer; transition: background 140ms ease, transform 140ms ease; }
.dashflow-home-hero-actions button.is-primary { color: #0f172a!important; background: #ffffff!important; border-color: #ffffff!important; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15)!important; }
.dashflow-home-hero-actions button:hover { transform: translateY(-1px); background: rgba(15, 23, 42, 0.52)!important; }
.dashflow-home-hero-actions button.is-primary:hover { background: #f8fafc!important; }
.dashflow-home-hero-actions button:active { transform: translateY(0); }

/* Home hides technical pulse & title layers while keeping identical command bar geometry. */
.dashflow-command-shell.is-personal-home .dashflow-pulse,
.dashflow-command-shell.is-personal-home .dashflow-section-title { display: none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-bar {
  min-height: 42px; margin: 0 0 12px; padding: 5px 6px; border: 1px solid var(--df-home-border); border-radius: 10px; background: color-mix(in srgb, var(--df-home-surface) 96%, transparent); box-shadow: none;
}
.dashflow-command-shell.is-personal-home .dashflow-command-button { height: 30px; padding: 0 10px; border-radius: 7px!important; font-size: 11.5px; font-weight: 600; }
.dashflow-command-shell.is-personal-home .dashflow-command-button.is-active { color: var(--df-home-text)!important; background: var(--df-home-accent-soft)!important; border-color: var(--df-home-border)!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-workspace { display: none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-actions .is-secondary-action { display: none!important; }

.dashflow-personal-home { color: var(--df-home-text); display: flex; flex-direction: column; gap: 12px; }
.dashflow-home-card { overflow: hidden; border: 1px solid var(--df-home-border)!important; border-radius: 12px; background: var(--df-home-surface)!important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02); }
.dashflow-home-card-head { min-height: 38px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid var(--df-home-border); }
.dashflow-home-card-head > strong { color: var(--df-home-text); font-size: 12.5px; font-weight: 700; }
.dashflow-home-card-head > span, .dashflow-home-card-actions > span { color: var(--df-home-muted); font-size: 10px; font-weight: 650; letter-spacing: 0.06em; }
.dashflow-home-card-actions { display: flex; align-items: center; gap: 8px; }
.dashflow-home-card-actions button { width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border: 0!important; border-radius: 6px!important; color: var(--df-home-muted)!important; background: transparent!important; box-shadow: none!important; cursor: pointer; transition: color 140ms ease, background 140ms ease; }
.dashflow-home-card-actions button:hover { color: var(--df-home-text)!important; background: var(--df-home-surface-2)!important; }
.dashflow-home-card-actions svg { width: 13.5px; height: 13.5px; }

/* Real WeRead highlight. Light-harmonious reading card. */
.dashflow-home-weread {
  overflow: hidden;
  border: 1px solid var(--df-home-border);
  border-radius: 12px;
  color: var(--df-home-text);
  background: linear-gradient(135deg, var(--df-home-reading), var(--df-home-reading-2));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.dashflow-home-weread-head { height: 36px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--df-home-border); }
.dashflow-home-weread-head strong { color: var(--df-home-text); font-size: 12.5px; font-weight: 700; }
.dashflow-home-weread-head span { color: var(--df-home-accent); font-size: 9.5px; font-weight: 700; letter-spacing: 0.08em; }
.dashflow-home-weread-body { padding: 13px 15px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 14px; align-items: center; }
.dashflow-home-weread-cover { width: 38px; height: 50px; border-radius: 5px; overflow: hidden; display: grid; place-items: center; background: color-mix(in srgb, var(--df-home-accent) 12%, var(--df-home-surface-2)); color: var(--df-home-accent); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); flex-shrink: 0; }
.dashflow-home-weread-cover img { width: 100%; height: 100%; object-fit: cover; }
.dashflow-home-weread-cover svg { width: 18px; height: 18px; }
.dashflow-home-weread-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.dashflow-home-weread-copy small { color: var(--df-home-muted); font-size: 10.5px; font-weight: 600; }
.dashflow-home-weread-copy blockquote { margin: 0; padding: 0; border: 0; color: var(--df-home-text); font-size: 13px; line-height: 1.55; font-style: normal; font-weight: 550; }
.dashflow-home-weread-copy p { margin: 0; color: var(--df-home-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dashflow-home-weread-copy strong { color: var(--df-home-text); font-size: 12.5px; }
.dashflow-home-weread-actions { display: flex; align-items: center; gap: 6px; }
.dashflow-home-weread-actions button, .dashflow-home-weread-body > button { height: 28px; padding: 0 10px; border: 1px solid var(--df-home-border); border-radius: 6px; color: var(--df-home-muted); background: var(--df-home-surface); font-size: 11px; font-weight: 600; cursor: pointer; transition: background 140ms ease, color 140ms ease, border-color 140ms ease; }
.dashflow-home-weread-actions button:hover, .dashflow-home-weread-body > button:hover { background: var(--df-home-surface-2); color: var(--df-home-text); border-color: var(--df-home-border-strong); }
.dashflow-home-weread-loading { color: var(--df-home-muted); font-size: 11.5px; margin: 0; padding: 6px 0; }

/* Today 2-column layout: Focus and Status track. */
.dashflow-home-top-grid, .dashflow-home-today-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 12px; }
.dashflow-home-focus-list { padding: 4px 12px 10px; display: flex; flex-direction: column; }
.dashflow-home-focus-row { min-height: 38px; padding: 6px 3px; display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 9px; align-items: center; border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 60%, transparent); transition: background 120ms ease; }
.dashflow-home-focus-row:last-child { border-bottom: 0; }
.dashflow-home-focus-row:hover { background: var(--df-home-surface-2); border-radius: 6px; }
.dashflow-home-focus-row input[type="checkbox"] { margin: 0; accent-color: var(--df-home-accent); cursor: pointer; }
.dashflow-home-focus-row button { min-width: 0; padding: 0; border: 0; background: transparent; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
.dashflow-home-focus-row strong { color: var(--df-home-text); font-size: 12.5px; font-weight: 650; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-home-focus-row small { color: var(--df-home-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dashflow-home-focus-row.is-urgent strong { color: #b91c1c; }
.dashflow-home-focus-row.is-high strong { color: #b45309; }

.dashflow-home-status { padding: 13px 15px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; }
.dashflow-home-status-lead { display: flex; align-items: baseline; gap: 12px; }
.dashflow-home-status-lead strong { font-size: 32px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: var(--df-home-text); font-variant-numeric: tabular-nums; }
.dashflow-home-status-lead > div { display: flex; flex-direction: column; gap: 1px; }
.dashflow-home-status-lead span { color: var(--df-home-muted); font-size: 10.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.dashflow-home-status-lead small { color: var(--df-home-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.dashflow-home-status-track { height: 5px; border-radius: 99px; background: var(--df-home-surface-2); overflow: hidden; }
.dashflow-home-status-track span { display: block; height: 100%; border-radius: inherit; background: var(--df-home-accent); transition: width 300ms ease; }
.dashflow-home-status-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding-top: 10px; border-top: 1px solid var(--df-home-border); }
.dashflow-home-metric { display: flex; flex-direction: column; gap: 2px; }
.dashflow-home-metric span { color: var(--df-home-muted); font-size: 10px; font-weight: 650; letter-spacing: 0.05em; }
.dashflow-home-metric strong { color: var(--df-home-text); font-size: 13.5px; font-weight: 750; font-variant-numeric: tabular-nums; }

/* Growth areas: 2-column navigation rows. Areas are navigation rows. */
.dashflow-home-areas { display: flex; flex-direction: column; gap: 7px; }
.dashflow-home-section-head { display: flex; align-items: baseline; justify-content: space-between; padding: 2px 2px 0; }
.dashflow-home-section-head strong { color: var(--df-home-text); font-size: 13px; font-weight: 750; }
.dashflow-home-section-head span { color: var(--df-home-muted); font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; }
.dashflow-home-area-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
.dashflow-home-area {
  min-height: 50px; padding: 10px 14px; display: grid; grid-template-columns: 20px 24px minmax(0, 1fr) auto; gap: 10px; align-items: center; border: 1px solid var(--df-home-border); border-radius: 9px; background: var(--df-home-surface); color: var(--df-home-text); cursor: pointer; text-align: left; transition: transform 140ms ease, border-color 140ms ease, background 140ms ease; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.dashflow-home-area:hover { transform: translateY(-1px); border-color: var(--df-home-border-strong); background: var(--df-home-surface-2); }
.dashflow-home-area-number { color: var(--df-home-muted); font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.dashflow-home-area-icon { width: 24px; height: 24px; border-radius: 6px; display: grid; place-items: center; background: var(--df-home-surface-2); color: var(--df-home-accent); }
.dashflow-home-area-icon svg { width: 14px; height: 14px; }
.dashflow-home-area-copy { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.dashflow-home-area-copy strong { color: var(--df-home-text); font-size: 12.5px; font-weight: 650; }
.dashflow-home-area-copy small { color: var(--df-home-muted); font-size: 10.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
.dashflow-home-area-action { color: var(--df-home-muted); font-size: 11px; font-weight: 600; white-space: nowrap; opacity: 0.85; transition: opacity 140ms ease, color 140ms ease; }
.dashflow-home-area:hover .dashflow-home-area-action { opacity: 1; color: var(--df-home-text); }

/* Bottom split: Activity strip & Recent notes. */
.dashflow-home-bottom-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 12px; }
.dashflow-home-activity-strip { padding: 13px 14px; display: grid; grid-template-columns: repeat(30, minmax(0, 1fr)); gap: 3px; align-items: center; }
.dashflow-home-activity-strip span { aspect-ratio: 1; border-radius: 2px; background: var(--df-home-surface-2); transition: transform 120ms ease; }
.dashflow-home-activity-strip span[data-level="1"] { background: color-mix(in srgb, var(--df-home-accent) 26%, var(--df-home-surface-2)); }
.dashflow-home-activity-strip span[data-level="2"] { background: color-mix(in srgb, var(--df-home-accent) 50%, var(--df-home-surface-2)); }
.dashflow-home-activity-strip span[data-level="3"] { background: color-mix(in srgb, var(--df-home-accent) 75%, var(--df-home-surface-2)); }
.dashflow-home-activity-strip span[data-level="4"] { background: var(--df-home-accent); }
.dashflow-home-activity-strip span:hover { transform: scale(1.2); }

.dashflow-home-recent-list { padding: 4px 12px 8px; display: flex; flex-direction: column; }
.dashflow-home-recent-row { min-height: 34px; padding: 5px 3px; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 9px; align-items: center; border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 60%, transparent); color: var(--df-home-muted); cursor: pointer; text-align: left; border: 0; background: transparent; width: 100%; transition: background 120ms ease; }
.dashflow-home-recent-row:last-child { border-bottom: 0; }
.dashflow-home-recent-row:hover { background: var(--df-home-surface-2); border-radius: 5px; color: var(--df-home-text); }
.dashflow-home-recent-row svg { width: 13.5px; height: 13.5px; color: var(--df-home-muted); }
.dashflow-home-recent-row strong { color: var(--df-home-text); font-size: 12px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-home-recent-row time { color: var(--df-home-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }

/* Compact Empty state. */
.dashflow-home-empty { min-height: 72px; padding: 12px 6px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.dashflow-home-empty strong { display: block; color: var(--df-home-text); font-size: 12.5px; font-weight: 650; }
.dashflow-home-empty p { margin: 2px 0 0; color: var(--df-home-muted); font-size: 11.5px; }
.dashflow-home-empty button { height: 28px; padding: 0 11px; border: 1px solid var(--df-home-border); border-radius: 6px; color: var(--df-home-text); background: var(--df-home-surface); font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 140ms ease; }
.dashflow-home-empty button:hover { background: var(--df-home-surface-2); color: var(--df-home-text); }

@media (max-width: 860px) {
  .dashflow-home-today-grid, .dashflow-home-bottom-grid { grid-template-columns: 1fr; }
  .dashflow-home-area-list { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .dashflow-command-shell.is-personal-home .dashflow-hero { padding: 18px 20px!important; }
  .dashflow-home-weread-body { grid-template-columns: 1fr; }
  .dashflow-home-weread-actions { justify-content: flex-start; }
}
`;

export class PersonalHomeDesignService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = PERSONAL_HOME_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}
