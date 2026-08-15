# DashFlow v0.1.9

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 继续以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和操作。

## v0.1.9：Multiple Dashboards UI

这一版把从第一天就存在的数据结构正式开放成多工作台 UI：

- 顶部工作台切换器，可在多个 Dashboard 之间快速切换
- 新建工作台，新 Dashboard 从完整默认布局开始
- 重命名当前工作台
- 一键复制当前工作台
- 删除工作台，并保证至少保留一个 Dashboard
- 删除当前工作台后自动切换到相邻可用工作台
- 复制时重新生成 Widget ID，副本与原工作台之后完全独立
- 桌面布局、Widget 配置、隐藏状态、手机排序、折叠状态和紧凑模式都会随工作台分别保存
- 工作台管理器同时支持桌面和移动端

例如可以同时维护：

```text
Home      → 日常总览
Work      → 工作项目 / Today / Calendar
Personal  → 个人任务 / Habit
Review    → Weekly Review / Heatmap
```

Dashboard 仍然只保存 UI 编排和 Widget 实例，不复制 Vault 中的 Task / Project / Habit 数据。

## v0.1.8：移动端布局 / 排序模式

- 桌面继续使用 12 列自由拖拽 / resize / 自动碰撞重排
- 900px 以下进入独立移动端单列模式
- 每张卡片支持独立折叠 / 展开
- 编辑模式用 ↑ / ↓ 调整手机排序
- 手机排序独立保存，不改变桌面位置
- 支持移动端紧凑模式和独立重置

## v0.1.7：Weekly Review

Weekly Review 会把 Task / Project / Habit / Activity / Calendar 汇总成本周复盘，包括 Activity Score 对比、Habit 完成率、逾期/未完成事项、活动项目进度和下周关注事项，并支持复制 Markdown 周报。

## v0.1.6：Calendar + Agenda

统一时间层把 Task `📅 due`、Task `⏳ scheduled`、Project `deadline` 和 Habit 节奏投射到月历与 Agenda。CalendarEvent 是运行时派生对象，不创建第二份业务数据。

## v0.1.5：Habit / 长周期任务

Habit 是正式 Domain，真实打卡保存在 Markdown frontmatter 的 `habit_log` 中。支持 daily / weekdays、历史补打卡、streak、30 天完成率、长期目标进度和暂停 / 完成 / 归档。

## v0.1.4：Activity Tracker + Heatmap

Activity Tracker 从启用后开始累计笔记活动、任务创建 / 完成与 Habit 打卡。Heatmap 支持综合活跃度 / Tasks / Habits / Notes。

> Activity 是派生统计，不会伪造安装前的历史编辑数据。

## v0.1.3：Task Editor

Dashboard 中可直接创建和编辑任务，并写回原始 Markdown。支持标题、完成状态、due date、优先级和项目归属。

## v0.1.2：Widget 配置系统

每张 Widget 实例可以独立配置，同一种 Widget 可以添加多张并拥有不同参数。

## v0.1.1：Layout Engine

卡片支持碰撞检测、拖动自动推挤、resize 级联重排、垂直压缩、旧布局修复和新卡片自动寻找空位。

## 当前内置 Widget

| Widget | 主要能力 |
|---|---|
| 快速捕捉 | 写入 Inbox |
| 今日任务 | 今日 + 逾期任务 |
| 今日进度 | 当日完成比例 |
| 项目 | 活动项目 + 自动进度 |
| 即将到期 | 未来任务 |
| 日历 | 月历 + Agenda |
| 长期习惯 | 打卡 / streak / 目标 |
| Weekly Review | 本周复盘 + 下周关注 |
| 活跃度 | Heatmap |
| 倒计时 | 目标日期 |
| Vault Pulse | Vault 统计 |

## 安装测试版

GitHub Actions 构建成功后会产生 `dashflow-plugin` artifact，包含：

- `manifest.json`
- `main.js`
- `styles.css`

放入 `<你的 Vault>/.obsidian/plugins/dashflow/`，然后在 Obsidian → 设置 → 第三方插件中启用 **DashFlow**。开发阶段建议先使用测试 Vault。

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
- [ ] 写 Calendar 📅 2026-08-20
- [ ] 提前安排实现 ⏳ 2026-08-18 📅 2026-08-20
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

## Habit 格式

```yaml
---
type: habit
habit_id: workout
name: 每天运动
status: active
frequency: weekdays
start: 2026-08-15
target_days: 30
habit_log:
  - 2026-08-17
---
```

## 数据边界

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| Habit | Markdown / frontmatter |
| Habit check-in | `habit_log` frontmatter |
| CalendarEvent | 运行时派生 |
| Weekly Review | 运行时聚合 |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard 集合 / activeDashboardId | 插件 `data.json` |
| Desktop layout | 每个 Dashboard 独立 UI 状态 |
| Mobile order / collapse | 每个 Dashboard 独立 UI 状态 |
| Activity | 插件 `data.json` 中的派生统计 |

卸载 DashFlow 不会带走用户的 Task / Project / Habit 数据。

## 架构

```text
Vault
  ↓
VaultIndexService
  ↓
Task / Project / Habit Domain
  ↓
Services
  ├── TaskService
  ├── ProjectService
  ├── HabitService
  ├── CalendarService
  ├── WeeklyReviewService
  ├── CaptureService
  └── ActivityService
  ↓
Widget Registry + Widget Instances
  ↓
Dashboard Collection
  ├── Home
  ├── Work
  ├── Personal
  └── ...
  ↓
Layout Engine
  ├── Desktop 12-column grid
  └── Mobile single-column order
  ↓
Dashboard View
```

## 下一阶段

1. Dashboard 模板
2. Dashboard 导入 / 导出
3. Habit 自定义周期 / 提醒
4. Calendar 周视图 / 更完整 scheduled 编辑
5. 自定义 Query / Widget

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部通过后才上传可安装 artifact。
