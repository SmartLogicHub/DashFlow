# DashFlow v0.4.1

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit 始终以 Markdown / frontmatter 为真实数据源；DashFlow 负责索引、聚合、展示和直接操作。

## v0.4.1 · Visual Reset + 微信读书

这一版不是继续给 v0.4.0 的大卡片“换皮”，而是重新收紧 Home 与 Work 的信息层级：

- **Home**：图片只是氛围层，真正的主角是今天、阅读、长期领域和 Activity。
- **Work**：取消紫色大 Banner、版本号和 SECOND BRAIN 等技术展示，从第一屏直接进入工作内容。
- **微信读书**：接入腾讯官方 Agent API Gateway，只展示用户自己的真实个人划线，不伪造名言、封面或来源。

### Personal Home

主页现在由五块组成：

1. 约 194px 的紧凑 Hero：日期、个人标题、副标题、进入工作台、记录灵感
2. 微信读书每日划线：书封、书名、作者、章节、真实划线、换一条；没有连接时显示明确连接入口
3. Today + 今日状态：真实任务、Habit、活动项目、Activity streak
4. 长期成长：工作 / 生活 / 时间 / 复盘改成紧凑导航行，不再使用四张巨大空卡
5. 最近 30 天 Activity + 最近修改的 Vault Markdown

空状态也被压缩，不再用几百像素的空白告诉用户“没有任务”。

### Hero 场景

DashFlow 提供三套经过筛选的低饱和联网场景，并保留完全本地的 Vault 图片覆盖：

```text
Alpine    雪山湖村 · 冷蓝
Paper     海岸晨光 · 暖白
Midnight  雾林 · 深色
Obsidian  不加载场景照片，跟随当前 Obsidian Theme
```

前三套场景使用 Unsplash License 下的免费照片：

- Alpine：Marios Gkortsilas · Hallstatt winter village
- Paper：Howard Walsh · calm sunrise coast
- Midnight：mark wang · foggy Sichuan pine forest

如果不希望加载远程照片，可以选择 **Obsidian** 主题，或者从 Vault 选择自己的 JPG / PNG / WebP / AVIF / GIF；本地图片优先级最高。

### 微信读书

DashFlow 使用腾讯公开的微信读书 Agent API Gateway：

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

首页读取路径严格按官方文档：

```text
/user/notebooks
    ↓ 找到有个人划线的书
/book/bookmarklist
    ↓ markText + chapters + book metadata
首页“微信读书 · 我的划线”
```

- API Key 只保存在 Obsidian SecretStorage / Keychain；DashFlow `data.json` 只保存 Secret 名称
- 不使用 Cookie 抓取
- 不持久化完整划线缓存，内存缓存约 10 分钟
- `/book/bookmarklist` 没有返回 `deepLink` 时，不自行拼接 `weread://` 链接
- 未连接或没有真实数据时，不展示假的“我的划线”

### Work · 执行工作台

Work 继续保留真实任务/项目能力和高级 Grid 编辑，但视觉回到生产力工具本身：

- 顶部只保留一条紧凑命令栏
- 去掉紫色 landing banner、`MY DASHBOARD`、版本号和技术性副标题
- Widget 使用更轻的边界和更大的可读字体
- Task 采用列表层级而不是卡片套卡片
- Project 采用行式信息结构和真实进度
- Progress 保留 Today / All Tasks 两个真实维度，但缩小视觉占比
- Inbox / Calendar / Habits / Review 继续作为独立工作流
- 编辑布局仍支持 drag / resize / config / add / remove / reset

### Quick Add

全局 Quick Add 可以从命令面板或顶部「添加」呼出：

- 输入一句话按 Enter → 进入 Inbox
- 详细任务 → 计划日 / 截止日 / 优先级 / 项目
- 新建项目
- 新建习惯

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
- Personal Home + Work execution surface
- 微信读书真实个人划线
- 多 Dashboard、内置模板、自定义模板、JSON 导入 / 导出
- Desktop Grid 与移动端单列体验
- 全局搜索与 Quick Add
- 可选 AI 日计划

## 数据边界

DashFlow 不把 Task / Project / Habit 锁进专有数据库。删除插件后，业务数据仍留在 Vault Markdown 中。Dashboard 布局、Personal Home 外观、模板与 Activity 派生统计保存在插件数据中；AI / 微信读书 API Key 保存在 Obsidian SecretStorage 中。

## 开发

```bash
npm install
npm test
npm run build
```

CI 同时执行测试、TypeScript build、production bundle、`node --check main.js`，并上传插件 artifact。
