const STYLE_ID = "dashflow-personal-home-v041";

export const PERSONAL_HOME_STYLES = `
/* v0.4.1 Visual Reset — Personal Home is calm, content-led, and photo-optional. */
.dashflow-view-container[data-dashflow-theme="alpine"] {
  --df-home-canvas:#eef2f1;
  --df-home-surface:#f9fbfa;
  --df-home-surface-2:#f1f5f4;
  --df-home-border:rgba(38,58,66,.11);
  --df-home-text:#203039;
  --df-home-muted:#74828a;
  --df-home-accent:#315f72;
  --df-home-accent-soft:#dbe8ec;
  --df-home-reading:#244f63;
  --df-home-reading-2:#315f73;
  --df-home-scene:url("https://images.unsplash.com/photo-1768161224125-8b2489c9f72c?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg:#eef2f1;
  --df-cmd-surface:#f9fbfa;
  --df-cmd-soft:#edf2f1;
  --df-cmd-border:rgba(38,58,66,.11);
  --df-cmd-border-strong:rgba(38,58,66,.19);
  --df-cmd-text:#203039;
  --df-cmd-muted:#718087;
  --df-cmd-faint:#9aa5aa;
  --df-cmd-purple:#526d79;
}
.dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-canvas:#f4f1ea;
  --df-home-surface:#fffdf8;
  --df-home-surface-2:#f7f2e9;
  --df-home-border:rgba(77,65,48,.11);
  --df-home-text:#38332d;
  --df-home-muted:#827a70;
  --df-home-accent:#765f4b;
  --df-home-accent-soft:#ede4d8;
  --df-home-reading:#6a5b50;
  --df-home-reading-2:#8a7260;
  --df-home-scene:url("https://images.unsplash.com/photo-1774809553151-a6a237462b91?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg:#f4f1ea;
  --df-cmd-surface:#fffdf8;
  --df-cmd-soft:#f3ede3;
  --df-cmd-border:rgba(77,65,48,.11);
  --df-cmd-border-strong:rgba(77,65,48,.20);
  --df-cmd-text:#38332d;
  --df-cmd-muted:#81786d;
  --df-cmd-faint:#a49b91;
  --df-cmd-purple:#76624e;
}
.dashflow-view-container[data-dashflow-theme="midnight"] {
  --df-home-canvas:#11171b;
  --df-home-surface:#182126;
  --df-home-surface-2:#1d292f;
  --df-home-border:rgba(224,236,241,.09);
  --df-home-text:#e7eef1;
  --df-home-muted:#96a6ad;
  --df-home-accent:#88b4c5;
  --df-home-accent-soft:#213a44;
  --df-home-reading:#1a3038;
  --df-home-reading-2:#29464f;
  --df-home-scene:url("https://images.unsplash.com/photo-1754623291028-423b4455b53b?auto=format&fit=crop&w=2400&q=82");
  --df-cmd-bg:#11171b;
  --df-cmd-surface:#182126;
  --df-cmd-soft:#1d292f;
  --df-cmd-border:rgba(224,236,241,.09);
  --df-cmd-border-strong:rgba(224,236,241,.17);
  --df-cmd-text:#e7eef1;
  --df-cmd-muted:#96a6ad;
  --df-cmd-faint:#6e8088;
  --df-cmd-purple:#88b4c5;
}
.dashflow-view-container[data-dashflow-theme="obsidian"] {
  --df-home-canvas:var(--background-primary);
  --df-home-surface:var(--background-primary);
  --df-home-surface-2:var(--background-secondary);
  --df-home-border:var(--background-modifier-border);
  --df-home-text:var(--text-normal);
  --df-home-muted:var(--text-muted);
  --df-home-accent:var(--interactive-accent);
  --df-home-accent-soft:color-mix(in srgb,var(--interactive-accent) 12%,transparent);
  --df-home-reading:color-mix(in srgb,var(--background-secondary) 78%,var(--interactive-accent));
  --df-home-reading-2:color-mix(in srgb,var(--background-secondary) 65%,var(--interactive-accent));
  --df-home-scene:linear-gradient(135deg,color-mix(in srgb,var(--interactive-accent) 28%,var(--background-primary)),var(--background-secondary));
}

.dashflow-view-container.dashflow-personal-home-active { background:var(--df-home-canvas)!important; }
.dashflow-command-shell.is-personal-home { width:min(1120px,calc(100% - 32px))!important; padding-top:16px!important; }

/* Compact atmospheric Hero. Photo is ambience, not the product itself. */
.dashflow-command-shell.is-personal-home .dashflow-hero {
  position:relative;
  isolation:isolate;
  height:194px!important;
  min-height:194px!important;
  margin:0 0 10px!important;
  padding:24px 28px!important;
  display:flex!important;
  align-items:flex-end!important;
  justify-content:flex-start!important;
  overflow:hidden;
  border:0!important;
  border-radius:20px!important;
  color:#fff!important;
  background-color:#39505c!important;
  background-image:
    linear-gradient(90deg,rgb(8 18 25 / calc(var(--df-home-overlay,.32) + .24)) 0%,rgb(8 18 25 / var(--df-home-overlay,.32)) 42%,rgb(8 18 25 / .08) 78%),
    var(--df-home-image,var(--df-home-scene))!important;
  background-size:cover!important;
  background-position:center 54%!important;
  box-shadow:0 14px 34px rgba(25,45,54,.11)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero::before {
  content:""; position:absolute; inset:0; z-index:0;
  background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(0,0,0,.12)); pointer-events:none;
}
.dashflow-command-shell.is-personal-home .dashflow-hero>* { position:relative; z-index:1; }
.dashflow-home-hero-content { width:min(620px,78%); display:flex; flex-direction:column; align-items:flex-start; text-align:left; }
.dashflow-home-hero-date { margin-bottom:9px; color:rgba(255,255,255,.78); font-size:11px; font-weight:650; letter-spacing:.03em; }
.dashflow-command-shell.is-personal-home .dashflow-hero h1 {
  margin:0!important; color:#fff!important; font-size:clamp(31px,4.4vw,46px)!important; line-height:1.05!important; font-weight:720!important; letter-spacing:-.035em!important; text-shadow:0 2px 18px rgba(0,0,0,.22)!important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero p { margin:9px 0 0!important; max-width:500px; color:rgba(255,255,255,.82)!important; font-size:12.5px!important; line-height:1.5!important; letter-spacing:0!important; text-transform:none!important; }
.dashflow-home-hero-actions { margin-top:16px; display:flex; gap:8px; flex-wrap:wrap; }
.dashflow-home-hero-actions button { height:32px; padding:0 12px; border:1px solid rgba(255,255,255,.24)!important; border-radius:8px!important; color:#fff!important; background:rgba(20,31,37,.24)!important; box-shadow:none!important; backdrop-filter:blur(10px); font-size:11px; font-weight:650; }
.dashflow-home-hero-actions button.is-primary { color:#17303a!important; background:rgba(255,255,255,.93)!important; }
.dashflow-home-hero-actions button:hover { transform:translateY(-1px); background:rgba(20,31,37,.38)!important; }
.dashflow-home-hero-actions button.is-primary:hover { background:#fff!important; }

/* Home hides technical identity layers; navigation becomes a quiet utility strip. */
.dashflow-command-shell.is-personal-home .dashflow-pulse,
.dashflow-command-shell.is-personal-home .dashflow-section-title { display:none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-bar {
  min-height:40px; margin:0 0 14px; padding:4px 6px; border:1px solid var(--df-home-border); border-radius:11px; background:color-mix(in srgb,var(--df-home-surface) 96%,transparent); box-shadow:none; backdrop-filter:blur(14px);
}
.dashflow-command-shell.is-personal-home .dashflow-command-button { height:30px; padding:0 9px; border-radius:7px!important; font-size:11px; }
.dashflow-command-shell.is-personal-home .dashflow-command-button.is-active { color:var(--df-home-text)!important; background:var(--df-home-accent-soft)!important; border-color:transparent!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-workspace { display:none!important; }
.dashflow-command-shell.is-personal-home .dashflow-command-actions .is-secondary-action { display:none!important; }

.dashflow-personal-home { color:var(--df-home-text); display:flex; flex-direction:column; gap:14px; }
.dashflow-home-card { overflow:hidden; border:1px solid var(--df-home-border)!important; border-radius:14px; background:var(--df-home-surface)!important; box-shadow:none; }
.dashflow-home-card-head { min-height:40px; padding:0 14px; display:flex; align-items:center; justify-content:space-between; gap:10px; border-bottom:1px solid var(--df-home-border); }
.dashflow-home-card-head>strong { color:var(--df-home-text); font-size:13px; font-weight:720; }
.dashflow-home-card-head>span,.dashflow-home-card-actions>span { color:var(--df-home-muted); font-size:9px; letter-spacing:.06em; }
.dashflow-home-card-actions { display:flex; align-items:center; gap:8px; }
.dashflow-home-card-actions button { width:26px; height:26px; padding:0; display:grid; place-items:center; border:0!important; border-radius:7px!important; color:var(--df-home-muted)!important; background:transparent!important; box-shadow:none!important; }
.dashflow-home-card-actions button:hover { color:var(--df-home-text)!important; background:var(--df-home-surface-2)!important; }
.dashflow-home-card-actions svg { width:14px; height:14px; }

/* Real WeRead highlight. No connection = explicit connection state, never fake content. */
.dashflow-home-weread { overflow:hidden; border:0; border-radius:14px; color:#f3f7f8; background:linear-gradient(120deg,var(--df-home-reading),var(--df-home-reading-2)); box-shadow:0 8px 22px rgba(30,55,65,.08); }
.dashflow-home-weread-head { height:34px; padding:0 15px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,.11); }
.dashflow-home-weread-head strong { font-size:10px; font-weight:650; letter-spacing:.03em; }
.dashflow-home-weread-head span { color:rgba(255,255,255,.48); font-size:8px; letter-spacing:.1em; }
.dashflow-home-weread-body { min-height:92px; padding:12px 15px; display:grid; grid-template-columns:54px minmax(0,1fr) auto; align-items:center; gap:14px; }
.dashflow-home-weread-cover { width:48px; height:68px; display:grid; place-items:center; overflow:hidden; border-radius:5px; color:rgba(255,255,255,.65); background:rgba(255,255,255,.08); }
.dashflow-home-weread-cover img { width:100%; height:100%; object-fit:cover; }
.dashflow-home-weread-cover svg { width:22px; height:22px; }
.dashflow-home-weread-mark { width:38px; height:38px; display:grid; place-items:center; border-radius:10px; background:rgba(255,255,255,.10); }
.dashflow-home-weread-mark svg { width:18px; height:18px; }
.dashflow-home-weread-copy { min-width:0; }
.dashflow-home-weread-copy>small { display:block; margin-bottom:5px; color:rgba(255,255,255,.60); font-size:9px; }
.dashflow-home-weread-copy>strong { display:block; color:#fff; font-size:12px; font-weight:650; }
.dashflow-home-weread-copy blockquote { margin:0; padding:0; border:0; color:#fff; font-family:var(--font-text); font-size:13.5px; line-height:1.65; font-style:normal; }
.dashflow-home-weread-copy p { margin:5px 0 0; color:rgba(255,255,255,.55); font-size:9px; }
.dashflow-home-weread-actions { display:flex; flex-direction:column; gap:6px; }
.dashflow-home-weread-body>button,.dashflow-home-weread-actions button { height:29px; padding:0 10px; border:1px solid rgba(255,255,255,.18)!important; border-radius:7px!important; color:#fff!important; background:rgba(255,255,255,.08)!important; box-shadow:none!important; font-size:9px; white-space:nowrap; }
.dashflow-home-weread-body>button:hover,.dashflow-home-weread-actions button:hover { background:rgba(255,255,255,.15)!important; }
.dashflow-home-weread-loading { grid-column:1/-1; margin:0; color:rgba(255,255,255,.66); font-size:11px; }

.dashflow-home-top-grid { display:grid; grid-template-columns:minmax(0,1.6fr) minmax(250px,.72fr); gap:12px; }
.dashflow-home-focus,.dashflow-home-status { min-height:204px; }
.dashflow-home-focus-list { padding:5px 14px 9px; }
.dashflow-home-focus-row { min-height:38px; display:grid; grid-template-columns:16px minmax(0,1fr); gap:9px; align-items:center; border-bottom:1px solid color-mix(in srgb,var(--df-home-border) 72%,transparent); }
.dashflow-home-focus-row:last-child { border-bottom:0; }
.dashflow-home-focus-row input { width:15px; height:15px; margin:0; accent-color:var(--df-home-accent); }
.dashflow-home-focus-row>button { min-width:0; padding:6px 0; display:flex; flex-direction:column; gap:2px; border:0!important; color:var(--df-home-text)!important; background:transparent!important; box-shadow:none!important; text-align:left; }
.dashflow-home-focus-row>button strong { overflow:hidden; font-size:12px; font-weight:610; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-home-focus-row>button small { color:var(--df-home-muted); font-size:9px; }
.dashflow-home-focus-row.is-urgent>button strong { color:#b4505f; }
.dashflow-home-focus-row.is-high>button strong { color:#9b7431; }
.dashflow-home-empty { min-height:150px; padding:18px; display:flex; align-items:center; justify-content:space-between; gap:18px; color:var(--df-home-muted); }
.dashflow-home-empty strong { display:block; color:var(--df-home-text); font-size:13px; }
.dashflow-home-empty p { max-width:480px; margin:5px 0 0; font-size:10px; line-height:1.5; }
.dashflow-home-empty button { height:31px; flex:0 0 auto; padding:0 11px; border:1px solid var(--df-home-border)!important; border-radius:7px!important; color:var(--df-home-text)!important; background:var(--df-home-surface-2)!important; box-shadow:none!important; font-size:10px; }

.dashflow-home-status { padding-bottom:12px; }
.dashflow-home-status-lead { padding:22px 16px 10px; display:flex; align-items:flex-end; gap:12px; }
.dashflow-home-status-lead>strong { color:var(--df-home-text); font-size:34px; line-height:.9; letter-spacing:-.04em; }
.dashflow-home-status-lead>div { display:flex; flex-direction:column; gap:3px; }
.dashflow-home-status-lead span { color:var(--df-home-text); font-size:11px; font-weight:650; }
.dashflow-home-status-lead small { color:var(--df-home-muted); font-size:9px; }
.dashflow-home-status-track { height:4px; margin:0 16px 16px; overflow:hidden; border-radius:99px; background:var(--df-home-surface-2); }
.dashflow-home-status-track span { display:block; height:100%; border-radius:inherit; background:var(--df-home-accent); }
.dashflow-home-status-metrics { padding:0 16px; display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.dashflow-home-status-metrics>div { min-width:0; padding-top:10px; border-top:1px solid var(--df-home-border); }
.dashflow-home-status-metrics strong { display:block; color:var(--df-home-text); font-size:13px; }
.dashflow-home-status-metrics span { display:block; margin-top:2px; color:var(--df-home-muted); font-size:8.5px; }

/* Areas are navigation rows, not four empty marketing cards. */
.dashflow-home-section { display:flex; flex-direction:column; gap:7px; }
.dashflow-home-section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:14px; padding:0 2px; }
.dashflow-home-section-head h2 { margin:0; color:var(--df-home-text); font-size:15px; line-height:1.2; }
.dashflow-home-section-head span { color:var(--df-home-muted); font-size:9px; }
.dashflow-home-area-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); overflow:hidden; border:1px solid var(--df-home-border); border-radius:14px; background:var(--df-home-surface); }
.dashflow-home-area { min-height:68px; padding:0 14px; display:grid; grid-template-columns:26px 28px minmax(0,1fr) auto; align-items:center; gap:9px; border:0!important; border-radius:0!important; color:var(--df-home-text)!important; background:transparent!important; box-shadow:none!important; text-align:left; }
.dashflow-home-area:nth-child(odd) { border-right:1px solid var(--df-home-border)!important; }
.dashflow-home-area:nth-child(n+3) { border-top:1px solid var(--df-home-border)!important; }
.dashflow-home-area:hover { background:var(--df-home-surface-2)!important; }
.dashflow-home-area-number { color:var(--df-home-muted); font-size:10px; font-variant-numeric:tabular-nums; }
.dashflow-home-area-icon { width:26px; height:26px; display:grid; place-items:center; border-radius:8px; color:var(--df-home-accent); background:var(--df-home-accent-soft); }
.dashflow-home-area-icon svg { width:14px; height:14px; }
.dashflow-home-area-copy { min-width:0; display:flex; flex-direction:column; gap:3px; }
.dashflow-home-area-copy strong { color:var(--df-home-text); font-size:11.5px; }
.dashflow-home-area-copy small { overflow:hidden; color:var(--df-home-muted); font-size:8.5px; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-home-area-action { color:var(--df-home-muted); font-size:9px; white-space:nowrap; }

.dashflow-home-lower-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr); gap:12px; }
.dashflow-home-activity,.dashflow-home-recent { min-height:126px; }
.dashflow-home-activity-strip { padding:18px 14px 17px; display:grid; grid-template-columns:repeat(30,minmax(5px,1fr)); gap:4px; }
.dashflow-home-activity-strip span { aspect-ratio:1; min-width:5px; max-width:18px; border-radius:3px; background:color-mix(in srgb,var(--df-home-border) 75%,transparent); }
.dashflow-home-activity-strip span[data-level="1"] { background:color-mix(in srgb,var(--df-home-accent) 24%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="2"] { background:color-mix(in srgb,var(--df-home-accent) 42%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="3"] { background:color-mix(in srgb,var(--df-home-accent) 64%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="4"] { background:var(--df-home-accent); }
.dashflow-home-recent-list { padding:4px 13px 8px; }
.dashflow-home-recent-list>button { width:100%; min-height:31px; padding:4px 1px; display:grid; grid-template-columns:15px minmax(0,1fr) auto; align-items:center; gap:8px; border:0!important; border-bottom:1px solid var(--df-home-border)!important; border-radius:0!important; color:var(--df-home-text)!important; background:transparent!important; box-shadow:none!important; text-align:left; }
.dashflow-home-recent-list>button:last-child { border-bottom:0!important; }
.dashflow-home-recent-list>button>span:first-child { width:14px; height:14px; color:var(--df-home-muted); }
.dashflow-home-recent-list>button>span:nth-child(2) { min-width:0; display:flex; flex-direction:column; }
.dashflow-home-recent-list strong { overflow:hidden; font-size:10px; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-home-recent-list small,.dashflow-home-recent-list time { color:var(--df-home-muted); font-size:8px; }
.dashflow-home-recent-empty { margin:18px 14px; color:var(--df-home-muted); font-size:10px; }

/* Settings follow the same quiet hierarchy instead of giant grey blocks. */
.dashflow-settings-page { max-width:900px; margin:0 auto; padding:24px 8px 64px; }
.dashflow-settings-hero { margin-bottom:18px; }
.dashflow-settings-hero h2 { margin:0 0 5px; font-size:24px; }
.dashflow-settings-hero p { margin:0; color:var(--text-muted); font-size:12px; }
.dashflow-settings-panel { margin:0 0 14px; padding:6px 16px 4px; border:1px solid var(--background-modifier-border); border-radius:12px; background:var(--background-primary); }
.dashflow-settings-panel-head { padding:9px 0 7px; display:flex; flex-direction:column; gap:3px; border-bottom:1px solid var(--background-modifier-border); }
.dashflow-settings-panel-head strong { font-size:13px; }
.dashflow-settings-panel-head span { color:var(--text-muted); font-size:10px; line-height:1.45; }
.dashflow-settings-panel .setting-item { padding:12px 0; }
.dashflow-home-theme-preview { margin:10px 0 4px; padding:13px 14px; display:flex; flex-direction:column; gap:3px; border-radius:9px; color:var(--text-normal); background:var(--background-secondary); }
.dashflow-home-theme-preview strong { font-size:15px; }
.dashflow-home-theme-preview span { color:var(--text-muted); font-size:10px; }
.dashflow-settings-advanced { margin-top:14px; padding:12px 14px; border:1px solid var(--background-modifier-border); border-radius:10px; }
.dashflow-settings-advanced summary { cursor:pointer; font-weight:650; }
.dashflow-settings-guide-grid { margin-top:12px; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.dashflow-settings-code-card { min-width:0; padding:12px; border-radius:9px; background:var(--background-secondary); }
.dashflow-settings-code-card h3 { margin:0 0 8px; }
.dashflow-settings-code-card pre { overflow:auto; font-size:10px; }
.dashflow-settings-code-card p { color:var(--text-muted); font-size:9px; }

@media (max-width:820px) {
  .dashflow-command-shell.is-personal-home { width:calc(100% - 20px)!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { height:176px!important; min-height:176px!important; padding:21px 22px!important; }
  .dashflow-home-top-grid,.dashflow-home-lower-grid { grid-template-columns:1fr; }
  .dashflow-home-focus,.dashflow-home-status { min-height:0; }
  .dashflow-home-activity-strip { grid-template-columns:repeat(15,1fr); }
}
@media (max-width:560px) {
  .dashflow-command-shell.is-personal-home { width:calc(100% - 14px)!important; padding-top:8px!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { height:164px!important; min-height:164px!important; padding:18px!important; border-radius:14px!important; }
  .dashflow-home-hero-content { width:92%; }
  .dashflow-command-shell.is-personal-home .dashflow-hero h1 { font-size:30px!important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero p { font-size:11px!important; }
  .dashflow-home-hero-actions { margin-top:12px; }
  .dashflow-command-shell.is-personal-home .dashflow-command-label { display:none; }
  .dashflow-command-shell.is-personal-home .dashflow-command-button { width:30px; padding:0; justify-content:center; }
  .dashflow-home-weread-body { grid-template-columns:44px minmax(0,1fr); gap:10px; }
  .dashflow-home-weread-cover { width:40px; height:58px; }
  .dashflow-home-weread-actions { grid-column:1/-1; flex-direction:row; justify-content:flex-end; }
  .dashflow-home-area-list { grid-template-columns:1fr; }
  .dashflow-home-area,.dashflow-home-area:nth-child(odd),.dashflow-home-area:nth-child(n+3) { border:0!important; border-top:1px solid var(--df-home-border)!important; }
  .dashflow-home-area:first-child { border-top:0!important; }
  .dashflow-home-area-action { display:none; }
  .dashflow-home-empty { min-height:112px; align-items:flex-start; flex-direction:column; justify-content:center; gap:10px; }
  .dashflow-home-activity-strip { gap:3px; }
  .dashflow-settings-guide-grid { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion:reduce) {
  .dashflow-command-shell.is-personal-home * { transition:none!important; }
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
