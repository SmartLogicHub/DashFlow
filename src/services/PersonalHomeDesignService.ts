const STYLE_ID = "dashflow-personal-home-v041";

export const PERSONAL_HOME_STYLES = `
/* v0.4.1 Visual Reset — Personal Home is calm, content-led, and photo-optional. */
.dashflow-view-container[data-dashflow-theme="alpine"] {
  --df-home-canvas: #eef2f1;
  --df-home-surface: #ffffff;
  --df-home-surface-2: #f2f6f5;
  --df-home-border: rgba(38, 58, 66, 0.09);
  --df-home-border-strong: rgba(38, 58, 66, 0.18);
  --df-home-text: #1e2f36;
  --df-home-muted: #64757e;
  --df-home-faint: #90a0a8;
  --df-home-accent: #2c596d;
  --df-home-accent-soft: rgba(44, 89, 109, 0.11);
  --df-home-reading: #1f4759;
  --df-home-reading-2: #2d5b6e;
  --df-home-scene: url("https://images.unsplash.com/photo-1768161224125-8b2489c9f72c?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #eef2f1;
  --df-cmd-surface: #ffffff;
  --df-cmd-soft: #f0f5f4;
  --df-cmd-border: rgba(38, 58, 66, 0.09);
  --df-cmd-border-strong: rgba(38, 58, 66, 0.18);
  --df-cmd-text: #1e2f36;
  --df-cmd-muted: #64757e;
  --df-cmd-faint: #90a0a8;
  --df-cmd-purple: #4e6a77;
}
.dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-canvas: #f4f0e8;
  --df-home-surface: #ffffff;
  --df-home-surface-2: #f7f3eb;
  --df-home-border: rgba(77, 65, 48, 0.09);
  --df-home-border-strong: rgba(77, 65, 48, 0.18);
  --df-home-text: #342f28;
  --df-home-muted: #746c61;
  --df-home-faint: #9d9488;
  --df-home-accent: #6f5844;
  --df-home-accent-soft: rgba(111, 88, 68, 0.11);
  --df-home-reading: #5a4b40;
  --df-home-reading-2: #756151;
  --df-home-scene: url("https://images.unsplash.com/photo-1774809553151-a6a237462b91?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #f4f0e8;
  --df-cmd-surface: #ffffff;
  --df-cmd-soft: #f6f1e8;
  --df-cmd-border: rgba(77, 65, 48, 0.09);
  --df-cmd-border-strong: rgba(77, 65, 48, 0.18);
  --df-cmd-text: #342f28;
  --df-cmd-muted: #746c61;
  --df-cmd-faint: #9d9488;
  --df-cmd-purple: #705b47;
}
.dashflow-view-container[data-dashflow-theme="midnight"] {
  --df-home-canvas: #10161a;
  --df-home-surface: #172025;
  --df-home-surface-2: #1c272d;
  --df-home-border: rgba(224, 236, 241, 0.08);
  --df-home-border-strong: rgba(224, 236, 241, 0.16);
  --df-home-text: #e6eef1;
  --df-home-muted: #8b9ca4;
  --df-home-faint: #63757e;
  --df-home-accent: #82b0c2;
  --df-home-accent-soft: rgba(130, 176, 194, 0.14);
  --df-home-reading: #172d34;
  --df-home-reading-2: #24424c;
  --df-home-scene: url("https://images.unsplash.com/photo-1754623291028-423b4455b53b?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg: #10161a;
  --df-cmd-surface: #172025;
  --df-cmd-soft: #1c272d;
  --df-cmd-border: rgba(224, 236, 241, 0.08);
  --df-cmd-border-strong: rgba(224, 236, 241, 0.16);
  --df-cmd-text: #e6eef1;
  --df-cmd-muted: #8b9ca4;
  --df-cmd-faint: #63757e;
  --df-cmd-purple: #82b0c2;
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
  --df-home-reading: color-mix(in srgb, var(--background-secondary) 78%, var(--interactive-accent));
  --df-home-reading-2: color-mix(in srgb, var(--background-secondary) 65%, var(--interactive-accent));
  --df-home-scene: linear-gradient(135deg, color-mix(in srgb, var(--interactive-accent) 28%, var(--background-primary)), var(--background-secondary));
}

.dashflow-view-container.dashflow-personal-home-active { background: var(--df-home-canvas)!important; }
.dashflow-command-shell.is-personal-home { width: min(1120px, calc(100% - 32px))!important; padding-top: 16px!important; }

/* Compact atmospheric Hero. Photo is ambience, not the product itself. */
.dashflow-command-shell.is-personal-home .dashflow-hero {
  position: relative;
  isolation: isolate;
  height:194px!important;
  min-height: 194px!important;
  margin: 0 0 12px!important;
  padding: 24px 28px!important;
  display: flex!important;
  align-items: flex-end!important;
  justify-content: flex-start!important;
  overflow: hidden;
  border: 0!important;
  border-radius: 16px!important;
  color: #fff!important;
  background-color: #2b3e48!important;
  background-image:
    linear-gradient(90deg, rgba(8, 18, 25, calc(var(--df-home-overlay, 0.32) + 0.38)) 0%, rgba(8, 18, 25, calc(var(--df-home-overlay, 0.32) + 0.16)) 52%, rgba(8, 18, 25, 0.08) 85%),
    var(--df-home-image, var(--df-home-scene))!important;
  background-size: cover!important;
  background-position: center 54%!important;
  box-shadow: 0 10px 30px rgba(18, 36, 45, 0.09)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero::before {
  content: ""; position: absolute; inset: 0; z-index: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.18)); pointer-events: none;
}
.dashflow-command-shell.is-personal-home .dashflow-hero > * { position: relative; z-index: 1; }
.dashflow-home-hero-content { width: min(640px, 80%); display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
.dashflow-home-hero-date { margin-bottom: 8px; color: rgba(255, 255, 255, 0.88); font-size: 11.5px; font-weight: 650; letter-spacing: 0.03em; }
.dashflow-command-shell.is-personal-home .dashflow-hero h1 {
  margin: 0!important; color: #fff!important; font-size: clamp(28px, 4.2vw, 42px)!important; line-height: 1.08!important; font-weight: 720!important; letter-spacing: -0.035em!important; text-shadow: 0 2px 14px rgba(0, 0, 0, 0.30)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero p { margin: 8px 0 0!important; max-width: 520px; color: rgba(255, 255, 255, 0.90)!important; font-size: 13px!important; line-height: 1.5!important; letter-spacing: 0!important; text-transform: none!important; text-shadow: 0 1px 6px rgba(0, 0, 0, 0.25)!important; }
.dashflow-home-hero-actions { margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap; }
.dashflow-home-hero-actions button { height: 32px; padding: 0 13px; border: 1px solid rgba(255, 255, 255, 0.28)!important; border-radius: 8px!important; color: #fff!important; background: rgba(18, 30, 36, 0.30)!important; box-shadow: none!important; backdrop-filter: blur(10px); font-size: 11.5px; font-weight: 600; cursor: pointer; transition: background 150ms ease, transform 150ms ease; }
.dashflow-home-hero-actions button.is-primary { color: #162f3a!important; background: rgba(255, 255, 255, 0.95)!important; border-color: rgba(255, 255, 255, 0.95)!important; }
.dashflow-home-hero-actions button:hover { transform: translateY(-1px); background: rgba(18, 30, 36, 0.45)!important; }
.dashflow-home-hero-actions button.is-primary:hover { background: #ffffff!important; }
.dashflow-home-hero-actions button:active { transform: translateY(0); }

/* Home hides technical identity layers; navigation becomes a quiet utility strip. */
.dashflow-command-shell.is-personal-home .dashflow-pulse,
.dashflow-command-shell.is-personal-home .dashflow-section-title { display: none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-bar {
  min-height: 40px; margin: 0 0 14px; padding: 4px 6px; border: 1px solid var(--df-home-border); border-radius: 10px; background: color-mix(in srgb, var(--df-home-surface) 96%, transparent); box-shadow: none; backdrop-filter: blur(14px);
}
.dashflow-command-shell.is-personal-home .dashflow-command-button { height: 30px; padding: 0 10px; border-radius: 7px!important; font-size: 11.5px; font-weight: 600; }
.dashflow-command-shell.is-personal-home .dashflow-command-button.is-active { color: var(--df-home-text)!important; background: var(--df-home-accent-soft)!important; border-color: transparent!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-workspace { display: none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-actions .is-secondary-action { display: none!important; }

.dashflow-personal-home { color: var(--df-home-text); display: flex; flex-direction: column; gap: 14px; }
.dashflow-home-card { overflow: hidden; border: 1px solid var(--df-home-border)!important; border-radius: 12px; background: var(--df-home-surface)!important; box-shadow: none; }
.dashflow-home-card-head { min-height: 38px; padding: 0 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border-bottom: 1px solid var(--df-home-border); }
.dashflow-home-card-head > strong { color: var(--df-home-text); font-size: 13px; font-weight: 700; }
.dashflow-home-card-head > span, .dashflow-home-card-actions > span { color: var(--df-home-muted); font-size: 10.5px; font-weight: 600; letter-spacing: 0.05em; }
.dashflow-home-card-actions { display: flex; align-items: center; gap: 8px; }
.dashflow-home-card-actions button { width: 26px; height: 26px; padding: 0; display: grid; place-items: center; border: 0!important; border-radius: 7px!important; color: var(--df-home-muted)!important; background: transparent!important; box-shadow: none!important; cursor: pointer; transition: color 150ms ease, background 150ms ease; }
.dashflow-home-card-actions button:hover { color: var(--df-home-text)!important; background: var(--df-home-surface-2)!important; }
.dashflow-home-card-actions svg { width: 14px; height: 14px; }

/* Real WeRead highlight. No connection = explicit connection state, never fake content. */
.dashflow-home-weread { overflow: hidden; border: 0; border-radius: 12px; color: #f3f7f8; background: linear-gradient(120deg, var(--df-home-reading), var(--df-home-reading-2)); box-shadow: 0 6px 20px rgba(25, 48, 58, 0.07); }
.dashflow-home-weread-head { height: 34px; padding: 0 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.12); }
.dashflow-home-weread-head strong { font-size: 11px; font-weight: 650; letter-spacing: 0.02em; }
.dashflow-home-weread-head span { color: rgba(255, 255, 255, 0.60); font-size: 10px; letter-spacing: 0.08em; }
.dashflow-home-weread-body { min-height: 88px; padding: 13px 16px; display: grid; grid-template-columns: 50px minmax(0, 1fr) auto; align-items: center; gap: 15px; }
.dashflow-home-weread-cover { width: 48px; height: 68px; display: grid; place-items: center; overflow: hidden; border-radius: 6px; color: rgba(255, 255, 255, 0.70); background: rgba(255, 255, 255, 0.10); box-shadow: 0 3px 10px rgba(0, 0, 0, 0.14); }
.dashflow-home-weread-cover img { width: 100%; height: 100%; object-fit: cover; }
.dashflow-home-weread-cover svg { width: 22px; height: 22px; }
.dashflow-home-weread-mark { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 10px; background: rgba(255, 255, 255, 0.10); color: rgba(255, 255, 255, 0.85); }
.dashflow-home-weread-mark svg { width: 18px; height: 18px; }
.dashflow-home-weread-copy { min-width: 0; }
.dashflow-home-weread-copy > small { display: block; margin-bottom: 4px; color: rgba(255, 255, 255, 0.75); font-size: 11px; font-weight: 600; }
.dashflow-home-weread-copy > strong { display: block; color: #ffffff; font-size: 12.5px; font-weight: 650; }
.dashflow-home-weread-copy blockquote { margin: 0; padding: 0; border: 0; color: #ffffff; font-family: var(--font-text); font-size: 13.5px; line-height: 1.65; font-style: normal; }
.dashflow-home-weread-copy p { margin: 5px 0 0; color: rgba(255, 255, 255, 0.65); font-size: 10.5px; }
.dashflow-home-weread-actions { display: flex; flex-direction: column; gap: 6px; }
.dashflow-home-weread-body > button, .dashflow-home-weread-actions button { height: 29px; padding: 0 11px; border: 1px solid rgba(255, 255, 255, 0.22)!important; border-radius: 7px!important; color: #ffffff!important; background: rgba(255, 255, 255, 0.10)!important; box-shadow: none!important; font-size: 11px; font-weight: 600; white-space: nowrap; cursor: pointer; transition: background 150ms ease, transform 150ms ease; }
.dashflow-home-weread-body > button:hover, .dashflow-home-weread-actions button:hover { background: rgba(255, 255, 255, 0.20)!important; transform: translateY(-1px); }
.dashflow-home-weread-loading { grid-column: 1/-1; margin: 0; color: rgba(255, 255, 255, 0.75); font-size: 12px; }

.dashflow-home-top-grid { display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(260px, 0.75fr); gap: 12px; }
.dashflow-home-focus, .dashflow-home-status { min-height: 196px; }
.dashflow-home-focus-list { padding: 4px 14px 8px; }
.dashflow-home-focus-row { min-height: 38px; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 10px; align-items: center; border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 65%, transparent); }
.dashflow-home-focus-row:last-child { border-bottom: 0; }
.dashflow-home-focus-row input { width: 15px; height: 15px; margin: 0; accent-color: var(--df-home-accent); cursor: pointer; }
.dashflow-home-focus-row > button { min-width: 0; padding: 6px 0; display: flex; flex-direction: column; gap: 2px; border: 0!important; color: var(--df-home-text)!important; background: transparent!important; box-shadow: none!important; text-align: left; cursor: pointer; }
.dashflow-home-focus-row > button strong { overflow: hidden; font-size: 12.5px; font-weight: 620; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-home-focus-row > button small { color: var(--df-home-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dashflow-home-focus-row.is-urgent > button strong { color: #b84050; }
.dashflow-home-focus-row.is-high > button strong { color: #9c7028; }
.dashflow-home-empty { min-height: 110px; padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; color: var(--df-home-muted); }
.dashflow-home-empty strong { display: block; color: var(--df-home-text); font-size: 13px; font-weight: 650; }
.dashflow-home-empty p { max-width: 480px; margin: 4px 0 0; font-size: 11px; line-height: 1.5; }
.dashflow-home-empty button { height: 30px; flex: 0 0 auto; padding: 0 12px; border: 1px solid var(--df-home-border)!important; border-radius: 7px!important; color: var(--df-home-text)!important; background: var(--df-home-surface-2)!important; box-shadow: none!important; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 150ms ease; }
.dashflow-home-empty button:hover { background: color-mix(in srgb, var(--df-home-accent) 8%, var(--df-home-surface-2))!important; }

.dashflow-home-status { padding-bottom: 12px; }
.dashflow-home-status-lead { padding: 18px 16px 10px; display: flex; align-items: flex-end; gap: 12px; }
.dashflow-home-status-lead > strong { color: var(--df-home-text); font-size: 32px; line-height: 0.95; letter-spacing: -0.04em; font-weight: 720; font-variant-numeric: tabular-nums; }
.dashflow-home-status-lead > div { display: flex; flex-direction: column; gap: 2px; }
.dashflow-home-status-lead span { color: var(--df-home-text); font-size: 12px; font-weight: 650; }
.dashflow-home-status-lead small { color: var(--df-home-muted); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.dashflow-home-status-track { height: 5px; margin: 0 16px 14px; overflow: hidden; border-radius: 99px; background: var(--df-home-surface-2); }
.dashflow-home-status-track span { display: block; height: 100%; border-radius: inherit; background: var(--df-home-accent); transition: width 240ms ease; }
.dashflow-home-status-metrics { padding: 0 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.dashflow-home-status-metrics > div { min-width: 0; padding-top: 10px; border-top: 1px solid var(--df-home-border); }
.dashflow-home-status-metrics strong { display: block; color: var(--df-home-text); font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums; }
.dashflow-home-status-metrics span { display: block; margin-top: 2px; color: var(--df-home-muted); font-size: 10.5px; }

/* Areas are navigation rows, not four empty marketing cards. */
.dashflow-home-section { display: flex; flex-direction: column; gap: 7px; }
.dashflow-home-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; padding: 0 2px; }
.dashflow-home-section-head h2 { margin: 0; color: var(--df-home-text); font-size: 14.5px; font-weight: 700; line-height: 1.2; }
.dashflow-home-section-head span { color: var(--df-home-muted); font-size: 10.5px; font-weight: 500; }
.dashflow-home-area-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); overflow: hidden; border: 1px solid var(--df-home-border); border-radius: 12px; background: var(--df-home-surface); }
.dashflow-home-area { min-height: 64px; padding: 0 16px; display: grid; grid-template-columns: 24px 28px minmax(0, 1fr) auto; align-items: center; gap: 10px; border: 0!important; border-radius: 0!important; color: var(--df-home-text)!important; background: transparent!important; box-shadow: none!important; text-align: left; cursor: pointer; transition: background 150ms ease; }
.dashflow-home-area:nth-child(odd) { border-right: 1px solid var(--df-home-border)!important; }
.dashflow-home-area:nth-child(n+3) { border-top: 1px solid var(--df-home-border)!important; }
.dashflow-home-area:hover { background: var(--df-home-surface-2)!important; }
.dashflow-home-area-number { color: var(--df-home-muted); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.dashflow-home-area-icon { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 8px; color: var(--df-home-accent); background: var(--df-home-accent-soft); }
.dashflow-home-area-icon svg { width: 14px; height: 14px; }
.dashflow-home-area-copy { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.dashflow-home-area-copy strong { color: var(--df-home-text); font-size: 12.5px; font-weight: 650; }
.dashflow-home-area-copy small { overflow: hidden; color: var(--df-home-muted); font-size: 10.5px; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-home-area-action { color: var(--df-home-accent); font-size: 11px; font-weight: 600; white-space: nowrap; }

.dashflow-home-lower-grid { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr); gap: 12px; }
.dashflow-home-activity, .dashflow-home-recent { min-height: 124px; }
.dashflow-home-activity-strip { padding: 16px 14px 15px; display: grid; grid-template-columns: repeat(30, minmax(5px, 1fr)); gap: 4px; }
.dashflow-home-activity-strip span { aspect-ratio: 1; min-width: 5px; max-width: 18px; border-radius: 3px; background: color-mix(in srgb, var(--df-home-border) 70%, transparent); transition: transform 120ms ease; }
.dashflow-home-activity-strip span:hover { transform: scale(1.18); }
.dashflow-home-activity-strip span[data-level="1"] { background: color-mix(in srgb, var(--df-home-accent) 24%, var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="2"] { background: color-mix(in srgb, var(--df-home-accent) 44%, var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="3"] { background: color-mix(in srgb, var(--df-home-accent) 68%, var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="4"] { background: var(--df-home-accent); }
.dashflow-home-recent-list { padding: 4px 14px 8px; }
.dashflow-home-recent-list > button { width: 100%; min-height: 32px; padding: 5px 2px; display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; align-items: center; gap: 9px; border: 0!important; border-bottom: 1px solid color-mix(in srgb, var(--df-home-border) 65%, transparent)!important; border-radius: 0!important; color: var(--df-home-text)!important; background: transparent!important; box-shadow: none!important; text-align: left; cursor: pointer; transition: background 150ms ease; }
.dashflow-home-recent-list > button:last-child { border-bottom: 0!important; }
.dashflow-home-recent-list > button:hover { background: var(--df-home-surface-2)!important; }
.dashflow-home-recent-list > button > span:first-child { width: 15px; height: 15px; color: var(--df-home-muted); display: grid; place-items: center; }
.dashflow-home-recent-list > button > span:first-child svg { width: 13px; height: 13px; }
.dashflow-home-recent-list > button > span:nth-child(2) { min-width: 0; display: flex; flex-direction: column; }
.dashflow-home-recent-list strong { overflow: hidden; font-size: 11.5px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.dashflow-home-recent-list small { color: var(--df-home-muted); font-size: 10px; }
.dashflow-home-recent-list time { color: var(--df-home-muted); font-size: 10px; font-variant-numeric: tabular-nums; }
.dashflow-home-recent-empty { margin: 16px 14px; color: var(--df-home-muted); font-size: 11px; }

/* Settings follow the same quiet hierarchy instead of giant grey blocks. */
.dashflow-settings-page { max-width: 900px; margin: 0 auto; padding: 24px 8px 64px; }
.dashflow-settings-hero { margin-bottom: 18px; }
.dashflow-settings-hero h2 { margin: 0 0 5px; font-size: 22px; font-weight: 700; }
.dashflow-settings-hero p { margin: 0; color: var(--text-muted); font-size: 12.5px; }
.dashflow-settings-panel { margin: 0 0 14px; padding: 6px 16px 4px; border: 1px solid var(--background-modifier-border); border-radius: 12px; background: var(--background-primary); }
.dashflow-settings-panel-head { padding: 9px 0 7px; display: flex; flex-direction: column; gap: 3px; border-bottom: 1px solid var(--background-modifier-border); }
.dashflow-settings-panel-head strong { font-size: 13px; font-weight: 700; }
.dashflow-settings-panel-head span { color: var(--text-muted); font-size: 11px; line-height: 1.45; }
.dashflow-settings-panel .setting-item { padding: 12px 0; }
.dashflow-home-theme-preview { margin: 10px 0 4px; padding: 13px 14px; display: flex; flex-direction: column; gap: 3px; border-radius: 9px; color: var(--text-normal); background: var(--background-secondary); }
.dashflow-home-theme-preview strong { font-size: 14.5px; font-weight: 650; }
.dashflow-home-theme-preview span { color: var(--text-muted); font-size: 11px; }
.dashflow-settings-advanced { margin-top: 14px; padding: 12px 14px; border: 1px solid var(--background-modifier-border); border-radius: 10px; }
.dashflow-settings-advanced summary { cursor: pointer; font-weight: 650; }
.dashflow-settings-guide-grid { margin-top: 12px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.dashflow-settings-code-card { min-width: 0; padding: 12px; border-radius: 9px; background: var(--background-secondary); }
.dashflow-settings-code-card h3 { margin: 0 0 8px; font-size: 13px; }
.dashflow-settings-code-card pre { overflow: auto; font-size: 11px; }
.dashflow-settings-code-card p { color: var(--text-muted); font-size: 10.5px; }

@media (max-width: 820px) {
  .dashflow-command-shell.is-personal-home { width: calc(100% - 20px)!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { height: 180px!important; min-height: 180px!important; padding: 20px 22px!important; }
  .dashflow-home-top-grid, .dashflow-home-lower-grid { grid-template-columns: 1fr; }
  .dashflow-home-focus, .dashflow-home-status { min-height: 0; }
  .dashflow-home-activity-strip { grid-template-columns: repeat(15, 1fr); }
}
@media (max-width: 560px) {
  .dashflow-command-shell.is-personal-home { width: calc(100% - 14px)!important; padding-top: 8px!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { height: 170px!important; min-height: 170px!important; padding: 18px!important; border-radius: 14px!important; }
  .dashflow-home-hero-content { width: 94%; }
  .dashflow-command-shell.is-personal-home .dashflow-hero h1 { font-size: 28px!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero p { font-size: 12px!important; }
  .dashflow-home-hero-actions { margin-top: 12px; }
  .dashflow-command-shell.is-personal-home .dashflow-command-label { display: none; }
  .dashflow-command-shell.is-personal-home .dashflow-command-button { width: 30px; padding: 0; justify-content: center; }
  .dashflow-home-weread-body { grid-template-columns: 44px minmax(0, 1fr); gap: 10px; }
  .dashflow-home-weread-cover { width: 40px; height: 58px; }
  .dashflow-home-weread-actions { grid-column: 1/-1; flex-direction: row; justify-content: flex-end; }
  .dashflow-home-area-list { grid-template-columns: 1fr; }
  .dashflow-home-area, .dashflow-home-area:nth-child(odd), .dashflow-home-area:nth-child(n+3) { border: 0!important; border-top: 1px solid var(--df-home-border)!important; }
  .dashflow-home-area:first-child { border-top: 0!important; }
  .dashflow-home-area-action { display: none; }
  .dashflow-home-empty { min-height: 100px; align-items: flex-start; flex-direction: column; justify-content: center; gap: 10px; }
  .dashflow-home-activity-strip { gap: 3px; }
  .dashflow-settings-guide-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell.is-personal-home * { transition: none!important; }
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
