# DashFlow v0.1.2

DashFlow 是一个建立在 Obsidian Vault 之上的个人工作台。Task / Project 继续以 Markdown / frontmatter 为真实数据源，Widget 和 Dashboard 负责查询、展示和操作。

## v0.1.2：Widget 配置系统

这一版把“每张卡片都能独立配置”正式做进 Widget 架构，而不是继续在各个组件里写特殊设置逻辑。

进入 **编辑布局** 后，每张卡片右上角会出现 `⚙`。打开后可以：

- 为当前 Widget 实例设置独立标题
- 修改该 Widget 自己的参数
- 保存或取消修改
- 一键恢复该 Widget 的默认配置
- 同一种 Widget 放多个实例，并分别设置不同参数

当前配置项：

| Widget | 可配置项 |
|---|---|
| 快速捕捉 | 输入框提示文字 |
| 今日任务 | 是否包含逾期任务、最多显示数量 |
| 今日进度 | 中央标签 |
| 项目 | 最多显示数量 |
| 即将到期 | 未来天数、最多显示数量 |
| 倒计时 | 标题、目标日期 |
| Vault Pulse | 实例标题 |

底层通过 `WidgetDefinition.settings` 定义配置 Schema。以后新增 Widget 只需声明字段，不需要再为每张卡单独实现一套设置窗口。

## v0.1.1：Layout Engine

已经完成：

- 卡片碰撞检测
- 拖动时自动推挤被碰撞卡片
- resize 级联重排
- 自动向上压缩空白
- 删除卡片后重新压缩
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
- Markdown Task 解析与直接勾选
- Project frontmatter + 自动项目进度
- Quick Capture → Inbox
- Today Tasks / Progress
- Projects / Upcoming
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

## 数据边界

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |

卸载 DashFlow 不会带走用户的 Task / Project 数据。

## Widget 配置架构

```text
WidgetDefinition
├── type / name / icon
├── size constraints
├── defaultConfig()
└── settings[]
      ├── text
      ├── number
      ├── toggle
      ├── date
      └── select

                ↓

WidgetInstance
├── title
├── config
└── layout
```

`settings[]` 描述“这个 Widget 允许用户配置什么”，`WidgetInstance.config` 保存“这一张具体卡片选择了什么”。

这意味着两张相同类型的 Tasks Widget 可以分别成为：

- 「今天」：包含逾期，最多 10 条
- 「轻量清单」：不包含逾期，最多 5 条

而不会互相影响。

## 下一阶段

Widget 配置系统稳定后，继续按这个顺序：

1. Task 编辑 Modal
2. Heatmap / Activity Tracker
3. Habit / 长周期任务
4. Calendar
5. 移动端排序模式
6. 多 Dashboard UI

## CI

GitHub Actions 执行：

```text
npm install
npm test
npm run build
node --check main.js
```

全部通过后才上传可安装 artifact。
