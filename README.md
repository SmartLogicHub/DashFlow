# DashFlow v0.1.1

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。核心原则是：**Task / Project 保持在 Markdown 中，Widget / Dashboard 只负责查询、展示和操作这些数据。**

## v0.1.1：Layout Engine

这一版重点完成桌面端布局基础设施：

- 卡片碰撞检测
- 拖动时被碰撞卡片自动向下让位
- resize 时支持级联推挤
- 松手后自动向上压缩空白
- 删除卡片后自动重新压缩
- 新增 Widget 优先填补第一个可用空位，而不是永远追加到底部
- 旧布局如果已经存在重叠，会在参与布局运算时自动修复
- 活动卡片始终保持用户当前拖到的位置，其余卡片围绕它重排
- Layout Engine 增加独立自动化测试，并接入 GitHub Actions

移动端仍保持单列模式，暂不开放自由 resize。

## 当前已实现

- 独立 Dashboard View
- Widget Registry：同一种 Widget 可创建多个实例
- 12 列桌面布局与持久化
- 编辑模式：拖动、调整尺寸、移除、添加、重置布局
- Vault 增量索引
- Markdown Task 解析与 Dashboard 直接勾选
- Project frontmatter 解析与任务进度计算
- Quick Capture → Inbox
- Today Tasks / Progress
- Projects / Upcoming
- Countdown / Vault Pulse
- 设置页
- 亮暗主题适配
- 移动端单列布局

## 安装测试版

GitHub Actions 构建成功后会生成 `dashflow-plugin` artifact，包含：

- `manifest.json`
- `main.js`
- `styles.css`

放入：

`<你的 Vault>/.obsidian/plugins/dashflow/`

然后在 Obsidian → 设置 → 第三方插件中启用 **DashFlow**。建议开发阶段先使用测试 Vault。

## 本地开发

需要 Node.js 22+。

```bash
npm install
npm test
npm run build
```

开发监听：

```bash
npm run dev
```

## Task 格式

```md
- [ ] 写 DashFlow 第一版
- [ ] 完成布局引擎 📅 2026-08-20
- [ ] 紧急任务 ⏫ 📅 2026-08-18
- [ ] 完成 Widget Registry #project/dashflow
```

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

`project_id` 与任务里的 `#project/dashflow` 对应。

## 数据边界

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |

因此卸载 DashFlow 不会带走用户的任务和项目。

## 架构

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

完整数据契约见 `src/models.ts`，架构说明见 `ARCHITECTURE.md`。

## 下一阶段

v0.1.1 的 Layout Engine 稳定后，下一步进入 **Widget 配置系统**：

1. 通用 Widget Settings Schema
2. 每个 Widget 独立配置面板
3. Tasks 的筛选 / 排序 / 数量设置
4. Projects 的状态 / 数量 / 进度显示设置
5. Countdown 标题与目标日期设置统一迁移到配置面板

之后再进入 Task 编辑 Modal、Heatmap / Activity Tracker、Habit 和 Calendar。

## CI

GitHub Actions 会执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部成功后才上传可安装 artifact。
