const STYLE_ID = "dashflow-personal-home-v040";

export const PERSONAL_HOME_STYLES = `
/* v0.4.0 Personal OS theme layer. The existing Command Dashboard remains the Work surface. */
.dashflow-view-container[data-dashflow-theme="alpine"] {
  --df-home-canvas: #edf2f4;
  --df-home-surface: rgba(250,252,252,.88);
  --df-home-surface-strong: #fbfcfc;
  --df-home-border: rgba(48,73,89,.14);
  --df-home-text: #23343f;
  --df-home-muted: #73828b;
  --df-home-accent: #315d73;
  --df-home-accent-soft: #cfe0e7;
  --df-home-shadow: 0 18px 55px rgba(35,57,70,.08);
  --df-cmd-bg: #edf2f4;
  --df-cmd-surface: #f9fbfb;
  --df-cmd-soft: #e6edef;
  --df-cmd-border: rgba(48,73,89,.13);
  --df-cmd-border-strong: rgba(48,73,89,.24);
  --df-cmd-text: #23343f;
  --df-cmd-muted: #71808a;
  --df-cmd-faint: #9aa7ae;
  --df-cmd-purple: #456d82;
}

.dashflow-view-container[data-dashflow-theme="paper"] {
  --df-home-canvas: #f3efe7;
  --df-home-surface: rgba(255,252,245,.90);
  --df-home-surface-strong: #fffdf8;
  --df-home-border: rgba(77,66,50,.14);
  --df-home-text: #37322b;
  --df-home-muted: #847a6e;
  --df-home-accent: #6a5a45;
  --df-home-accent-soft: #e8dfcf;
  --df-home-shadow: 0 18px 55px rgba(66,54,39,.08);
  --df-cmd-bg: #f3efe7;
  --df-cmd-surface: #fffdf8;
  --df-cmd-soft: #ebe4d8;
  --df-cmd-border: rgba(77,66,50,.13);
  --df-cmd-border-strong: rgba(77,66,50,.24);
  --df-cmd-text: #37322b;
  --df-cmd-muted: #82786c;
  --df-cmd-faint: #a89e92;
  --df-cmd-purple: #756149;
}

.dashflow-view-container[data-dashflow-theme="midnight"] {
  --df-home-canvas: #111722;
  --df-home-surface: rgba(24,33,46,.90);
  --df-home-surface-strong: #1a2330;
  --df-home-border: rgba(189,209,223,.12);
  --df-home-text: #e8eef3;
  --df-home-muted: #9aa9b6;
  --df-home-accent: #8eb9ce;
  --df-home-accent-soft: #263d4a;
  --df-home-shadow: 0 18px 58px rgba(0,0,0,.24);
  --df-cmd-bg: #111722;
  --df-cmd-surface: #192230;
  --df-cmd-soft: #202b39;
  --df-cmd-border: rgba(210,224,236,.10);
  --df-cmd-border-strong: rgba(210,224,236,.20);
  --df-cmd-text: #e8eef3;
  --df-cmd-muted: #9aa9b6;
  --df-cmd-faint: #71808d;
  --df-cmd-purple: #83b4cb;
}

.dashflow-view-container[data-dashflow-theme="obsidian"] {
  --df-home-canvas: var(--background-primary);
  --df-home-surface: color-mix(in srgb, var(--background-primary) 94%, transparent);
  --df-home-surface-strong: var(--background-primary);
  --df-home-border: var(--background-modifier-border);
  --df-home-text: var(--text-normal);
  --df-home-muted: var(--text-muted);
  --df-home-accent: var(--interactive-accent);
  --df-home-accent-soft: color-mix(in srgb, var(--interactive-accent) 14%, transparent);
  --df-home-shadow: 0 18px 55px rgba(0,0,0,.07);
}

.dashflow-view-container.dashflow-personal-home-active {
  background: var(--df-home-canvas) !important;
}

.dashflow-command-shell.is-personal-home {
  width: min(1080px, calc(100% - 36px)) !important;
  padding-top: 22px !important;
}

/* Hero: one emotional surface, the rest of Home stays quiet. */
.dashflow-command-shell.is-personal-home .dashflow-hero {
  min-height: 238px !important;
  height: 238px !important;
  margin-bottom: 12px !important;
  padding: 30px 34px !important;
  display: flex !important;
  align-items: flex-end !important;
  justify-content: flex-start !important;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.28) !important;
  border-radius: 24px !important;
  color: #fff !important;
  background-image:
    linear-gradient(rgb(7 20 30 / var(--df-home-overlay, .46)), rgb(11 28 41 / calc(var(--df-home-overlay, .46) + .10))),
    var(--df-home-image, linear-gradient(135deg, #5a7282 0%, #8ca0a9 44%, #2d4555 100%)) !important;
  background-size: cover !important;
  background-position: center !important;
  box-shadow: 0 22px 56px rgba(25,47,61,.16) !important;
}
.dashflow-view-container[data-dashflow-theme="paper"] .dashflow-command-shell.is-personal-home .dashflow-hero {
  background-image:
    linear-gradient(rgb(39 31 21 / var(--df-home-overlay, .42)), rgb(53 43 30 / calc(var(--df-home-overlay, .42) + .08))),
    var(--df-home-image, linear-gradient(135deg,#8f836f,#c2b39b 48%,#665b4c)) !important;
}
.dashflow-view-container[data-dashflow-theme="midnight"] .dashflow-command-shell.is-personal-home .dashflow-hero {
  background-image:
    linear-gradient(rgb(4 9 17 / var(--df-home-overlay, .52)), rgb(5 13 23 / calc(var(--df-home-overlay, .52) + .08))),
    var(--df-home-image, linear-gradient(135deg,#0f2133,#243f55 52%,#0b151f)) !important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero::before {
  content:"";
  position:absolute;
  inset:0;
  z-index:0;
  background:linear-gradient(90deg,rgba(0,0,0,.18),transparent 58%);
  pointer-events:none;
}
.dashflow-command-shell.is-personal-home .dashflow-hero > * { position:relative; z-index:1; }
.dashflow-home-hero-content { width:min(650px,84%); display:flex; flex-direction:column; align-items:flex-start; text-align:left; }
.dashflow-home-hero-date { margin-bottom:12px; color:rgba(255,255,255,.78); font-family:var(--font-monospace); font-size:10px; font-weight:650; letter-spacing:.08em; }
.dashflow-command-shell.is-personal-home .dashflow-hero h1 {
  margin:0 !important;
  color:#fff !important;
  font-size:clamp(34px,5.2vw,54px) !important;
  line-height:1.02 !important;
  font-weight:690 !important;
  letter-spacing:-.04em !important;
  text-shadow:0 4px 22px rgba(0,0,0,.22) !important;
}
.dashflow-command-shell.is-personal-home .dashflow-hero p {
  margin:12px 0 0 !important;
  max-width:520px;
  color:rgba(255,255,255,.80) !important;
  font-family:var(--font-interface) !important;
  font-size:13px !important;
  line-height:1.55 !important;
  letter-spacing:0 !important;
  text-transform:none !important;
}
.dashflow-home-hero-actions { margin-top:22px; display:flex; gap:9px; flex-wrap:wrap; }
.dashflow-home-hero-actions button { height:36px; padding:0 14px; border:1px solid rgba(255,255,255,.28) !important; border-radius:10px !important; color:#fff !important; background:rgba(15,27,36,.28) !important; box-shadow:none !important; backdrop-filter:blur(12px); font-size:11px; font-weight:650; }
.dashflow-home-hero-actions button.is-primary { color:#17303f !important; background:rgba(255,255,255,.90) !important; }
.dashflow-home-hero-actions button:hover { transform:translateY(-1px); background:rgba(15,27,36,.42) !important; }
.dashflow-home-hero-actions button.is-primary:hover { background:#fff !important; }

/* Home removes technical/administrative header layers. */
.dashflow-command-shell.is-personal-home .dashflow-pulse,
.dashflow-command-shell.is-personal-home .dashflow-section-title { display:none !important; }
.dashflow-command-shell.is-personal-home .dashflow-command-bar {
  min-height:44px;
  margin:0 0 16px;
  padding:5px 7px;
  border:1px solid var(--df-home-border);
  border-radius:14px;
  background:var(--df-home-surface);
  box-shadow:0 7px 24px rgba(35,57,70,.05);
  backdrop-filter:blur(18px);
}
.dashflow-command-shell.is-personal-home .dashflow-command-button { height:32px; padding:0 10px; border-radius:9px !important; font-size:10px; }
.dashflow-command-shell.is-personal-home .dashflow-command-button.is-active { color:var(--df-home-text) !important; background:var(--df-home-accent-soft) !important; border-color:transparent !important; }
.dashflow-command-shell.is-personal-home .dashflow-command-workspace { display:none !important; }
.dashflow-command-shell.is-personal-home .dashflow-command-actions .is-secondary-action { display:none !important; }

.dashflow-personal-home { color:var(--df-home-text); display:flex; flex-direction:column; gap:20px; }
.dashflow-home-top-grid { display:grid; grid-template-columns:minmax(0,1.42fr) minmax(270px,.58fr); gap:14px; }
.dashflow-home-card,
.dashflow-home-area {
  border:1px solid var(--df-home-border) !important;
  background:var(--df-home-surface) !important;
  box-shadow:var(--df-home-shadow);
  backdrop-filter:blur(18px);
}
.dashflow-home-card { border-radius:18px; overflow:hidden; }
.dashflow-home-card-head { min-height:44px; padding:0 17px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-bottom:1px solid var(--df-home-border); }
.dashflow-home-card-head strong { color:var(--df-home-text); font-size:12px; font-weight:730; }
.dashflow-home-card-head span { color:var(--df-home-muted); font-family:var(--font-monospace); font-size:8px; letter-spacing:.08em; }

.dashflow-home-focus { min-height:260px; }
.dashflow-home-focus-list { padding:9px 16px 14px; }
.dashflow-home-focus-row { min-height:42px; display:grid; grid-template-columns:16px minmax(0,1fr); gap:10px; align-items:center; border-bottom:1px solid color-mix(in srgb,var(--df-home-border) 72%,transparent); }
.dashflow-home-focus-row:last-child { border-bottom:0; }
.dashflow-home-focus-row input { width:15px; height:15px; margin:0; accent-color:var(--df-home-accent); }
.dashflow-home-focus-row button { min-width:0; padding:7px 0; display:flex; flex-direction:column; gap:3px; border:0 !important; color:var(--df-home-text) !important; background:transparent !important; box-shadow:none !important; text-align:left; cursor:pointer; }
.dashflow-home-focus-row button strong { overflow:hidden; font-size:11px; font-weight:610; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-home-focus-row button small { color:var(--df-home-muted); font-size:8px; }
.dashflow-home-focus-row.is-urgent button strong { color:#a84f5c; }
.dashflow-home-focus-row.is-high button strong { color:#9d742f; }
.dashflow-home-empty { min-height:190px; display:grid; place-items:center; align-content:center; text-align:center; color:var(--df-home-muted); }
.dashflow-home-empty > span { width:26px; height:26px; margin-bottom:10px; color:var(--df-home-accent); }
.dashflow-home-empty strong { color:var(--df-home-text); font-size:12px; }
.dashflow-home-empty p { margin:6px 0 0; font-size:9px; }

.dashflow-home-status { min-height:260px; }
.dashflow-home-status-ring-wrap { padding:20px 16px 13px; display:grid; justify-items:center; gap:9px; }
.dashflow-home-status-ring { width:98px; height:98px; position:relative; display:grid; place-content:center; justify-items:center; border-radius:50%; background:conic-gradient(var(--df-home-accent) var(--df-home-progress), color-mix(in srgb,var(--df-home-border) 70%,transparent) 0); }
.dashflow-home-status-ring::before { content:""; position:absolute; inset:7px; border-radius:50%; background:var(--df-home-surface-strong); }
.dashflow-home-status-ring strong,.dashflow-home-status-ring span { position:relative; z-index:1; }
.dashflow-home-status-ring strong { font-size:21px; line-height:1; }
.dashflow-home-status-ring span { margin-top:4px; color:var(--df-home-muted); font-family:var(--font-monospace); font-size:7px; letter-spacing:.08em; }
.dashflow-home-status-ring-wrap p { margin:0; color:var(--df-home-muted); font-size:9px; }
.dashflow-home-status-metrics { padding:0 14px 15px; display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
.dashflow-home-status-metrics > div { padding:9px 7px; border-radius:10px; background:color-mix(in srgb,var(--df-home-accent-soft) 42%,transparent); text-align:center; }
.dashflow-home-status-metrics strong { display:block; color:var(--df-home-text); font-size:12px; }
.dashflow-home-status-metrics span { display:block; margin-top:3px; color:var(--df-home-muted); font-size:7.5px; }

.dashflow-home-section { display:flex; flex-direction:column; gap:10px; }
.dashflow-home-section-head { display:flex; align-items:flex-end; justify-content:space-between; gap:14px; padding:0 2px; }
.dashflow-home-section-head h2 { margin:0; color:var(--df-home-text); font-size:16px; line-height:1.2; }
.dashflow-home-section-head span { color:var(--df-home-muted); font-size:9px; }
.dashflow-home-area-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.dashflow-home-area { min-height:174px; position:relative; padding:20px; display:flex; flex-direction:column; align-items:flex-start; border-radius:18px !important; color:var(--df-home-text) !important; text-align:left; cursor:pointer; transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease; }
.dashflow-home-area:hover { transform:translateY(-2px); border-color:color-mix(in srgb,var(--df-home-accent) 34%,var(--df-home-border)) !important; box-shadow:0 22px 60px rgba(35,57,70,.11); }
.dashflow-home-area-number { position:absolute; right:18px; top:15px; color:color-mix(in srgb,var(--df-home-muted) 42%,transparent); font-size:24px; font-weight:300; }
.dashflow-home-area-icon { width:28px; height:28px; display:grid; place-items:center; margin-bottom:16px; border-radius:9px; color:var(--df-home-accent); background:var(--df-home-accent-soft); }
.dashflow-home-area-icon svg { width:15px; height:15px; }
.dashflow-home-area strong { font-size:14px; font-weight:680; }
.dashflow-home-area p { max-width:360px; margin:8px 0 0; color:var(--df-home-muted); font-size:9.5px; line-height:1.55; }
.dashflow-home-area-action { margin-top:auto; padding-top:16px; color:var(--df-home-accent); font-size:9px; font-weight:650; }

.dashflow-home-lower-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr); gap:14px; }
.dashflow-home-activity,.dashflow-home-recent { min-height:175px; }
.dashflow-home-activity { padding-bottom:14px; }
.dashflow-home-activity-strip { padding:22px 16px 14px; display:grid; grid-template-columns:repeat(30,1fr); gap:4px; }
.dashflow-home-activity-strip span { aspect-ratio:1; min-width:0; border-radius:3px; background:color-mix(in srgb,var(--df-home-border) 62%,transparent); }
.dashflow-home-activity-strip span[data-level="1"] { background:color-mix(in srgb,var(--df-home-accent) 24%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="2"] { background:color-mix(in srgb,var(--df-home-accent) 42%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="3"] { background:color-mix(in srgb,var(--df-home-accent) 66%,var(--df-home-surface)); }
.dashflow-home-activity-strip span[data-level="4"] { background:var(--df-home-accent); }
.dashflow-home-activity > p { margin:0; padding:0 16px; color:var(--df-home-muted); font-size:8px; }
.dashflow-home-recent-list { padding:5px 13px 10px; }
.dashflow-home-recent-list button { width:100%; min-height:31px; padding:5px 3px; display:grid; grid-template-columns:15px minmax(0,1fr) auto; gap:8px; align-items:center; border:0 !important; border-bottom:1px solid color-mix(in srgb,var(--df-home-border) 70%,transparent) !important; color:var(--df-home-text) !important; background:transparent !important; box-shadow:none !important; text-align:left; }
.dashflow-home-recent-list button:last-child { border-bottom:0 !important; }
.dashflow-home-recent-list button > span:first-child { width:14px; height:14px; color:var(--df-home-muted); }
.dashflow-home-recent-list button > span:nth-child(2) { min-width:0; display:flex; flex-direction:column; }
.dashflow-home-recent-list strong { overflow:hidden; font-size:9px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
.dashflow-home-recent-list small,.dashflow-home-recent-list time { color:var(--df-home-muted); font-size:7px; }
.dashflow-home-recent-empty { padding:18px; color:var(--df-home-muted); font-size:9px; }

/* Quick Add is a lightweight capture palette, not a permanent dashboard card. */
.dashflow-quick-add-modal { width:min(620px,calc(100vw - 44px)); padding:8px 4px 4px; }
.dashflow-quick-add-eyebrow { margin-bottom:7px; color:var(--text-muted); font-family:var(--font-monospace); font-size:9px; letter-spacing:.16em; }
.dashflow-quick-add-modal h2 { margin:0; font-size:24px; }
.dashflow-quick-add-lead { margin:7px 0 15px; color:var(--text-muted); font-size:11px; line-height:1.6; }
.dashflow-quick-add-composer { min-height:52px; padding:0 13px; display:grid; grid-template-columns:18px minmax(0,1fr) auto; gap:10px; align-items:center; border:1px solid var(--background-modifier-border); border-radius:14px; background:var(--background-secondary); }
.dashflow-quick-add-icon { width:17px; height:17px; color:var(--interactive-accent); }
.dashflow-quick-add-composer input { width:100%; border:0 !important; background:transparent !important; box-shadow:none !important; font-size:13px; }
.dashflow-quick-add-hint { color:var(--text-faint); font-family:var(--font-monospace); font-size:8px; }
.dashflow-quick-add-actions { margin-top:12px; display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.dashflow-quick-add-action { min-height:72px; padding:11px; display:grid; grid-template-columns:26px minmax(0,1fr); gap:9px; align-items:center; border:1px solid var(--background-modifier-border) !important; border-radius:12px !important; color:var(--text-normal) !important; background:var(--background-primary) !important; box-shadow:none !important; text-align:left; }
.dashflow-quick-add-action:hover { background:var(--background-secondary) !important; }
.dashflow-quick-add-action-icon { width:25px; height:25px; display:grid; place-items:center; border-radius:8px; color:var(--interactive-accent); background:color-mix(in srgb,var(--interactive-accent) 12%,transparent); }
.dashflow-quick-add-action-icon svg { width:14px; height:14px; }
.dashflow-quick-add-action > span:last-child { display:flex; flex-direction:column; gap:4px; }
.dashflow-quick-add-action strong { font-size:10px; }
.dashflow-quick-add-action small { color:var(--text-muted); font-size:8px; line-height:1.4; }

/* Appearance settings get a visual preview instead of being plain form rows. */
.dashflow-home-theme-preview { min-height:112px; margin:4px 0 14px; padding:18px; display:flex; flex-direction:column; justify-content:flex-end; border-radius:16px; color:white; background:linear-gradient(135deg,#526d7f,#93a4ab 54%,#314957); box-shadow:0 12px 34px rgba(35,57,70,.12); }
.dashflow-home-theme-preview strong { font-size:20px; }
.dashflow-home-theme-preview span { margin-top:5px; color:rgba(255,255,255,.75); font-size:9px; }

@media (max-width: 860px) {
  .dashflow-command-shell.is-personal-home { width:calc(100% - 20px) !important; }
  .dashflow-home-top-grid,.dashflow-home-lower-grid { grid-template-columns:1fr; }
  .dashflow-home-area-grid { grid-template-columns:1fr 1fr; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { min-height:210px !important; height:210px !important; padding:25px !important; }
  .dashflow-home-activity-strip { gap:3px; }
}

@media (max-width: 620px) {
  .dashflow-command-shell.is-personal-home { width:calc(100% - 14px) !important; padding-top:8px !important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero { min-height:188px !important; height:188px !important; border-radius:17px !important; padding:20px !important; }
  .dashflow-home-hero-content { width:100%; }
  .dashflow-command-shell.is-personal-home .dashflow-hero h1 { font-size:31px !important; }
  .dashflow-command-shell.is-personal-home .dashflow-hero p { font-size:11px !important; }
  .dashflow-home-hero-actions { margin-top:16px; }
  .dashflow-home-hero-actions button { height:34px; }
  .dashflow-command-shell.is-personal-home .dashflow-command-nav .dashflow-command-label { display:none; }
  .dashflow-command-shell.is-personal-home .dashflow-command-nav .dashflow-command-button { width:31px; padding:0; justify-content:center; }
  .dashflow-home-area-grid { grid-template-columns:1fr; }
  .dashflow-home-area { min-height:148px; }
  .dashflow-home-activity-strip { grid-template-columns:repeat(15,1fr); }
  .dashflow-quick-add-actions { grid-template-columns:1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-home-area,.dashflow-home-hero-actions button { transition:none !important; transform:none !important; }
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
