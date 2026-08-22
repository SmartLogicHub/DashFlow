import { Notice } from "obsidian";
import { TimedConfirmation } from "../ui/timedConfirmation";
import type DashFlowPlugin from "../main";
import type { CustomDashboardTemplate, DashboardDefinition } from "../models";
import {
  nextDashboardId,
  normalizeDashboardName,
} from "../dashboard/dashboardCollection";
import {
  createCustomDashboardTemplate,
  instantiateCustomDashboardTemplate,
} from "../dashboard/customDashboardTemplates";
import {
  DASHBOARD_TEMPLATES,
  DEFAULT_DASHBOARD_TEMPLATE_ID,
  type DashboardTemplateId,
} from "../dashboard/dashboardTemplates";

const STYLE_ID = "dashflow-dashboard-switcher-styles";
const MODAL_CLASS = "dashflow-dashboard-manager-container";
const BUILTIN_PREFIX = "builtin:";
const CUSTOM_PREFIX = "custom:";

const SWITCHER_STYLES = `
.dashflow-dashboard-switcher{display:flex;align-items:center;gap:7px;margin:-12px 4px 24px;min-height:34px}
.dashflow-dashboard-switcher select{max-width:240px;min-width:130px;height:32px;font-size:11px;border-radius:8px}
.dashflow-dashboard-switcher button{appearance:none;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-muted);height:32px;min-width:32px;border-radius:8px;padding:0 9px;cursor:pointer;font-size:12px}
.dashflow-dashboard-switcher button:hover{background:var(--background-modifier-hover);color:var(--text-normal)}
.dashflow-dashboard-count{color:var(--text-faint);font-size:var(--df-type-label,11px);margin-left:2px}
.dashflow-dashboard-manager-container .modal{width:min(680px,calc(100vw - 28px));max-width:680px}
.dashflow-dashboard-manager-container .modal-content{padding-bottom:18px}
.dashflow-dashboard-template-section{margin-top:14px}
.dashflow-dashboard-template-section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 2px 8px;color:var(--text-muted);font-size:var(--df-type-label,11px);font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.dashflow-dashboard-template-section-title small{font-size:var(--df-type-label,11px);font-weight:500;letter-spacing:0;text-transform:none;color:var(--text-faint)}
.dashflow-dashboard-template-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0}
.dashflow-dashboard-template-card{appearance:none;border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);border-radius:12px;padding:11px 12px;text-align:left;cursor:pointer;min-height:88px;display:grid;grid-template-columns:30px minmax(0,1fr);gap:9px;align-items:start}
.dashflow-dashboard-template-card:hover{background:var(--background-modifier-hover)}
.dashflow-dashboard-template-card.is-selected{border-color:var(--interactive-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--interactive-accent) 45%,transparent);background:color-mix(in srgb,var(--interactive-accent) 7%,var(--background-secondary))}
.dashflow-dashboard-template-card.is-custom .dashflow-dashboard-template-icon{color:var(--interactive-accent)}
.dashflow-dashboard-template-icon{font-size:20px;line-height:1.1;text-align:center;padding-top:2px}
.dashflow-dashboard-template-copy strong{display:block;font-size:12px;margin-bottom:4px}
.dashflow-dashboard-template-copy small{display:block;color:var(--text-muted);font-size:var(--df-type-label,11px);line-height:1.45}
.dashflow-dashboard-template-meta{display:block;color:var(--text-faint);font-size:var(--df-type-label,11px);margin-top:5px}
.dashflow-dashboard-create-name{margin-top:16px}
.dashflow-dashboard-create-name label,.dashflow-dashboard-template-save-field label{display:block;font-size:var(--df-type-label,11px);color:var(--text-muted);margin-bottom:5px}
.dashflow-dashboard-create-name input,.dashflow-dashboard-template-save-field input,.dashflow-dashboard-template-save-field textarea{width:100%}
.dashflow-dashboard-template-save-field{margin:12px 0}
.dashflow-dashboard-template-save-field textarea{min-height:76px;resize:vertical}
.dashflow-dashboard-manager-list{display:flex;flex-direction:column;gap:6px;margin:16px 0}
.dashflow-dashboard-manager-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;border:1px solid var(--background-modifier-border);border-radius:10px;padding:7px 8px}
.dashflow-dashboard-manager-row.is-active{border-color:color-mix(in srgb,var(--interactive-accent) 50%,var(--background-modifier-border));background:color-mix(in srgb,var(--interactive-accent) 7%,transparent)}
.dashflow-dashboard-manager-row-main{appearance:none;border:0;background:transparent;color:var(--text-normal);text-align:left;padding:3px 5px;cursor:pointer;min-width:0}
.dashflow-dashboard-manager-row-main strong{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dashflow-dashboard-manager-row-main small{display:block;color:var(--text-faint);font-size:var(--df-type-label,11px);margin-top:3px}
.dashflow-dashboard-manager-row-badge{font-size:var(--df-type-label,11px);color:var(--interactive-accent);padding:3px 6px;border-radius:99px;background:color-mix(in srgb,var(--interactive-accent) 10%,transparent)}
.dashflow-dashboard-name-editor{display:flex;gap:8px;align-items:center;margin:14px 0 8px}
.dashflow-dashboard-name-editor input{flex:1;min-width:0}
.dashflow-dashboard-manager-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}
.dashflow-dashboard-manager-actions .is-danger,.dashflow-custom-template-delete{color:var(--text-error)}
.dashflow-dashboard-modal-note{color:var(--text-faint);font-size:var(--df-type-label,11px);line-height:1.5;margin-top:6px}
.dashflow-custom-template-list{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.dashflow-custom-template-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 9px;border:1px solid var(--background-modifier-border);border-radius:10px}
.dashflow-custom-template-row strong{display:block;font-size:11px}
.dashflow-custom-template-row small{display:block;margin-top:3px;color:var(--text-faint);font-size:var(--df-type-label,11px);line-height:1.4}
.dashflow-custom-template-row button{height:30px;white-space:nowrap}
@media(max-width:900px){.dashflow-dashboard-switcher{margin-top:-8px;margin-bottom:18px}.dashflow-dashboard-switcher select{flex:1;max-width:none}.dashflow-dashboard-count{display:none}.dashflow-dashboard-manager-row{grid-template-columns:minmax(0,1fr) auto}.dashflow-dashboard-template-grid{grid-template-columns:1fr}}
`;

export class DashboardSwitcherInteractionService {
  private unsubscribeRender: (() => void) | null = null;
  private readonly destructiveConfirmation = new TimedConfirmation();

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.ensureStyles();
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  openManager(): void {
    this.openManageModal();
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
    document.getElementById(STYLE_ID)?.remove();
    this.closeModal();
    for (const switcher of document.querySelectorAll(".dashflow-dashboard-switcher")) switcher.remove();
  }

  private decorate(root: HTMLElement): void {
    for (const shell of root.querySelectorAll<HTMLElement>(".dashflow-shell")) {
      this.decorateShell(shell);
    }
  }

  private decorateShell(shell: HTMLElement): void {
    const hero = shell.querySelector<HTMLElement>(".dashflow-hero");
    if (!hero) return;
    const workspace = shell.querySelector<HTMLElement>(".dashflow-command-workspace");
    let switcher = shell.querySelector<HTMLElement>(".dashflow-dashboard-switcher");
    if (!switcher) {
      switcher = document.createElement("div");
      switcher.className = "dashflow-dashboard-switcher";

      const select = document.createElement("select");
      select.setAttribute("aria-label", "切换工作台");
      select.addEventListener("change", async () => {
        await this.plugin.dashboardManager.setActiveDashboard(select.value);
      });

      const create = this.button("＋", "新建工作台");
      create.addEventListener("click", () => this.openCreateModal());
      const manage = this.button("•••", "管理工作台");
      manage.addEventListener("click", () => this.openManageModal());
      const count = document.createElement("span");
      count.className = "dashflow-dashboard-count";
      switcher.append(select, create, manage, count);
      if (workspace) workspace.appendChild(switcher);
      else hero.insertAdjacentElement("afterend", switcher);
    } else if (workspace && switcher.parentElement !== workspace) {
      workspace.appendChild(switcher);
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
    let selectedKey = `${BUILTIN_PREFIX}${DEFAULT_DASHBOARD_TEMPLATE_ID}`;

    const description = document.createElement("p");
    description.className = "setting-item-description";
    description.textContent = "选择内置模板或你自己保存的模板。模板只决定卡片与布局，不会复制或移动知识库里的任务、项目、习惯。";
    content.appendChild(description);

    const cards: HTMLButtonElement[] = [];
    const selectTemplate = (key: string): void => {
      selectedKey = key;
      for (const card of cards) {
        const selected = card.dataset.templateKey === key;
        card.classList.toggle("is-selected", selected);
        card.setAttribute("aria-pressed", selected ? "true" : "false");
      }
    };

    const builtInSection = this.templateSection("内置模板", "DashFlow 官方起始布局");
    for (const template of DASHBOARD_TEMPLATES) {
      const key = `${BUILTIN_PREFIX}${template.id}`;
      const card = this.templateCard(
        key,
        template.icon,
        template.name,
        template.description,
        `${template.widgetCount} 张卡片`,
        false,
        selectTemplate,
      );
      cards.push(card);
      builtInSection.grid.appendChild(card);
    }
    content.appendChild(builtInSection.section);

    const customTemplates = this.plugin.data.customTemplates;
    if (customTemplates.length > 0) {
      const customSection = this.templateSection("我的模板", `${customTemplates.length} 个已保存模板`);
      for (const template of customTemplates) {
        const key = `${CUSTOM_PREFIX}${template.id}`;
        const card = this.templateCard(
          key,
          template.icon || "✦",
          template.name,
          template.description || "从你的工作台保存的自定义模板。",
          `自定义 · ${template.dashboard.widgets.length} 张卡片`,
          true,
          selectTemplate,
        );
        cards.push(card);
        customSection.grid.appendChild(card);
      }
      content.appendChild(customSection.section);
    }
    selectTemplate(selectedKey);

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
      const fallbackName = this.templateNameForKey(selectedKey);
      const requestedName = input.value.trim() || fallbackName;
      const dashboard = selectedKey.startsWith(CUSTOM_PREFIX)
        ? await this.createFromCustomTemplate(selectedKey.slice(CUSTOM_PREFIX.length), requestedName)
        : await this.plugin.dashboardManager.createDashboard(
          requestedName,
          selectedKey.slice(BUILTIN_PREFIX.length) as DashboardTemplateId,
        );
      if (!dashboard) {
        new Notice("无法创建工作台，请检查模板或名称");
        input.focus();
        return;
      }
      close();
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
    });
    const saveTemplate = this.button("✦ 保存为模板", "把当前工作台保存为自定义模板");
    saveTemplate.addEventListener("click", () => {
      close();
      this.openSaveTemplateModal(active);
    });
    const remove = this.button("删除当前", "删除当前工作台");
    remove.classList.add("is-danger");
    remove.disabled = dashboards.length <= 1;
    remove.addEventListener("click", async () => {
      if (!this.destructiveConfirmation.request(`dashboard-remove:${active.id}`)) {
        remove.textContent = "再次点击确认删除";
        window.setTimeout(() => {
          if (remove.isConnected) {
            remove.textContent = "删除当前";
          }
        }, 3500);
        return;
      }
      if (await this.plugin.dashboardManager.deleteDashboard(active.id)) close();
    });
    actions.append(create, duplicate, saveTemplate, remove);
    content.appendChild(actions);

    const note = document.createElement("p");
    note.className = "dashflow-dashboard-modal-note";
    note.textContent = dashboards.length <= 1
      ? "至少保留一个工作台，所以当前不能删除。保存为模板只会记录工作台界面编排。"
      : "复制会产生独立工作台；保存为模板则把当前卡片、布局和手机状态保存为可重复使用的起始布局。";
    content.appendChild(note);

    if (this.plugin.data.customTemplates.length > 0) {
      const heading = document.createElement("h3");
      heading.textContent = "我的模板";
      const customList = document.createElement("div");
      customList.className = "dashflow-custom-template-list";
      for (const template of this.plugin.data.customTemplates) {
        customList.appendChild(this.customTemplateRow(template, close));
      }
      content.append(heading, customList);
    }

    this.plugin.dashboardTransfer.decorateManagerActions(container);
    document.body.appendChild(container);
  }

  private openSaveTemplateModal(dashboard: DashboardDefinition): void {
    this.closeModal();
    const { container, content, close } = this.modalFrame("保存为自定义模板");
    const note = document.createElement("p");
    note.className = "dashflow-dashboard-modal-note";
    note.textContent = "会保存当前卡片、配置、桌面布局和移动端状态。任务、项目、习惯、活跃度与知识库笔记内容不会进入模板。";

    const nameField = document.createElement("div");
    nameField.className = "dashflow-dashboard-template-save-field";
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "模板名称";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.maxLength = 48;
    nameInput.value = `${dashboard.name} 模板`;
    nameField.append(nameLabel, nameInput);

    const descriptionField = document.createElement("div");
    descriptionField.className = "dashflow-dashboard-template-save-field";
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "说明（可选）";
    const descriptionInput = document.createElement("textarea");
    descriptionInput.maxLength = 180;
    descriptionInput.placeholder = "例如：工作日早晨的专注工作台";
    descriptionField.append(descriptionLabel, descriptionInput);

    const buttons = document.createElement("div");
    buttons.className = "modal-button-container";
    const cancel = this.button("取消", "取消保存模板");
    cancel.addEventListener("click", close);
    const save = this.button("保存模板", "保存当前工作台为模板");
    save.classList.add("mod-cta");
    const submit = async (): Promise<void> => {
      const name = normalizeDashboardName(nameInput.value);
      if (!name) {
        new Notice("模板名称不能为空");
        nameInput.focus();
        return;
      }
      const template = createCustomDashboardTemplate(
        dashboard,
        name,
        descriptionInput.value,
        this.plugin.data.customTemplates,
      );
      this.plugin.data.customTemplates.push(template);
      await this.plugin.savePluginData();
      close();
      new Notice(`已保存模板：${template.name}`);
    };
    save.addEventListener("click", () => void submit());
    nameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void submit();
      }
    });
    buttons.append(cancel, save);
    content.append(note, nameField, descriptionField, buttons);
    document.body.appendChild(container);
    window.setTimeout(() => {
      nameInput.focus();
      nameInput.select();
    }, 0);
  }

  private async createFromCustomTemplate(
    templateId: string,
    name: string,
  ): Promise<DashboardDefinition | null> {
    const template = this.plugin.data.customTemplates.find((item) => item.id === templateId);
    if (!template) return null;
    const dashboards = this.plugin.dashboardManager.list();
    const normalizedName = normalizeDashboardName(name) || template.name;
    const dashboardId = nextDashboardId(normalizedName, dashboards.map((dashboard) => dashboard.id));
    const dashboard = instantiateCustomDashboardTemplate(template, dashboardId, normalizedName);
    await this.plugin.dashboardManager.updateDashboard(dashboard);
    await this.plugin.dashboardManager.setActiveDashboard(dashboard.id);
    return dashboard;
  }

  private customTemplateRow(template: CustomDashboardTemplate, close: () => void): HTMLElement {
    const row = document.createElement("div");
    row.className = "dashflow-custom-template-row";
    const copy = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = `${template.icon || "✦"} ${template.name}`;
    const meta = document.createElement("small");
    meta.textContent = `${template.dashboard.widgets.length} 张卡片${template.description ? ` · ${template.description}` : ""}`;
    copy.append(name, meta);

    const remove = this.button("删除模板", `删除模板 ${template.name}`);
    remove.classList.add("dashflow-custom-template-delete");
    remove.addEventListener("click", async () => {
      if (!this.destructiveConfirmation.request(`template-remove:${template.id}`)) {
        remove.textContent = "再次确认";
        window.setTimeout(() => {
          if (remove.isConnected) {
            remove.textContent = "删除模板";
          }
        }, 3000);
        return;
      }
      const index = this.plugin.data.customTemplates.findIndex((item) => item.id === template.id);
      if (index < 0) return;
      this.plugin.data.customTemplates.splice(index, 1);
      await this.plugin.savePluginData();
      close();
      new Notice(`已删除模板：${template.name}`);
      this.openManageModal();
    });
    row.append(copy, remove);
    return row;
  }

  private templateNameForKey(key: string): string {
    if (key.startsWith(CUSTOM_PREFIX)) {
      return this.plugin.data.customTemplates.find((template) => template.id === key.slice(CUSTOM_PREFIX.length))?.name
        ?? "自定义工作台";
    }
    return DASHBOARD_TEMPLATES.find((template) => template.id === key.slice(BUILTIN_PREFIX.length))?.name
      ?? "工作台";
  }

  private templateSection(title: string, meta: string): {
    section: HTMLElement;
    grid: HTMLElement;
  } {
    const section = document.createElement("section");
    section.className = "dashflow-dashboard-template-section";
    const heading = document.createElement("div");
    heading.className = "dashflow-dashboard-template-section-title";
    const label = document.createElement("span");
    label.textContent = title;
    const small = document.createElement("small");
    small.textContent = meta;
    heading.append(label, small);
    const grid = document.createElement("div");
    grid.className = "dashflow-dashboard-template-grid";
    section.append(heading, grid);
    return { section, grid };
  }

  private templateCard(
    key: string,
    iconText: string,
    nameText: string,
    descriptionText: string,
    metaText: string,
    custom: boolean,
    onSelect: (key: string) => void,
  ): HTMLButtonElement {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `dashflow-dashboard-template-card${custom ? " is-custom" : ""}`;
    card.dataset.templateKey = key;
    card.setAttribute("aria-pressed", "false");

    const icon = document.createElement("span");
    icon.className = "dashflow-dashboard-template-icon";
    icon.textContent = iconText;
    const copy = document.createElement("span");
    copy.className = "dashflow-dashboard-template-copy";
    const name = document.createElement("strong");
    name.textContent = nameText;
    const details = document.createElement("small");
    details.textContent = descriptionText;
    const meta = document.createElement("span");
    meta.className = "dashflow-dashboard-template-meta";
    meta.textContent = metaText;
    copy.append(name, details, meta);
    card.append(icon, copy);
    card.addEventListener("click", () => onSelect(key));
    return card;
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
