# DashFlow Hero 与产品语言统一设计

## 目标

将 DashFlow 的三张离线场景图从“仅能在文字下拉框中选择的主页装饰”，收拢为跨“今日”和“工作台”等主页面一致、可见、可立即验证的产品主题；同时消除 Hero、文案与任务进度的语义冲突。

## 已确认的产品决定

- 采用 A 方案：同一个主题同时应用于“今日”和所有工作页面；自定义 Vault 图片继续优先于预设主题。
- 工作页面保留同主题 Hero，但缩为紧凑横幅，优先保障任务与项目的首屏空间。
- 设置页改用可点击的缩略图主题卡，不再将预设主题藏在下拉列表中。
- 主产品语言使用中文；英文只作为小号辅助标签，不再出现 “Obsidian · Personal Dashboard” 或 “ALL TASKS” 这类竞争性主文案。

## 根因与约束

当前实现已经能解析离线场景，并通过 `PresentationRuntimeService` 写入视图 CSS 变量；问题不在图片缺失。问题在于：

1. 设置页只提供下拉选择，预览卡只是文字，且主题变更经 300ms 延迟保存，用户无法确认是否持久化。
2. Hero 的内容由 `DashboardRenderer`、`ProductExperienceService` 与 CSS `::after` / `:has()` 同时控制；多个 CSS 层也分别定义工作页 Hero，导致视觉与文案的最终所有权不清晰。
3. 进度 Widget 名为“今日进度”，但固定渲染“今日”和“全部任务”两种统计。

不修改 Markdown、任务、项目或已有主题设置的存储格式；不引入联网图片、第三方运行时依赖或新的迁移版本。

## 设计

### 1. 单一主题目录与持久化操作

新增纯模块 `src/product/heroThemes.ts`，作为 Alpine、Paper、Midnight、Obsidian 四个选项的唯一目录，包含稳定 ID、中文名称、说明与离线资源路径。`heroScenes.ts` 的资源路径逻辑迁入/复用该目录，避免 Settings 与运行时各自维护字符串。

Settings 只在主题卡被点选时调用一个异步 `selectHomeTheme` 路径：写入 `settings.homeTheme`、`await savePluginData()`、刷新所有 Dashboard 视图、重绘设置页。这样点击完成即是落盘完成；普通文本输入仍保留原有防抖保存。每个按钮必须有 `aria-pressed`，当前项有清晰的选中边框与勾选标记。Obsidian 选项展示为跟随应用颜色的抽象卡，不假装有第四张图片。

`PresentationRuntimeService` 保持唯一的资源解析者：向每个 DashFlow 视图写入最终 `--df-hero-image`（本地 Vault 覆盖图或当前离线预设）及现有颜色变量。主题缩略图可复用同一资源解析 API；没有资源时使用安全的纯色/渐变回退。

### 2. 单一 Hero 内容与样式所有者

`DashboardRenderer` 只提供 Hero 结构容器和布局按钮，不再写标题、说明或英文品牌文案。`ProductExperienceService` 是 Hero 内容的唯一所有者：

- “今日”保留日期、个人标题、副标题、开始今天与快速记录操作。
- “工作台”及其他工作页使用 `PRODUCT_SECTIONS` 的中文标题和说明，展示同一最终主题图；工作台横幅在桌面为约 128px、窄屏为约 112px。
- 所有可见标题都以真实 DOM 文本输出；移除 CSS `content` 与 `:has()` 驱动的页面标题。

样式仅保留一个工作页 Hero 定义（放在 `ProductHierarchyResetStyles.ts`）；移除 `VisualContinuityStyles.ts` 中与之竞争的工作页 Hero 声明。Hero 背景统一读取 `--df-hero-image`，不再在 `--df-ambient-image`、`--df-bundled-home-scene`、`--df-home-scene` 之间竞争。保留低饱和遮罩、文字安全区、窄屏与 reduced-motion 行为。

### 3. 统一文案与进度语义

`ProductExperienceService` 的导航和 Hero 文案使用已有的 `PRODUCT_SECTIONS` 数据；移除 “SECOND BRAIN”、“WORK SYSTEM” 与 “Obsidian · Personal Dashboard”。仪表盘名 `Home` 的兼容显示继续为“默认工作台”。

进度 Widget 改名为“任务概览”，描述为“今日任务与全部任务的完成情况”。两枚环的标签改为“今日任务”“全部任务”；底部仍显示完成数。旧 Widget 实例与其 `config.label` 保留，避免破坏已有 Dashboard，但不再把无效的标签设置呈现为可配置行为。

### 4. 可测试边界

新增三个纯模块边界，并以真实数据对象测试，而非只搜索源码文本：

- `heroThemes.ts`：预设定义、离线资源映射及可选主题 ID。
- `heroPresentation.ts`：按页面区段返回中文 Hero 文案和紧凑/主页布局意图。
- `progressOverview.ts`：从今日任务与全部任务生成“任务概览”的两项进度指标，并正确处理 0 项任务。

Settings 和 DOM 渲染仅消费这些纯结果。现有源码结构测试可以保留为防回归补充，但不再是本次行为的唯一验证。

## 验收标准

1. 外观设置显示 Alpine、Paper、Midnight 三张真实缩略图及 Obsidian 跟随主题卡；点击任意项后选中状态立即变化，数据已保存。
2. 切换预设主题后，今日与工作台 Hero 都使用相同场景；选择本地 Vault 图片后两处都使用该图片；清除后恢复预设主题。
3. 工作台 Hero 不超过紧凑高度，标题与说明来自真实 DOM，且主文案为中文。
4. 搜索运行时源代码与构建产物，不再出现 `images.unsplash.com`、`Obsidian · Personal Dashboard`、`ALL TASKS` 或 Hero 标题的 CSS `content:` 规则。
5. 进度卡标题为“任务概览”，内部为“今日任务”与“全部任务”，数字计算保持正确。
6. 新增纯逻辑测试先失败、后通过；完整测试、TypeScript 检查、生产构建和安装包检查均通过。

## 风险与回退

不变更 `homeTheme`、`homeHeroImagePath` 等数据字段，因此旧配置可直接读取。若某个预设资源不存在，运行时只回退到主题色，不会尝试联网。设置卡落盘失败时保留旧选择、显示 Obsidian Notice，并不刷新页面为假成功状态。
