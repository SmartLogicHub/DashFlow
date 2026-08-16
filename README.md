# DashFlow v0.5.4

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit / Daily Progress 继续以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、筛选、展示和直接操作。

> v0.5.4 完成 DashFlow Intelligence & Workflow 路线：新增时间戳驱动的 **Focus** 与默认不自动联网的 **Magic Embed**，并延续 v0.5.3.1 的完整 Note Visual Data Filter、v0.5.2 AI News、v0.5.1 Quick Capture / Context Switcher 和 v0.5.0 Intelligence Core。

## v0.5.4 · Focus & Safe Extensibility

### Focus

Focus 是一个普通 Dashboard Widget，但计时状态是全局共享的：在不同 Dashboard 放多个 Focus 卡片时，它们显示的是同一个专注会话，不会各自启动互相冲突的计时器。

- 专注 / 短休息 / 长休息三种模式
- 默认 `25 / 5 / 15` 分钟，可按 Widget 配置
- 可配置每完成多少次专注进入一次长休息
- 开始 / 暂停 / 恢复 / 重置 / 跳过
- 切换 Dashboard 后继续运行
- Obsidian 重启后恢复同一个会话
- 电脑休眠跨过结束时间后，恢复时按真实时间结算

Focus 的时间真相不是“每秒减 1”，而是一个持久化的 `endsAt` 时间戳：

```text
start -> endsAt = now + duration
pause -> pausedRemainingMs = endsAt - now
resume -> endsAt = now + pausedRemainingMs
reload/sleep -> remaining = max(0, endsAt - Date.now())
```

界面的 1 秒刷新只负责重新计算显示，不负责推进业务状态。完成结算由一次性 timeout + 启动时 reconcile 处理。

### Focus Activity

完成的专注会进入现有 Activity 派生统计：

- `focusSessions`
- `focusMinutes`
- `completedFocusSessionKeys`

每个完成 session 使用稳定 session ID 去重，因此崩溃、休眠或重复 reconcile 不会把同一轮专注重复计算。Task / Project / Habit Markdown 不会因为 Focus 被修改。

### Magic Embed

Magic Embed 用于在 Dashboard 中按需嵌入 Web 页面，同时把“可扩展”与“任意代码执行”分开。

安全边界：

- 远程页面只接受 `https://`
- 本地开发允许 `http://localhost` / `127.0.0.1` / loopback
- `javascript:` / `data:` / `file:` 等协议不会加载
- 带 URL username/password 的地址不会加载
- 导入 Dashboard 后**不会自动联网**
- 必须由用户点击「加载嵌入内容」
- 授权只存在于当前 Obsidian 会话，重启后需要重新加载
- iframe 使用 `sandbox`
- 不授予 `allow-same-origin`
- 表单提交默认关闭；开启后只增加 `allow-forms`
- `referrerPolicy="no-referrer"`
- 外部链接使用 `noopener noreferrer`
- 不提供 `eval`、`new Function`、用户 JavaScript 配置或任意代码注入入口

```text
Magic Embed
┌──────────────────────────────────────────────┐
│ example.com                                  │
│ 嵌入内容尚未联网加载。                       │
│                                              │
│ [加载嵌入内容]   在浏览器打开                │
└──────────────────────────────────────────────┘
```

## v0.5.3.1 · Complete Visual Data Filter

v0.5.3.1 补齐 Visual Data Filter 的 Note 侧能力。Note 不是第二套数据库，而是由 Vault + MetadataCache 在现有增量索引中派生出的只读记录：

- path / name / folder
- tags
- scalar frontmatter
- Markdown task 总数 / 完成数
- ctime / mtime

可视筛选支持：

- Entity：Note / Task / Project / Habit / All
- State：进行中 / 已完成 / 全部
- Date：早于今天 / 今天 / 未来 7 天 / 未来 30 天 / 无日期
- Keyword
- Tag
- Folder 前缀
- Frontmatter：`key` 或 `key=value`
- Note task status：含任务 / 有未完成任务 / 任务已清空 / 无任务
- Sort：日期 / 名称 / 类型
- Result limit

筛选条件只保存在 Widget config；结果始终从实时 `VaultSnapshot` 计算。

## v0.5.3 · Visual Data Filter

v0.5.3 引入纯查询引擎与 Visual Data Filter Widget：不要求用户写 query language，而是通过按钮、下拉框和输入框组合条件。Task / Project / Habit 结果继续复用现有编辑器；Note 结果直接打开原 Markdown。

## v0.5.2 · AI News Curation

AI News 是可添加的 Dashboard Widget：

1. 通过 Obsidian `requestUrl` 获取公开 RSS / Atom。
2. DOMParser 解析并规范化。
3. 稳定 ID + URL 去重。
4. 最多 12 个源、每源最多 12 条、候选最多 40 条。
5. 默认 4 小时 source cache。
6. `candidatesHash` 不变时复用已有 AI 排名，不重复花 Token。
7. 候选变化时只进行一次批量 `AIClient.completeJson()` 排名。
8. 展示 Top-K、评分和推荐理由。

DashFlow **不抓文章正文**。送给 AI Provider 的候选只包含 RSS / Atom 自带的标题、摘要、来源、日期和候选 ID。

自动 Feed 抓取还会拒绝 localhost、私网、link-local、`.local` 和过大的 Feed，避免导入 Widget 配置后自动探测内网。

## v0.5.1 · Quick Capture + Context Switcher

### Quick Capture

默认仍写入 `DashFlow/Inbox.md`，可以切换为：

- DashFlow Inbox
- 今天的 Daily Note
- 每次询问

写入 Daily Note 时会原样保留 `#标签` 与 `[[双链]]`，并复用统一 `DailyNoteService` 路径规则。已有笔记通过 `Vault.process()` 修改。

### Context Switcher

Dashboard 顶部可以把三个情景映射到已有 Dashboard ID：

```text
☀ Morning   ⚡ Work   ↻ Review   ⚙
```

它只负责快速切换已有 Dashboard，不复制 layout，不建立第二套工作台数据模型。

## v0.5.0 · Intelligence Core + AI Morning Briefing

v0.5.0 把 AI 网络层集中为共享 `AIClient`：

```text
                    AIClient
                       │
          ┌────────────┼────────────┐
          │            │            │
     AI Planning   Morning Brief   AI News
```

统一支持 OpenAI-compatible `/chat/completions`、Base URL / Model / SecretStorage API Key，并支持 localhost / Ollama compatible endpoint。

AI Morning Briefing 是独立 opt-in：只有用户明确授权后，DashFlow 才读取昨日 Daily Note 正文并发送到配置的 AI Base URL。缓存按 `日期 + 来源路径 + source hash` 失效。

## v0.4.5–v0.4.6 · Daily Progress

Daily Progress 是有开始、终点和每日推进记录的长期任务语义，与普通 Habit 分开：

- 每日完成 / 取消完成
- 历史日期回填
- 连续推进天数
- 目标天数 / 进度
- 今日推进备注
- 关联 Project
- Home / Today 独立指标与推进卡
- Weekly Review 独立完成率和本周备注摘要

旧 Habit 没有 `habit_kind` 时继续按普通 Habit 解析，不需要迁移。

## 产品结构

### Home · Personal Home

- Hero：日期、个人标题、副标题、开始今天、收集灵感
- AI Morning Briefing（明确授权后）
- 微信读书个人划线
- Today + Task / Habit / Daily Progress / Project / Activity 状态
- Daily Progress 今日推进
- 最近 Activity 与最近修改的 Vault Markdown

### Dashboard · Execution Surface

Dashboard 支持：

- Desktop drag / resize
- 移动端单列布局
- Widget config / add / remove / reset
- 多 Dashboard
- 内置模板与自定义模板
- JSON import / export
- Morning / Work / Review Context Switcher
- Focus
- Visual Data Filter
- AI News
- Magic Embed
- Countdown / Calendar / Heatmap / Weekly Review 等现有 Widget

### Quick Add

- 一句话进入 Inbox / Daily Note / 每次询问
- 详细任务
- 新建项目
- Habit / Daily Progress

## AI 配置

DashFlow AI 使用 OpenAI-compatible 接口：

```text
Base URL: https://api.deepseek.com
Model:    你的服务支持的模型
API Key:  Obsidian SecretStorage / Keychain
```

本地 Ollama 示例：

```text
Base URL: http://localhost:11434/v1
Model:    你的本地模型
API Key:  可留空
```

AI Key 不写入 `data.json`。

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

## 数据与安全边界

DashFlow 不把 Task / Project / Habit / Daily Progress 锁进专有数据库。删除插件后，这些业务数据仍留在 Vault Markdown 中。

插件私有数据主要保存：

- Dashboard layout / Widget config / templates
- Context 映射与 Quick Capture 偏好
- Personal Home 外观
- Activity 派生统计
- Focus 计时状态
- AI Morning Briefing / AI News 缓存
- UI state

安全原则：

- AI / 微信读书 API Key 使用 Obsidian SecretStorage / Keychain
- Morning Briefing 读取 Daily Note 正文需要独立授权
- AI News 不抓文章正文
- Magic Embed 默认不自动联网并使用 sandbox iframe
- 不提供任意 JavaScript 执行配置

## Roadmap implementation policy

本轮 0.5 路线参考了成熟 Obsidian / TypeScript 项目的架构与 UX 思路，包括 auto-news、news-digest、Dataview / Datacore、statusbar-pomo-obsidian、ObsidianCustomFrames 等；DashFlow 按自己的 Markdown-first、Widget、Design System 和 service 架构重新实现，没有引入第二套数据库或无关框架。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
