# DashFlow v0.5.5

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit / Daily Progress 继续以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、筛选、展示和直接操作。

> v0.5.5 是一轮 **Query & Performance Optimization**：不增加第二套数据库，不改变 Markdown 数据格式，而是把 `VaultIndex → Query → Dashboard / Search / Filter / Calendar / Review` 收敛成 revision-aware 的内存查询链路，让 Vault 变大后仍保持稳定响应。

## v0.5.5 · Query & Performance Optimization

### 受控 Vault 索引

旧实现首次索引 / 手动重建时会对所有 Markdown 文件一次性 `Promise.all`。小 Vault 没问题，但几千个文件时会同时制造大量 `cachedRead()` 和解析任务。

v0.5.5 改为固定并发 worker：

```text
Markdown files
      │
      ├─ worker 1
      ├─ worker 2
      ├─ ...
      └─ worker 8
             │
             ▼
        VaultSnapshot
```

默认最多 8 个文件同时进入读取 / 解析，降低启动瞬间的 I/O 峰值。

Obsidian 一次真实编辑还可能连续产生 `modify + metadata changed` 等事件。DashFlow 现在会按文件路径做短时间合并，同一个文件在 24ms 窗口内只保留最后一次待索引任务；显式 Task / Project / Habit 写入仍可直接要求立即索引。

### Revision-aware Query Layer

`VaultSnapshot.revision` 继续是单调递增的索引版本。v0.5.5 新增 `VaultQueryService`，把 revision 作为所有派生查询的统一失效边界：

```text
Vault events
    │
    ▼
VaultIndexService
    │
    └─ VaultSnapshot revision N
                 │
        ┌────────┴────────┐
        │ VaultQuery     │ Filter candidate index
        │                │ Calendar cache
        ▼                ▼
Today / Focus / Projects / Search / Visual Data Filter / Calendar / Review

Vault change → revision N+1 → 当前 revision 的派生缓存整体失效
```

派生缓存只存在内存，不写入 Vault，也不写入插件专有查询数据库。

### Task / Project / Habit

同一个 revision 内：

- Today / Focus / Overdue / Upcoming 不再反复扫描并排序全部 Task。
- Project → Task 使用一次构建的 `Map<projectId, tasks>`。
- task-derived Project progress 使用同一份项目任务统计，不再为每张项目卡扫描全部 Task。
- Active Project / Habit 集合只排序一次并复用。
- Dashboard 旧调用即使显式传入“当前 snapshot.tasks”，也会自动识别并走共享查询缓存；自定义测试数组仍保持原来的纯计算行为。

### Global Search

Global Search 不再每输入一个字符都重新创建三类实体的标准化搜索文本：

- 当前 revision 先预构建 Task / Project / Habit 的 lowercase searchable rows。
- 查询字符串统一 trim / lowercase / collapse whitespace。
- 最近查询结果使用有界内存缓存。
- Vault revision 变化后自动清空。

### Visual Data Filter

Visual Data Filter 输入框仍然即时预览，但昂贵的候选标准化现在只对每个 `VaultSnapshot` 做一次：

- `DataFilterMatch`
- searchable text
- normalized tags `Set`
- normalized folder
- Note frontmatter lowercase `Map`

这些派生结构通过 `WeakMap<VaultSnapshot, DataFilterIndex>` 与 snapshot 生命周期绑定；旧 snapshot 不再被引用后可以自然 GC，不形成第二份持久数据。

### Calendar / Weekly Review

Calendar 会按 `revision + 日期区间 + 显示开关` 缓存事件展开结果。相同月份 / 周区间重复渲染时，不再重复：

- 扫描全部 Task / Project
- 对每个 active Habit 逐日展开 schedule
- 重复排序 CalendarEvent

缓存最多保留 32 个 Calendar query；revision 改变后整体清空。Weekly Review 复用 Project progress 与 Calendar cache，因此也会同步受益。

### 有界缓存与大数据回归

- 动态 Query cache 最多 64 个 key。
- Calendar cache 最多 32 个 query。
- Data Filter candidate index 与 snapshot 使用 WeakMap 绑定。
- 测试包含 12,000 Task + 200 Project 的合成 snapshot，验证项目索引、搜索与日期查询语义。
- 回归测试不使用脆弱的“CI 必须低于 X ms”阈值，而是锁定缓存复用、revision 失效、索引结构与并发上限。

### 数据兼容

- `SCHEMA_VERSION` 仍为 `7`。
- Task / Project / Habit / Daily Progress Markdown 格式不变。
- Dashboard / Widget config 格式不变。
- 没有持久化 query database。
- 升级后不需要迁移 Vault 或 `data.json`。

这套 revision/in-memory-index 思路参考了 Dataview 等成熟 Obsidian 查询项目的索引模式，但 DashFlow 只借鉴“索引 revision 作为下游失效边界”的架构原则，仍使用自己的轻量 TypeScript / Obsidian 实现。

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

Query / Filter / Calendar 的 v0.5.5 性能缓存只存在内存，不进入 `data.json`。

安全原则：

- AI / 微信读书 API Key 使用 Obsidian SecretStorage / Keychain
- Morning Briefing 读取 Daily Note 正文需要独立授权
- AI News 不抓文章正文
- Magic Embed 默认不自动联网并使用 sandbox iframe
- 不提供任意 JavaScript 执行配置

## Roadmap implementation policy

DashFlow 的新能力优先研究成熟 Obsidian / TypeScript 项目的架构与 UX，再按自己的 Markdown-first、Widget、Design System 和 service 架构重新实现。0.5 路线参考过 auto-news、news-digest、Dataview / Datacore、statusbar-pomo-obsidian、ObsidianCustomFrames 等项目，但不把外部框架或数据库直接拼进 DashFlow。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
