# DashFlow v0.2.5

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和直接操作。

## v0.2.5：Aurora UI

这一版根据真实 Obsidian 使用截图重新定义 DashFlow 的视觉语言与默认工作流布局，不是对旧白卡片主题做小修小补。

### Aurora 视觉系统

- 独立的 Violet / Cyan / Green / Gold / Rose Aurora 色系，并继续吸收 Obsidian Accent 作为动态主色
- Light 使用冷白蓝灰 Canvas；Dark 使用深海军蓝 Canvas，不再让所有层级都落在同一种背景亮度
- 页面使用大尺度 Aurora 环境光，Card 使用克制的 glass / blur / edge highlight，而不是所有内容都玻璃化
- Today Tasks 成为首屏视觉焦点，拥有更强的 Accent / Cyan 空间光和边缘层级
- Widget 按角色分色：Capture=Cyan、Progress/Habit=Green、Project=Violet、Countdown=Gold、Calendar=Cyan、Review=Purple
- Quick Capture CTA 使用 Violet → Cyan 渐变；Progress 使用 Green；Countdown 使用 Gold → Rose 数字渐变
- Heatmap 从单 Accent 改成 Violet / Cyan 强度梯度，高强度数据才出现轻微 glow
- Calendar 普通日期保持安静，Today / Selected / Event 承担颜色；Agenda 成为独立内层 surface
- Project / Weekly Review 内部继续使用扁平信息行，避免“卡片套卡片”
- `prefers-reduced-motion` 仍然生效

### Command Center 顶部

Hero 不再只是一个大标题，而是一个工作台状态面板：

```text
Dashboard Name
今天日期 · 今日待办 · 活动项目
                                  编辑布局
```

Vault Pulse 位于 Hero 下方作为紧凑 KPI dock。

### 新默认 Home 布局

首屏从“多个等权 Widget”改为明确的执行优先级：

```text
┌────────────────────────┬──────────────────┐
│ Today Tasks             │ Quick Capture    │
│ 7 columns · primary     ├───────┬──────────┤
│                         │Progress│Countdown │
├─────────────────────────┼───────┴──────────┤
│ Projects                │ Upcoming          │
├─────────────────────────┼───────────────────┤
│ Habits                  │ Activity          │
├─────────────────────────┴───────────────────┤
│ Weekly Review                               │
├─────────────────────────────────────────────┤
│ Calendar                                    │
├─────────────────────────────────────────────┤
│ Vault Pulse                                  │
└─────────────────────────────────────────────┘
```

Untouched 的旧 Home（包括 v0.2.3 和 v0.2.4 默认布局）会安全迁移到 Aurora 布局，同时保留 Widget 配置。用户手动移动 / resize 过的 Dashboard 不会被强制覆盖。

### Settings Control Center

设置页也重新设计：

- 顶部产品 Hero + 当前版本
- Inbox / Project / Habit 识别设置放进同一个紧凑 Data & Recognition panel
- Project / Habit Markdown 协议并排显示为 code cards
- 不再使用四块巨大的默认灰色 Setting 卡片

数据边界没有改变：视觉重构不会复制或迁移 Task / Project / Habit 业务数据。

## 核心能力

- 独立 Obsidian Dashboard View
- 12 列桌面网格：拖拽、resize、碰撞推挤与自动压缩
- 手机独立单列排序、折叠和紧凑模式
- 多 Dashboard：新建、切换、重命名、复制、删除
- 5 套内置 Dashboard Template
- 当前 Dashboard 保存为自定义 Template
- Dashboard JSON 导入 / 导出，可跨 Vault 搬运 UI 编排
- Widget 多实例与独立配置
- Task 创建 / 编辑 / 完成并安全写回 Markdown
- Project 自动关联任务并计算进度
- Habit 打卡、streak、30 天完成率和目标进度
- Activity Tracker + Heatmap
- Calendar 月视图 + Agenda
- Weekly Review + Markdown 周报复制
- Quick Capture / Countdown / Vault Pulse

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

## Dashboard Templates

内置起始模板：

- **Daily Focus**：Quick Capture / Today / Progress / Upcoming / Calendar / Countdown / Heatmap
- **Project Management**：Projects / Today / Upcoming / Calendar / Milestone / Vault Pulse
- **Habit Tracker**：Habits / Habit Heatmap / Habit Calendar / Weekly Review
- **Weekly Review**：Weekly Review / Heatmap / Projects / Calendar / Vault Pulse
- **Minimal**：Quick Capture / Today / Progress

也可以在「管理工作台」里把当前 Dashboard 保存为自己的模板。模板保存 Widget、配置和布局，不包含 Task、Project、Habit、Activity 或 Vault 笔记内容。

## Dashboard 导入 / 导出

Dashboard Transfer JSON 只包含可移植的 UI 编排：

```text
Dashboard
  ↓ export
DashFlow Dashboard JSON
  ↓ import
New Dashboard with remapped IDs
```

导入始终创建新 Dashboard，并重新生成 Dashboard / Widget ID。当前传输格式为 `dashflow-dashboard / formatVersion: 1`。

## BRAT 安装 / 更新

DashFlow 每个主版本会自动创建和 `manifest.json` 同版本的 GitHub Release，并附带：

- `main.js`
- `manifest.json`
- `styles.css`

因此可以在 BRAT 中添加：

```text
https://github.com/SmartLogicHub/DashFlow
```

也可以手动把 Release 中三个文件放到：

```text
<你的 Vault>/.obsidian/plugins/dashflow/
```

然后在 Obsidian → 设置 → 第三方插件中启用 **DashFlow**。

## Task 格式

```md
- [ ] 写 Calendar 📅 2026-08-20
- [ ] 提前安排实现 ⏳ 2026-08-18 📅 2026-08-20
- [ ] 紧急任务 ⏫ 📅 2026-08-18
- [ ] 完成 Widget Registry #project/dashflow
```

支持：

- due：`📅 YYYY-MM-DD`
- scheduled：`⏳ YYYY-MM-DD`
- start：`🛫 YYYY-MM-DD`
- completed：`✅ YYYY-MM-DD`
- urgent：`⏫` / `🔺`
- high：`🔼`
- low：`🔽`
- project：`#project/<id>`

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
| Built-in Dashboard Template | 插件代码，仅作为起始布局 |
| Custom Dashboard Template | 插件 `data.json` 中的 UI 编排快照 |
| Dashboard Transfer JSON | 可移植 UI 编排，不含业务数据 |
| WidgetInstance | 插件 `data.json` |
| Dashboard 集合 / activeDashboardId | 插件 `data.json` |
| Desktop / Mobile layout | 每个 Dashboard 独立 UI 状态 |
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
Dashboard Collection
  ↓
Layout Engine
  ├── Desktop 12-column grid
  └── Mobile single-column order
  ↓
Aurora Design + Interaction Layer
  ↓
Dashboard View
```

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

## 近期版本

- **v0.2.5** — Aurora UI + Command Center layout + Settings redesign
- **v0.2.4** — Visual Polish + refined Home layout
- **v0.2.3** — UI / Design System 2.0
- **v0.2.2** — 自定义 Dashboard Template
- **v0.2.1** — Dashboard JSON 导入 / 导出
- **v0.2.0** — 5 套内置 Dashboard Templates
- **v0.1.9** — Multiple Dashboards UI
- **v0.1.8** — 移动端排序 / 折叠 / 紧凑模式
- **v0.1.7** — Weekly Review
- **v0.1.6** — Calendar + Agenda
- **v0.1.5** — Habit
- **v0.1.4** — Activity Tracker + Heatmap

## 下一阶段

1. Calendar Week View / 更完整 scheduled 编辑
2. Habit 自定义周期 / 提醒
3. Dashboard Template 分享 / 模板库体验
4. 自定义 Query / Widget

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

通过后上传可安装 artifact，并在 `main` 上自动发布 BRAT-compatible GitHub Release。
