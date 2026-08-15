# DashFlow v0.2.3

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和直接操作。

## v0.2.3：UI / Design System 2.0

这一版暂停堆业务功能，集中统一 DashFlow 的视觉系统和交互层级：

- 配色继续跟随 Obsidian Light / Dark、Accent Color 和社区主题，不写死一套 Dashboard 皮肤
- 使用 Obsidian 的扩展颜色建立语义色：Info / Success / Warning / Danger / Purple / Cyan
- 卡片、边框、浮层、按钮和编辑栏统一成一套 surface / border / shadow tokens
- Light / Dark 分别调整卡片表面与阴影强度
- Widget 图标根据内容类型获得克制的语义强调色
- Calendar：due / scheduled / project deadline / habit 使用不同语义色
- Habit：打卡、进度和完成状态统一使用 Success 色
- Weekly Review：Overdue / Project / Habit badge 使用一致的 Danger / Warning / Success 色
- Heatmap：四档强度继续从当前 Obsidian Accent 动态生成
- Vault Pulse 的 Overdue 数量使用 Danger 强调
- Dashboard 模板卡片、管理弹窗、导入导出弹窗和 Task / Habit Editor 做统一视觉收敛
- 增加 `:focus-visible` 键盘焦点状态
- 支持 `prefers-reduced-motion`，减少不必要的 hover / transition 动效

```text
Obsidian Theme / Accent
        ↓
DashFlow Design Tokens
        ↓
Surface / Border / Accent / Semantic Colors
        ↓
Widgets / Calendar / Habit / Weekly Review / Heatmap / Modals
```

DashFlow 不维护一套固定的“品牌蓝/品牌绿”覆盖用户主题，而是优先继承 Obsidian CSS variables，再用语义映射增强信息层级。

## 核心能力

- 12 列桌面 Dashboard，拖拽、resize、碰撞推挤和自动压缩
- 手机独立单列排序、折叠和紧凑模式
- 多 Dashboard：新建、切换、重命名、复制、删除
- 5 套内置 Dashboard Template
- 把当前 Dashboard 保存成自定义 Template
- Dashboard JSON 导入 / 导出，可跨 Vault 搬运 UI 编排
- Widget 多实例与独立配置
- Task 创建 / 编辑 / 完成并直接写回 Markdown
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

也可以在「管理工作台」里把当前 Dashboard 保存为自己的模板。自定义模板保存 Widget、配置和布局，不包含 Task、Project、Habit、Activity 或 Vault 笔记内容。

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

## 安装测试版

GitHub Actions 构建成功后会生成 `dashflow-plugin` artifact，包含：

- `manifest.json`
- `main.js`
- `styles.css`

把三个文件放入：

```text
<你的 Vault>/.obsidian/plugins/dashflow/
```

然后在 Obsidian → 设置 → 第三方插件中启用 **DashFlow**。开发阶段建议使用测试 Vault。

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
Built-in Templates ───────┐
Custom Templates ─────────┼──→ New Dashboard
Dashboard Transfer JSON ──┘
                           ↓
Dashboard Collection
  ↓
Layout Engine
  ├── Desktop 12-column grid
  └── Mobile single-column order
  ↓
Design System 2.0
  ↓
Dashboard View
```

## 近期版本

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
- **v0.1.3** — Task Editor
- **v0.1.2** — Widget Configuration
- **v0.1.1** — Layout Engine

## 下一阶段

1. Dashboard Template 分享 / 模板库体验
2. Calendar 周视图 / 更完整 scheduled 编辑
3. Habit 自定义周期 / 提醒
4. 自定义 Query / Widget

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部通过后才上传可安装 artifact。
