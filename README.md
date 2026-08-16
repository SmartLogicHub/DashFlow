# DashFlow v0.4.4

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

> v0.4.4 把 Dashboard 从“可编辑布局”升级成更有反馈、更灵活的个人工作台：统一动效、自由拖拽、卡片缩放、响应式信息密度和多实例自定义倒计时。

## v0.4.4 · Interaction & Flexible Dashboard

- **全新 Motion System**：卡片 stagger 入场、数字反馈、hover lift、拖拽与 resize 状态都使用统一 motion token / easing。
- **卡片自由排序**：Desktop 编辑布局继续支持拖拽模块，自由调整位置并持久化；拖动时增加明确的层级、目标边框和阴影反馈。
- **自定义倒计时**：Countdown 本身就是多实例 Widget，每张卡片可以独立设置标题和目标日期，例如“距项目上线”“距考试”“距旅行”。
- **卡片缩放**：Desktop Grid 支持自由 resize；v0.4.4 使用 Container Query 让卡片在 compact / normal / expanded 宽度下自动调整信息密度，而不是简单把内容硬挤进去。
- **细节与性能**：Light / Dark 使用不同阴影强度；数字使用 tabular nums；只在活动拖拽卡片启用 `will-change`；移动端关闭无意义 hover 位移。
- **无障碍动效**：完整支持 `prefers-reduced-motion`，减少动效用户不会被强制播放入场、数字或拖拽动画。
- **数据边界不变**：这次交互升级只影响 Dashboard presentation / layout，不修改 Task / Project / Habit Markdown 真实数据。

## 产品结构

### Home · Personal Home

Home 是个人状态和长期成长入口，而不是另一个工作后台：

1. 约 194px Hero：日期、个人标题、副标题、开始今天、收集灵感
2. 微信读书每日划线：真实书籍、章节和个人划线
3. Today + 今日状态：任务、Habit、活动项目与 Activity streak
4. 长期成长入口：工作 / 生活 / 时间 / 复盘
5. 最近 Activity 与最近修改的 Vault Markdown

空状态保持紧凑，避免用大面积空白表达“没有内容”。

### Work · 执行工作台

Work 强调尽快进入执行，而不是展示 landing page：

- 顶部紧凑命令栏
- compact Hero，减少首屏占用
- Task 使用列表层级
- Project 使用行式信息结构与真实进度
- Progress 保留 Today / All Tasks 两个真实维度
- Inbox / Calendar / Habits / Review 作为独立工作流
- Dashboard 支持 drag / resize / config / add / remove / reset
- Resize 后自动切换信息密度

### 自定义 Countdown

在「编辑布局」中可以添加多个 Countdown，每个实例独立配置：

```text
距 DashFlow 0.5 发布   46 DAYS
距考试                 23 DAYS
距旅行                128 DAYS
```

配置项：

- 卡片标题
- 倒计时标签
- 目标日期

Countdown 的配置保存在 Dashboard Widget config 中，不会写进 Task / Project / Habit Markdown。

### Quick Add

全局 Quick Add 可以从命令面板或顶部「添加」呼出：

- 输入一句话按 Enter → 进入 Inbox
- 创建带计划日 / 截止日 / 优先级 / 项目关联的任务
- 新建项目
- 新建习惯

## Hero 场景

DashFlow 提供三套低饱和联网场景，并支持完全本地的 Vault 图片覆盖：

```text
Alpine    雪山湖村 · 冷蓝
Paper     海岸晨光 · 暖白
Midnight  雾林 · 深色
Obsidian  不加载场景照片，跟随当前 Obsidian Theme
```

前三套场景使用 Unsplash License 下的免费照片。若不希望加载远程照片，可以选择 **Obsidian**，或者从 Vault 选择自己的 JPG / PNG / WebP / AVIF / GIF；本地图片优先级最高。

## 微信读书

DashFlow 使用腾讯公开的微信读书 Agent API Gateway，只展示用户自己的真实个人划线，不伪造名言、封面或来源。

```text
POST https://i.weread.qq.com/api/agent/gateway
Authorization: Bearer wrk-...
skill_version: 1.0.4
```

连接流程：

1. 在 DashFlow 设置 → 微信读书点击「获取 API Key」
2. 从微信读书官方页面获取 `wrk-...` Key
3. 把 Key 保存到 Obsidian Keychain，并在 DashFlow 中选择该 Secret
4. 点击「测试连接」

首页读取路径：

```text
/user/notebooks
    ↓ 找到有个人划线的书
/book/bookmarklist
    ↓ markText + chapters + book metadata
首页“微信读书 · 我的划线”
```

安全与数据原则：

- API Key 只保存在 Obsidian SecretStorage / Keychain；DashFlow `data.json` 只保存 Secret 名称
- 不使用 Cookie 抓取
- 不持久化完整划线缓存，内存缓存约 10 分钟
- `/book/bookmarklist` 没有返回 `deepLink` 时，不自行拼接 `weread://` 链接
- 未连接或没有真实数据时，不展示假的“我的划线”

## 核心能力

- Vault 增量索引
- Task 创建 / 编辑 / 完成 / 计划日 / 截止日 / 优先级 / 项目关联
- Project 创建 / 编辑 / 详情 / 自动任务进度
- Habit 创建 / 编辑 / 打卡 / streak / 目标
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

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍留在 Vault Markdown 中。

插件数据主要保存：

- Dashboard 布局、Widget config 与模板
- Personal Home 外观设置
- Activity 派生统计
- UI / presentation state

AI / 微信读书 API Key 保存在 Obsidian SecretStorage 中。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
