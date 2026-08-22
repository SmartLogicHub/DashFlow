# AI 早报与快速记录一体化修复 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让 AI 早报在空状态中可直接配置并一键填入可靠订阅源，同时修复快速记录弹窗的主操作与排版。

**Architecture:** 推荐源作为独立纯数据模块，由 AI 早报定义和通用卡片配置渲染器消费；配置入口继续通过现有卡片配置事件定位实例。快速记录保留原 CaptureService，只重组 Modal DOM 与样式，让回车和按钮共享同一个提交函数。

**Tech Stack:** TypeScript 5.8、Obsidian Plugin API、原生 DOM/CSS、Node 22 test runner、esbuild、Playwright CDP 冒烟测试。

---

## 文件结构

- Create: `src/widgets/aiNewsSources.ts` — 维护经过验证的推荐源及序列化文本。
- Modify: `src/models.ts` — 为通用卡片设置增加 `textarea` 与可选预设动作元数据。
- Modify: `src/widgets/intelligence.ts` — AI 早报 RSS 字段改为多行并绑定推荐源。
- Modify: `src/dashboard/DashboardRenderer.ts` — 渲染多行设置控件和“使用推荐源”草稿动作。
- Modify: `src/dashboard/widgetConfigRequest.ts` — 提供统一的当前卡片配置事件发送函数。
- Modify: `src/services/AINewsWidgetInteractionService.ts` — 渲染空源/AI 未配置的现场操作。
- Modify: `src/styles/AINewsStyles.ts` — AI 早报操作型空状态样式。
- Modify: `src/ui/QuickAddModal.ts` — 明确保存按钮、目标行和更多创建方式结构。
- Modify: `src/styles/ProductPresentationStyles.ts` — 快速记录桌面与窄窗口排版。
- Modify: `tests/ai-news.test.ts` — 推荐源、多行控件和现场配置入口测试。
- Modify: `tests/workflow-context.test.ts` — 快速记录提交与目标入口契约测试。
- Modify: `tests/product-presentation.test.ts` — 快速记录布局样式契约测试。
- Modify: `scripts/obsidian-ui-smoke.mjs` — 增加快速记录与 AI 早报关键可见性检查。

### Task 1: 推荐 RSS 与多行卡片设置

**Files:**
- Create: `src/widgets/aiNewsSources.ts`
- Modify: `src/models.ts:174-185`
- Modify: `src/widgets/intelligence.ts:10-32`
- Modify: `src/dashboard/DashboardRenderer.ts:563-570,625-695`
- Test: `tests/ai-news.test.ts`

- [ ] **Step 1: 写推荐源与多行字段的失败测试**

在 `tests/ai-news.test.ts` 中导入纯数据模块并断言：推荐源恰好为已验证的六个 URL、无重复、全部为 HTTPS；同时断言 AI 早报使用 `type: "textarea"`，Renderer 存在 textarea 与 preset 草稿赋值路径。

```ts
import { RECOMMENDED_AI_NEWS_SOURCES, recommendedAiNewsSourcesText } from "../src/widgets/aiNewsSources";

test("AI News exposes six verified recommended feeds", () => {
  assert.equal(RECOMMENDED_AI_NEWS_SOURCES.length, 6);
  assert.equal(new Set(RECOMMENDED_AI_NEWS_SOURCES.map((item) => item.url)).size, 6);
  assert.ok(RECOMMENDED_AI_NEWS_SOURCES.every((item) => item.url.startsWith("https://")));
  assert.equal(recommendedAiNewsSourcesText().split("\n").length, 6);
});
```

- [ ] **Step 2: 运行测试并确认因模块/行为缺失而失败**

Run: `npm test`

Expected: FAIL，指出 `aiNewsSources` 不存在或断言的 textarea/preset 路径缺失。

- [ ] **Step 3: 实现纯推荐源模块与通用 textarea 字段**

推荐源模块导出只读数组和换行序列化函数：

```ts
export const RECOMMENDED_AI_NEWS_SOURCES = [
  { name: "OpenAI News", url: "https://openai.com/news/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "Hugging Face Blog", url: "https://huggingface.co/blog/feed.xml" },
  { name: "Obsidian 更新日志", url: "https://obsidian.md/changelog.xml" },
  { name: "阮一峰的网络日志", url: "https://www.ruanyifeng.com/blog/atom.xml" },
  { name: "少数派", url: "https://sspai.com/feed" },
] as const;

export function recommendedAiNewsSourcesText(): string {
  return RECOMMENDED_AI_NEWS_SOURCES.map((item) => item.url).join("\n");
}
```

`WidgetSettingField` 增加 `textarea` 分支，字段支持 `rows`、`placeholder` 和 `{ label, value }` preset。Renderer 创建 `<textarea>`，输入时只更新 `modalDraft`；点击 preset 后同步控件与草稿，仍由现有“保存”按钮持久化。

- [ ] **Step 4: 运行测试并确认通过**

Run: `npm test`

Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add src/widgets/aiNewsSources.ts src/models.ts src/widgets/intelligence.ts src/dashboard/DashboardRenderer.ts tests/ai-news.test.ts
git commit -m "feat: add recommended AI news feeds"
```

### Task 2: AI 早报现场配置入口

**Files:**
- Modify: `src/dashboard/widgetConfigRequest.ts`
- Modify: `src/services/AINewsWidgetInteractionService.ts`
- Modify: `src/styles/AINewsStyles.ts`
- Test: `tests/ai-news.test.ts`

- [ ] **Step 1: 写空源与 AI 设置入口的失败测试**

断言交互服务使用统一 `requestWidgetConfig`，空源时显示“配置新闻源”，AI 未配置错误时显示“打开 AI 设置”，并且操作型空状态具有可访问按钮和专属样式类。

- [ ] **Step 2: 运行测试并确认正确失败**

Run: `npm test`

Expected: FAIL，缺少现场操作与对应样式。

- [ ] **Step 3: 实现统一配置事件与操作型空状态**

`requestWidgetConfig(target, widgetId)` 发送可冒泡的 `DASHFLOW_CONFIGURE_WIDGET_EVENT`。AI 卡片在 `sources.trim()` 为空时不调用抓取服务，直接渲染说明和“配置新闻源”；点击后从卡片 body 发送当前实例 ID。捕获“AI Provider 尚未配置”时渲染“打开 AI 设置”，调用 `plugin.openSettings("integration")`。其他错误保持只读诊断文本。

- [ ] **Step 4: 为操作型空状态增加样式**

增加 `.dashflow-ai-news-empty-copy`、`.dashflow-ai-news-empty-action`，保持按钮最小 32px、清晰 focus、hover/active 状态；卡片窄宽度下不溢出。

- [ ] **Step 5: 运行测试并确认通过**

Run: `npm test`

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/dashboard/widgetConfigRequest.ts src/services/AINewsWidgetInteractionService.ts src/styles/AINewsStyles.ts tests/ai-news.test.ts
git commit -m "feat: make AI news setup discoverable"
```

### Task 3: 快速记录主操作与排版

**Files:**
- Modify: `src/ui/QuickAddModal.ts`
- Modify: `src/styles/ProductPresentationStyles.ts`
- Modify: `tests/workflow-context.test.ts`
- Modify: `tests/product-presentation.test.ts`

- [ ] **Step 1: 写快速记录结构与样式的失败测试**

测试源代码包含 `dashflow-quick-add-submit`、`dashflow-quick-add-target`、`dashflow-quick-add-section-label` 和“更改目标”；断言保存按钮初始禁用、输入事件同步状态、click 与 Enter 都调用同一个 `capture()`。样式测试断言 target 使用 flex、action 使用两列内部网格、窄窗口使用单列。

- [ ] **Step 2: 运行测试并确认正确失败**

Run: `npm test`

Expected: FAIL，指出保存按钮和目标栏规则缺失。

- [ ] **Step 3: 重组 QuickAddModal**

将眉题改为“捕捉”，压缩说明文案。Composer 创建图标、输入框和 `保存` 按钮；保存按钮与 Enter 共用现有 `capture()`，空输入保持禁用。目标行左侧显示当前目标，右侧按钮包含设置图标和“更改目标”。快捷入口前增加“更多创建方式”标签，原任务/项目/习惯动作不变。

- [ ] **Step 4: 修复桌面和窄窗口样式**

Composer 保持 `20px minmax(0, 1fr) auto`；target 使用 `display:flex; justify-content:space-between; align-items:center`；action 内部使用图标/文字两列网格，统一最小高度和基线。`@media (max-width: 760px)` 下快捷入口为单列，所有按钮保持触控高度。

- [ ] **Step 5: 运行测试并确认通过**

Run: `npm test`

Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add src/ui/QuickAddModal.ts src/styles/ProductPresentationStyles.ts tests/workflow-context.test.ts tests/product-presentation.test.ts
git commit -m "fix: polish quick capture workflow"
```

### Task 4: 构建、真实界面验证与安装

**Files:**
- Modify: `scripts/obsidian-ui-smoke.mjs`
- Generated: `main.js`
- Deploy: `G:\文档\于浩的知识库\.obsidian\plugins\dashflow\main.js`
- Deploy: `G:\文档\于浩的知识库\.obsidian\plugins\dashflow\manifest.json`
- Deploy: `G:\文档\于浩的知识库\.obsidian\plugins\dashflow\styles.css`

- [ ] **Step 1: 先扩展 UI 冒烟断言**

打开快速记录，验证保存按钮、目标行、三个入口在宽/窄窗口内无溢出；打开工作台 AI 早报空状态时验证“配置新闻源”可见并能打开对应卡片配置。

- [ ] **Step 2: 运行 UI 测试并确认旧构建缺少新行为**

Run: `npm run test:ui`

Expected: 在尚未构建/安装的新入口断言处 FAIL；若 Obsidian 未以 CDP 模式启动，则记录环境阻塞并改用构建后静态验证。

- [ ] **Step 3: 完整测试与生产构建**

Run: `npm test`

Expected: 全部 PASS。

Run: `npm run build`

Expected: TypeScript 无错误，esbuild 生成生产 `main.js`。

- [ ] **Step 4: 安全安装到目标知识库**

先核对目标目录恰为 `G:\文档\于浩的知识库\.obsidian\plugins\dashflow`，将现有三项运行文件复制为带时间戳备份，再复制新的 `main.js`、`manifest.json`、`styles.css`。不覆盖 `data.json`，避免丢失用户配置和凭据引用。

- [ ] **Step 5: 重载插件并运行 UI 冒烟测试**

通过已连接 Obsidian CDP 执行插件禁用/启用，运行 `npm run test:ui`；保存宽/窄截图并检查控制台错误、页面错误、溢出和操作入口。

- [ ] **Step 6: 最终检查并提交**

Run: `git diff --check`

Run: `git status --short`

Expected: 只包含预期构建/冒烟测试改动，无临时文件。

```bash
git add scripts/obsidian-ui-smoke.mjs main.js
git commit -m "test: cover AI news and quick capture flows"
```

记录安装备份位置、测试数量、构建结果和 UI 验证结果。
