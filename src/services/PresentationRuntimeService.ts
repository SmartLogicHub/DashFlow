import { normalizePath, TFile, type EventRef } from "obsidian";
import type DashFlowPlugin from "../main";

/**
 * Small runtime bridge for presentation behavior that cannot be expressed in CSS.
 *
 * Keep this service event-driven. It deliberately avoids MutationObserver so the
 * design system does not rescan the whole Obsidian DOM after unrelated changes.
 */
export class PresentationRuntimeService {
  private layoutChangeRef: EventRef | null = null;
  private started = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    if (this.started) return;
    this.started = true;
    document.addEventListener("click", this.handleDocumentClick);
    this.layoutChangeRef = this.plugin.app.workspace.on("layout-change", this.syncAmbientImage);
    this.plugin.app.workspace.onLayoutReady(() => {
      if (this.started) this.syncAmbientImage();
    });
    this.syncAmbientImage();
  }

  stop(): void {
    if (!this.started) return;
    this.started = false;
    document.removeEventListener("click", this.handleDocumentClick);
    if (this.layoutChangeRef) this.plugin.app.workspace.offref(this.layoutChangeRef);
    this.layoutChangeRef = null;
  }

  private readonly handleDocumentClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const start = target.closest<HTMLButtonElement>(".dashflow-home-hero-actions > button:first-child");
    if (!start) return;
    window.setTimeout(() => this.focusTodayWidget(), 48);
  };

  private readonly syncAmbientImage = (): void => {
    const customImage = this.resolveLocalHeroImage();
    for (const view of document.querySelectorAll<HTMLElement>(".dashflow-view-container")) {
      if (customImage) view.style.setProperty("--df-ambient-image", `url(\"${customImage.replace(/\"/g, "%22")}\")`);
      else view.style.removeProperty("--df-ambient-image");
    }
  };

  private resolveLocalHeroImage(): string | null {
    const path = this.plugin.data.settings.homeHeroImagePath.trim();
    if (!path) return null;
    const file = this.plugin.app.vault.getAbstractFileByPath(normalizePath(path));
    return file instanceof TFile ? this.plugin.app.vault.getResourcePath(file) : null;
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
