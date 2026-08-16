# DashFlow v0.3.1

DashFlow 是建立在 Obsidian Vault 之上的个人工作系统。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、组织、呈现和直接操作。

## v0.3.1：Studio UI

这一版继续沿用 v0.3.0 的 Today / Inbox / Projects / Calendar / Habits / Review 产品结构，但把默认界面从“经过包装的 Dashboard Grid”进一步改成真正的应用视图。

设计研究主要参考成熟生产力产品的共同原则：导航应后退、主内容应成为视觉焦点、Today 应是执行面、Quick Capture 应是随手记录入口而不是一张大卡、项目和任务应该直接可操作，而不是展示技术数据。

### Today

- 默认不再渲染 Widget 网格；Today 使用独立 DOM 工作区
- 黑色重侧栏改成轻量半透明导航面板
- 删除四张等权 KPI 卡，改为一条低权重的当天上下文信息
- 顶部增加真正可用的快速输入：输入文字并按 Enter，会直接创建一个计划在今天的任务
- 今日任务成为唯一主面板；逾期、计划日、项目和优先级通过轻量 metadata 呈现
- 右侧只保留接下来 7 天、活动项目和今日习惯三个上下文面板
- 空状态不再占据巨大灰色矩形，会提供明确下一步动作

### Inbox

- 收集箱使用独立处理队列
- 顶部输入可以直接捕捉想法到 Inbox
- 任务一旦补充项目、计划日、开始日或截止日，就会离开“未整理”状态

### Projects

- 项目从进度条表单行改成项目 Portfolio Board
- 卡片展示状态、描述/截止日、下一步数量和进度
- 点击直接进入项目详情，而不是跳进 Markdown

### Calendar / Habits / Review

这些复杂工作流继续复用已经稳定的 Calendar / Habit / Weekly Review 行为，但放进新的 Studio workflow canvas：

- Calendar 独立全宽
- Habits + Activity 在宽屏双栏、窄屏自动单列
- Review 独立纵向工作流

### 高级布局

旧 Dashboard Grid 没有删除。它现在是高级自定义能力：用户点“自定义布局”时仍可编辑 Widget、布局和 Dashboard；正常使用时它不再决定默认产品界面。

## 工作流

```text
DashFlow
├── 今天
├── 收集箱
├── 项目
├── 日历
├── 习惯
└── 复盘
```

## 可选 AI 日计划

- 默认兼容 DeepSeek OpenAI Chat Completions API
- API Key 使用 Obsidian SecretStorage / Keychain
- 只有用户主动点击 AI 规划才会请求
- 只发送任务 / 项目 / 习惯的结构化摘要，不发送笔记正文
- AI 建议不会自动修改 Vault

最低 Obsidian 版本为 **1.11.4**。

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
- Desktop Grid 高级布局
- 全局搜索 / 快速新建
- 可选 AI 日计划

## 开发

```bash
npm install
npm test
npm run build
```

构建输出：`main.js`。CI 同时执行测试、TypeScript build、bundle、`node --check main.js`，并上传插件 artifact。

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍然留在 Vault Markdown 中。Dashboard 布局、模板与 Activity 派生统计保存在插件数据中；AI API Key 保存在 Obsidian SecretStorage 中。
