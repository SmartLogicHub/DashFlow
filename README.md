# DashFlow v0.3.2

DashFlow 是建立在 Obsidian Vault 之上的个人工作 Dashboard。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

## v0.3.2 · Command Dashboard

这一版根据真实 Obsidian Dashboard 参考重新确定视觉方向：**不在 Obsidian 里面再造第二套 App 外壳，而是让 Obsidian 自己负责左右侧栏，DashFlow 专注中间工作区。**

默认界面由五层组成：

```text
Purple Command Banner
Vault Pulse
Dashboard identity + date/time
Horizontal command bar
Dense editable widget grid
```

### 视觉与布局

- 紫黑色横幅成为唯一强视觉焦点，Light / Dark 下都保持统一品牌识别
- Vault Pulse 压缩为终端式状态条，不再使用大 KPI 卡
- Dashboard 标题、版本和日期时间放在同一信息层
- 取消 DashFlow 自己的全高左侧导航，不与 Obsidian 文件树和右侧插件栏争夺宽度
- 横向命令条提供主页、项目、收集箱、日历、习惯、复盘，以及新建任务 / 项目 / 习惯、搜索和可选 AI 规划
- 默认 Home 恢复 Bento/Grid，但卡片更紧凑、边框更细、留白更少
- 桌面默认首屏：Quick Capture / TODO / Progress / Upcoming；第二层 Projects；第三层 Activity + Countdown
- Habit / Calendar / Review 继续作为独立工作流存在，不强塞首屏
- 编辑布局继续支持拖拽、resize、配置、添加、删除和重置；编辑工具条改成浮动 pill
- 手机仍然使用单列内容，不做自由 resize

### 工作流

**主页**
- 快速捕捉直接写入 Inbox
- TODO 显示今天与逾期任务
- Progress 使用真实任务数据
- Upcoming 显示未来截止任务
- Projects 显示真实项目进度并可进入项目详情
- Activity 使用真实 Activity 数据
- Countdown 使用 Widget 配置的目标日期

**收集箱**
- 顶部输入后按 Enter 即可捕捉
- 只显示尚未整理的开放任务
- 点击任务进入完整任务编辑器

**项目**
- 项目列表、进度、任务完成数
- 点击进入 Project Detail
- Project Detail 中可新建已关联项目的下一步任务

**日历 / 习惯 / 复盘**
- Calendar + Agenda
- Habit check-in / streak / history
- Weekly Review + Activity + Vault stats

### 可选 AI 日计划

- 默认兼容 DeepSeek OpenAI Chat Completions API
- API Key 使用 Obsidian SecretStorage / Keychain
- 只有用户主动点击 AI 规划时才请求
- 只发送结构化任务 / 项目 / Habit 摘要，不发送笔记正文
- AI 只给建议，不自动修改 Vault

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
- 多 Dashboard、内置模板、自定义模板、JSON 导入 / 导出
- Desktop Grid 与移动端排序
- 全局搜索与快速新建
- 可选 AI 日计划

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍留在 Vault Markdown 中。Dashboard 布局、模板与 Activity 派生统计保存在插件数据中；AI API Key 保存在 Obsidian SecretStorage 中。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
