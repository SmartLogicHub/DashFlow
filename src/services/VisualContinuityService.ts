const STYLE_ID = "dashflow-visual-continuity-v042";

export const VISUAL_CONTINUITY_STYLES = `
/* DashFlow v0.4.2 final visual system.
 * This is the last presentation layer: it stabilizes the shared photographic
 * frame, normalizes typography, and gives every working surface/modal one
 * consistent hierarchy without touching domain data or write behavior. */

/* ---------------------------------------------------------------------- */
/* HERO + NAVIGATION                                                      */
/* ---------------------------------------------------------------------- */
.dashflow-home-hero-actions > button:nth-child(1),
.dashflow-home-hero-actions > button:nth-child(2) {
  font-size: 0!important;
}
.dashflow-home-hero-actions > button:nth-child(1)::after,
.dashflow-home-hero-actions > button:nth-child(2)::after {
  font-size: 11.5px;
  font-weight: 650;
  line-height: 1;
  white-space: nowrap;
}
.dashflow-home-hero-actions > button:nth-child(1)::after { content: "开始今天 →"; }
.dashflow-home-hero-actions > button:nth-child(2)::after { content: "收集灵感"; }

.dashflow-command-shell:not(.is-personal-home)::before { display: none!important; }

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  display: flex!important;
  position: relative!important;
  isolation: isolate;
  height: 194px!important;
  min-height: 194px!important;
  margin: 0 0 12px!important;
  padding: 24px 30px!important;
  align-items: flex-end!important;
  justify-content: flex-start!important;
  overflow: hidden!important;
  border: 1px solid var(--df-home-border, var(--df-cmd-border))!important;
  border-radius: 14px!important;
  color: #fff!important;
  background-color: #0f172a!important;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, .74) 0%, rgba(15, 23, 42, .40) 56%, rgba(15, 23, 42, .08) 100%),
    var(--df-ambient-image, var(--df-home-scene))!important;
  background-size: cover!important;
  background-position: center 50%!important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, .06)!important;
}
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero > * { display: none!important; }
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.16));
}
.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  content: "DASHFLOW";
  position: relative;
  z-index: 1;
  color: rgba(255,255,255,.97);
  font-size: 24px;
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -.02em;
  text-shadow: 0 2px 14px rgba(0,0,0,.38);
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="work"].is-active) > .dashflow-hero::after { content: "工作台 · WORK"; }
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="projects"].is-active) > .dashflow-hero::after { content: "项目 · PROJECTS"; }
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="inbox"].is-active) > .dashflow-hero::after { content: "收集箱 · INBOX"; }
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="calendar"].is-active) > .dashflow-hero::after { content: "日历 · CALENDAR"; }
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="habits"].is-active) > .dashflow-hero::after { content: "习惯 · HABITS"; }
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="review"].is-active) > .dashflow-hero::after { content: "复盘 · REVIEW"; }

.dashflow-command-shell > .dashflow-command-bar {
  min-height: 42px!important;
  background: color-mix(in srgb, var(--df-cmd-surface) 94%, transparent)!important;
  backdrop-filter: blur(10px);
}
.dashflow-command-shell .dashflow-command-workspace {
  display: flex!important;
  align-items: center!important;
  margin-left: 2px!important;
  padding-left: 7px!important;
  border-left: 1px solid var(--df-cmd-border)!important;
}
.dashflow-command-shell .dashflow-command-workspace .dashflow-dashboard-switcher {
  height: 30px!important;
  gap: 2px!important;
}
.dashflow-command-shell .dashflow-command-workspace .dashflow-dashboard-switcher select {
  width: 82px!important;
  max-width: 92px!important;
  padding-inline: 5px!important;
  color: var(--df-cmd-muted)!important;
  font-size: 10.5px!important;
}
/* Creation remains available from the manager; remove the isolated plus from
 * the top bar so Home/+ /... no longer reads like stray controls. */
.dashflow-command-shell .dashflow-command-workspace .dashflow-dashboard-switcher > button:first-of-type {
  display: none!important;
}
.dashflow-command-shell .dashflow-command-workspace .dashflow-dashboard-switcher > button:last-of-type {
  width: 28px!important;
  min-width: 28px!important;
  padding: 0!important;
  font-size: 11px!important;
}

/* ---------------------------------------------------------------------- */
/* TYPOGRAPHY + WORK GRID                                                 */
/* ---------------------------------------------------------------------- */
.dashflow-command-shell,
.dashflow-editor-modal,
.dashflow-search-modal {
  font-family: var(--font-interface);
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page {
  font-size: 12.5px!important;
  line-height: 1.45!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header strong {
  font-size: 13px!important;
  line-height: 1.2!important;
  font-weight: 700!important;
  letter-spacing: -.01em!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-icon {
  color: var(--df-home-accent, var(--df-cmd-muted))!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-empty {
  min-height: 48px!important;
  padding: 8px 10px!important;
  color: var(--df-cmd-muted)!important;
  font-size: 11.5px!important;
  line-height: 1.45!important;
}

/* Project rows contain main content + five-step progress + numeric stat. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) minmax(96px, 146px) 54px!important;
  gap: 14px!important;
  min-height: 42px!important;
  padding: 6px 4px!important;
  align-items: center!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-main { min-width: 0!important; }
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-name,
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row strong {
  color: var(--df-cmd-text)!important;
  font-size: 12.75px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
  letter-spacing: -.01em!important;
}
/* The five-stage track already communicates progress; remove the duplicate
 * thin bar from decorated rows so the eye only has one progress language. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row:has(.dashflow-project-steps) .dashflow-project-bar {
  display: none!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-steps {
  width: 100%!important;
  min-width: 0!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-steps::before {
  height: 2px!important;
  background: color-mix(in srgb, var(--df-cmd-border) 72%, var(--df-cmd-soft))!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-step {
  width: 7px!important;
  height: 7px!important;
  background: var(--df-cmd-soft)!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-step.is-active {
  background: var(--df-home-accent, var(--interactive-accent))!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat {
  min-width: 54px!important;
  display: grid!important;
  justify-items: end!important;
  gap: 1px!important;
  text-align: right!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat strong {
  font-size: 12.5px!important;
  line-height: 1.2!important;
  font-weight: 700!important;
  font-variant-numeric: tabular-nums;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat span {
  color: var(--df-cmd-muted)!important;
  font-size: 10px!important;
  line-height: 1.2!important;
}

/* Dual progress rings: one accent, one inner disc, symmetric spacing. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body {
  padding: 5px 10px 8px!important;
  overflow: hidden!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-wrap {
  padding: 5px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-pair {
  width: min(100%, 282px)!important;
  margin: 0 auto!important;
  grid-template-columns: repeat(2, minmax(92px, 1fr))!important;
  gap: 20px!important;
  align-items: center!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-metric {
  min-width: 0!important;
  gap: 6px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring {
  width: 62px!important;
  height: 62px!important;
  filter: none!important;
  background: conic-gradient(
    var(--df-home-accent, var(--interactive-accent)) var(--dashflow-progress),
    color-mix(in srgb, var(--df-cmd-border) 64%, var(--df-cmd-soft)) 0
  )!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring::after { display: none!important; }
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring::before {
  content: ""!important;
  position: absolute!important;
  inset: 5px!important;
  display: block!important;
  border-radius: 50%!important;
  background: var(--df-cmd-surface)!important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-cmd-border) 72%, transparent)!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring > div {
  position: relative!important;
  z-index: 1!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring strong {
  color: var(--df-cmd-text)!important;
  font-size: 16px!important;
  line-height: 1!important;
  font-weight: 760!important;
  letter-spacing: -.025em!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring span {
  margin-top: 4px!important;
  color: var(--df-cmd-muted)!important;
  font-size: 8.75px!important;
  line-height: 1!important;
  font-weight: 650!important;
  letter-spacing: .04em!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-caption {
  color: var(--df-cmd-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.3!important;
  white-space: nowrap!important;
  font-variant-numeric: tabular-nums;
}

/* ---------------------------------------------------------------------- */
/* PRODUCT SUB-PAGES                                                      */
/* ---------------------------------------------------------------------- */
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page {
  padding: 18px!important;
  border-radius: 12px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page-head {
  align-items: center!important;
  padding-bottom: 12px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page-head small {
  margin-bottom: 4px!important;
  color: var(--df-cmd-muted)!important;
  font-size: 9.5px!important;
  letter-spacing: .08em!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page-head h2 {
  font-size: 18px!important;
  line-height: 1.2!important;
  font-weight: 750!important;
  letter-spacing: -.02em!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-empty {
  min-height: 88px!important;
  padding: 18px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-empty strong {
  font-size: 13px!important;
}
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-empty p {
  margin-top: 4px!important;
  font-size: 11px!important;
}

/* Inbox */
.dashflow-command-shell .dashflow-command-inbox-composer {
  height: 44px!important;
  margin: 14px 0 8px!important;
  border-radius: 9px!important;
}
.dashflow-command-shell .dashflow-command-inbox-composer input {
  font-size: 12.5px!important;
}
.dashflow-command-shell .dashflow-command-inbox-row {
  min-height: 42px!important;
}
.dashflow-command-shell .dashflow-command-inbox-row strong {
  font-size: 12.5px!important;
}
.dashflow-command-shell .dashflow-command-inbox-row small {
  font-size: 10.5px!important;
}

/* Calendar: one accent language, no green circle + purple outline collision. */
.dashflow-command-shell .dashflow-calendar-day {
  border-radius: 8px!important;
  box-shadow: none!important;
}
.dashflow-command-shell .dashflow-calendar-day.is-today {
  border: 1px solid color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 58%, var(--df-cmd-border))!important;
  background: color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 6%, var(--df-cmd-surface))!important;
  box-shadow: none!important;
}
.dashflow-command-shell .dashflow-calendar-day.is-today .dashflow-calendar-day-number {
  color: var(--df-home-accent, var(--interactive-accent))!important;
  background: transparent!important;
  box-shadow: none!important;
  font-weight: 800!important;
}
.dashflow-command-shell .dashflow-calendar-day.is-selected {
  border-color: var(--df-home-accent, var(--interactive-accent))!important;
  background: color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 9%, var(--df-cmd-surface))!important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 22%, transparent)!important;
}
.dashflow-command-shell .dashflow-calendar-day-number {
  font-size: 11px!important;
  font-variant-numeric: tabular-nums;
}
.dashflow-command-shell .dashflow-calendar-agenda h3,
.dashflow-command-shell .dashflow-calendar-agenda strong {
  font-size: 13px!important;
  line-height: 1.3!important;
}

/* Habits */
.dashflow-command-shell .dashflow-habit-row {
  min-height: 52px!important;
  padding: 8px 10px!important;
  border-radius: 8px!important;
  box-shadow: none!important;
}
.dashflow-command-shell .dashflow-habit-name {
  font-size: 12.75px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
}
.dashflow-command-shell .dashflow-habit-meta,
.dashflow-command-shell .dashflow-habit-row small {
  color: var(--df-cmd-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.35!important;
}

/* Review: a summary band, not four independent admin KPI cards. */
.dashflow-command-shell .dashflow-weekly-kpis {
  gap: 0!important;
  overflow: hidden!important;
  border: 1px solid var(--df-cmd-border)!important;
  border-radius: 10px!important;
  background: color-mix(in srgb, var(--df-cmd-surface) 96%, transparent)!important;
}
.dashflow-command-shell .dashflow-weekly-kpi {
  min-height: 60px!important;
  padding: 9px 11px!important;
  border: 0!important;
  border-right: 1px solid var(--df-cmd-border)!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}
.dashflow-command-shell .dashflow-weekly-kpi:last-child { border-right: 0!important; }
.dashflow-command-shell .dashflow-weekly-kpi::before { display: none!important; }
.dashflow-command-shell .dashflow-weekly-kpi strong {
  color: var(--df-cmd-text)!important;
  font-size: 18px!important;
  line-height: 1.15!important;
}
.dashflow-command-shell .dashflow-weekly-kpi span,
.dashflow-command-shell .dashflow-weekly-kpi small {
  color: var(--df-cmd-muted)!important;
  font-size: 9.75px!important;
  line-height: 1.3!important;
}
.dashflow-command-shell .dashflow-weekly-row {
  min-height: 36px!important;
  padding: 6px 7px!important;
  border: 0!important;
  border-bottom: 1px solid color-mix(in srgb, var(--df-cmd-border) 65%, transparent)!important;
  border-radius: 0!important;
  background: transparent!important;
  box-shadow: none!important;
}

/* ---------------------------------------------------------------------- */
/* SHARED MODAL SYSTEM                                                    */
/* ---------------------------------------------------------------------- */
.modal:has(.dashflow-editor-modal) {
  width: min(680px, calc(100vw - 36px))!important;
  max-width: 680px!important;
  border-radius: 16px!important;
}
.modal:has(.dashflow-editor-modal) .modal-close-button {
  top: 14px!important;
  right: 14px!important;
  color: var(--text-muted)!important;
}
.modal:has(.dashflow-editor-modal) .modal-content.dashflow-editor-modal {
  padding: 26px 28px 24px!important;
  color: var(--text-normal)!important;
  font-size: 13px!important;
  line-height: 1.5!important;
}
.dashflow-editor-modal .dashflow-modal-eyebrow {
  margin: 0 0 7px!important;
  color: var(--text-muted)!important;
  font-size: 9.75px!important;
  line-height: 1!important;
  font-weight: 700!important;
  letter-spacing: .12em!important;
  text-transform: uppercase!important;
}
.dashflow-editor-modal > h2 {
  margin: 0!important;
  padding: 0!important;
  color: var(--text-normal)!important;
  font-size: 22px!important;
  line-height: 1.2!important;
  font-weight: 760!important;
  letter-spacing: -.025em!important;
}
.dashflow-editor-modal > .dashflow-modal-lead {
  max-width: 560px!important;
  margin: 7px 0 18px!important;
  color: var(--text-muted)!important;
  font-size: 11.5px!important;
  line-height: 1.55!important;
}

/* Obsidian Setting-based editors */
.dashflow-task-editor > .setting-item,
.dashflow-project-editor > .setting-item,
.dashflow-habit-editor > .setting-item {
  min-height: 54px!important;
  padding: 10px 0!important;
  display: grid!important;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 280px)!important;
  gap: 22px!important;
  align-items: center!important;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent)!important;
}
.dashflow-task-editor > .setting-item:first-of-type,
.dashflow-project-editor > .setting-item:first-of-type,
.dashflow-habit-editor > .setting-item:first-of-type {
  border-top-color: var(--background-modifier-border)!important;
}
.dashflow-task-editor .setting-item-info,
.dashflow-project-editor .setting-item-info,
.dashflow-habit-editor .setting-item-info {
  min-width: 0!important;
  margin: 0!important;
  padding: 0!important;
}
.dashflow-task-editor .setting-item-name,
.dashflow-project-editor .setting-item-name,
.dashflow-habit-editor .setting-item-name {
  color: var(--text-normal)!important;
  font-size: 12.5px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
}
.dashflow-task-editor .setting-item-description,
.dashflow-project-editor .setting-item-description,
.dashflow-habit-editor .setting-item-description {
  margin-top: 3px!important;
  color: var(--text-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.4!important;
}
.dashflow-task-editor .setting-item-control,
.dashflow-project-editor .setting-item-control,
.dashflow-habit-editor .setting-item-control {
  width: 100%!important;
  min-width: 0!important;
  margin: 0!important;
  padding: 0!important;
  display: flex!important;
  justify-content: flex-end!important;
  align-items: center!important;
  gap: 8px!important;
}
.dashflow-task-editor input[type="text"],
.dashflow-task-editor input[type="date"],
.dashflow-task-editor input[type="number"],
.dashflow-task-editor select,
.dashflow-project-editor input[type="text"],
.dashflow-project-editor input[type="date"],
.dashflow-project-editor input[type="number"],
.dashflow-project-editor select,
.dashflow-habit-editor input[type="text"],
.dashflow-habit-editor input[type="date"],
.dashflow-habit-editor input[type="number"],
.dashflow-habit-editor select {
  width: 100%!important;
  min-width: 0!important;
  height: 34px!important;
  border-radius: 7px!important;
  font-size: 12px!important;
}
.dashflow-project-editor textarea,
.dashflow-task-editor textarea,
.dashflow-habit-editor textarea {
  width: 100%!important;
  min-height: 78px!important;
  resize: vertical!important;
  border-radius: 7px!important;
  font-size: 12px!important;
  line-height: 1.45!important;
}
.dashflow-project-editor .slider,
.dashflow-task-editor .slider,
.dashflow-habit-editor .slider {
  width: 100%!important;
}
.dashflow-task-editor-actions,
.dashflow-habit-editor-actions {
  min-height: 48px!important;
  margin-top: 8px!important;
  padding: 12px 0 0!important;
  display: flex!important;
  justify-content: flex-end!important;
  border-top: 1px solid var(--background-modifier-border)!important;
}
.dashflow-task-editor-actions .setting-item-info,
.dashflow-habit-editor-actions .setting-item-info { display: none!important; }
.dashflow-task-editor-actions .setting-item-control,
.dashflow-habit-editor-actions .setting-item-control {
  width: auto!important;
  margin-left: auto!important;
}
.dashflow-task-editor-actions button,
.dashflow-habit-editor-actions button {
  min-height: 32px!important;
  border-radius: 7px!important;
  font-size: 11.5px!important;
}

/* ---------------------------------------------------------------------- */
/* PROJECT DETAIL MODAL                                                   */
/* ---------------------------------------------------------------------- */
.modal:has(.dashflow-project-detail) {
  width: min(720px, calc(100vw - 40px))!important;
  max-width: 720px!important;
}
.modal:has(.dashflow-project-detail) .modal-content.dashflow-project-detail {
  padding: 28px 30px 26px!important;
}
.dashflow-project-detail-head {
  display: flex!important;
  align-items: flex-start!important;
  justify-content: space-between!important;
  gap: 24px!important;
  margin: 0 0 22px!important;
}
.dashflow-project-detail-head > div:first-child {
  min-width: 0!important;
  flex: 1 1 auto!important;
}
.dashflow-project-detail h2 {
  margin: 0!important;
  color: var(--text-normal)!important;
  font-size: 24px!important;
  line-height: 1.2!important;
  font-weight: 760!important;
  letter-spacing: -.025em!important;
}
.dashflow-project-detail .dashflow-modal-lead {
  max-width: 520px!important;
  margin: 8px 0 0!important;
  color: var(--text-muted)!important;
  font-size: 12px!important;
  line-height: 1.5!important;
}
.dashflow-project-detail-actions {
  display: flex!important;
  align-items: center!important;
  gap: 7px!important;
  flex: 0 0 auto!important;
  padding-top: 17px!important;
}
.dashflow-project-detail-actions button,
.dashflow-project-detail-section-head > button {
  min-height: 32px!important;
  padding: 0 11px!important;
  display: inline-flex!important;
  align-items: center!important;
  justify-content: center!important;
  gap: 6px!important;
  border: 1px solid var(--background-modifier-border)!important;
  border-radius: 8px!important;
  color: var(--text-normal)!important;
  background: var(--background-primary-alt, var(--background-primary))!important;
  box-shadow: none!important;
  font-size: 11.5px!important;
  font-weight: 600!important;
}
.dashflow-project-detail-actions button:hover,
.dashflow-project-detail-section-head > button:hover { background: var(--background-modifier-hover)!important; }
.dashflow-project-detail-actions button svg { width: 14px!important; height: 14px!important; }
.dashflow-project-detail-meta {
  display: grid!important;
  grid-template-columns: repeat(4, minmax(0, 1fr))!important;
  gap: 8px!important;
  margin: 0 0 12px!important;
}
.dashflow-project-detail-meta-item {
  min-width: 0!important;
  min-height: 60px!important;
  padding: 10px 12px!important;
  display: flex!important;
  flex-direction: column!important;
  justify-content: center!important;
  gap: 4px!important;
  border: 1px solid var(--background-modifier-border)!important;
  border-radius: 10px!important;
  background: color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary))!important;
}
.dashflow-project-detail-meta-item > span {
  color: var(--text-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.2!important;
}
.dashflow-project-detail-meta-item > strong {
  overflow: hidden!important;
  color: var(--text-normal)!important;
  font-size: 14px!important;
  line-height: 1.25!important;
  font-weight: 700!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
  font-variant-numeric: tabular-nums;
}
.dashflow-project-detail-progress {
  width: 100%!important;
  height: 5px!important;
  margin: 0 0 22px!important;
  overflow: hidden!important;
  border-radius: 999px!important;
  background: var(--background-modifier-border)!important;
}
.dashflow-project-detail-progress > span {
  display: block!important;
  height: 100%!important;
  border-radius: inherit!important;
  background: var(--interactive-accent)!important;
}
.dashflow-project-detail-section-head {
  display: flex!important;
  align-items: center!important;
  justify-content: space-between!important;
  gap: 16px!important;
  margin: 0 0 10px!important;
}
.dashflow-project-detail-section-head > div {
  min-width: 0!important;
  display: flex!important;
  align-items: baseline!important;
  gap: 8px!important;
}
.dashflow-project-detail-section-head strong {
  color: var(--text-normal)!important;
  font-size: 14px!important;
  line-height: 1.25!important;
  font-weight: 700!important;
}
.dashflow-project-detail-section-head span {
  color: var(--text-muted)!important;
  font-size: 10.5px!important;
}
.dashflow-project-detail-task-list {
  display: flex!important;
  flex-direction: column!important;
  gap: 0!important;
  border-top: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent)!important;
}
.dashflow-project-detail-task {
  min-height: 48px!important;
  display: grid!important;
  grid-template-columns: 18px minmax(0, 1fr)!important;
  gap: 10px!important;
  align-items: center!important;
  padding: 7px 2px!important;
  border-bottom: 1px solid color-mix(in srgb, var(--background-modifier-border) 72%, transparent)!important;
}
.dashflow-project-detail-task > input { margin: 0!important; }
.dashflow-project-detail-task > button {
  min-width: 0!important;
  padding: 3px 0!important;
  display: flex!important;
  flex-direction: column!important;
  align-items: flex-start!important;
  gap: 3px!important;
  border: 0!important;
  background: transparent!important;
  box-shadow: none!important;
  text-align: left!important;
}
.dashflow-project-detail-task > button strong {
  color: var(--text-normal)!important;
  font-size: 12.5px!important;
  line-height: 1.35!important;
  font-weight: 600!important;
}
.dashflow-project-detail-task > button span {
  color: var(--text-muted)!important;
  font-size: 10px!important;
  line-height: 1.3!important;
}
.dashflow-project-detail .dashflow-product-empty {
  min-height: 76px!important;
  padding: 14px 4px!important;
  display: flex!important;
  flex-direction: column!important;
  align-items: flex-start!important;
  justify-content: center!important;
  gap: 3px!important;
  text-align: left!important;
}
.dashflow-project-detail .dashflow-product-empty strong {
  font-size: 12.5px!important;
  font-weight: 650!important;
}
.dashflow-project-detail .dashflow-product-empty span {
  color: var(--text-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.4!important;
}
.dashflow-project-completed {
  margin-top: 14px!important;
  color: var(--text-muted)!important;
  font-size: 11px!important;
}

/* ---------------------------------------------------------------------- */
/* QUICK ADD                                                              */
/* ---------------------------------------------------------------------- */
.modal:has(.dashflow-quick-add-modal) {
  width: min(620px, calc(100vw - 36px))!important;
  max-width: 620px!important;
}
.dashflow-quick-add-modal > .dashflow-modal-lead { margin-bottom: 16px!important; }
.dashflow-quick-add-composer {
  min-height: 48px!important;
  padding: 0 11px!important;
  display: grid!important;
  grid-template-columns: 20px minmax(0, 1fr) auto!important;
  align-items: center!important;
  gap: 9px!important;
  border: 1px solid color-mix(in srgb, var(--interactive-accent) 26%, var(--background-modifier-border))!important;
  border-radius: 10px!important;
  background: color-mix(in srgb, var(--background-secondary) 58%, var(--background-primary))!important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--interactive-accent) 5%, transparent)!important;
}
.dashflow-quick-add-icon {
  width: 18px!important;
  height: 18px!important;
  display: grid!important;
  place-items: center!important;
  color: var(--interactive-accent)!important;
}
.dashflow-quick-add-icon svg { width: 15px!important; height: 15px!important; }
.dashflow-quick-add-composer input {
  width: 100%!important;
  height: 44px!important;
  padding: 0!important;
  border: 0!important;
  background: transparent!important;
  box-shadow: none!important;
  color: var(--text-normal)!important;
  font-size: 13px!important;
}
.dashflow-quick-add-hint {
  color: var(--text-faint)!important;
  font-family: var(--font-monospace)!important;
  font-size: 9px!important;
  font-weight: 650!important;
}
.dashflow-quick-add-actions {
  margin-top: 12px!important;
  display: grid!important;
  grid-template-columns: repeat(3, minmax(0, 1fr))!important;
  gap: 8px!important;
}
.dashflow-quick-add-action {
  min-height: 72px!important;
  padding: 10px!important;
  display: grid!important;
  grid-template-columns: 28px minmax(0, 1fr)!important;
  gap: 9px!important;
  align-items: start!important;
  border: 1px solid var(--background-modifier-border)!important;
  border-radius: 10px!important;
  color: var(--text-normal)!important;
  background: var(--background-primary)!important;
  box-shadow: none!important;
  text-align: left!important;
}
.dashflow-quick-add-action:hover { background: var(--background-modifier-hover)!important; }
.dashflow-quick-add-action-icon {
  width: 28px!important;
  height: 28px!important;
  display: grid!important;
  place-items: center!important;
  border-radius: 8px!important;
  color: var(--interactive-accent)!important;
  background: color-mix(in srgb, var(--interactive-accent) 9%, transparent)!important;
}
.dashflow-quick-add-action-icon svg { width: 15px!important; height: 15px!important; }
.dashflow-quick-add-action > span:last-child { min-width: 0!important; }
.dashflow-quick-add-action strong {
  display: block!important;
  font-size: 11.75px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
}
.dashflow-quick-add-action small {
  display: block!important;
  margin-top: 3px!important;
  color: var(--text-muted)!important;
  font-size: 9.75px!important;
  line-height: 1.35!important;
}

/* ---------------------------------------------------------------------- */
/* GLOBAL SEARCH                                                          */
/* ---------------------------------------------------------------------- */
.dashflow-search-modal {
  width: min(680px, calc(100vw - 36px))!important;
  max-width: 680px!important;
  border-radius: 14px!important;
}
.dashflow-search-modal .prompt-input-container {
  padding: 10px 12px!important;
  border-bottom: 1px solid var(--background-modifier-border)!important;
}
.dashflow-search-modal .prompt-input {
  height: 42px!important;
  padding: 0 4px!important;
  font-size: 14px!important;
  line-height: 1.3!important;
}
.dashflow-search-modal .suggestion-container {
  padding: 7px!important;
}
.dashflow-search-modal .suggestion-item {
  min-height: 48px!important;
  margin: 1px 0!important;
  padding: 8px 9px!important;
  border-radius: 9px!important;
}
.dashflow-search-modal .suggestion-item.is-selected {
  background: color-mix(in srgb, var(--interactive-accent) 9%, var(--background-modifier-hover))!important;
}
.dashflow-search-item {
  display: grid!important;
  grid-template-columns: 30px minmax(0, 1fr)!important;
  gap: 9px!important;
  align-items: center!important;
}
.dashflow-search-item-icon {
  width: 30px!important;
  height: 30px!important;
  display: grid!important;
  place-items: center!important;
  border-radius: 8px!important;
  color: var(--interactive-accent)!important;
  background: color-mix(in srgb, var(--interactive-accent) 8%, transparent)!important;
}
.dashflow-search-item-icon svg { width: 15px!important; height: 15px!important; }
.dashflow-search-item-copy { min-width: 0!important; }
.dashflow-search-item-copy strong {
  display: block!important;
  overflow: hidden!important;
  color: var(--text-normal)!important;
  font-size: 12.5px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
}
.dashflow-search-item-copy span {
  display: block!important;
  overflow: hidden!important;
  margin-top: 2px!important;
  color: var(--text-muted)!important;
  font-size: 10px!important;
  line-height: 1.3!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
}
.dashflow-search-modal .prompt-instructions {
  padding: 7px 12px 9px!important;
  color: var(--text-faint)!important;
  font-size: 9.5px!important;
}

/* ---------------------------------------------------------------------- */
/* AI PLAN                                                                */
/* ---------------------------------------------------------------------- */
.modal:has(.dashflow-ai-plan) {
  width: min(720px, calc(100vw - 36px))!important;
  max-width: 720px!important;
}
.dashflow-ai-plan-state {
  min-height: 92px!important;
  margin-top: 16px!important;
  padding: 16px!important;
  display: flex!important;
  align-items: center!important;
  justify-content: center!important;
  gap: 9px!important;
  border: 1px solid var(--background-modifier-border)!important;
  border-radius: 10px!important;
  color: var(--text-muted)!important;
  background: color-mix(in srgb, var(--background-secondary) 55%, var(--background-primary))!important;
  font-size: 11.5px!important;
}
.dashflow-ai-plan-spinner {
  width: 24px!important;
  height: 24px!important;
  display: grid!important;
  place-items: center!important;
  color: var(--interactive-accent)!important;
}
.dashflow-ai-plan-output {
  max-height: min(52vh, 460px)!important;
  margin-top: 16px!important;
  padding: 16px 17px!important;
  overflow: auto!important;
  border: 1px solid var(--background-modifier-border)!important;
  border-radius: 10px!important;
  color: var(--text-normal)!important;
  background: color-mix(in srgb, var(--background-secondary) 48%, var(--background-primary))!important;
  font-size: 12px!important;
  line-height: 1.65!important;
  white-space: pre-wrap!important;
}
.dashflow-ai-plan-actions {
  margin-top: 12px!important;
  display: flex!important;
  justify-content: flex-end!important;
  gap: 7px!important;
}
.dashflow-ai-plan-actions button {
  min-height: 32px!important;
  padding: 0 11px!important;
  border-radius: 7px!important;
  font-size: 11.5px!important;
}

/* Stable response when Home's primary action enters Work. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget.is-hero-action-target {
  border-color: color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 58%, var(--df-cmd-border))!important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--df-home-accent, var(--interactive-accent)) 10%, transparent)!important;
}

/* ---------------------------------------------------------------------- */
/* RESPONSIVE                                                             */
/* ---------------------------------------------------------------------- */
@media (max-width: 760px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 160px!important;
    min-height: 160px!important;
    padding: 20px 22px!important;
    border-radius: 12px!important;
  }
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after { font-size: 20px!important; }
  .dashflow-command-shell .dashflow-command-workspace { display: none!important; }

  .dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
    grid-template-columns: minmax(0, 1fr) 54px!important;
    gap: 10px!important;
  }
  .dashflow-command-shell:not(.is-personal-home) .dashflow-project-steps { display: none!important; }

  .modal:has(.dashflow-editor-modal),
  .dashflow-search-modal {
    width: calc(100vw - 18px)!important;
    max-width: none!important;
  }
  .modal:has(.dashflow-editor-modal) .modal-content.dashflow-editor-modal {
    padding: 22px 18px 20px!important;
  }
  .dashflow-task-editor > .setting-item,
  .dashflow-project-editor > .setting-item,
  .dashflow-habit-editor > .setting-item {
    grid-template-columns: 1fr!important;
    gap: 7px!important;
    padding: 10px 0!important;
  }
  .dashflow-task-editor .setting-item-control,
  .dashflow-project-editor .setting-item-control,
  .dashflow-habit-editor .setting-item-control {
    justify-content: stretch!important;
  }
  .dashflow-project-detail-head {
    flex-direction: column!important;
    gap: 10px!important;
  }
  .dashflow-project-detail-actions { padding-top: 0!important; }
  .dashflow-project-detail-meta { grid-template-columns: repeat(2, minmax(0, 1fr))!important; }
  .dashflow-quick-add-actions { grid-template-columns: 1fr!important; }
  .dashflow-quick-add-action { min-height: 58px!important; }
}

@media (max-width: 480px) {
  .dashflow-editor-modal > h2 { font-size: 20px!important; }
  .dashflow-project-detail h2 { font-size: 21px!important; }
  .dashflow-project-detail-meta { grid-template-columns: 1fr 1fr!important; }
  .dashflow-progress-pair { gap: 10px!important; }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-command-shell *,
  .dashflow-editor-modal *,
  .dashflow-search-modal * {
    transition: none!important;
    animation: none!important;
    scroll-behavior: auto!important;
  }
}
`;

export class VisualContinuityService {
  private observer: MutationObserver | null = null;

  start(): void {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = VISUAL_CONTINUITY_STYLES;
      document.head.appendChild(style);
    }

    this.observer = new MutationObserver(() => this.stabilizeHeroActions());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.stabilizeHeroActions();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    document.getElementById(STYLE_ID)?.remove();
  }

  private stabilizeHeroActions(): void {
    for (const actions of document.querySelectorAll<HTMLElement>(".dashflow-home-hero-actions")) {
      const buttons = actions.querySelectorAll<HTMLButtonElement>(":scope > button");
      const start = buttons[0];
      const capture = buttons[1];

      if (start && start.dataset.dashflowContinuity !== "1") {
        start.dataset.dashflowContinuity = "1";
        start.dataset.dashflowPolished = "1";
        start.dataset.dashflowRole = "start";
        start.title = "进入工作台，并聚焦今日任务";
        start.setAttribute("aria-label", "开始今天：进入工作台并聚焦今日任务");
        start.addEventListener("click", () => window.setTimeout(() => this.focusTodayWidget(), 48));
      }

      if (capture && capture.dataset.dashflowContinuity !== "1") {
        capture.dataset.dashflowContinuity = "1";
        capture.dataset.dashflowPolished = "1";
        capture.dataset.dashflowRole = "capture";
        capture.title = "打开 Quick Add，把一句想法收进 Inbox";
        capture.setAttribute("aria-label", "收集灵感：打开 Quick Add 并写入 Inbox");
      }
    }
  }

  private focusTodayWidget(): void {
    const card = document.querySelector<HTMLElement>(
      '.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-id="today-tasks"]',
    );
    if (!card) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    card.classList.add("is-hero-action-target");
    window.setTimeout(() => card.classList.remove("is-hero-action-target"), reduceMotion ? 0 : 900);
  }
}
