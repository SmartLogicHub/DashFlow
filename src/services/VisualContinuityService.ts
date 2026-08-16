const STYLE_ID = "dashflow-visual-continuity-v042";

export const VISUAL_CONTINUITY_STYLES = `
/* v0.4.2 visual continuity — keep one stable visual frame across every
 * DashFlow section. Home carries the richer copy/actions, while work pages
 * reuse the same scene, crop and height with a lighter section label. */

/* ProductExperience rebuilds the Hero when its observer decorates the shell.
 * Keep the visible labels in CSS so DOM replacement cannot alternate copy. */
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

/* The old ambient pseudo strip is no longer needed. Every main section now
 * owns the same 194px photographic frame as Home, avoiding any visual jump. */
.dashflow-command-shell:not(.is-personal-home)::before {
  display: none!important;
}

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

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero > * {
  display: none!important;
}

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

.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="work"].is-active) > .dashflow-hero::after {
  content: "工作台 · WORK";
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="projects"].is-active) > .dashflow-hero::after {
  content: "项目 · PROJECTS";
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="inbox"].is-active) > .dashflow-hero::after {
  content: "收集箱 · INBOX";
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="calendar"].is-active) > .dashflow-hero::after {
  content: "日历 · CALENDAR";
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="habits"].is-active) > .dashflow-hero::after {
  content: "习惯 · HABITS";
}
.dashflow-command-shell:not(.is-personal-home):has(.dashflow-command-button[data-section="review"].is-active) > .dashflow-hero::after {
  content: "复盘 · REVIEW";
}

/* Let navigation remain visually attached to the same scene. */
.dashflow-command-shell:not(.is-personal-home) > .dashflow-command-bar {
  background: color-mix(in srgb, var(--df-cmd-surface) 92%, transparent)!important;
  backdrop-filter: blur(10px);
}

/* TYPOGRAPHY ------------------------------------------------------------ */
.dashflow-command-shell,
.dashflow-project-detail {
  font-family: var(--font-interface);
  font-kerning: normal;
  text-rendering: optimizeLegibility;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-body,
.dashflow-command-shell:not(.is-personal-home) .dashflow-command-page {
  font-size: 12.5px!important;
  line-height: 1.45;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-widget-header strong {
  font-size: 13px!important;
  line-height: 1.2!important;
  letter-spacing: -.01em!important;
}

/* WORK PROJECT ROWS ----------------------------------------------------- */
/* ProjectExperience injects three children: main content, 5-step progress,
 * and numeric stats. Keep three real columns so the data never overlaps. */
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
  grid-template-columns: minmax(0, 1fr) minmax(92px, 140px) 52px!important;
  gap: 14px!important;
  min-height: 42px!important;
  padding: 5px 4px!important;
  align-items: center!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-main {
  min-width: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-name,
.dashflow-command-shell:not(.is-personal-home) .dashflow-project-row strong {
  font-size: 13px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
  letter-spacing: -.01em!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-bar {
  height: 3px!important;
  margin-top: 5px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-steps {
  width: 100%!important;
  min-width: 0!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat {
  min-width: 52px!important;
  text-align: right!important;
  justify-items: end!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat strong {
  font-size: 12.5px!important;
  font-variant-numeric: tabular-nums;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-project-stat span {
  font-size: 10px!important;
  line-height: 1.2!important;
}

/* PROGRESS PAIR --------------------------------------------------------- */
.dashflow-command-shell:not(.is-personal-home) .dashflow-widget[data-widget-type="progress"] .dashflow-widget-body {
  padding: 5px 12px 8px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-pair {
  width: min(100%, 286px)!important;
  margin: 0 auto!important;
  grid-template-columns: repeat(2, minmax(94px, 1fr))!important;
  gap: 18px!important;
  align-items: center!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-metric {
  min-width: 0!important;
  gap: 6px!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring {
  width: 62px!important;
  height: 62px!important;
  background: conic-gradient(
    var(--df-home-accent, var(--df-cmd-purple)) var(--dashflow-progress),
    var(--df-cmd-soft) 0
  )!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring strong {
  font-size: 16px!important;
  line-height: 1!important;
  letter-spacing: -.025em!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-ring span {
  margin-top: 4px!important;
  font-size: 9px!important;
  color: var(--df-cmd-muted)!important;
}

.dashflow-command-shell:not(.is-personal-home) .dashflow-progress-caption {
  font-size: 10.5px!important;
  line-height: 1.3!important;
  white-space: nowrap!important;
  color: var(--df-cmd-muted)!important;
}

/* PROJECT DETAIL MODAL -------------------------------------------------- */
.modal:has(.dashflow-project-detail) {
  width: min(720px, calc(100vw - 40px))!important;
  max-width: 720px!important;
  border-radius: 16px!important;
}

.modal:has(.dashflow-project-detail) .modal-content.dashflow-project-detail {
  padding: 28px 30px 26px!important;
  color: var(--text-normal)!important;
  font-size: 13px!important;
  line-height: 1.5!important;
}

.dashflow-project-detail-head {
  display: flex!important;
  align-items: flex-start!important;
  justify-content: space-between!important;
  gap: 24px!important;
  margin: 0 0 22px!important;
  padding: 0!important;
}

.dashflow-project-detail-head > div:first-child {
  min-width: 0!important;
  flex: 1 1 auto!important;
}

.dashflow-project-detail .dashflow-modal-eyebrow {
  margin: 0 0 7px!important;
  color: var(--text-muted)!important;
  font-size: 10px!important;
  line-height: 1!important;
  font-weight: 700!important;
  letter-spacing: .12em!important;
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
  font-size: 12.5px!important;
  line-height: 1.55!important;
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
.dashflow-project-detail-section-head > button:hover {
  background: var(--background-modifier-hover)!important;
}

.dashflow-project-detail-actions button svg {
  width: 14px!important;
  height: 14px!important;
}

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
  margin: 0 0 24px!important;
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
  padding: 0!important;
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
  line-height: 1.25!important;
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

.dashflow-project-detail-task > input {
  margin: 0!important;
}

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
  max-width: 100%!important;
  overflow: hidden!important;
  color: var(--text-normal)!important;
  font-size: 12.5px!important;
  line-height: 1.4!important;
  font-weight: 600!important;
  text-overflow: ellipsis!important;
  white-space: nowrap!important;
}

.dashflow-project-detail-task > button span {
  color: var(--text-muted)!important;
  font-size: 10.5px!important;
  line-height: 1.35!important;
}

.dashflow-project-detail-task-list > .dashflow-product-empty {
  min-height: 92px!important;
  padding: 18px!important;
  display: flex!important;
  flex-direction: column!important;
  align-items: flex-start!important;
  justify-content: center!important;
  gap: 4px!important;
  border: 1px dashed var(--background-modifier-border)!important;
  border-radius: 10px!important;
  background: color-mix(in srgb, var(--background-secondary) 45%, transparent)!important;
  text-align: left!important;
}

.dashflow-project-detail-task-list > .dashflow-product-empty strong {
  color: var(--text-normal)!important;
  font-size: 12.5px!important;
  line-height: 1.3!important;
  font-weight: 650!important;
}

.dashflow-project-detail-task-list > .dashflow-product-empty span {
  color: var(--text-muted)!important;
  font-size: 11.5px!important;
  line-height: 1.5!important;
}

.dashflow-project-completed {
  margin-top: 14px!important;
  color: var(--text-muted)!important;
  font-size: 11.5px!important;
}

.dashflow-project-completed > summary {
  padding: 6px 0!important;
  cursor: pointer;
  font-weight: 600!important;
}

@media (max-width: 760px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 160px!important;
    min-height: 160px!important;
    padding: 20px 22px!important;
    border-radius: 12px!important;
  }
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
    font-size: 20px;
  }

  .dashflow-command-shell:not(.is-personal-home) .dashflow-project-row {
    grid-template-columns: minmax(0, 1fr) 50px!important;
  }
  .dashflow-command-shell:not(.is-personal-home) .dashflow-project-steps {
    display: none!important;
  }

  .modal:has(.dashflow-project-detail) .modal-content.dashflow-project-detail {
    padding: 24px 20px 22px!important;
  }
  .dashflow-project-detail-head {
    flex-direction: column!important;
    gap: 12px!important;
  }
  .dashflow-project-detail-actions {
    padding-top: 0!important;
  }
  .dashflow-project-detail-meta {
    grid-template-columns: repeat(2, minmax(0, 1fr))!important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashflow-widget.is-hero-action-target {
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

    /* Mark fresh Hero buttons synchronously. The older polish observer waits
     * 24ms before changing their text; this guard prevents that competing write. */
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
