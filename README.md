# DashFlow v0.3.0

DashFlow 是建立在 Obsidian Vault 之上的个人工作系统。它不再把所有能力堆成一面 Widget 墙，而是把一天的工作拆成六个明确流程：**今天、收集箱、项目、日历、习惯、复盘**。

Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、组织、呈现和直接操作。

## v0.3.0：Product Reset

这一版根据真实 Obsidian 使用反馈和成熟任务产品的交互方式重新设计信息架构。

### 今天

打开 DashFlow 默认进入 Today：

- 今日计划 / 截止 / 逾期任务成为主工作区
- 紧凑显示今日待推进、逾期、活动项目与习惯完成情况
- Progress 和 Upcoming 是辅助信息，不再与任务争夺视觉焦点
- 活动项目只显示必要的进度；点击进入项目详情，而不是直接把用户扔进 Markdown

### 收集箱

“Quick Capture”不再占据首页一张大卡。所有尚未整理的快速任务进入真正的 Inbox 流程：

- 查看未整理任务
- 点击任务补充计划日期、截止日期、优先级和所属项目
- 完成或打开 Inbox 原文
- 全局“新建任务”仍然可以随时记录行动

### 项目

Project 现在是可操作对象：

- 从 DashFlow 直接新建 / 编辑项目
- 项目组合页显示状态、截止日、下一步任务数和进度
- 项目详情显示下一步行动、已完成任务和项目进度
- 在项目详情中直接创建已关联项目的任务
- 原始 Markdown 仍然保留为二级入口

### 日历 / 习惯 / 复盘

这些能力从 Today 撤出，分别成为清晰的工作流：

- **日历**：任务计划日 / 截止日、项目截止日、习惯节奏与 Agenda
- **习惯**：今日打卡、历史轨迹、连续天数、Heatmap
- **复盘**：Weekly Review、Activity、Vault 统计

### 全局搜索与命令

顶部 Search 可以跨 Task / Project / Habit 搜索，也可以直接新建任务、项目或习惯。命令面板同时提供 Today / Inbox / Projects / Calendar / Habits / Review 的直接入口。

### 可选 AI 日计划

v0.3.0 增加可选 AI Planning：

- 默认兼容 DeepSeek OpenAI Chat Completions API
- 默认 Base URL `https://api.deepseek.com`
- 默认模型 `deepseek-v4-flash`
- API Key 使用 Obsidian SecretStorage / Keychain；插件 `data.json` 只保存 secret 名称，不保存 Key
- 只有用户主动点击“AI 规划”才会发起请求
- 只发送未完成任务、活动项目和习惯的结构化摘要，不发送笔记正文
- AI 输出只是建议，不自动改写 Vault

因为使用 Obsidian SecretStorage，v0.3.0 的最低 Obsidian 版本为 **1.11.4**。

## 数据格式

### Task

```md
- [ ] 整理发布计划 #project/dashflow ⏳ 2026-08-18 📅 2026-08-20
```

DashFlow UI 可以直接编辑：标题、计划日期、开始日期、截止日期、优先级、所属项目和完成状态。

### Project

```yaml
---
type: project
project_id: dashflow
name: DashFlow
status: active
deadline: 2026-09-30
progress_mode: tasks
---
```

### Habit

```yaml
---
type: habit
habit_id: workout
name: 每天运动
status: active
frequency: daily
target_days: 30
habit_log:
  - 2026-08-15
---
```

## 现有能力

- Vault 增量索引
- Task 编辑 / 完成 / 日程 / 项目关联
- Project 新建 / 编辑 / 详情 / 任务进度
- Habit 新建 / 编辑 / 打卡 / 连续天数
- Calendar + Agenda
- Weekly Review
- Activity Heatmap
- 多 Dashboard、模板、自定义模板、导入 / 导出
- Desktop Grid 与移动端排序
- 全局搜索 / 快速新建
- 可选 AI 日计划

## 架构

```text
Obsidian Vault
  ↓
VaultIndexService
  ↓
Task / Project / Habit / Activity / Calendar
  ↓
Product Workflows
  ├── Today
  ├── Inbox
  ├── Projects
  ├── Calendar
  ├── Habits
  └── Review
  ↓
Dashboard / Search / Editors / Optional AI Plan
```

## 开发

```bash
npm install
npm test
npm run build
```

构建输出：`main.js`。CI 同时执行测试、TypeScript build、bundle、`node --check main.js`，并上传插件 artifact。

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍然留在 Vault Markdown 中。Dashboard 布局、模板与 Activity 派生统计保存在插件数据中；AI API Key 保存在 Obsidian SecretStorage 中。
