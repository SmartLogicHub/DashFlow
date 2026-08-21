# 任务概览主次布局 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将工作台「任务概览」从并列双圆环改成以今日完成度为主、全部任务为辅的紧凑摘要。

**Architecture:** `taskOverview` 显式提供 `today` 与 `all` 两个真实指标，避免调用方依赖数组位置。`ProductExperienceService` 只为工作台进度卡创建新的任务概览 DOM；新 CSS 类由 `ProductDesignService` 独占，因而不会被旧的 `.dashflow-progress-*` 规则干扰。

**Tech Stack:** TypeScript、Obsidian DOM API、内联 CSS、Node test runner、esbuild。

---

### Task 1: 明确任务概览的今日与全局数据角色

**Files:**
- Modify: `src/product/progressOverview.ts`
- Modify: `tests/hero-product-unification.test.ts`

- [ ] **Step 1: 写出失败的数据契约测试**

在 `tests/hero-product-unification.test.ts` 中把 `taskOverview` 的断言改为期望：

```ts
assert.deepEqual(overview.today, { label: "今日任务", completed: 1, total: 2, percentage: 50 });
assert.deepEqual(overview.all, { label: "全部任务", completed: 2, total: 4, percentage: 50 });
assert.equal(taskOverview([], []).today.total, 0);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm.cmd test`

Expected: `task overview keeps today and all-task metrics semantically separate` 因缺少 `today` / `all` 而失败。

- [ ] **Step 3: 最小化实现显式角色**

在 `src/product/progressOverview.ts` 将 `TaskOverview` 改为：

```ts
export interface TaskOverview {
  title: "任务概览";
  today: TaskOverviewMetric;
  all: TaskOverviewMetric;
}
```

并让 `taskOverview(todayItems, allItems)` 返回 `today: metric("今日任务", todayItems)` 与 `all: metric("全部任务", allItems)`。不增加缓存或第二份数据。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm.cmd test`

Expected: 223 项测试通过。

- [ ] **Step 5: 提交数据契约**

```powershell
git add src/product/progressOverview.ts tests/hero-product-unification.test.ts
git commit -m "refactor: name task overview metrics"
```

### Task 2: 用主次 DOM 替换双圆环

**Files:**
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `tests/hero-product-unification.test.ts`

- [ ] **Step 1: 写出失败的结构测试**

扩展 `hero-product-unification.test.ts`，断言工作台装饰器源码包含：

```ts
assert.ok(experienceSource.includes("dashflow-task-overview"));
assert.ok(experienceSource.includes("dashflow-task-overview-primary"));
assert.ok(experienceSource.includes("dashflow-task-overview-secondary"));
assert.ok(experienceSource.includes("dashflow-task-overview-empty"));
assert.ok(experienceSource.includes("dashflow-task-overview-bar-fill"));
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm.cmd test`

Expected: 新结构测试失败，当前源码仍为 `dashflow-progress-pair`。

- [ ] **Step 3: 最小化实现新结构**

在 `decorateProgressWidget` 中使用 `overview.today` 与 `overview.all`，并以 `today.completed/today.total|all.completed/all.total` 作为刷新签名。创建以下结构：

```text
.dashflow-task-overview
├─ .dashflow-task-overview-primary
│  ├─ label: 今日任务
│  └─ 有任务：圆环、百分比、完成数；无任务：.dashflow-task-overview-empty「今天暂无待办」
└─ .dashflow-task-overview-secondary
   ├─ label: 全部任务
   ├─ 百分比与完成数
   └─ .dashflow-task-overview-bar > .dashflow-task-overview-bar-fill
```

圆环只用于今日任务。全部任务的填充宽度为 `all.percentage + "%"`。删除 `progressMetric` 在此装饰器中的使用，但不改动 `DashboardRenderer` 的通用进度 Widget。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm.cmd test`

Expected: 223 项测试通过。

- [ ] **Step 5: 提交 DOM 改造**

```powershell
git add src/services/ProductExperienceService.ts tests/hero-product-unification.test.ts
git commit -m "feat: prioritize today in task overview"
```

### Task 3: 赋予主次布局稳定的视觉层级

**Files:**
- Modify: `src/services/ProductDesignService.ts`
- Modify: `tests/hero-product-unification.test.ts`

- [ ] **Step 1: 写出失败的样式所有权测试**

读取 `src/services/ProductDesignService.ts`，断言它包含 `.dashflow-task-overview`、`.dashflow-task-overview-primary`、`.dashflow-task-overview-secondary` 和 `.dashflow-task-overview-bar-fill`，且工作台新结构不再使用 `.dashflow-progress-pair`。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm.cmd test`

Expected: 新样式类不存在而失败。

- [ ] **Step 3: 最小化实现工作台样式**

在 `ProductDesignService` 的产品样式串中添加专用规则：

- 容器用两栏 Grid，左栏略宽，卡片内垂直居中；
- 今日圆环直径约 76px，使用既有 accent 与 surface token；
- 无今日任务时显示短文案，不保留空圆环；
- 全部任务使用数字、说明和 4px 圆角进度条；
- `max-width: 480px` 时保持两栏但缩小圆环与间距，文字不截断。

不要修改旧 `.dashflow-progress-*` 选择器；新类隔离旧样式层。

- [ ] **Step 4: 运行完整验证**

Run:

```powershell
npm.cmd test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
node --check main.js
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git diff --check
```

Expected: 测试全绿、构建成功、产物语法与 Git 差异检查成功。

- [ ] **Step 5: 提交样式与测试**

```powershell
git add src/services/ProductDesignService.ts tests/hero-product-unification.test.ts
git commit -m "style: clarify task overview hierarchy"
```
