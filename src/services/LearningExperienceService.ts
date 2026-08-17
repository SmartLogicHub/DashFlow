import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import { LearningWorkspace } from "../learning/LearningWorkspace";

/**
 * Learning is a first-class product workspace, not a Widget collection.
 *
 * ProductExperience still owns the shared shell / primary navigation. This
 * service mounts one additional primary destination after Work and renders the
 * Learning Workspace into the existing DashFlow root. It subscribes to the
 * explicit DashboardRender lifecycle and never observes document.body.
 */
export class LearningExperienceService {
  private unsubscribeRender: (() => void) | null = null;
  private active = false;
  private readonly workspace: LearningWorkspace;

  constructor(private readonly plugin: DashFlowPlugin) {
    this.workspace = new LearningWorkspace(plugin);
  }

  start(): void {
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorateRoot(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorateRoot(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
  }

  open(): void {
    this.active = true;
    // Normalize the shared shell to a non-Home section first. Learning then
    // owns only the page content and active nav state, not another shell.
    this.plugin.productExperience.openSection("work");
    this.plugin.dashboardRender.forEachRoot((root) => this.decorateRoot(root, true));
  }

  close(): void {
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  private decorateRoot(root: HTMLElement, force = false): void {
    for (const shell of root.querySelectorAll<HTMLElement>(".dashflow-command-shell")) {
      this.ensureNavigation(shell);
      if (this.active) this.renderWorkspace(shell, force);
    }
  }

  private ensureNavigation(shell: HTMLElement): void {
    const nav = shell.querySelector<HTMLElement>(".dashflow-command-nav");
    if (!nav) return;

    if (nav.dataset.learningNavigation !== "1") {
      nav.dataset.learningNavigation = "1";
      nav.addEventListener("click", (event) => {
        const target = event.target instanceof Element
          ? event.target.closest<HTMLButtonElement>(".dashflow-command-button[data-section]")
          : null;
        if (!target || target.dataset.section === "learning") return;
        this.active = false;
      }, { capture: true });
    }

    let button = nav.querySelector<HTMLButtonElement>('.dashflow-command-button[data-section="learning"]');
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "dashflow-command-button";
      button.dataset.section = "learning";
      button.title = "学习";

      const icon = document.createElement("span");
      icon.className = "dashflow-command-icon";
      setIcon(icon, "graduation-cap");
      const label = document.createElement("span");
      label.className = "dashflow-command-label";
      label.textContent = "学习";
      button.append(icon, label);
      button.addEventListener("click", () => this.open());

      const work = nav.querySelector<HTMLButtonElement>('.dashflow-command-button[data-section="work"]');
      if (work?.nextSibling) nav.insertBefore(button, work.nextSibling);
      else if (work) nav.appendChild(button);
      else nav.prepend(button);
    }

    this.syncNavigation(nav, button);
  }

  private syncNavigation(nav: HTMLElement, learningButton: HTMLButtonElement): void {
    if (!this.active) {
      learningButton.classList.remove("is-active");
      learningButton.removeAttribute("aria-current");
      return;
    }

    for (const button of nav.querySelectorAll<HTMLButtonElement>(".dashflow-command-button[data-section]")) {
      const isLearning = button === learningButton;
      button.classList.toggle("is-active", isLearning);
      if (isLearning) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  }

  private renderWorkspace(shell: HTMLElement, force: boolean): void {
    if (shell.classList.contains("is-layout-editing")) return;
    const grid = shell.querySelector<HTMLElement>(".dashflow-grid");
    const nav = shell.querySelector<HTMLElement>(".dashflow-command-nav");
    const learningButton = nav?.querySelector<HTMLButtonElement>('.dashflow-command-button[data-section="learning"]');
    if (!grid || !nav || !learningButton) return;

    this.syncNavigation(nav, learningButton);
    grid.dataset.productSection = "learning";
    grid.style.setProperty("display", "block", "important");

    for (const card of grid.querySelectorAll<HTMLElement>(":scope > .dashflow-widget")) {
      card.style.setProperty("display", "none", "important");
    }
    for (const page of grid.querySelectorAll(
      ":scope > .dashflow-command-page, :scope > .dashflow-personal-home",
    )) page.remove();

    const current = grid.querySelector<HTMLElement>(":scope > .dashflow-learning-page");
    if (!current || force) {
      current?.remove();
      grid.appendChild(this.workspace.render());
    }
  }
}
