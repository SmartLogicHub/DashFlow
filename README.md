# DashFlow v0.1.7

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 继续以 Markdown / frontmatter 为真实数据源，Widget 和 Dashboard 负责查询、展示和操作。

## v0.1.7：Weekly Review

这一版把 Task / Project / Habit / Activity / Calendar 汇总成一个真正的周复盘层，重点回答三个问题：**这周做了什么、现在卡在哪里、下周要看什么**。

Weekly Review Widget 支持：

- 本周完成任务数、Activity Score、活跃天数和笔记活动
- 本周 Habit 总完成率与各 Habit 完成情况
- Activity Score 与上周对比
- 汇总逾期与本周仍需处理的任务
- 活动项目当前进度与 deadline
- 自动读取下周 Task due / scheduled 与 Project deadline
- 点击任务直接打开 Task Editor
- 点击 Habit 直接打开 Habit Editor
- 点击项目直接打开项目原文
- 一键复制 Markdown 格式 Weekly Review
- 周一起始 / 周日起始可配置
- 待处理、项目、下周关注数量可配置
- Habit 与 Activity 对比模块可独立开关
- 多个 Weekly Review Widget 可使用不同配置

Weekly Review 不保存第二份 Task / Project / Habit 数据。它由现有 Domain 与 Activity 派生：

```text
Task / Project / Habit
        ↓
   VaultIndexService
        ↓
Project / Calendar / Activity Services
        ↓
    WeeklyReviewService
        ↓
     Weekly Review
```

其中 Activity 只从 DashFlow 开始记录后累计；如果本周中途才开始使用 Activity Tracker，Widget 会明确提示本周 Activity 为部分统计。任务、项目和 Habit 本身仍直接读取当前 Vault。

现有用户升级后可以在 **编辑布局 → 添加卡片 → Weekly Review** 中加入；新安装默认 Dashboard 会直接包含一张全宽 Weekly Review。

## v0.1.6：Calendar + Agenda

这一版加入统一时间层，把现有 Domain 里的日期投射到同一张月历：

- Task `📅 due`
- Task `⏳ scheduled`
- Project `deadline`
- Habit `daily / weekdays` 节奏

Calendar Widget 支持 6 周月视图、周一 / 周日起始、月份导航、每日事件标记、选中日期 Agenda、Task / Habit / Project 快捷操作，以及在选中日期直接创建任务。

Calendar 本身不保存第二份业务数据。它只读取 VaultIndexService 中已有的 Task / Project / Habit，然后通过 CalendarService 生成临时 `CalendarEvent`。

## v0.1.5：Habit / 长周期任务

Habit 已是正式 Domain，并保持 Markdown source-of-truth：

```yaml
---
type: habit
habit_id: workout
name: 每天运动
status: active
frequency: daily
start: 2026-08-15
target_days: 30
habit_log:
  - 2026-08-15
---
```

支持 Dashboard 创建 / 编辑、daily / weekdays、每日打卡、历史轨迹、streak、30 天完成率、长期目标进度、暂停 / 完成 / 归档，以及 Heatmap Habit 维度。

## v0.1.4：Activity Tracker + Heatmap

Activity Tracker 从启用后开始累计新建/修改笔记、任务创建/完成和 Habit 打卡。Heatmap 支持综合活跃度 / Tasks / Habits / Notes 四种统计维度。

> Activity 是派生统计，不会伪造安装前的历史编辑数据。

## v0.1.3：Task Editor

Dashboard 中可直接创建和编辑任务，修改会写回原始 Markdown。支持标题、完成状态、due date、优先级和项目归属；Calendar 新建任务可以预填选中日期。

## v0.1.2：Widget 配置系统

每张 Widget 实例都可以独立配置。同一种 Widget 可以添加多张，各自拥有不同筛选和参数。

当前内置 Widget：

| Widget | 主要配置 |
|---|---|
| 快速捕捉 | 输入提示文字 |
| 今日任务 | 包含逾期、显示数量 |
| 今日进度 | 中央标签 |
| 项目 | 显示数量 |
| 即将到期 | 未来天数、显示数量 |
| Weekly Review | 周起始日、待处理/项目/下周数量、Habit、Activity 对比 |
| 日历 | 周起始日、数据类型、已完成任务、Agenda 数量 |
| 长期习惯 | 历史天数、显示数量、进度、暂停状态 |
| 活跃度 | 天数、统计维度、图例 |
| 倒计时 | 标题、目标日期 |
| Vault Pulse | 实例标题 |

## v0.1.1：Layout Engine

- 卡片碰撞检测
- 拖动自动推挤
- resize 级联重排
- 自动向上压缩空白
- 删除后重新压缩
- 新卡片优先填补可用空位
- 旧布局重叠自动修复
- 拖动 / resize 实时重排预览
- Layout Engine 自动化测试

## 当前功能

- 独立 Dashboard View
- Widget Registry + WidgetInstance
- 12 列桌面布局
- 拖动 / resize / 自动重排 / 持久化
- Widget 实例配置系统
- Vault 增量索引
- Markdown Task 解析、勾选、创建和编辑
- Project frontmatter + 自动项目进度
- Habit frontmatter + 每日打卡 / streak / 长期目标
- Weekly Review + Markdown 复制
- Calendar + Agenda 时间视图
- Quick Capture → Inbox
- Today Tasks / Progress
- Projects / Upcoming
- Activity Heatmap
- Countdown / Vault Pulse
- Obsidian 亮暗主题适配
- 移动端单列布局
- 插件设置页

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

Calendar 与 Weekly Review 会读取 `📅` due 和 `⏳` scheduled。

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

`project_id` 与任务里的 `#project/dashflow` 对应，`deadline` 会进入 Calendar 和 Weekly Review。

## Habit 格式

```yaml
---
type: habit
habit_id: workout
name: 每天运动
status: active
frequency: weekdays
start: 2026-08-15
end: 2026-09-30
target_days: 30
habit_log:
  - 2026-08-17
---
```

`frequency` 当前支持 `daily` 和 `weekdays`。真实完成记录始终由 `habit_log` 保存。

## 数据边界

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| Habit | Markdown / frontmatter |
| Habit check-in | `habit_log` frontmatter |
| CalendarEvent | 运行时由 Domain 派生，不持久化 |
| Weekly Review | 运行时由 Domain + Activity 派生，不持久化 |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |
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
  ↓
Dashboard View
```

## 下一阶段

1. 移动端排序模式
2. 多 Dashboard UI
3. Habit 自定义周期 / 提醒
4. Calendar 周视图 / 更完整 scheduled 编辑
5. Weekly Review 历史快照 / 保存到笔记

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部通过后才上传可安装 artifact。
