# DashFlow v0.1.5

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 继续以 Markdown / frontmatter 为真实数据源，Widget 和 Dashboard 负责查询、展示和操作。

## v0.1.5：Habit / 长周期任务

这一版把长期习惯正式纳入 DashFlow 的 Domain 层，并复用 v0.1.4 的 Activity 数据层。

Habit 支持：

- Dashboard 直接创建 Habit Markdown
- Dashboard 直接编辑名称、频率、状态、起止日期与目标天数
- 每日一键打卡 / 取消打卡
- `daily` 与 `weekdays` 两种频率
- 最近 7–30 天打卡轨迹
- 连续打卡 streak
- 最近 30 天完成率
- 14 / 30 / 100 天等长期目标进度
- active / paused / completed / archived 状态
- Habit Widget 多实例与独立配置
- Heatmap 新增「习惯」统计维度
- 习惯打卡进入综合 Activity Score

Habit 的定义和真实打卡日期保存在 Markdown frontmatter：

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

`habit_log` 是打卡记录的 Source of Truth。Activity 只保存派生统计，因此卸载 DashFlow 后习惯数据仍然保留在 Vault 中。

综合活跃度当前权重为：完成任务 ×4、新建任务 ×1、新建笔记 ×3、当天首次修改笔记 ×1、习惯打卡 ×3。

## v0.1.4：Activity Tracker + Heatmap

Activity Tracker 从启用 v0.1.4 后开始累计：

- 新建 Markdown 笔记
- 当天首次修改某篇 Markdown 笔记
- 通过 DashFlow 新建任务
- 完成任务（包括 Dashboard 操作和大部分直接 Markdown 勾选）
- v0.1.5 起记录 Habit 打卡

Heatmap 支持：

- 28–365 天显示范围
- 综合活跃度 / 任务 / 习惯 / 笔记统计维度
- 4 级强度显示
- Active days
- Tasks done
- Habit checks
- Day streak
- 每日 hover 明细
- 独立 Widget 配置与多实例

> Activity 是派生统计，不会伪造安装前的历史编辑数据。

## v0.1.3：Task Editor

Dashboard 里的任务可以直接操作，同时 Markdown 仍然是唯一真实数据源：

- 点击 Today / Upcoming 的任务标题打开编辑器
- 修改标题、完成状态、到期日期、优先级、所属项目
- 修改直接写回原始 Markdown 行
- 保留缩进、列表符号、普通标签及已有 start / scheduled / completed 元数据
- Today Widget 可结构化新建任务到 Inbox
- 项目通过 `#project/<id>` 关联

## v0.1.2：Widget 配置系统

进入 **编辑布局** 后，每张卡片右上角会出现 `⚙`。配置只作用于当前 Widget 实例，因此同一种 Widget 可以添加多张并使用不同参数。

当前内置 Widget：

| Widget | 主要配置 |
|---|---|
| 快速捕捉 | 输入提示文字 |
| 今日任务 | 包含逾期、显示数量 |
| 今日进度 | 中央标签 |
| 项目 | 显示数量 |
| 即将到期 | 未来天数、显示数量 |
| 长期习惯 | 历史天数、显示数量、进度、暂停状态 |
| 活跃度 | 天数、统计维度、图例 |
| 倒计时 | 标题、目标日期 |
| Vault Pulse | 实例标题 |

底层通过 `WidgetDefinition.settings` 定义配置 Schema，新 Widget 不需要重新实现设置窗口。

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

## Habit 格式

```yaml
---
type: habit
habit_id: workout
name: 每天运动
status: active
frequency: daily
start: 2026-08-15
end: 2026-09-13
target_days: 30
habit_log:
  - 2026-08-15
---
```

`frequency` 当前支持 `daily` 和 `weekdays`。Dashboard 的打卡操作会直接修改 `habit_log`。

## 数据边界

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| Habit | Markdown / frontmatter |
| Habit check-in | `habit_log` frontmatter |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |
| Activity | 插件 `data.json` 中的派生统计 |

卸载 DashFlow 不会带走用户的 Task / Project / Habit 数据。Activity 只是可重新开始累计的统计数据。

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
  ├── CaptureService
  └── ActivityService
  ↓
Widget Registry + Widget Instances
  ↓
Layout Engine
  ↓
Dashboard View
```

HabitService 只负责读写 Markdown Habit；ActivityService 监听 Task / Habit / Vault 变化并生成派生每日统计。

## 下一阶段

1. Calendar
2. Weekly Review
3. 移动端排序模式
4. 多 Dashboard UI
5. Habit 自定义周期 / 提醒

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部通过后才上传可安装 artifact。
