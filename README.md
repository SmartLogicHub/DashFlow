# DashFlow v0.5.6

DashFlow 是建立在 Obsidian Vault 之上的 **Personal OS**。Task / Project / Habit / Daily Progress 继续以 Markdown / frontmatter 为业务真相；DashFlow 负责索引、聚合、筛选、展示和直接操作。

v0.5.6 聚焦 **Runtime / Product Hierarchy / DeepSeek UX Polish**：收敛 Dashboard 渲染触发、恢复完整 Hero 视觉、理顺主导航和设置层级，并选择性吸收 DeepSeek 优化版中与 DashFlow 产品方向一致的交互与视觉方案。

## v0.5.6 重点

### Runtime 与渲染

- `DashboardRenderService` 统一跟踪已挂载 DashFlow root 与 render completion。
- Vault / Dashboard 的重复刷新请求通过 `requestAnimationFrame` 合并为一次 commit。
- 内存记录 `requests / commits / coalesced / last / average / max render duration`，不写入 `data.json`。
- Task / Activity / Habit / Calendar / Weekly Review / AI News / Data Filter / Focus / Magic Embed 等 Dashboard decorator 继续以 root-scoped render lifecycle 为主。
- **Mobile 是明确例外**：`MobileDashboardInteractionService` 正式启用并保留对 `document.body` 的 `MutationObserver`，用于移动端 DOM 适配。

### Dashboard 拖拽

桌面布局编辑保留全卡片 FLIP 预览：pointermove 时对非拖动卡片进行前后 `getBoundingClientRect()` 测量，被布局算法推开的卡片通过短时 transform 动画平滑让位。该行为是当前交互设计的一部分，并由回归测试锁定。

### Product hierarchy 与 Hero

- Home / Work / Projects / Calendar / Review 均保留完整 photographic Hero。
- 桌面 Hero 约 194px，窄窗口约 172px，不再压回 88px / 72px 条状 Banner。
- 默认远程场景 URL 不再主动请求 `w=2400&q=82` 变体。
- Morning / Work / Review 的重复情景导航不再与一级主导航同时常驻。
- Dashboard 切换回归布局基础设施；Quick Add 继续作为主要创建入口。
- Projects 页面移除旧的固定高度空白结构，内容按真实项目数据自适应。

### DeepSeek 选择性整合

- 设置页整理为 **外观 / 工作流 / AI 与集成 / 高级** 四个产品区。
- 卡片、设置与暗色主题使用更克制的 surface / hairline 体系。
- 数字展示使用 tabular figures，小字号与控件字重统一。
- DeepSeek polish 保持 presentation-only，不接管 Hero 几何、业务事件或普通卡片 hover transform。
- **AI Provider API Key 按当前产品选择直接保存在插件 `data.json`**；WeRead 保持独立 Keychain 流程。

## 现有能力

- Personal Home / Morning Briefing
- Task / Project / Habit / Daily Progress
- Quick Capture / Inbox / Context workflows
- Calendar / Weekly Review / Activity
- Focus
- Visual Data Filter
- AI News
- Magic Embed
- Multiple Dashboards / templates / import-export
- Desktop drag / resize 与 Mobile layout

## 数据边界

DashFlow 不把 Task / Project / Habit / Daily Progress 锁进专有业务数据库。删除插件后，这些业务数据仍留在 Vault Markdown 中。

插件私有 `data.json` 主要保存：

- Dashboard layout / Widget config / templates
- Context 与 Quick Capture 偏好
- Personal Home UI 配置
- Activity / Focus 派生状态
- AI cache
- AI Provider API Key（当前产品选择为明文保存）

v0.5.5 引入的 Query / Filter / Calendar revision-aware 缓存只存在内存，不进入 `data.json`。

### 兼容性

- `SCHEMA_VERSION = 7`
- Obsidian minimum app version: `1.11.4`
- Task / Project / Habit / Daily Progress Markdown 格式不变
- 不新增第二套业务数据库
- v0.5.5 → v0.5.6 不要求迁移 Vault

## 开发

```bash
npm install
npm test
npm run build
```

CI 会执行测试、TypeScript production build、production bundle、`node --check main.js`，并生成插件安装 artifact 与完整开发源码 artifact。

## 安装文件

Obsidian 插件目录需要：

```text
main.js
manifest.json
styles.css
```

放入：

```text
<Vault>/.obsidian/plugins/dashflow/
```

然后在 Obsidian 中重新加载 DashFlow。

## 历史文档

v0.5.5 及之前的详细 README 内容归档在 [`docs/README-v0.5.5.md`](docs/README-v0.5.5.md)。
