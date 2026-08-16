# DashFlow v0.4.5

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit / Daily Progress 都以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

> v0.4.5 新增长期任务「日更打卡」：把论文、考试、产品上线、写作挑战等长期目标拆成每天可推进的一格，并为每天保存自己的推进备注。

## v0.4.5 · Daily Progress

Daily Progress 与普通 Habit 共用稳定的长期追踪底座，但语义明确分开：

- **习惯 Habit**：适合运动、阅读、早睡等长期重复行为。
- **长期任务 Daily Progress**：适合有开始和终点的目标，例如“论文写作 60 天”“DashFlow 0.5 发布”“考试冲刺 30 天”。

长期任务支持：

- 每日完成 / 取消完成
- 历史日期回填
- 7–30 天进度格子
- 连续推进天数
- 完成天数 / 目标天数 / 百分比
- 今日推进备注
- 有备注的历史日期标记
- 可选关联现有 Project
- Active / Paused / Completed / Archived 状态
- 开始日期、结束日期、目标天数

每日完成状态继续写在 `habit_log`；每日文字记录独立写在 `daily_notes`，不会互相覆盖。

```yaml
---
type: habit
habit_id: dashflow-v05
habit_kind: daily-progress
name: DashFlow 0.5
status: active
frequency: daily
start: 2026-08-16
end: 2026-10-01
target_days: 46
linked_project: dashflow
habit_log:
  - 2026-08-16
  - 2026-08-17
daily_notes:
  2026-08-16: 完成设计系统与交互层整理
  2026-08-17: 完成 Daily Progress 数据模型
---
```

旧 Habit 文件没有 `habit_kind` 时始终按普通 Habit 解析，不需要迁移。

## v0.4.4 · Interaction & Flexible Dashboard

v0.4.4 已加入：

- 统一 Motion System：卡片 stagger 入场、数字反馈、hover、拖拽和 resize 状态
- Desktop 卡片自由拖拽排序与持久化
- Desktop 卡片自由 resize
- Container Query 驱动的 compact / normal / expanded 信息密度
- 多实例自定义 Countdown，每张卡片独立标题和目标日期
- Light / Dark 交互阴影与性能细节
- `prefers-reduced-motion` 完整支持

Desktop 支持自由拖拽和 resize；移动端保持稳定单列顺序与触控友好交互。

## 产品结构

### Home · Personal Home

Home 是个人状态和长期成长入口：

1. 约 194px Hero：日期、个人标题、副标题、开始今天、收集灵感
2. 微信读书每日划线：真实书籍、章节和个人划线
3. Today + 今日状态：任务、Habit、Daily Progress、活动项目与 Activity streak
4. 长期成长入口：工作 / 生活 / 时间 / 复盘
5. 最近 Activity 与最近修改的 Vault Markdown

### Work · 执行工作台

- 紧凑命令栏与 compact Hero
- Task 列表与真实优先级 / 日期 / 项目关联
- Project 行式结构与真实进度
- Today / All Tasks Progress
- Inbox / Calendar / Habits / Review 独立工作流
- Dashboard drag / resize / config / add / remove / reset
- Resize 后自动切换信息密度

### Habits · 长期节奏

Habits Widget 同时承载普通 Habit 和 Daily Progress：

```text
每天运动                 🔥 12
■■■■■□■                 ○ 打卡

DashFlow 0.5     日更 · ↗ DashFlow   连续 8 天
■■■■■■■                 📝 已记录  ✓ 今日已推进
████████████░░           18/46 · 39%
```

Daily Progress 的历史格子可以点击回填完成状态；今日可以直接写推进备注。

### 自定义 Countdown

在「编辑布局」中可以添加多个 Countdown：

```text
距 DashFlow 0.5 发布   46 DAYS
距考试                 23 DAYS
距旅行                128 DAYS
```

每个实例独立保存卡片标题、倒计时标签和目标日期。

### Quick Add

全局 Quick Add 支持：

- 一句话进入 Inbox
- 详细任务
- 新建项目
- 习惯 / 日更长期任务

## 微信读书

DashFlow 使用腾讯公开的微信读书 Agent API Gateway，只展示用户自己的真实个人划线，不伪造名言、封面或来源。

```text
POST https://i.weread.qq.com/api/agent/gateway
Authorization: Bearer wrk-...
skill_version: 1.0.4
```

API Key 只保存在 Obsidian SecretStorage / Keychain；不使用 Cookie 抓取；不伪造内容或 deep link。

## 核心能力

- Vault 增量索引
- Task 创建 / 编辑 / 完成 / 计划日 / 截止日 / 优先级 / 项目关联
- Project 创建 / 编辑 / 详情 / 自动任务进度
- Habit 创建 / 编辑 / 打卡 / streak / 目标
- Daily Progress 日更打卡 / 历史回填 / 每日备注 / Project 关联
- Activity Tracker + Heatmap
- Calendar + Agenda
- Weekly Review
- Personal Home + Work execution surface
- Motion System + Flexible Dashboard Grid
- 多实例自定义 Countdown
- 微信读书真实个人划线
- 多 Dashboard、内置模板、自定义模板、JSON 导入 / 导出
- Desktop Grid 与移动端单列体验
- 全局搜索与 Quick Add
- 可选 AI 日计划

## 数据格式

### Task

```md
- [ ] 整理发布计划 #project/dashflow ⏳ 2026-08-18 📅 2026-08-20
```

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

### Daily Progress

```yaml
---
type: habit
habit_id: thesis
habit_kind: daily-progress
name: 论文写作
status: active
frequency: daily
start: 2026-08-16
end: 2026-10-15
target_days: 60
linked_project: thesis
habit_log:
  - 2026-08-16
daily_notes:
  2026-08-16: 完成研究问题初稿
---
```

## 数据边界

DashFlow 不把业务数据锁进专有数据库。删除插件后，Task / Project / Habit / Daily Progress 仍完整留在 Vault Markdown 中。

插件私有数据主要保存 Dashboard 布局、Widget config、模板、Personal Home 外观、Activity 派生统计和 UI state。AI / 微信读书 API Key 保存在 Obsidian SecretStorage 中。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
