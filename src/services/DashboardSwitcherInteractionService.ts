import { Notice } from "obsidian";
import type DashFlowPlugin from "../main";
import type { DashboardDefinition } from "../models";
import {
  DASHBOARD_TEMPLATES,
  DEFAULT_DASHBOARD_TEMPLATE_ID,
  type DashboardTemplateId,
} from "../dashboard/dashboardTemplates";

const STYLE_ID = "dashflow-dashboard-switcher-styles";
const MODAL_CLASS = "dashflow-dashboard-manager-container";

const SWITCHER_STYLES = `
.dashflow-dashboard-switcher{display:flex;align-items:center;gap:7px;margin:-12px 4px 24px;min-height:34px}
.dashflow-dashboard-switcher select{max-width:240px;min-width:130px;height:32px;font-size:11px;border-radius:8px}
.dashflow-dashboard-switcher button{appearance:none;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-muted);height:32px;min-width:32px;border-radius:8px;padding:0 9px;cursor:pointer;font-size:12px}
.dashflow-dashboard-switcher button:hover{background:var(--background-modifier-hover);color:var(--text-normal)}
.dashflow-dashboard-count{color:var(--text-faint);font-size:10px;margin-left:2px}
.dashflow-dashboard-manager-container .modal{width:min(680px,calc(100vw - 28px));max-width:680px}
.dashflow-dashboard-manager-container .modal-content{padding-bottom:18px}
.dashflow-dashboard-template-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:14px 0}
.dashflow-dashboard-template-card{appearance:none;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);border-radius:12px;padding:11px 12px;text-align:left;cursor:pointer;min-height:88px;display:grid;grid-template-columns:30px minmax(0,1fr);gap:9px;align-items:start}
.dashflow-dashboard-template-card:hover{background:var(--background-modifier-hover)}
.dashflow-dashboard-template-card.is-selected{border-color:var(--interactive-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--interactive-accent) 45%,transparent);background:color-mix(in srgb,var(--interactive-accent) 7%,var(--background-secondary))}
.dashflow-dashboard-template-icon{font-size:20px;line-height:1.1;text-align:center;padding-top:2px}
.dashflow-dashboard-template-copy strong{display:block;font-size:12px;margin-bottom:4px}
.dashflow-dashboard-template-copy small{display:block;color:var(--text-muted);font-size:10px;line-height:1.45}
.dashflow-dashboard-template-meta{display:block;color:var(--text-faint);font-size:9px;margin-top:5px}
.dashflow-dashboard-create-name{margin-top:12px}
.dashflow-dashboard-create-name label{display:block;font-size:10px;color:var(--text-muted);margin-bottom:5px}
.dashflow-dashboard-create-name input{width:100%}
.dashflow-dashboard-manager-list{display:flex;flex-direction:column;gap:6px;margin:16px 0}
.dashflow-dashboard-manager-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid var(--background-modifier-border);border-radius:10px;padding:7px 8px}
.dashflow-dashboard-manager-row.is-active{border-color:color-mix(in srgb,var(--interactive-accent) 50%,var(--background-modifier-border));background:color-mix(in srgb,var(--interactive-accent) 7%,transparent)}
.dashflow-dashboard-manager-row-main{appearance:none;border:0;background:transparent;color:var(--text-normal);text-align:left;padding:3px 5px;cursor:pointer;min-width:0}
.dashflow-dashboard-manager-row-main strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dashflow-dashboard-manager-row-main small{display:block;color:var(--text-faint);font-size:9px;margin-top:3px}
.dashflow-dashboard-manager-row-badge{font-size:9px;color:var(--interactive-accent);padding:3px 6px;border-radius:99px;background:color-mix(in srgb,var(--interactive-accent) 10%,transparent)}
.dashflow-dashboard-name-editor{display:flex;gap:8px;align-items:center;margin:14px 0 8px}
.dashflow-dashboard-name-editor input{flex:1;min-width:0}
.dashflow-dashboard-manager-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}
.dashflow-dashboard-manager-actions .is-danger{color:var(--text-error)}
.dashflow-dashboard-modal-note{color:var(--text-faint);font-size:10px;line-height:1.5;margin-top:6px}
@media(max-width:900px){.dashflow-dashboard-switcher{margin-top:-8px;margin-bottom:18px}.dashflow-dashboard-switcher select{flex:1;max-width:none}.dashflow-dashboard-count{display:none}.dashflow-dashboard-manager-row{grid-template-columns:minmax(0,1fr) auto}.dashflow-dashboard-template-grid{grid-template-columns:1fr}}
`;

export class DashboardSwitcherInteractionService {
  private observer: MutationObserver | null = null;
  private scheduled = false;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(document.body, { childList: true, subtree: true });
    this.schedule();
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    document.getElementById(STYLE_ID)?.remove();
    this.closeModal();
    for (const switcher of document.querySelectorAll(".dashflow-dashboard-switcher")) switcher.remove();
  }

  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    window.setTimeout(() => {
      this.scheduled = false;
      this.decorate();
    }, 0);
  }

  private decorate(): void {
    for (const shell of document.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      this.decorateShell(shell);
    }
  }

  private decorateShell(shell: HTMLElement): void {
    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    if (!hero) return;
    let switcher = shell.querySelector<HTMLElement>(".dashflow-dashboard-switcher");
    if (!switcher) {
      switcher = document.createElement("div");
      switcher.className = "dashflow-dashboard-switcher";

      const select = document.createElement("select");
      select.setAttribute("aria-label", "切换工作台");
      select.addEventListener("change", async () => {
        if (await this.plugin.dashboardManager.setActiveDashboard(select.value)) {
          this.plugin.refreshDashboardViews();
          this.schedule();
        }
      });

      const create = this.button("＋", "新建工作台");
      create.addEventListener("click", () => this.openCreateModal());
      const manage = this.button("•••", "管理工作台");
      manage.addEventListener("click", () => this.openManageModal());
      const count = document.createElement("span");
      count.className = "dashflow-dashboard-count";
      switcher.append(select, create, manage, count);
      hero.insertAdjacentElement("afterend", switcher);
    }
    this.syncSwitcher(switcher);
  }

  private syncSwitcher(switcher: HTMLElement): void {
    const dashboards = this.plugin.dashboardManager.list();
    const active = this.plugin.dashboardManager.active();
    const select = switcher.querySelector<HTMLSelectElement>("select");
    const count = switcher.querySelector<HTMLElement>(".dashflow-dashboard-count");
    if (!select) return;
    const signature = dashboards.map((dashboard) => `${dashboard.id}:${dashboard.name}`).join("|");
    if (select.dataset.signature !== signature) {
      select.replaceChildren();
      for (const dashboard of dashboards) {
        const option = document.createElement("option");
        option.value = dashboard.id;
        option.textContent = dashboard.name;
        select.appendChild(option);
      }
      select.dataset.signature = signature;
    }
    if (select.value !== active.id) select.value = active.id;
    if (count) count.textContent = `${dashboards.length} 个工作台`;
  }

  private openCreateModal(): void {
    this.closeModal();
    const { container, content, close } = this.modalFrame("新建工作台");
    let selectedTemplateId: DashboardTemplateId = DEFAULT_DASHBOARD_TEMPLATE_ID;

    const description = document.createElement("p");
    description.className = "setting-item-description";
    description.textContent = "先选一个起始模板。模板只决定 Widget 与布局，不会复制或移动 Vault 里的 Task、Project、Habit。";
    content.appendChild(description);

    const templateGrid = document.createElement("div");
    templateGrid.className = "dashflow-dashboard-template-grid";
    const selectTemplate = (templateId: DashboardTemplateId): void => {
      selectedTemplateId = templateId;
      for (const card of templateGrid.querySelectorAll<HTMLButtonElement>("[data-template-id]")) {
        const selected = card.dataset.templateId === templateId;
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", selected ? "true" : "false");
      }
    };

    for (const template of DASHBOARD_TEMPLATES) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "dashflow-dashboard-template-card";
      card.dataset.templateId = template.id;
      card.setAttribute("aria-pressed", "false");

      const icon = document.createElement("span");
      icon.className = "dashflow-dashboard-template-icon";
      icon.textContent = template.icon;
      const copy = document.createElement("span");
      copy.className = "dashflow-dashboard-template-copy";
      const name = document.createElement("strong");
      name.textContent = template.name;
      const details = document.createElement("small");
      details.textContent = template.description;
      const meta = document.createElement("span");
      meta.className = "dashflow-dashboard-template-meta";
      meta.textContent = `${template.widgetCount} 张卡片`;
      copy.append(name, details, meta);
      card.append(icon, copy);
      card.addEventListener("click", () => selectTemplate(template.id));
      templateGrid.appendChild(card);
    }
    content.appendChild(templateGrid);
    selectTemplate(selectedTemplateId);

    const nameField = document.createElement("div");
    nameField.className = "dashflow-dashboard-create-name";
    const label = document.createElement("label");
    label.textContent = "工作台名称（可选）";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "留空则使用模板名称";
    input.maxLength = 48;
    nameField.append(label, input);
    content.appendChild(nameField);

    const buttons = document.createElement("div");
    buttons.className = "modal-button-container";
    const cancel = this.button("取消", "取消");
    cancel.addEventListener("click", close);
    const create = this.button("创建", "按模板创建工作台");
    create.classList.add("mod-cta");
    const submit = async (): Promise<void> => {
      const template = DASHBOARD_TEMPLATES.find((item) => item.id === selectedTemplateId)!;
      const dashboard = await this.plugin.dashboardManager.createDashboard(
        input.value.trim() || template.name,
        selectedTemplateId,
      );
      if (!dashboard) {
        new Notice("无法创建工作台，请检查名称");
        input.focus();
        return;
      }
      close();
      this.plugin.refreshDashboardViews();
      this.schedule();
    };
    create.addEventListener("click", () => void submit());
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void submit();
      }
    });
    buttons.append(cancel, create);
    content.appendChild(buttons);
    document.body.appendChild(container);
  }

  private openManageModal(): void {
    this.closeModal();
    const active = this.plugin.dashboardManager.active();
    const dashboards = this.plugin.dashboardManager.list();
    const { container, content, close } = this.modalFrame("管理工作台");

    const list = document.createElement("div");
    list.className = "dashflow-dashboard-manager-list";
    for (const dashboard of dashboards) {
      list.appendChild(this.dashboardRow(dashboard, active.id, close));
    }
    content.appendChild(list);

    const editorTitle = document.createElement("h3");
    editorTitle.textContent = `当前：${active.name}`;
    const editor = document.createElement("div");
    editor.className = "dashflow-dashboard-name-editor";
    const input = document.createElement("input");
    input.type = "text";
    input.value = active.name;
    input.maxLength = 48;
    const rename = this.button("保存名称", "重命名当前工作台");
    const saveName = async (): Promise<void> => {
      const ok = await this.plugin.dashboardManager.renameDashboard(active.id, input.value);
      if (!ok) {
        new Notice("工作台名称不能为空");
        input.focus();
        return;
      }
      close();
      this.plugin.refreshDashboardViews();
      this.schedule();
    };
    rename.addEventListener("click", () => void saveName());
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void saveName();
      }
    });
    editor.append(input, rename);
    content.append(editorTitle, editor);

    const actions = document.createElement("div");
    actions.className = "dashflow-dashboard-manager-actions";
    const create = this.button("＋ 新建", "从模板新建工作台");
    create.addEventListener("click", () => {
      close();
      this.openCreateModal();
    });
    const duplicate = this.button("复制当前", "复制当前工作台");
    duplicate.addEventListener("click", async () => {
      await this.plugin.dashboardManager.duplicateDashboard(active.id);
      close();
      this.plugin.refreshDashboardViews();
      this.schedule();
    });
    const remove = this.button("删除当前", "删除当前工作台");
    remove.classList.add("is-danger");
    remove.disabled = dashboards.length <= 1;
    remove.addEventListener("click", async () => {
      if (remove.dataset.confirm !== "true") {
        remove.dataset.confirm = "true";
        remove.textContent = "再次点击确认删除";
        window.setTimeout(() => {
          if (remove.isConnected) {
            remove.dataset.confirm = "false";
            remove.textContent = "删除当前";
          }
        }, 3500);
        return;
      }
      if (await this.plugin.dashboardManager.deleteDashboard(active.id)) {
        close();
        this.plugin.refreshDashboardViews();
        this.schedule();
      }
    });
    actions.append(create, duplicate, remove);
    content.appendChild(actions);

    const note = document.createElement("p");
    note.className = "dashflow-dashboard-modal-note";
    note.textContent = dashboards.length <= 1
      ? "至少保留一个工作台，所以当前不能删除。"
      : "复制会完整保留 Widget、桌面布局、手机排序、折叠状态和每张卡片的配置，但副本之后独立保存。";
    content.appendChild(note);
    document.body.appendChild(container);
  }

  private dashboardRow(
    dashboard: DashboardDefinition,
    activeId: string,
    close: () => void,
  ): HTMLElement {
    const row = document.createElement("div");
    row.className = `dashflow-dashboard-manager-row${dashboard.id === activeId ? " is-active" : ""}`;
    const main = document.createElement("button");
    main.type = "button";
    main.className = "dashflow-dashboard-manager-row-main";
    const name = document.createElement("strong");
    name.textContent = dashboard.name;
    const meta = document.createElement("small");
    meta.textContent = `${dashboard.widgets.filter((widget) => !widget.hidden).length} 张可见卡片`;
    main.append(name, meta);
    main.addEventListener("click", async () => {
      if (dashboard.id !== activeId) await this.plugin.dashboardManager.setActiveDashboard(dashboard.id);
      close();
      this.plugin.refreshDashboardViews();
      this.schedule();
    });
    row.appendChild(main);
    const badge = document.createElement("span");
    badge.className = "dashflow-dashboard-manager-row-badge";
    badge.textContent = dashboard.id === activeId ? "当前" : "打开";
    row.appendChild(badge);
    return row;
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

  private button(text: string, title: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.title = title;
    return button;
  }

  private closeModal(): void {
    for (const modal of document.querySelectorAll(`.${MODAL_CLASS}`)) modal.remove();
  }

  private ensureStyles(): void {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = SWITCHER_STYLES;
    document.head.appendChild(style);
  }
}
