import { Notice } from "obsidian";
import type DashFlowPlugin from "../main";
import { PLUGIN_VERSION } from "../constants";
import {
  cloneDashboardDefinition,
  nextDashboardId,
  nextDuplicateDashboardName,
  normalizeDashboardName,
} from "../dashboard/dashboardCollection";
import {
  DashboardTransferError,
  parseDashboardTransferJson,
  serializeDashboardTransfer,
  unsupportedDashboardWidgetTypes,
} from "../dashboard/dashboardTransfer";

const STYLE_ID = "dashflow-dashboard-transfer-styles";
const MODAL_CLASS = "dashflow-dashboard-transfer-container";
const MANAGER_CLASS = "dashflow-dashboard-manager-container";

const TRANSFER_STYLES = `
.dashflow-dashboard-transfer-container .modal{width:min(720px,calc(100vw - 28px));max-width:720px}
.dashflow-dashboard-transfer-container .modal-content{padding-bottom:18px}
.dashflow-dashboard-transfer-container textarea{width:100%;min-height:300px;resize:vertical;font-family:var(--font-monospace);font-size:var(--df-type-label,11px);line-height:1.5;tab-size:2}
.dashflow-dashboard-transfer-field{margin:12px 0}
.dashflow-dashboard-transfer-field label{display:block;font-size:var(--df-type-label,11px);color:var(--text-muted);margin-bottom:5px}
.dashflow-dashboard-transfer-field input[type="text"]{width:100%}
.dashflow-dashboard-transfer-file{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0}
.dashflow-dashboard-transfer-file input[type="file"]{max-width:100%;font-size:var(--df-type-label,11px);color:var(--text-muted)}
.dashflow-dashboard-transfer-status{min-height:18px;margin:8px 0 0;font-size:var(--df-type-label,11px);line-height:1.45;color:var(--text-muted)}
.dashflow-dashboard-transfer-status.is-error{color:var(--text-error)}
.dashflow-dashboard-transfer-note{font-size:var(--df-type-label,11px);line-height:1.5;color:var(--text-faint);margin:8px 0 12px}
.dashflow-dashboard-transfer-actions{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:12px}
.dashflow-dashboard-transfer-injected{white-space:nowrap}
@media(max-width:900px){.dashflow-dashboard-transfer-container textarea{min-height:240px}.dashflow-dashboard-transfer-actions{justify-content:stretch}.dashflow-dashboard-transfer-actions button{flex:1}}
`;

export class DashboardTransferInteractionService {
  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
  }

  stop(): void {
    document.getElementById(STYLE_ID)?.remove();
    this.closeModal();
    for (const button of document.querySelectorAll(".dashflow-dashboard-transfer-injected")) button.remove();
  }

  openExportModal(): void {
    this.closeManagerModal();
    this.closeModal();
    const dashboard = this.plugin.dashboardManager.active();
    let json = "";
    try {
      json = serializeDashboardTransfer(dashboard, PLUGIN_VERSION);
    } catch {
      new Notice("无法导出当前工作台");
      return;
    }

    const { container, content, close } = this.modalFrame(`导出工作台 · ${dashboard.name}`);
    const note = document.createElement("p");
    note.className = "dashflow-dashboard-transfer-note";
    note.textContent = "导出内容只包含卡片、配置、桌面布局和移动端界面状态，不包含任务、项目、习惯、活跃度或知识库笔记内容。";

    const textarea = document.createElement("textarea");
    textarea.value = json;
    textarea.readOnly = true;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "工作台 JSON");

    const actions = document.createElement("div");
    actions.className = "dashflow-dashboard-transfer-actions";
    const closeButton = this.button("关闭", "关闭导出窗口");
    closeButton.addEventListener("click", close);
    const download = this.button("下载 .json", "下载工作台 JSON 文件");
    download.addEventListener("click", () => this.downloadJson(dashboard.name, json));
    const copy = this.button("复制 JSON", "复制工作台 JSON");
    copy.classList.add("mod-cta");
    copy.addEventListener("click", async () => {
      const ok = await this.copyText(json, textarea);
      new Notice(ok ? "工作台 JSON 已复制" : "复制失败，请手动复制文本框内容");
    });
    actions.append(closeButton, download, copy);
    content.append(note, textarea, actions);
    document.body.appendChild(container);
    window.setTimeout(() => textarea.focus(), 0);
  }

  openImportModal(): void {
    this.closeManagerModal();
    this.closeModal();
    const { container, content, close } = this.modalFrame("导入工作台");

    const note = document.createElement("p");
    note.className = "dashflow-dashboard-transfer-note";
    note.textContent = "粘贴 DashFlow 工作台 JSON，或读取之前导出的 .json 文件。导入会创建一个新的工作台，不会覆盖现有工作台或修改知识库业务数据。";

    const fileRow = document.createElement("div");
    fileRow.className = "dashflow-dashboard-transfer-file";
    const fileLabel = document.createElement("span");
    fileLabel.textContent = "JSON 文件：";
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json,application/json";
    fileRow.append(fileLabel, fileInput);

    const textarea = document.createElement("textarea");
    textarea.placeholder = "在这里粘贴 DashFlow 工作台 JSON…";
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "待导入工作台 JSON");

    const nameField = document.createElement("div");
    nameField.className = "dashflow-dashboard-transfer-field";
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "导入后的工作台名称（可选）";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.maxLength = 48;
    nameInput.placeholder = "留空则沿用导出时的名称";
    nameField.append(nameLabel, nameInput);

    const status = document.createElement("p");
    status.className = "dashflow-dashboard-transfer-status";

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        textarea.value = await file.text();
        status.classList.remove("is-error");
        status.textContent = `已读取 ${file.name}`;
      } catch {
        status.classList.add("is-error");
        status.textContent = "无法读取这个 JSON 文件";
      }
    });

    const actions = document.createElement("div");
    actions.className = "dashflow-dashboard-transfer-actions";
    const cancel = this.button("取消", "取消导入");
    cancel.addEventListener("click", close);
    const submit = this.button("导入为新工作台", "导入工作台 JSON");
    submit.classList.add("mod-cta");
    submit.addEventListener("click", () => void this.importJson(
      textarea.value,
      nameInput.value,
      status,
      close,
    ));
    actions.append(cancel, submit);
    content.append(note, fileRow, textarea, nameField, status, actions);
    document.body.appendChild(container);
    window.setTimeout(() => textarea.focus(), 0);
  }

  private async importJson(
    text: string,
    nameOverride: string,
    status: HTMLElement,
    close: () => void,
  ): Promise<void> {
    try {
      const source = parseDashboardTransferJson(text);
      const unsupported = unsupportedDashboardWidgetTypes(
        source,
        this.plugin.widgetRegistry.list().map((definition) => definition.type),
      );
      if (unsupported.length > 0) {
        throw new DashboardTransferError(`当前 DashFlow 不支持这些卡片：${unsupported.join(", ")}`);
      }

      const existing = this.plugin.dashboardManager.list();
      const override = normalizeDashboardName(nameOverride);
      let name = override || source.name;
      if (!override && existing.some((dashboard) => dashboard.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        name = nextDuplicateDashboardName(name, existing.map((dashboard) => dashboard.name));
      }
      const id = nextDashboardId(name, existing.map((dashboard) => dashboard.id));
      const dashboard = cloneDashboardDefinition(source, id, name);
      await this.plugin.dashboardManager.updateDashboard(dashboard);
      await this.plugin.dashboardManager.setActiveDashboard(dashboard.id);

      close();
      this.plugin.refreshDashboardViews();
      new Notice(`已导入工作台：${dashboard.name}`);
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = error instanceof DashboardTransferError
        ? error.message
        : "导入失败，请检查 JSON 内容";
    }
  }

  decorateManagerActions(root: ParentNode): void {
    for (const actions of root.querySelectorAll<HTMLElement>(".dashflow-dashboard-manager-actions")) {
      if (actions.dataset.dashboardTransfer === "true") continue;
      actions.dataset.dashboardTransfer = "true";
      const exportButton = this.button("导出当前", "导出当前工作台 JSON");
      exportButton.classList.add("dashflow-dashboard-transfer-injected");
      exportButton.addEventListener("click", () => this.openExportModal());
      const importButton = this.button("导入 JSON", "导入工作台 JSON");
      importButton.classList.add("dashflow-dashboard-transfer-injected");
      importButton.addEventListener("click", () => this.openImportModal());
      const danger = actions.querySelector<HTMLElement>(".is-danger");
      actions.insertBefore(exportButton, danger);
      actions.insertBefore(importButton, danger);
    }
  }

  private modalFrame(title: string): {
    container: HTMLElement;
    content: HTMLElement;
    close: () => void;
  } {
    const container = document.createElement("div");
    container.className = `modal-container mod-dim ${MODAL_CLASS}`;
    const backdrop = document.createElement("div");
    backdrop.className = "modal-bg";
    const modal = document.createElement("div");
    modal.className = "modal";
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "modal-close-button";
    closeButton.textContent = "×";
    closeButton.setAttribute("aria-label", "关闭");
    const content = document.createElement("div");
    content.className = "modal-content";
    const heading = document.createElement("h2");
    heading.textContent = title;
    content.appendChild(heading);
    const close = (): void => container.remove();
    backdrop.addEventListener("click", close);
    closeButton.addEventListener("click", close);
    container.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
    container.tabIndex = -1;
    modal.append(closeButton, content);
    container.append(backdrop, modal);
    return { container, content, close };
  }

  private async copyText(text: string, textarea: HTMLTextAreaElement): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        textarea.focus();
        textarea.select();
        return document.execCommand("copy");
      } catch {
        return false;
      }
    }
  }

  private downloadJson(name: string, json: string): void {
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `dashflow-${this.filePart(name)}.json`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private filePart(value: string): string {
    const normalized = value.trim().toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    return normalized || "dashboard";
  }

  private button(text: string, title: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.title = title;
    return button;
  }

  private closeManagerModal(): void {
    for (const modal of document.querySelectorAll(`.${MANAGER_CLASS}`)) modal.remove();
  }

  private closeModal(): void {
    for (const modal of document.querySelectorAll(`.${MODAL_CLASS}`)) modal.remove();
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = TRANSFER_STYLES;
    document.head.appendChild(style);
  }
}
