import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DASHBOARD_TEMPLATES } from "../src/dashboard/dashboardTemplates";
import { FEATURE_CATALOG } from "../src/product/featureCatalog";
import { WidgetRegistry } from "../src/widgets/WidgetRegistry";
import { registerBuiltins } from "../src/widgets/builtins";
import { registerDataWidgets } from "../src/widgets/data";
import { registerEmbedWidgets } from "../src/widgets/embed";
import { registerFocusWidgets } from "../src/widgets/focus";

function productRegistry(): WidgetRegistry {
  const registry = new WidgetRegistry();
  registerBuiltins(registry);
  registerDataWidgets(registry);
  registerEmbedWidgets(registry);
  registerFocusWidgets(registry);
  return registry;
}

test("built-in cards and starting layouts use Chinese product names", () => {
  const registry = productRegistry();
  assert.equal(registry.get("vault-stats")?.name, "知识库概览");
  assert.equal(registry.get("data-filter")?.name, "数据筛选");
  assert.equal(registry.get("magic-embed")?.name, "网页嵌入");
  assert.equal(registry.get("focus")?.name, "专注计时");
  assert.equal(registry.get("weekly-review")?.name, "每周复盘");
  assert.deepEqual(
    DASHBOARD_TEMPLATES.map((template) => template.name),
    ["今日专注", "项目管理", "习惯追踪", "每周复盘", "极简模式"],
  );
});

test("feature discovery uses the same Chinese names as the card registry", () => {
  const registry = productRegistry();
  for (const type of ["vault-stats", "data-filter", "magic-embed", "focus"]) {
    const feature = FEATURE_CATALOG.find((item) => item.widgetType === type);
    assert.equal(feature?.name, registry.get(type)?.name, type);
  }
});

test("primary product surfaces no longer render legacy English presentation labels", () => {
  const sources = [
    "src/dashboard/DashboardRenderer.ts",
    "src/services/ProductExperienceService.ts",
    "src/services/ActivityWidgetInteractionService.ts",
    "src/services/AINewsWidgetInteractionService.ts",
    "src/services/DataFilterWidgetInteractionService.ts",
    "src/services/FocusWidgetInteractionService.ts",
    "src/services/PersonalHomeService.ts",
    "src/services/HabitWidgetInteractionService.ts",
    "src/services/WeeklyReviewWidgetInteractionService.ts",
    "src/widgets/builtins.ts",
    "src/ui/AIPlanModal.ts",
    "src/ui/CaptureDestinationModal.ts",
    "src/ui/DailyProgressNoteModal.ts",
    "src/ui/FeatureHubModal.ts",
    "src/ui/HabitEditorModal.ts",
    "src/ui/OnboardingModal.ts",
    "src/ui/OpportunityEditModal.ts",
    "src/ui/ProjectDetailModal.ts",
    "src/ui/ProjectEditorModal.ts",
    "src/ui/QuickAddModal.ts",
    "src/ui/TaskEditorModal.ts",
    "src/ui/WorkflowSettingsModal.ts",
  ].map((path) => readFileSync(path, "utf8")).join("\n");

  for (const copy of [
    "我的工作台", "知识库概览", "笔记", "待办", "项目", "已完成", "已逾期",
    "今日任务", "未来 ${days} 天", "今年结束", "天", "活跃天数", "任务完成", "习惯打卡",
    "连续天数", "较少", "较多", "实时", "微信读书", "功能中心", "初次使用",
    "快速捕捉", "每日规划", "工作流",
  ]) assert.ok(sources.includes(copy), `missing Chinese product copy: ${copy}`);

  for (const legacy of [
    "MY DASHBOARD", "VAULT PULSE", "NOTES", "PENDING", "PROJECTS", "OVERDUE",
    "NEXT 7 DAYS", "YEAR END", "ACTIVE DAYS", "TASKS DONE", "HABIT CHECKS", "DAY STREAK",
    "tracking since", "LESS", "MORE", "LIVE", "WEREAD", "FEATURE HUB", "FIRST RUN",
    "INBOX · PROCESS QUEUE", "DAILY PROGRESS", "WEEKDAYS", "OPPORTUNITY · EDIT",
    "PROJECT · EDIT", "PROJECT · NEW", "TASK · EDIT", "TASK · NEW", "LONG TERM · EDIT",
    "LONG TERM · NEW",
    "QUICK CAPTURE", "AI · DAILY PLAN", "WORKFLOW",
    "AI CURATED", "H CACHE", "match.kind.toUpperCase()", "DAILY PROGRESS ·", " min`",
  ]) assert.equal(sources.includes(legacy), false, `legacy presentation copy remains: ${legacy}`);
});

test("settings and management surfaces use Chinese product terminology", () => {
  const sources = [
    "src/dashboard/dashboardTransfer.ts",
    "src/product/commandCatalog.ts",
    "src/product/onboarding.ts",
    "src/services/CaptureService.ts",
    "src/services/ContextSwitcherService.ts",
    "src/services/DashboardSwitcherInteractionService.ts",
    "src/services/DashboardTransferInteractionService.ts",
    "src/services/DataFilterWidgetInteractionService.ts",
    "src/services/MorningBriefingService.ts",
    "src/services/ProductExperienceService.ts",
    "src/services/WeeklyReviewService.ts",
    "src/services/WeeklyReviewWidgetInteractionService.ts",
    "src/settings/DashFlowSettingsTab.ts",
    "src/ui/AIPlanModal.ts",
    "src/ui/DailyProgressNoteModal.ts",
    "src/ui/HeroImagePickerModal.ts",
    "src/ui/MorningBriefingSettingsModal.ts",
    "src/ui/ProjectEditorModal.ts",
    "src/ui/WorkflowSettingsModal.ts",
  ].map((path) => readFileSync(path, "utf8")).join("\n");

  for (const copy of [
    "配置快速捕捉与情景模式", "导出当前工作台 JSON", "重新索引知识库",
    "今日专注", "项目管理", "每周复盘", "自己的头图", "头图标题", "头图副标题",
    "知识库本地图片", "每日笔记文件夹", "每日笔记日期格式", "情景切换",
  ]) assert.ok(sources.includes(copy), `missing localized management copy: ${copy}`);

  for (const legacy of [
    "配置 Quick Capture 与情景模式", "导出当前 Dashboard JSON", "导入 Dashboard JSON",
    "重新索引 Vault", "自己的 Hero 图片", "Hero 标题", "Hero 副标题",
    "搜索 Vault 中的 Hero 图片", "编辑 Dashboard 布局", "允许读取昨日 Daily Note",
    "Daily Note 文件夹", "Daily Note 日期格式", "Context Switcher", "Weekly Review 已复制",
    "Task、Project、Habit、Activity", "AI Provider 尚未配置", "哪个 Project",
    "已捕捉到今日 Daily Note", "Weekly Review ·", "Activity Score", "### Habit",
    "### Daily Progress", "Vault 根目录", "taskTotal} tasks",
  ]) assert.equal(sources.includes(legacy), false, `legacy management copy remains: ${legacy}`);
});
