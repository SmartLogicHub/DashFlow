# DashFlow v0.1.0

一个建立在 Obsidian Vault 之上的个人工作台。v0.1 的目标是先把 **Task / Project / Widget / Dashboard** 四层模型、统一索引、写回与可持久化布局真正跑通，再逐步扩展 Heatmap、Habit、Calendar 等能力。

## 已实现

- 独立 Dashboard View
- Widget Registry：同一种 Widget 可创建多个实例
- 12 列桌面布局
- 编辑模式：拖动、调整尺寸、移除、添加、重置布局
- 布局自动保存到插件 `data.json`
- Vault 增量索引
- Markdown Task 解析
- 在 Dashboard 直接勾选/取消任务
- Project frontmatter 解析
- 根据关联任务自动计算 Project 进度
- Quick Capture 写入 Inbox
- 今日任务 / 今日进度
- 项目列表 / 未来 7 天
- Vault Pulse / 倒计时
- 响应式移动端单列布局
- 设置页

## 安装测试版

GitHub Actions 会在每次构建成功后生成 `dashflow-plugin` artifact，里面包含：

- `manifest.json`
- `main.js`
- `styles.css`

把这三个文件放到：

`<你的 Vault>/.obsidian/plugins/dashflow/`

然后在 Obsidian → 设置 → 第三方插件里启用 **DashFlow**。建议第一轮先使用测试 Vault。

## 本地开发

需要 Node.js 22+。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建会从 `src/main.ts` 生成根目录 `main.js`。`main.js` 是生成产物，正式测试包由 GitHub Actions artifact 提供。

当前源码按职责拆分：

```text
src/
├── main.ts
├── models.ts
├── dashboard/
├── layout/
├── parsers/
├── services/
├── settings/
├── ui/
├── utils/
└── widgets/
```

## Task 格式

基础任务：

```md
- [ ] 写 DashFlow 第一版
- [x] 设计数据模型
```

到期日期：

```md
- [ ] 完成布局引擎 📅 2026-08-20
```

优先级：

```md
- [ ] 紧急任务 ⏫ 📅 2026-08-18
- [ ] 高优先级 🔼
- [ ] 低优先级 🔽
```

关联项目：

```md
- [ ] 完成 Widget Registry #project/dashflow 📅 2026-08-20
```

同时已经为后续兼容预留 `⏳ scheduled`、`🛫 start`、`✅ completed` 字段解析。

## Project 格式

```yaml
---
type: project
project_id: dashflow
name: DashFlow Plugin
status: active
deadline: 2026-09-30
progress_mode: tasks
---
```

`project_id` 与任务中的 `#project/dashflow` 对应。

支持状态：`planned`、`active`、`paused`、`completed`、`archived`。

也支持手工进度：

```yaml
---
type: project
project_id: launch
status: active
progress_mode: manual
progress: 65
---
```

## Quick Capture

默认写入：

`DashFlow/Inbox.md`

可以在 DashFlow 设置页修改。

## 四个核心模型

完整 TypeScript 契约见 `src/models.ts`，详细设计见 `ARCHITECTURE.md`。

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |

因此卸载插件不会带走用户的任务和项目。

## 架构原则

```text
Vault
  ↓
VaultIndexService
  ↓
Task / Project Domain
  ↓
Services / Query
  ↓
Widget Registry + Widget Instances
  ↓
Layout Engine
  ↓
Dashboard View
```

Widget 不直接反复扫描 Vault；任务和项目统一由 `VaultIndexService` 建立轻量索引。Dashboard 只负责组织 Widget，不直接拥有 Task / Project 数据。

v0.1 的 Presentation 层使用 Obsidian API + 原生 DOM，暂不依赖 React、Dataview 或 Tasks。领域层、服务层、Widget Registry 与 UI 已分离，后续更换渲染层不需要推翻核心模型。

## 当前限制

- Task ID v0.1 由来源路径、行号和内容 hash 组成；大规模移动任务后会重新索引。
- 移动端使用单列布局，暂不支持自由 resize。
- Project 使用 `#project/<id>` 关联任务。
- 布局引擎允许自由放置，暂未加入碰撞避让与自动压缩。
- 还没有 Task 编辑 Modal、Widget 配置面板、Heatmap、Habit、Calendar 和多 Dashboard UI。

## 下一阶段

优先顺序：

1. Layout 碰撞检测与自动压缩
2. Widget 配置系统
3. Task 编辑 Modal
4. Heatmap / Activity Tracker
5. Habit / 长周期任务
6. Calendar
7. 移动端排序模式
8. 多 Dashboard UI

## CI

仓库使用 GitHub Actions 执行：

```text
npm install
npm run build
node --check main.js
```

成功后上传可安装的 `dashflow-plugin` artifact。真正写入 Vault 的功能仍建议先在测试 Vault 验证。
