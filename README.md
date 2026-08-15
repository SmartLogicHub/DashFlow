# DashFlow v0.2.1

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 继续以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和操作。

## v0.2.1：Dashboard 导入 / 导出

已经调好的 Dashboard 现在可以跨 Vault 搬运：

- 在「管理工作台」里直接导出当前 Dashboard
- 支持复制 JSON，也支持下载 `.json` 文件
- 导入时可以粘贴 JSON，也可以读取 `.json` 文件
- 导入始终创建新的 Dashboard，不覆盖现有工作台
- 自动重新生成 Dashboard / Widget ID，避免和目标 Vault 冲突
- 保留 Widget 组合、标题、配置、桌面布局、隐藏状态、移动端排序、折叠状态和紧凑模式
- 如果目标 DashFlow 缺少导出文件使用的 Widget 类型，会拒绝导入并提示缺失类型
- 导入前校验格式版本、Widget ID、布局边界和可见卡片碰撞
- 命令面板也提供「导出当前 Dashboard JSON」和「导入 Dashboard JSON」

导出文件只包含 Dashboard UI 编排，不包含 Task、Project、Habit、Activity 或 Vault 笔记内容。

```text
Dashboard
  ↓ export
DashFlow Dashboard JSON
  ↓ import into another Vault
New Dashboard with remapped IDs
```

当前传输格式为 `dashflow-dashboard / formatVersion: 1`，后续格式升级会独立于插件内部 `data.json` schema 管理。

## v0.2.0：Dashboard Templates

新建工作台可以直接选择起始模板：

- **Daily Focus**：Quick Capture / Today / Progress / Upcoming / Calendar / Countdown / Heatmap
- **Project Management**：Projects / Today / Upcoming / Calendar / Milestone / Vault Pulse
- **Habit Tracker**：Habits / Habit Heatmap / Habit Calendar / Weekly Review
- **Weekly Review**：Weekly Review / Heatmap / Projects / Calendar / Vault Pulse
- **Minimal**：Quick Capture / Today / Progress

模板只保存 Widget 组合、默认配置、桌面布局和移动端初始顺序，不复制 Task / Project / Habit 数据。创建之后，工作台会立即变成普通独立 Dashboard，可以继续拖拽、resize、删卡片、改 Widget 配置和手机排序。

“复制当前工作台”用来复制已经高度定制的 Dashboard；“从模板新建”更适合从标准场景开始。

## v0.1.9：Multiple Dashboards UI

- 顶部工作台切换器，可在多个 Dashboard 之间快速切换
- 新建、重命名、复制、删除工作台
- 至少保留一个 Dashboard
- 删除当前工作台后自动切换到有效工作台
- 每个 Dashboard 独立保存桌面布局、Widget 配置、手机排序、折叠状态和紧凑模式

例如可以同时维护：

```text
Home      → 日常总览
Work      → 工作项目 / Today / Calendar
Personal  → 个人任务 / Habit
Review    → Weekly Review / Heatmap
```

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
| Dashboard Template | 插件代码，仅作为起始布局 |
| Dashboard Transfer JSON | 可移植 UI 编排，不含业务数据 |
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
  ↓
Widget Registry + Widget Instances
  ↓
Dashboard Templates ──→ New Dashboard
                         ↓
Dashboard Collection ↔ Dashboard Transfer JSON
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

1. 自定义 Dashboard Template
2. Dashboard Template 分享 / 保存到模板库
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
