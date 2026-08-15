# DashFlow v0.2.4

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源，Dashboard 负责查询、展示和直接操作。

## v0.2.4：Visual Polish

这一版根据真实 Obsidian 截图做视觉与布局复盘，不继续堆业务功能。

重点：

- Home 主标题回归中性主文字色，不再被第三方主题的 Heading Color 染成 Danger / 粉红语义
- 保留 Obsidian Accent Color，并把 Accent 用在光感、焦点、进度和交互上
- Canvas / Card / Inner Surface 三层表面更加明确，Light / Dark 都继续跟随 Obsidian 主题
- 页面背景增加克制的 Accent / Purple 环境光，不使用固定品牌皮肤
- Widget 增加非常轻的顶缘高光、hover 抬升和语义色边缘，不做大面积霓虹
- Vault Pulse / Dashboard Switcher 使用轻量 glass surface
- 提升 muted / faint 文本可读性
- Project 与 Weekly Review 内部行去掉“按钮/卡片套卡片”观感
- Calendar 日期格变平，Selected / Today / Event 才承担视觉强调；Agenda 成为独立 Inner Surface
- Heatmap 格子更大、间距更清晰，高强度格子使用轻微 Accent glow
- Habit / Weekly Review / Calendar 继续遵守 Success / Warning / Danger / Info 语义色
- 默认 Home 网格从约 36 行压缩到 31 行，Today Tasks 更宽、Progress 更轻、Projects 成为主区域
- 只自动迁移完全保持 v0.2.3 默认位置的 Home；用户手工移动过的 Dashboard 不会被覆盖
- 保持 `prefers-reduced-motion` 与移动端独立单列体验

```text
Obsidian Theme / Accent
        ↓
DashFlow semantic tokens
        ↓
Canvas → Card → Inner Surface
        ↓
Accent + Success / Info / Warning / Danger
        ↓
Dashboard / Calendar / Habit / Review / Heatmap
```

设计目标不是 Dribbble 式炫技，而是 **更有氛围、更有层级，同时仍能每天长时间使用**。

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
Design System + Visual Polish
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
