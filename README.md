# DashFlow v0.1.8

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 继续以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和操作。

## v0.1.8：移动端布局 / 排序模式

这一版把桌面布局和移动端体验拆开：

- 桌面继续使用 12 列自由拖拽 / resize / 自动碰撞重排
- 900px 以下进入独立移动端模式
- 移动端改为单列卡片流，不再直接缩放桌面网格
- 每张卡片支持独立折叠 / 展开
- 编辑模式下使用 ↑ / ↓ 调整手机排序，触控不依赖拖拽
- 手机排序独立保存，不会改变桌面卡片位置
- 支持移动端紧凑模式
- 支持一键重置手机排序，同时保留桌面布局
- 新增卡片会自动追加进手机排序；删除卡片会同步清理移动端状态
- 横竖屏 / 窗口跨过 900px 时自动切换交互模式
- Calendar / Weekly Review / Habits / Heatmap 在手机上使用独立内容高度，减少嵌套滚动
- 移动端操作按钮扩大为触控友好的点击区域

移动端状态保存在 Dashboard 自身的插件数据里：

```ts
mobile: {
  order: string[];
  collapsedWidgetIds: string[];
  compactMode: boolean;
}
```

它只保存 UI 偏好，不复制 Task / Project / Habit 业务数据。

## v0.1.7：Weekly Review

Weekly Review 会把 Task / Project / Habit / Activity / Calendar 汇总成本周复盘：

- 本周完成 / 新建任务
- Activity Score 与上周对比
- 活跃天数与笔记活动
- Habit 本周完成率
- 逾期和本周仍未完成任务
- 活动项目进度与 deadline
- 下周 Task due / scheduled 与 Project deadline
- 一键复制 Markdown 周报

## v0.1.6：Calendar + Agenda

统一时间层把以下信息投射到月历：

- Task `📅 due`
- Task `⏳ scheduled`
- Project `deadline`
- Habit `daily / weekdays`

Calendar 本身不保存第二份业务数据，而是运行时由 VaultIndexService 派生 CalendarEvent。

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

- 卡片碰撞检测
- 拖动自动推挤
- resize 级联重排
- 自动向上压缩空白
- 删除后重新压缩
- 新卡片优先填补可用空位
- 旧布局重叠自动修复
- 拖动 / resize 实时重排预览

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

放入：

`<你的 Vault>/.obsidian/plugins/dashflow/`

然后在 Obsidian → 设置 → 第三方插件中启用 **DashFlow**。开发阶段建议先使用测试 Vault。

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
| Dashboard | 插件 `data.json` |
| Mobile order / collapse | Dashboard UI 状态 |
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
Layout Engine
  ├── Desktop 12-column grid
  └── Mobile single-column order
  ↓
Dashboard View
```

## 下一阶段

1. 多 Dashboard UI
2. Dashboard 模板
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
