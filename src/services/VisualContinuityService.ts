const STYLE_ID = "dashflow-visual-continuity-v042";

export const VISUAL_CONTINUITY_STYLES = `
/* v0.4.2 visual continuity — keep the Personal OS atmosphere across sections
 * without turning every working surface into another landing page. */

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

/* The older polish layer paints a very faint pseudo ambience. Replace it with
 * one deliberate compact scene ribbon so the theme is actually perceptible. */
.dashflow-command-shell:not(.is-personal-home)::before {
  display: none!important;
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
  display: flex!important;
  position: relative!important;
  isolation: isolate;
  height: 84px!important;
  min-height: 84px!important;
  margin: 0 0 10px!important;
  padding: 14px 18px!important;
  align-items: flex-end!important;
  justify-content: flex-start!important;
  overflow: hidden!important;
  border: 1px solid var(--df-cmd-border)!important;
  border-radius: 12px!important;
  color: #fff!important;
  background-color: #0f172a!important;
  background-image:
    linear-gradient(90deg, rgba(15, 23, 42, .68) 0%, rgba(15, 23, 42, .38) 48%, rgba(15, 23, 42, .14) 100%),
    var(--df-ambient-image, var(--df-home-scene))!important;
  background-size: cover!important;
  background-position: center 48%!important;
  box-shadow: none!important;
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
  background: linear-gradient(180deg, rgba(255,255,255,.035), rgba(0,0,0,.16));
}

.dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
  content: "DASHFLOW";
  position: relative;
  z-index: 1;
  color: rgba(255,255,255,.96);
  font-size: 14px;
  line-height: 1;
  font-weight: 760;
  letter-spacing: .025em;
  text-shadow: 0 1px 8px rgba(0,0,0,.30);
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

/* Let the navigation sit naturally beneath the scene instead of looking like
 * an unrelated white admin toolbar. */
.dashflow-command-shell:not(.is-personal-home) > .dashflow-command-bar {
  background: color-mix(in srgb, var(--df-cmd-surface) 92%, transparent)!important;
  backdrop-filter: blur(10px);
}

@media (max-width: 760px) {
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero {
    height: 68px!important;
    min-height: 68px!important;
    padding: 12px 14px!important;
    border-radius: 10px!important;
  }
  .dashflow-command-shell:not(.is-personal-home) > .dashflow-hero::after {
    font-size: 12.5px;
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
