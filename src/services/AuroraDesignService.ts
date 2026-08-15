const STYLE_ID = "dashflow-aurora-ui";

export const AURORA_STYLES = `
.dashflow-view-container {
  --df-aurora-violet: #7c5cff;
  --df-aurora-cyan: #2ac8ff;
  --df-aurora-green: #35d69f;
  --df-aurora-gold: #ffb45e;
  --df-aurora-rose: #ff6f91;
  --df-aurora-accent: color-mix(in srgb, var(--df-accent) 58%, var(--df-aurora-violet));
  --df-a-canvas: #f4f6fb;
  --df-a-panel: rgba(255,255,255,.78);
  --df-a-panel-strong: rgba(255,255,255,.94);
  --df-a-panel-soft: rgba(246,248,253,.78);
  --df-a-line: rgba(55,65,95,.12);
  --df-a-line-strong: rgba(69,79,114,.21);
  --df-a-text: #171a2b;
  --df-a-secondary: #5f687f;
  --df-a-faint: #8991a6;
  --df-a-shadow: 0 18px 56px rgba(47,57,95,.10);
  --df-a-shadow-hover: 0 26px 72px rgba(44,53,91,.16);
  color: var(--df-a-text);
  background:
    radial-gradient(900px 520px at 7% -10%, color-mix(in srgb, var(--df-aurora-violet) 20%, transparent), transparent 66%),
    radial-gradient(760px 440px at 88% -5%, color-mix(in srgb, var(--df-aurora-cyan) 15%, transparent), transparent 65%),
    radial-gradient(780px 520px at 52% 22%, color-mix(in srgb, var(--df-aurora-green) 5%, transparent), transparent 72%),
    linear-gradient(180deg, #f7f8fc 0%, var(--df-a-canvas) 44%, #f2f4f9 100%) !important;
}

.theme-dark .dashflow-view-container {
  --df-a-canvas: #090d18;
  --df-a-panel: rgba(16,22,39,.74);
  --df-a-panel-strong: rgba(19,25,44,.92);
  --df-a-panel-soft: rgba(22,29,50,.72);
  --df-a-line: rgba(201,211,255,.10);
  --df-a-line-strong: rgba(204,214,255,.20);
  --df-a-text: #f4f6ff;
  --df-a-secondary: #aab2c8;
  --df-a-faint: #777f96;
  --df-a-shadow: 0 22px 64px rgba(0,0,0,.32);
  --df-a-shadow-hover: 0 30px 82px rgba(0,0,0,.46);
  background:
    radial-gradient(980px 580px at 5% -12%, color-mix(in srgb, var(--df-aurora-violet) 27%, transparent), transparent 64%),
    radial-gradient(820px 500px at 94% -8%, color-mix(in srgb, var(--df-aurora-cyan) 19%, transparent), transparent 65%),
    radial-gradient(760px 520px at 52% 27%, color-mix(in srgb, var(--df-aurora-green) 7%, transparent), transparent 72%),
    linear-gradient(180deg, #0b1020 0%, var(--df-a-canvas) 46%, #080c15 100%) !important;
}

.dashflow-shell {
  width: min(1520px, calc(100% - 40px)) !important;
  padding: 24px 0 92px !important;
}

.dashflow-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  align-items: center !important;
  min-height: 138px;
  padding: 24px 26px !important;
  margin-bottom: 14px;
  border: 1px solid var(--df-a-line);
  border-radius: 24px;
  background:
    linear-gradient(115deg, color-mix(in srgb, var(--df-aurora-violet) 11%, var(--df-a-panel-strong)), color-mix(in srgb, var(--df-aurora-cyan) 5%, var(--df-a-panel)) 55%, var(--df-a-panel));
  box-shadow: var(--df-a-shadow), inset 0 1px 0 rgba(255,255,255,.38);
  backdrop-filter: blur(26px) saturate(1.22);
}

.theme-dark .dashflow-hero {
  box-shadow: var(--df-a-shadow), inset 0 1px 0 rgba(255,255,255,.07);
}

.dashflow-hero::before {
  content: "";
  position: absolute;
  z-index: -1;
  width: 520px;
  height: 520px;
  right: -190px;
  top: -300px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--df-aurora-cyan) 27%, transparent), color-mix(in srgb, var(--df-aurora-violet) 12%, transparent) 42%, transparent 69%);
  filter: blur(6px);
  pointer-events: none;
}

.dashflow-hero::after {
  content: "";
  position: absolute;
  z-index: -1;
  width: 360px;
  height: 180px;
  left: 16%;
  bottom: -128px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--df-aurora-violet) 15%, transparent);
  filter: blur(46px);
  pointer-events: none;
}

.dashflow-hero-copy { min-width: 0; }

.dashflow-eyebrow {
  color: var(--df-a-secondary) !important;
  letter-spacing: .16em !important;
  font-size: 9px !important;
}

.dashflow-eyebrow::before {
  width: 28px !important;
  height: 3px !important;
  background: linear-gradient(90deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important;
  box-shadow: 0 0 18px color-mix(in srgb, var(--df-aurora-cyan) 42%, transparent) !important;
}

.dashflow-hero h1 {
  margin: 9px 0 7px !important;
  color: var(--df-a-text) !important;
  font-size: clamp(34px, 4vw, 48px) !important;
  line-height: .96 !important;
  font-weight: 760 !important;
  letter-spacing: -.055em !important;
  text-shadow: none !important;
}

.dashflow-hero p {
  max-width: 650px !important;
  margin: 0 !important;
  color: var(--df-a-secondary) !important;
  font-size: 12px !important;
}

.dashflow-hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 15px;
}

.dashflow-hero-meta span {
  padding: 5px 9px;
  border: 1px solid var(--df-a-line);
  border-radius: 999px;
  color: var(--df-a-secondary);
  background: color-mix(in srgb, var(--df-a-panel-strong) 70%, transparent);
  font-size: 9px;
  letter-spacing: .02em;
  backdrop-filter: blur(12px);
}

.dashflow-hero-meta span:first-child {
  color: color-mix(in srgb, var(--df-aurora-accent) 80%, var(--df-a-text));
  border-color: color-mix(in srgb, var(--df-aurora-accent) 25%, var(--df-a-line));
  background: color-mix(in srgb, var(--df-aurora-accent) 8%, var(--df-a-panel));
}

.dashflow-hero-actions {
  display: flex;
  align-items: center;
  align-self: flex-start;
  padding-top: 2px;
}

.dashflow-edit-button {
  border: 1px solid color-mix(in srgb, var(--df-aurora-accent) 20%, var(--df-a-line)) !important;
  border-radius: 11px !important;
  color: var(--df-a-text) !important;
  background: color-mix(in srgb, var(--df-a-panel-strong) 78%, transparent) !important;
  box-shadow: 0 8px 24px rgba(30,36,64,.08) !important;
  backdrop-filter: blur(16px);
}

.dashflow-edit-button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--df-aurora-accent) 45%, var(--df-a-line)) !important;
  background: color-mix(in srgb, var(--df-aurora-accent) 8%, var(--df-a-panel-strong)) !important;
}

.dashflow-edit-button.is-active {
  color: white !important;
  border-color: transparent !important;
  background: linear-gradient(135deg, var(--df-aurora-violet), color-mix(in srgb, var(--df-aurora-cyan) 72%, var(--df-aurora-violet))) !important;
  box-shadow: 0 10px 30px color-mix(in srgb, var(--df-aurora-violet) 28%, transparent) !important;
}

.dashflow-shell .dashflow-dashboard-switcher {
  gap: 7px !important;
  margin: 0 0 12px 4px !important;
}

.dashflow-shell .dashflow-dashboard-switcher select,
.dashflow-shell .dashflow-dashboard-switcher button {
  min-height: 34px;
  border: 1px solid var(--df-a-line) !important;
  border-radius: 10px !important;
  color: var(--df-a-text) !important;
  background: color-mix(in srgb, var(--df-a-panel) 86%, transparent) !important;
  box-shadow: none !important;
  backdrop-filter: blur(16px) saturate(1.15);
}

.dashflow-shell .dashflow-dashboard-switcher button:hover {
  border-color: color-mix(in srgb, var(--df-aurora-cyan) 35%, var(--df-a-line)) !important;
  background: color-mix(in srgb, var(--df-aurora-cyan) 7%, var(--df-a-panel)) !important;
}

.dashflow-pulse {
  min-height: 52px !important;
  margin-bottom: 20px !important;
  border: 1px solid var(--df-a-line) !important;
  border-radius: 16px !important;
  background: color-mix(in srgb, var(--df-a-panel) 82%, transparent) !important;
  box-shadow: 0 10px 30px rgba(42,50,83,.07) !important;
  backdrop-filter: blur(22px) saturate(1.18);
}

.dashflow-pulse > span {
  padding: 0 20px !important;
  color: var(--df-a-secondary) !important;
  font-size: 9px !important;
}

.dashflow-pulse > span + span { border-left-color: var(--df-a-line) !important; }
.dashflow-pulse strong { color: var(--df-a-text) !important; font-size: 13px !important; }
.dashflow-pulse-label { color: var(--df-aurora-accent) !important; font-weight: 800 !important; }
.dashflow-pulse > span[data-metric="overdue"] strong { color: var(--df-aurora-rose) !important; }

.dashflow-section-title {
  padding: 0 5px 10px !important;
}

.dashflow-section-title > span {
  color: var(--df-a-secondary) !important;
  font-size: 9px !important;
  letter-spacing: .17em !important;
}

.dashflow-section-title small { color: var(--df-a-faint) !important; }

.dashflow-widget {
  isolation: isolate;
  overflow: hidden !important;
  border: 1px solid var(--df-a-line) !important;
  border-radius: 18px !important;
  color: var(--df-a-text) !important;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--df-widget-tone) 4%, transparent), transparent 92px),
    var(--df-a-panel) !important;
  box-shadow: var(--df-a-shadow) !important;
  backdrop-filter: blur(22px) saturate(1.15);
  transition: transform .18s ease, border-color .18s ease, box-shadow .2s ease, background .2s ease !important;
}

.dashflow-widget::before {
  content: "";
  position: absolute;
  z-index: 3;
  inset: 0 18px auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--df-widget-tone) 52%, transparent), transparent);
  pointer-events: none;
}

.dashflow-widget::after {
  content: "";
  position: absolute;
  z-index: -1;
  width: 180px;
  height: 180px;
  right: -110px;
  top: -120px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--df-widget-tone) 10%, transparent);
  filter: blur(26px);
  opacity: .65;
  pointer-events: none;
}

.dashflow-grid:not(.is-editing) .dashflow-widget:hover {
  transform: translateY(-3px) !important;
  border-color: color-mix(in srgb, var(--df-widget-tone) 36%, var(--df-a-line)) !important;
  box-shadow: var(--df-a-shadow-hover), 0 0 0 1px color-mix(in srgb, var(--df-widget-tone) 6%, transparent) !important;
}

.dashflow-widget[data-widget-id="today-tasks"] {
  --df-widget-tone: var(--df-aurora-accent) !important;
  border-color: color-mix(in srgb, var(--df-aurora-accent) 29%, var(--df-a-line)) !important;
  background:
    radial-gradient(420px 260px at 94% -12%, color-mix(in srgb, var(--df-aurora-cyan) 12%, transparent), transparent 66%),
    linear-gradient(135deg, color-mix(in srgb, var(--df-aurora-violet) 8%, var(--df-a-panel)), var(--df-a-panel) 60%) !important;
  box-shadow: 0 22px 64px color-mix(in srgb, var(--df-aurora-violet) 10%, rgba(42,50,83,.08)) !important;
}

.theme-dark .dashflow-widget[data-widget-id="today-tasks"] {
  box-shadow: 0 24px 72px rgba(0,0,0,.38), 0 0 38px color-mix(in srgb, var(--df-aurora-violet) 10%, transparent) !important;
}

.dashflow-widget[data-widget-type="quick-capture"] { --df-widget-tone: var(--df-aurora-cyan) !important; }
.dashflow-widget[data-widget-type="progress"] { --df-widget-tone: var(--df-aurora-green) !important; }
.dashflow-widget[data-widget-type="projects"] { --df-widget-tone: var(--df-aurora-violet) !important; }
.dashflow-widget[data-widget-type="upcoming"] { --df-widget-tone: var(--df-aurora-cyan) !important; }
.dashflow-widget[data-widget-type="countdown"] { --df-widget-tone: var(--df-aurora-gold) !important; }
.dashflow-widget[data-widget-type="habits"] { --df-widget-tone: var(--df-aurora-green) !important; }
.dashflow-widget[data-widget-type="heatmap"] { --df-widget-tone: var(--df-aurora-violet) !important; }
.dashflow-widget[data-widget-type="weekly-review"] { --df-widget-tone: #a873ff !important; }
.dashflow-widget[data-widget-type="calendar"] { --df-widget-tone: var(--df-aurora-cyan) !important; }
.dashflow-widget[data-widget-type="vault-stats"] { --df-widget-tone: var(--df-aurora-cyan) !important; }

.dashflow-widget-header {
  height: 46px !important;
  padding: 0 14px !important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-a-line) 68%, transparent) !important;
  background: linear-gradient(180deg, color-mix(in srgb, var(--df-widget-tone) 5%, var(--df-a-panel-strong)), color-mix(in srgb, var(--df-a-panel) 90%, transparent)) !important;
}

.dashflow-widget-header strong {
  color: var(--df-a-text) !important;
  font-size: 12.5px !important;
  font-weight: 690 !important;
}

.dashflow-widget-icon {
  width: 25px !important;
  height: 25px !important;
  flex-basis: 25px !important;
  border: 1px solid color-mix(in srgb, var(--df-widget-tone) 16%, transparent);
  border-radius: 8px !important;
  color: var(--df-widget-tone) !important;
  background: color-mix(in srgb, var(--df-widget-tone) 11%, var(--df-a-panel-soft)) !important;
  box-shadow: 0 5px 14px color-mix(in srgb, var(--df-widget-tone) 9%, transparent);
}

.dashflow-widget-body {
  height: calc(100% - 47px) !important;
  padding: 15px 16px !important;
}

.dashflow-empty {
  width: min(100%, 420px);
  height: auto !important;
  min-height: 70px !important;
  margin: auto;
  padding: 14px 16px !important;
  border: 1px solid color-mix(in srgb, var(--df-widget-tone) 12%, var(--df-a-line)) !important;
  border-radius: 13px !important;
  color: var(--df-a-faint) !important;
  background: color-mix(in srgb, var(--df-widget-tone) 3%, var(--df-a-panel-soft)) !important;
}

.dashflow-widget-kicker { color: var(--df-widget-tone) !important; }
.dashflow-widget-kicker span { color: var(--df-a-faint) !important; }

.dashflow-task {
  padding: 8px 7px !important;
  border-bottom-color: color-mix(in srgb, var(--df-a-line) 62%, transparent) !important;
  border-radius: 9px !important;
}

.dashflow-task:hover { background: color-mix(in srgb, var(--df-widget-tone) 6%, var(--df-a-panel-soft)) !important; }
.dashflow-task time { color: var(--df-a-secondary) !important; background: var(--df-a-panel-soft) !important; }

.dashflow-capture textarea {
  border-radius: 13px !important;
  padding: 11px 12px !important;
  background: color-mix(in srgb, var(--df-aurora-cyan) 3%, var(--df-a-panel-soft)) !important;
}

.dashflow-capture textarea:focus {
  border-color: color-mix(in srgb, var(--df-aurora-cyan) 40%, var(--df-a-line)) !important;
  background: color-mix(in srgb, var(--df-aurora-cyan) 7%, var(--df-a-panel-soft)) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--df-aurora-cyan) 9%, transparent) !important;
}

.dashflow-capture-footer { border-top-color: var(--df-a-line) !important; }
.dashflow-capture-footer span { color: var(--df-a-faint) !important; }
.dashflow-capture button {
  color: white !important;
  border-color: transparent !important;
  background: linear-gradient(135deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--df-aurora-violet) 20%, transparent) !important;
}

.dashflow-progress-ring {
  width: 100px !important;
  background: conic-gradient(var(--df-aurora-green) var(--dashflow-progress), color-mix(in srgb, var(--df-a-line) 75%, transparent) 0) !important;
  filter: drop-shadow(0 10px 22px color-mix(in srgb, var(--df-aurora-green) 18%, transparent)) !important;
}

.dashflow-progress-ring::after { background: var(--df-a-panel-strong) !important; border: 0; }
.dashflow-progress-ring span { color: var(--df-aurora-green) !important; }
.dashflow-progress-meta { color: var(--df-a-faint) !important; }

.dashflow-project-row {
  appearance: none !important;
  padding: 11px 6px !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-a-line) 64%, transparent) !important;
  border-radius: 9px !important;
  background: transparent !important;
  box-shadow: none !important;
}

.dashflow-project-row:hover { background: color-mix(in srgb, var(--df-aurora-violet) 6%, var(--df-a-panel-soft)) !important; }
.dashflow-project-name { color: var(--df-a-text) !important; font-weight: 610; }
.dashflow-project-bar { height: 5px !important; background: color-mix(in srgb, var(--df-aurora-violet) 10%, var(--df-a-line)) !important; }
.dashflow-project-bar span { background: linear-gradient(90deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important; }
.dashflow-project-stat strong { color: var(--df-aurora-violet) !important; }
.dashflow-project-stat span { color: var(--df-a-faint) !important; }

.dashflow-countdown > span { color: var(--df-aurora-gold) !important; }
.dashflow-countdown > strong {
  background: linear-gradient(150deg, var(--df-a-text) 15%, var(--df-aurora-gold) 48%, var(--df-aurora-rose) 92%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 12px 22px color-mix(in srgb, var(--df-aurora-gold) 15%, transparent));
  text-shadow: none !important;
}
.dashflow-countdown > small { color: var(--df-a-secondary) !important; }

.dashflow-stats-grid { gap: 0; }
.dashflow-stat { border-right-color: var(--df-a-line) !important; }
.dashflow-stat strong { font-size: clamp(22px, 3vw, 36px) !important; }
.dashflow-stat span { color: var(--df-a-faint) !important; }
.dashflow-stat:nth-child(1) strong { color: var(--df-aurora-cyan) !important; }
.dashflow-stat:nth-child(2) strong { color: var(--df-aurora-gold) !important; }
.dashflow-stat:nth-child(3) strong { color: var(--df-aurora-violet) !important; }
.dashflow-stat:nth-child(4) strong { color: var(--df-aurora-green) !important; }

.dashflow-heatmap-summary-main { gap: 20px !important; }
.dashflow-heatmap-stat strong { color: var(--df-aurora-violet) !important; font-size: 19px !important; }
.dashflow-heatmap-stat span,.dashflow-heatmap-range,.dashflow-heatmap-footer { color: var(--df-a-faint) !important; }
.dashflow-heatmap-grid { grid-template-rows: repeat(7, 12px) !important; grid-auto-columns: 12px !important; gap: 4px !important; }
.dashflow-heatmap-cell { width: 12px !important; height: 12px !important; border-radius: 4px !important; outline: 0 !important; }
.dashflow-heatmap-cell[data-level="0"] { background: color-mix(in srgb, var(--df-a-line) 65%, var(--df-a-panel-soft)) !important; }
.dashflow-heatmap-cell[data-level="1"] { background: color-mix(in srgb, var(--df-aurora-violet) 24%, var(--df-a-panel)) !important; }
.dashflow-heatmap-cell[data-level="2"] { background: color-mix(in srgb, var(--df-aurora-violet) 44%, var(--df-a-panel)) !important; }
.dashflow-heatmap-cell[data-level="3"] { background: color-mix(in srgb, var(--df-aurora-cyan) 68%, var(--df-aurora-violet)) !important; }
.dashflow-heatmap-cell[data-level="4"] { background: linear-gradient(135deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important; box-shadow: 0 0 14px color-mix(in srgb, var(--df-aurora-cyan) 30%, transparent); }

.dashflow-habit-row {
  border-color: color-mix(in srgb, var(--df-aurora-green) 14%, var(--df-a-line)) !important;
  border-radius: 12px !important;
  background: color-mix(in srgb, var(--df-aurora-green) 4%, var(--df-a-panel-soft)) !important;
  box-shadow: inset 3px 0 0 color-mix(in srgb, var(--df-aurora-green) 48%, transparent) !important;
}
.dashflow-habit-row:hover { background: color-mix(in srgb, var(--df-aurora-green) 8%, var(--df-a-panel-soft)) !important; }
.dashflow-habit-day.is-done { background: linear-gradient(135deg, var(--df-aurora-green), var(--df-aurora-cyan)) !important; box-shadow: 0 0 9px color-mix(in srgb, var(--df-aurora-green) 24%, transparent); }
.dashflow-habit-progress-track span { background: linear-gradient(90deg, var(--df-aurora-green), var(--df-aurora-cyan)) !important; }

.dashflow-weekly-kpi {
  border: 1px solid var(--df-a-line) !important;
  border-radius: 12px !important;
  background: color-mix(in srgb, #a873ff 4%, var(--df-a-panel-soft)) !important;
  box-shadow: none !important;
}
.dashflow-weekly-kpi::before { width: 3px !important; background: linear-gradient(180deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important; }
.dashflow-weekly-row { border-color: transparent !important; border-bottom-color: var(--df-a-line) !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; }
.dashflow-weekly-row:hover { background: color-mix(in srgb, #a873ff 6%, var(--df-a-panel-soft)) !important; }

.dashflow-calendar-day {
  min-height: 44px !important;
  border: 1px solid transparent !important;
  border-radius: 10px !important;
  background: transparent !important;
  box-shadow: none !important;
}
.dashflow-calendar-day:hover { border-color: color-mix(in srgb, var(--df-aurora-cyan) 18%, var(--df-a-line)) !important; background: color-mix(in srgb, var(--df-aurora-cyan) 6%, var(--df-a-panel-soft)) !important; }
.dashflow-calendar-day.is-selected { border-color: color-mix(in srgb, var(--df-aurora-violet) 45%, var(--df-a-line)) !important; background: color-mix(in srgb, var(--df-aurora-violet) 9%, var(--df-a-panel-soft)) !important; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-aurora-violet) 22%, transparent) !important; }
.dashflow-calendar-day.is-today .dashflow-calendar-day-number { background: linear-gradient(135deg, var(--df-aurora-violet), var(--df-aurora-cyan)) !important; box-shadow: 0 5px 14px color-mix(in srgb, var(--df-aurora-violet) 24%, transparent); }
.dashflow-calendar-agenda { margin-left: 4px; padding: 13px !important; border: 1px solid var(--df-a-line) !important; border-radius: 14px; background: color-mix(in srgb, var(--df-a-panel-soft) 86%, transparent); }
.dashflow-calendar-event { border-color: var(--df-a-line) !important; background: var(--df-a-panel) !important; box-shadow: none !important; }

.dashflow-edit-bar {
  border: 1px solid var(--df-a-line-strong) !important;
  background: color-mix(in srgb, var(--df-a-panel-strong) 84%, transparent) !important;
  box-shadow: 0 20px 60px rgba(20,26,48,.20) !important;
  backdrop-filter: blur(28px) saturate(1.2) !important;
}

/* DashFlow settings becomes a product surface instead of giant default Setting blocks. */
.dashflow-settings-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 10px 60px;
  --df-settings-violet: #7c5cff;
  --df-settings-cyan: #2ac8ff;
}

.dashflow-settings-hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 18px;
  padding: 22px 24px;
  border: 1px solid var(--background-modifier-border);
  border-radius: 20px;
  background:
    radial-gradient(380px 220px at 92% -20%, color-mix(in srgb, var(--df-settings-cyan) 18%, transparent), transparent 70%),
    linear-gradient(125deg, color-mix(in srgb, var(--df-settings-violet) 9%, var(--background-primary)), color-mix(in srgb, var(--background-secondary) 72%, var(--background-primary)));
}
.dashflow-settings-hero-badge { display:inline-flex; padding:4px 8px; border-radius:999px; color:var(--df-settings-violet); background:color-mix(in srgb,var(--df-settings-violet) 10%,transparent); font-size:10px; font-weight:700; letter-spacing:.1em; }
.dashflow-settings-hero h2 { margin:10px 0 5px; font-size:28px; letter-spacing:-.035em; }
.dashflow-settings-hero p { margin:0; max-width:650px; color:var(--text-muted); font-size:12px; line-height:1.55; }

.dashflow-settings-panel {
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid var(--background-modifier-border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--background-primary) 88%, var(--background-secondary));
}
.dashflow-settings-panel-head { padding:16px 18px 11px; border-bottom:1px solid color-mix(in srgb,var(--background-modifier-border) 72%,transparent); }
.dashflow-settings-panel-head strong { display:block; font-size:13px; }
.dashflow-settings-panel-head span { display:block; margin-top:3px; color:var(--text-muted); font-size:11px; }
.dashflow-settings-panel .setting-item { margin:0 !important; padding:15px 18px !important; border:0 !important; border-bottom:1px solid color-mix(in srgb,var(--background-modifier-border) 60%,transparent) !important; border-radius:0 !important; background:transparent !important; }
.dashflow-settings-panel .setting-item:last-child { border-bottom:0 !important; }
.dashflow-settings-panel .setting-item-name { font-size:12px; font-weight:620; }
.dashflow-settings-panel .setting-item-description { max-width:520px; color:var(--text-muted); font-size:10.5px; }
.dashflow-settings-panel input[type="text"] { min-width:230px; border-radius:9px; background:var(--background-primary); }
.dashflow-settings-guide-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; padding:14px; }
.dashflow-settings-code-card { min-width:0; padding:14px; border:1px solid color-mix(in srgb,var(--background-modifier-border) 68%,transparent); border-radius:12px; background:color-mix(in srgb,var(--background-secondary) 68%,var(--background-primary)); }
.dashflow-settings-code-card h3 { margin:0 0 8px; font-size:12px; }
.dashflow-settings-code-card pre { margin:0; padding:12px; overflow:auto; border-radius:10px; color:color-mix(in srgb,var(--text-normal) 90%,var(--df-settings-cyan)); background:color-mix(in srgb,var(--background-primary-alt) 82%,#111827); font-size:10px; line-height:1.5; }
.dashflow-settings-code-card p { margin:9px 0 0; color:var(--text-muted); font-size:10.5px; line-height:1.5; }

@media (max-width: 900px) {
  .dashflow-shell { width: min(100% - 20px, 780px) !important; padding-top: 16px !important; }
  .dashflow-hero { min-height: 0; padding: 20px !important; border-radius: 20px; }
  .dashflow-hero-actions { align-self: stretch; }
  .dashflow-widget { border-radius: 16px !important; }
  .dashflow-calendar-agenda { margin-left: 0; }
}

@media (max-width: 620px) {
  .dashflow-shell { width: calc(100% - 14px) !important; }
  .dashflow-hero { padding: 18px !important; }
  .dashflow-hero h1 { font-size: 34px !important; }
  .dashflow-hero-meta { gap:5px; }
  .dashflow-hero-meta span { padding:4px 7px; }
  .dashflow-pulse { margin-bottom:16px !important; }
  .dashflow-settings-guide-grid { grid-template-columns:1fr; }
  .dashflow-settings-panel .setting-item { align-items:flex-start; gap:10px; }
  .dashflow-settings-panel input[type="text"] { min-width:150px; width:100%; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-grid:not(.is-editing) .dashflow-widget:hover,
  .dashflow-edit-button:hover { transform:none !important; }
}
`;

export class AuroraDesignService {
  start(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = AURORA_STYLES;
    document.head.appendChild(style);
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
  }
}
