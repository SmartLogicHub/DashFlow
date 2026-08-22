# DashFlow 中文界面与网页嵌入引导 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一 DashFlow 主界面的中文文案，并让未配置的网页嵌入卡片可直接打开自身配置。

**Architecture:** 保留现有 Widget 数据模型和渲染/装饰分层。中文化只修改默认产品文案；配置入口用冒泡 CustomEvent 从网页嵌入装饰服务通知 DashboardRenderer，由渲染器校验当前卡片后打开既有配置弹窗。

**Tech Stack:** TypeScript、Obsidian API、原生 DOM、Node test、esbuild

---

### Task 1: 中文产品文案保护

**Files:**
- Modify: `tests/product-presentation.test.ts`
- Modify: `src/dashboard/DashboardRenderer.ts`
- Modify: `src/services/ProductExperienceService.ts`
- Modify: `src/services/ActivityWidgetInteractionService.ts`
- Modify: `src/services/PersonalHomeService.ts`
- Modify: `src/product/featureCatalog.ts`
- Modify: `src/widgets/builtins.ts`
- Modify: `src/widgets/data.ts`
- Modify: `src/widgets/embed.ts`
- Modify: `src/widgets/focus.ts`

- [ ] 添加失败测试，断言主界面默认名称和统计标签使用中文。
- [ ] 运行定向测试，确认因当前英文文案失败。
- [ ] 更新默认名称、指标、区块标题和设置说明，保留品牌及技术缩写。
- [ ] 重跑定向测试并确认通过。

### Task 2: 网页嵌入空状态直达配置

**Files:**
- Modify: `tests/focus-embed.test.ts`
- Modify: `src/services/MagicEmbedWidgetInteractionService.ts`
- Modify: `src/dashboard/DashboardRenderer.ts`
- Modify: `src/styles/FocusEmbedStyles.ts`

- [ ] 添加失败测试，覆盖“配置嵌入地址”按钮、配置请求事件、卡片 ID 校验和加载错误提示。
- [ ] 运行定向测试，确认新交互尚未实现。
- [ ] 实现空状态操作、事件处理、iframe 加载失败提示和相应样式。
- [ ] 重跑定向测试并确认通过。

### Task 3: 全量验证与安装

**Files:**
- Modify: `CHANGELOG.md`
- Generated: `main.js`
- Generated: `styles.css`

- [ ] 更新变更日志并运行完整单测、类型检查、生产构建和 npm audit。
- [ ] 备份知识库插件目录并记录 `data.json` 哈希。
- [ ] 安装 `main.js`、`manifest.json`、`styles.css` 和 hero 资源，保持 `data.json` 不变。
- [ ] 运行真实 Obsidian UI 烟雾测试，检查中英文文案、配置入口、控制台错误和窄屏溢出。
- [ ] 校验安装后的 `data.json` 哈希，提交实现但不创建发布标签。
