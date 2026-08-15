import { ItemView, type WorkspaceLeaf } from "obsidian";
import type DashFlowPlugin from "../main";
import { VIEW_TYPE } from "../constants";
import { DashboardRenderer } from "./DashboardRenderer";

export class DashboardView extends ItemView {
  private renderer: DashboardRenderer | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly plugin: DashFlowPlugin,
  ) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "DashFlow";
  }

  getIcon(): string {
    return "layout-dashboard";
  }

  async onOpen(): Promise<void> {
    const container = this.containerEl.children[1];
    if (!(container instanceof HTMLElement)) return;
    container.innerHTML = "";
    container.classList.add("dashflow-view-container");
    this.renderer = new DashboardRenderer(this.plugin, container);
    this.renderer.render();
  }

  refresh(): void {
    this.renderer?.render();
  }

  async onClose(): Promise<void> {
    this.renderer?.destroy();
    this.renderer = null;
  }
}
