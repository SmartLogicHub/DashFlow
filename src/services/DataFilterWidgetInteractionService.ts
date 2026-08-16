import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type {
  DataFilterDateRange,
  DataFilterEntity,
  DataFilterSort,
  DataFilterState,
  DataFilterTaskStatus,
  DataFilterWidgetConfig,
  WidgetInstance,
} from "../models";
import {
  DEFAULT_DATA_FILTER_CONFIG,
  normalizeDataFilterConfig,
  type DataFilterMatch,
} from "../filter/dataFilter";
import { HabitEditorModal } from "../ui/HabitEditorModal";
import { ProjectDetailModal } from "../ui/ProjectDetailModal";
import { TaskEditorModal } from "../ui/TaskEditorModal";
import { localDate } from "../utils/date";

const ENTITY_OPTIONS: Array<[DataFilterEntity, string]> = [
  ["all", "全部"], ["note", "笔记"], ["task", "任务"], ["project", "项目"], ["habit", "习惯"],
];
const STATE_OPTIONS: Array<[DataFilterState, string]> = [
  ["active", "进行中"], ["completed", "已完成"], ["all", "全部状态"],
];
const DATE_OPTIONS: Array<[DataFilterDateRange, string]> = [
  ["all", "全部日期"], ["overdue", "早于今天"], ["today", "今天"], ["next7", "未来 7 天"], ["next30", "未来 30 天"], ["none", "无日期"],
];
const SORT_OPTIONS: Array<[DataFilterSort, string]> = [
  ["date", "按日期"], ["name", "按名称"], ["type", "按类型"],
];
const NOTE_TASK_OPTIONS: Array<[DataFilterTaskStatus, string]> = [
  ["all", "笔记任务：全部"], ["has-tasks", "含任务"], ["pending", "有未完成任务"], ["completed", "任务已清空"], ["none", "无任务"],
];

export class DataFilterWidgetInteractionService {
  private unsubscribeRender: (() => void) | null = null;

  constructor(private readonly plugin: DashFlowPlugin) {}

  start(): void {
    this.unsubscribeRender = this.plugin.dashboardRender.subscribe(({ root }) => this.decorate(root));
    this.plugin.dashboardRender.forEachRoot((root) => this.decorate(root));
  }

  stop(): void {
    this.unsubscribeRender?.();
    this.unsubscribeRender = null;
  }

  private decorate(root: HTMLElement): void {
    const dashboard = this.plugin.dashboardManager.active();
    const widgets = new Map(dashboard.widgets.map((widget) => [widget.id, widget]));
    const revision = this.plugin.vaultIndex.getSnapshot().revision;
    for (const card of root.querySelectorAll<HTMLElement>(".dashflow-widget[data-widget-id]")) {
      const id = card.dataset.widgetId;
      const widget = id ? widgets.get(id) : undefined;
      if (!widget || widget.type !== "data-filter") continue;
      const body = card.querySelector<HTMLElement>(".dashflow-widget-body");
      if (!body) continue;
      const signature = `${widget.id}:${revision}:${JSON.stringify(widget.config)}`;
      if (body.dataset.dashflowDataFilter === signature) continue;
      body.dataset.dashflowDataFilter = signature;
      this.render(body, dashboard.id, widget);
    }
  }

  private render(body: HTMLElement, dashboardId: string, widget: WidgetInstance): void {
    body.replaceChildren();
    const config = normalizeDataFilterConfig(widget.config as Partial<DataFilterWidgetConfig>);
    const root = document.createElement("div");
    root.className = "dashflow-data-filter";

    const entityGroup = this.segmented("实体", ENTITY_OPTIONS, config.entity, (value) => {
      void this.persist(dashboardId, widget.id, { entity: value });
    });
    const stateGroup = this.segmented("状态", STATE_OPTIONS, config.state, (value) => {
      void this.persist(dashboardId, widget.id, { state: value });
    });

    const toolbar = document.createElement("div");
    toolbar.className = "dashflow-data-filter-toolbar";
    const dateSelect = this.select(DATE_OPTIONS, config.dateRange, "日期范围");
    const sortSelect = this.select(SORT_OPTIONS, config.sort, "排序方式");
    dateSelect.addEventListener("change", () => void this.persist(dashboardId, widget.id, { dateRange: dateSelect.value as DataFilterDateRange }));
    sortSelect.addEventListener("change", () => void this.persist(dashboardId, widget.id, { sort: sortSelect.value as DataFilterSort }));
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "dashflow-data-filter-reset";
    reset.title = "重置筛选";
    reset.setAttribute("aria-label", "重置筛选");
    setIcon(reset, "rotate-ccw");
    reset.addEventListener("click", () => void this.replaceConfig(dashboardId, widget.id, DEFAULT_DATA_FILTER_CONFIG));
    toolbar.append(dateSelect, sortSelect, reset);

    const search = document.createElement("div");
    search.className = "dashflow-data-filter-search";
    const query = this.input("search", config.query, "关键词：名称、路径、项目…", "筛选关键词");
    const tag = this.input("text", config.tag, "标签，例如 #ai", "筛选标签");
    search.append(query, tag);

    const advanced = document.createElement("div");
    advanced.className = "dashflow-data-filter-advanced";
    const folder = this.input("text", config.folder, "文件夹，例如 Projects", "筛选文件夹");
    const frontmatter = this.input("text", config.frontmatter, "属性，例如 status=active", "筛选 frontmatter");
    const noteTaskStatus = this.select(NOTE_TASK_OPTIONS, config.noteTaskStatus, "笔记任务状态");
    noteTaskStatus.addEventListener("change", () => void this.persist(dashboardId, widget.id, { noteTaskStatus: noteTaskStatus.value as DataFilterTaskStatus }));
    advanced.append(folder, frontmatter, noteTaskStatus);

    const summary = document.createElement("div");
    summary.className = "dashflow-data-filter-summary";
    const results = document.createElement("div");
    results.className = "dashflow-data-filter-results";

    const renderPreview = (): void => {
      const preview = this.plugin.vaultQuery.filterData({
        ...config,
        query: query.value,
        tag: tag.value,
        folder: folder.value,
        frontmatter: frontmatter.value,
        noteTaskStatus: noteTaskStatus.value as DataFilterTaskStatus,
        dateRange: dateSelect.value as DataFilterDateRange,
        sort: sortSelect.value as DataFilterSort,
      }, localDate());
      summary.textContent = `${preview.total} 条 · 笔记 ${preview.counts.note} · 任务 ${preview.counts.task} · 项目 ${preview.counts.project} · 习惯 ${preview.counts.habit}`;
      results.replaceChildren();
      if (preview.items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "dashflow-data-filter-empty";
        empty.textContent = "没有匹配的数据。调整条件后结果会即时更新。";
        results.appendChild(empty);
        return;
      }
      for (const match of preview.items) results.appendChild(this.resultRow(match));
      if (preview.total > preview.items.length) {
        const more = document.createElement("div");
        more.className = "dashflow-data-filter-more";
        more.textContent = `另有 ${preview.total - preview.items.length} 条未显示，可在卡片配置中调整结果上限。`;
        results.appendChild(more);
      }
    };

    for (const input of [query, tag, folder, frontmatter]) input.addEventListener("input", renderPreview);
    query.addEventListener("change", () => void this.persist(dashboardId, widget.id, { query: query.value }));
    tag.addEventListener("change", () => void this.persist(dashboardId, widget.id, { tag: tag.value }));
    folder.addEventListener("change", () => void this.persist(dashboardId, widget.id, { folder: folder.value }));
    frontmatter.addEventListener("change", () => void this.persist(dashboardId, widget.id, { frontmatter: frontmatter.value }));
    noteTaskStatus.addEventListener("change", renderPreview);
    for (const input of [query, tag, folder, frontmatter]) {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") input.blur();
      });
    }

    root.append(entityGroup, stateGroup, toolbar, search, advanced, summary, results);
    body.appendChild(root);
    renderPreview();
  }

  private input(type: "text" | "search", value: string, placeholder: string, ariaLabel: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.setAttribute("aria-label", ariaLabel);
    return input;
  }

  private segmented<T extends string>(
    labelText: string,
    options: Array<[T, string]>,
    selected: T,
    onChange: (value: T) => void,
  ): HTMLElement {
    const row = document.createElement("div");
    row.className = "dashflow-data-filter-segmented";
    const label = document.createElement("span");
    label.className = "dashflow-data-filter-label";
    label.textContent = labelText;
    const group = document.createElement("div");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", labelText);
    for (const [value, text] of options) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.value = value;
      button.textContent = text;
      button.classList.toggle("is-active", value === selected);
      button.setAttribute("aria-pressed", value === selected ? "true" : "false");
      button.addEventListener("click", () => onChange(value));
      group.appendChild(button);
    }
    row.append(label, group);
    return row;
  }

  private select<T extends string>(options: Array<[T, string]>, selected: T, ariaLabel: string): HTMLSelectElement {
    const select = document.createElement("select");
    select.setAttribute("aria-label", ariaLabel);
    for (const [value, text] of options) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      option.selected = value === selected;
      select.appendChild(option);
    }
    return select;
  }

  private resultRow(match: DataFilterMatch): HTMLButtonElement {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `dashflow-data-filter-result is-${match.kind}`;
    const icon = document.createElement("span");
    icon.className = "dashflow-data-filter-result-icon";
    setIcon(icon, match.kind === "note" ? "file-text" : match.kind === "task" ? "circle-check-big" : match.kind === "project" ? "folder-kanban" : "repeat-2");
    const copy = document.createElement("span");
    copy.className = "dashflow-data-filter-result-copy";
    const title = document.createElement("strong");
    title.textContent = match.title;
    const meta = document.createElement("small");
    meta.textContent = match.meta || (match.kind === "note" ? "笔记" : match.kind === "task" ? "任务" : match.kind === "project" ? "项目" : "习惯");
    copy.append(title, meta);
    const kind = document.createElement("span");
    kind.className = "dashflow-data-filter-result-kind";
    kind.textContent = match.kind.toUpperCase();
    row.append(icon, copy, kind);
    row.addEventListener("click", () => {
      if (match.kind === "note") void this.plugin.app.workspace.openLinkText(match.item.path, "", false);
      else if (match.kind === "task") new TaskEditorModal(this.plugin, match.item).open();
      else if (match.kind === "project") new ProjectDetailModal(this.plugin, match.item.id).open();
      else new HabitEditorModal(this.plugin, match.item).open();
    });
    return row;
  }

  private async persist(
    dashboardId: string,
    widgetId: string,
    patch: Partial<DataFilterWidgetConfig>,
  ): Promise<void> {
    await this.plugin.dashboardManager.updateWidget(dashboardId, widgetId, (widget) => ({
      ...widget,
      config: normalizeDataFilterConfig({ ...(widget.config as Partial<DataFilterWidgetConfig>), ...patch }),
    }));
  }

  private async replaceConfig(
    dashboardId: string,
    widgetId: string,
    config: DataFilterWidgetConfig,
  ): Promise<void> {
    await this.plugin.dashboardManager.updateWidget(dashboardId, widgetId, (widget) => ({
      ...widget,
      config: { ...config },
    }));
  }
}
