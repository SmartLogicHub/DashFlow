# DashFlow v0.4.0

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

## v0.4.0 · Personal OS Home

这一版把此前互相冲突的两种需求正式拆开：

- **Home / 主页**：有情绪、有个人感，回答“我现在处于什么状态、长期在成长什么”。
- **Work / 工作台**：保留 v0.3.2 的高密度 Command Dashboard，回答“我现在具体要推进什么”。

这样首页不再是所有 Widget 的总和，工作台也不需要承担生活主页的视觉职责。

### Personal Home

主页包含：

- 情绪化 Hero：日期、个人标题、副标题、进入工作台、记录灵感
- Today Focus：真实今日 / 逾期任务，可直接完成或编辑
- 今日状态：今日任务完成率、Habit 完成数、活动项目数、Activity streak
- 长期成长四领域：工作、生活、时间、复盘；点击进入对应工作流
- 最近 30 天 Activity 热力条
- 最近修改的 Markdown 笔记

### Hero 与主题

DashFlow **不会内置或请求远程库存照片**。默认 Hero 使用主题渐变；用户可以直接从 Vault 中选择 JPG / PNG / WebP / AVIF / GIF 图片。

推荐使用低饱和、横向构图、主体不过度居中的图片，例如：

- 雪山 / 湖泊 / 冰川：最适合 Alpine 冷蓝灰主题
- 森林 / 海岸：适合安静的生活主页
- 极简建筑 / 城市夜景：适合偏工作型 Personal OS

内置四套外观：

```text
Alpine    冷蓝灰 / 风景型
Paper     暖白 / 纸张型
Midnight  深色 / 沉浸型
Obsidian  跟随当前 Obsidian Theme / Accent
```

设置里可以直接搜索并选择 Vault 图片，也可以调整 Hero 标题、副标题和图片遮罩；图片留空时自动回到主题渐变。

### Work · Command Dashboard

工作台继续保留 v0.3.2 的真实高密度能力：

- Quick Capture / TODO / 双任务完成率 / Upcoming
- Project progress + DashFlow Project Detail
- Activity Heatmap
- Countdown
- 可编辑 Bento/Grid：拖拽、resize、配置、添加、删除、重置
- Obsidian 左右原生 Sidebars 不被 DashFlow 占用

### Quick Add

Quick Capture 不再必须长期占据 Personal Home。全局 **Quick Add** 可以从命令面板或顶部「添加」呼出：

- 直接输入一句话并按 Enter → 进入 Inbox
- 「详细任务」→ 设置计划日 / 截止日 / 优先级 / 项目
- 新建项目
- 新建习惯

### 其他工作流

- Inbox：只显示尚未整理的任务；补充项目或日期后自动离开待整理状态
- Projects：项目进度、详情、下一步任务
- Calendar：Calendar + Agenda
- Habits：Habit check-in / streak / history
- Review：Weekly Review + Activity + Vault stats
- Search：跨 Task / Project / Habit 搜索
- AI 日计划：可选，API Key 使用 Obsidian SecretStorage / Keychain

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

## 核心能力

- Vault 增量索引
- Task 创建 / 编辑 / 完成 / 计划日 / 截止日 / 优先级 / 项目关联
- Project 创建 / 编辑 / 详情 / 自动任务进度
- Habit 创建 / 编辑 / 打卡 / streak / 目标
- Activity Tracker + Heatmap
- Calendar + Agenda
- Weekly Review
- Personal Home + Work Command Dashboard
- 多 Dashboard、内置模板、自定义模板、JSON 导入 / 导出
- Desktop Grid 与移动端单列体验
- 全局搜索与 Quick Add
- 可选 AI 日计划

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍留在 Vault Markdown 中。Dashboard 布局、Personal Home 外观、模板与 Activity 派生统计保存在插件数据中；Hero 图片只引用 Vault 文件，不上传；AI API Key 保存在 Obsidian SecretStorage 中。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
