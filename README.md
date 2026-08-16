# DashFlow v0.5.2

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit / Daily Progress 都以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

> v0.5.2 新增 **AI News Curation**：把多个公开 RSS / Atom 信息源先在本地规范化、去重和缓存，再通过已有 `AIClient` 做一次个性化排序，只展示真正值得今天阅读的 Top-K 内容。

## v0.5.2 · AI News Curation

AI 早报是一个普通 Dashboard Widget，可以在「编辑布局 → 添加卡片」中加入，不会被写死在 Home。

每个实例都可以单独配置：

- **RSS / Atom 源**：换行、逗号或分号分隔，最多 12 个公开 HTTP(S) Feed。
- **兴趣 Prompt**：例如 `AI Agent、Obsidian、独立开发、效率工具`。
- **精选条数**：1–8 条，默认 3 条。
- **刷新周期**：1–24 小时，默认 4 小时。

```text
AI 早报                                      AI CURATED · 4H CACHE

01  OpenAI / Agent Runtime 新进展
    与你的 Agent / Personal OS 方向高度相关，值得关注接口变化。
    Source · 08/16 · 94/100

02  Obsidian 插件架构实践
    对插件状态管理和性能优化有直接参考价值。
    Source · 08/16 · 88/100

03  Local-first productivity tools
    与本地优先、可控数据边界方向一致。
    Source · 08/15 · 83/100
```

### 数据管线

```text
RSS / Atom
    │
    ├─ fetch（最多 12 源 × 每源 12 条）
    │
    ├─ normalize / clean
    │
    ├─ deduplicate
    │
    ├─ candidate cap（最多 40 条）
    │
    └─ AIClient.completeJson() 一次排序
                   │
                   └─ Top-K + score + 推荐理由
```

DashFlow **不抓取文章正文**。送给 AI Provider 的候选只包含 RSS / Atom 自带的标题、摘要、来源、发布日期和候选 ID；文章 URL 保留在本地用于打开原文。

### 缓存与 Token 控制

- Feed 在配置的刷新周期内直接使用缓存，不重复请求网络。
- 每次刷新会计算 `candidatesHash`。
- 如果候选内容没有变化，只更新时间并复用之前的 AI 排名。
- 只有候选真正变化后才再次调用 AI。
- AI News 缓存继续放在现有 `aiCache.news`，没有升级 `SCHEMA_VERSION`。

### 安全边界

AI News Widget 会在显示时自动读取配置的 Feed，因此 v0.5.2 对网络目标做了额外限制：

- 只允许公开 `http://` / `https://` Feed。
- 自动拒绝 `localhost`、`.localhost`、`.local`。
- 自动拒绝 IPv4 loopback、RFC1918 私网、link-local 与 `0.0.0.0/8`。
- 自动拒绝 IPv6 loopback、link-local 与本地 ULA 范围。
- 超大 Feed 会在 XML 解析前被拒绝。
- RSS 标题、摘要与来源始终被 AI Prompt 标记为**外部不可信数据**，其中的提示词不会被当作系统指令。
- 原文链接使用 `noopener noreferrer` 打开。

> 这里的限制只针对 **自动 Feed 抓取**。AI Provider 本身仍然可以配置为 `localhost` / `127.0.0.1` 的 Ollama 等本地 OpenAI-compatible 服务。

## v0.5.1 · Quick Capture + Context Switcher

### Quick Capture 目标

默认行为保持兼容：升级后仍然写入 `DashFlow/Inbox.md`。你可以在「配置 Quick Capture 与情景模式」中切换为：

- **DashFlow Inbox**：写成 `- [ ]` 待整理任务，并进入 Activity task-created 统计。
- **今天的 Daily Note**：写成普通 Markdown bullet，原样保留 `#标签` 与 `[[双链]]`。
- **每次询问**：提交时用轻量选择器决定 Inbox / Daily Note。

Daily Note 写入复用 AI Morning Briefing 的同一套路径规则，支持文件夹与 `YYYY / MM / DD` 日期格式；已有笔记使用 `Vault.process()` 安全修改。可以指定目标标题，例如：

```text
Daily Note: Daily Notes/2026-08-16.md
目标标题:  ## 闪念

## 闪念

- 研究 #AI [[DashFlow 0.5]]
```

如果目标标题不存在，DashFlow 会自动创建；留空则追加到笔记末尾。

### Context Switcher

工作台顶部可以映射三个情景：

```text
☀ Morning   ⚡ Work   ↻ Review   ⚙
```

它不会创建第二套 `layouts` 数据。每个 Tab 只保存一个**现有 Dashboard ID**，切换时继续调用 `DashboardManager.setActiveDashboard()`：

- **Morning**：适合 Home / Daily Focus
- **Work**：适合 Project Management / 执行工作台
- **Review**：适合 Weekly Review / 复盘工作台

需要新布局时，先用已有 Dashboard 模板创建，再把它映射到情景即可。Context Switcher 使用 Dashboard / Vault / Workspace 事件同步状态，没有新增全局 `MutationObserver`。

## v0.5.0 · Intelligence Core + AI Morning Briefing

### AI 晨间简报

晨间简报是独立可选功能，不会因为你开启了“AI 日计划”就自动读取笔记正文。

开启后：

1. DashFlow 根据配置定位昨日 Daily Note。
2. 使用 Obsidian Vault API 读取正文。
3. 将昨日笔记发送给你配置的 AI Base URL。
4. AI 返回 50–100 字昨日摘要与一个今日建议。
5. 结果按 `日期 + 来源路径 + 笔记内容 hash` 缓存在插件数据中。
6. 当天再次打开 Home 直接使用缓存；昨日笔记发生修改后会自动失效并重新生成。

```text
AI 晨间简报                         YESTERDAY → TODAY

昨日复盘 · 2026-08-15
完成了 DashFlow Daily Progress 的主要整合，剩余工作集中在
首页信息密度与周复盘验证，整体推进稳定，但发布收尾仍需聚焦。

今日建议
先完成发布验证，再进入下一项功能，避免同时拉开多个未收口工作流。

Daily Notes/2026-08-15.md                  [重新生成]
```

### 隐私边界

- **默认关闭**：`aiMorningBriefingEnabled` 默认为 `false`。
- **独立授权**：用户必须明确开启“允许读取昨日 Daily Note”。
- **AI 日计划不读取正文**：原有 AI Planning 仍只发送 Task / Project / Habit 摘要。
- **远程 Provider**：笔记正文会发送到用户配置的 AI Base URL，请自行确认服务商隐私政策。
- **本地 AI**：`localhost` / `127.0.0.1` / `::1` 可不配置 API Key，适合 Ollama 等本地 OpenAI-compatible 服务。
- **Key 不进入 data.json**：远程 API Key 仍保存在 Obsidian SecretStorage / Keychain。
- **Prompt Injection 防护**：Daily Note 内容被明确视为“不可信数据”，不会把笔记里的提示词当系统指令执行。

### Intelligence Core

v0.5.0 把原本 AI Planning 内部的网络请求抽成共享 `AIClient`：

```text
                    AIClient
                       │
          ┌────────────┼────────────┐
          │            │            │
     AI Planning   Morning Brief   AI News
```

统一支持：

- OpenAI-compatible `/chat/completions`
- Base URL / Model / SecretStorage API Key
- DeepSeek 等兼容服务
- Ollama / localhost 本地端点
- 文本 completion
- JSON completion 解析

## v0.4.6 · Daily Progress Integration

Daily Progress 不再被当成普通 Habit 混合统计：

- **Home / Today 独立指标**：习惯、日更、项目、连续活跃分别展示。
- **今日推进卡片**：直接完成 / 取消今天的长期任务进度。
- **今日备注**：从 Home 直接记录“今天实际推进了什么”。
- **Weekly Review 独立完成率**：Habit 与 Daily Progress 分开计算。
- **本周推进摘要**：周复盘会带出长期任务在本周写下的 Daily Notes。
- **零迁移**：继续使用 v0.4.5 的 `habit_log` 与 `daily_notes`，旧 Habit 完全不需要转换。

```text
今日状态
任务 75%    习惯 2/3    日更 1/2    连续活跃 8 天

长期任务 · 今日推进                    1/2 DONE
✓ DashFlow 0.5     完成 Daily Progress 首页整合   📝
○ 论文写作          记录今天实际推进了什么         📝
```

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

- 统一 Motion System：卡片 stagger 入场、数字反馈、hover、拖拽和 resize 状态
- Desktop 卡片自由拖拽排序与持久化
- Desktop 卡片自由 resize
- Container Query 驱动的 compact / normal / expanded 信息密度
- 多实例自定义 Countdown，每张卡片独立标题和目标日期
- Light / Dark 交互阴影与性能细节
- `prefers-reduced-motion` 完整支持

## 产品结构

### Home · Personal Home

1. Hero：日期、个人标题、副标题、开始今天、收集灵感
2. AI 晨间简报：昨日 Daily Note → 复盘摘要 → 今日建议（明确授权后）
3. 微信读书每日划线：真实书籍、章节和个人划线
4. Today + 今日状态：Task / Habit / Daily Progress / Project / Activity streak
5. 长期任务今日推进：直接打卡和写当天备注
6. 长期成长入口：工作 / 生活 / 时间 / 复盘
7. 最近 Activity 与最近修改的 Vault Markdown

### Work · 执行工作台

- Morning / Work / Review Context Switcher
- AI News Curation 可作为普通 Dashboard Widget 添加
- 紧凑命令栏与 compact Hero
- Task 列表与真实优先级 / 日期 / 项目关联
- Project 行式结构与真实进度
- Inbox / Calendar / Habits / Review 独立工作流
- Dashboard drag / resize / config / add / remove / reset
- Resize 后自动切换信息密度

### Habits · 长期节奏

Habits Widget 同时承载普通 Habit 和 Daily Progress。Daily Progress 的历史格子可以点击回填完成状态；今日可以直接写推进备注。

### Weekly Review · 周复盘

- 本周完成任务与 Activity 变化
- 普通 Habit 完成率
- Daily Progress 日更完成率
- 长期任务本周备注摘要
- 活动 Project 进度
- 下周任务 / Project 截止日

### 自定义 Countdown

在「编辑布局」中可以添加多个 Countdown，每个实例独立保存标题和目标日期。

### Quick Add

全局 Quick Add 支持：

- 一句话按配置进入 Inbox / Daily Note / 每次询问
- 详细任务
- 新建项目
- 习惯 / 日更长期任务

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

Morning Briefing 与 Daily Note Quick Capture 共用路径设置：

```text
Daily Note 文件夹: Daily Notes
日期格式:          YYYY-MM-DD
结果:              Daily Notes/2026-08-16.md
```

## 微信读书

DashFlow 使用腾讯公开的微信读书 Agent API Gateway，只展示用户自己的真实个人划线，不伪造名言、封面或来源。API Key 只保存在 Obsidian SecretStorage / Keychain。

## 核心能力

- Vault 增量索引
- Task / Project / Habit / Daily Progress
- AIClient + AI Morning Briefing + AI News Curation + 可选 AI 日计划
- AI News：RSS / Atom normalize / dedupe / cache / Top-K ranking
- Quick Capture：Inbox / Daily Note / Ask
- DailyNoteService：统一 Daily Note 路径与安全写入
- Context Switcher：Morning / Work / Review → existing Dashboard IDs
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

DashFlow 不把 Task / Project / Habit / Daily Progress 锁进专有数据库。删除插件后，这些业务数据仍完整留在 Vault Markdown 中。

插件私有数据主要保存 Dashboard 布局、Widget config、模板、Context 映射、Quick Capture 偏好、Personal Home 外观、Activity 派生统计、AI 晨间简报缓存、AI News 缓存和 UI state。AI / 微信读书 API Key 保存在 Obsidian SecretStorage 中。

AI 晨间简报默认关闭并需要独立授权。启用后，昨日 Daily Note 正文会发送给用户配置的 AI Base URL；如果使用 localhost Ollama，则请求留在本机。

AI News 会直接请求用户配置的公开 RSS / Atom URL，并把候选的**标题、摘要、来源、日期**发送给用户配置的 AI Base URL 做排序；不会抓取或上传文章正文。Feed URL 的自动请求会阻止 localhost、私网、link-local 和 `.local` 地址。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
