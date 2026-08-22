# DashFlow v0.7.0

DashFlow 是建立在 Obsidian Vault 之上的 Personal OS。Task、Project、Habit 和 Daily Progress 的 Markdown / frontmatter 是唯一业务真相；DashFlow 负责索引、聚合、筛选、展示和直接操作。

## 快速开始

1. 从 GitHub Release 下载 `DashFlow-v0.7.0.zip`，解压其内容到 `<Vault>/.obsidian/plugins/dashflow/`；不要扁平化其中的 `assets/heroes/` 目录。
2. 在 Obsidian 设置 → 社区插件中启用 DashFlow。
3. 首次打开时选择 Minimal、Daily Focus 或 Project Management 起始布局，也可以跳过；以后可在 DashFlow 设置 → 高级 → 首次引导重新打开。
4. 在工作台中使用 Quick Add、Inbox、Today、Projects、Calendar、Habits 和 Review。所有内容仍写回 Vault Markdown。

## 功能发现与页面切换

- 工作台顶部的「功能」会列出 DashFlow 的全部组件、日常操作与可选集成，并分别显示“已添加 / 未添加”和“可用 / 已关闭 / 需要配置”。未添加的组件可以直接加入当前工作台；AI、晨间简报和微信读书未就绪时会带你前往对应设置，不会直接发起网络请求。
- 「项目」页把项目列表、项目看板和项目时间轴合并为同一组视图。页面默认选择当前工作台已有的优先视图，并且一次只显示一个；选择尚未加入的视图时，可以在原位一键补齐。
- 「日历」「习惯」「复盘」以及没有任何项目视图的「项目」页不再显示空白画布。DashFlow 会说明当前工作台缺少的组件，并提供一键加入或恢复隐藏组件的操作。
- Dashboard 导入 / 导出、重新索引 Vault 等维护能力仍放在 Obsidian 命令面板或 DashFlow 设置 → 高级中，避免与日常操作混在一起。

开发环境使用可复现命令：

```bash
npm ci
npm test
npm run build
```

### 真实 Obsidian 冒烟测试

冒烟测试只操作界面，不调用 Vault 写入、插件保存或 frontmatter 修改 API。先完全退出 Obsidian，再以调试端口打开要验证的 Vault，例如 Windows：

```powershell
& "<Obsidian.exe>" --remote-debugging-port=9222 --remote-allow-origins=* "obsidian://open?vault=<URL 编码的 Vault 名称>"
npm run test:ui
```

如需使用其他端口，可设置 `DASHFLOW_OBSIDIAN_CDP_URL`。截图和 JSON 报告写入被 Git 忽略的 `output/playwright/release-smoke/`；命令结束时会恢复原视口、侧栏和 DashFlow 页面。

### 发布流程

1. 更新 `manifest.json`、`package.json`、锁文件、`versions.json` 和 `CHANGELOG.md` 中的版本。
2. 执行 `npm ci`、`npm test`、`npm run build` 和 `npm run test:ui`。
3. 由仓库所有者选择并提交 `LICENSE`；没有 `LICENSE` 时会阻止公开发布。
4. 推送提交后创建版本标签；标签名必须与 `manifest.json` 中的版本完全一致，例如 `0.7.1`。
5. 推送该标签，由 GitHub Actions 构建并创建 Release。普通 `main` 推送不会发布版本。

## 0.7.0 重点

- 窄面板导航改为双行结构，「添加 / 功能 / 搜索」始终可见，当前页面会自动滚动到导航可视区域。
- 功能中心支持名称与说明搜索，并可按「未添加 / 待配置」筛选；工具区固定，结果区独立滚动。
- 工作台项目与复盘改为可跳转摘要，项目、日历、习惯和完整复盘在专页自然展开，减少固定卡片内的嵌套滚动。
- 统一标题、正文、辅助文字、数字和触控尺寸；日历与恢复界面按 DashFlow 面板宽度响应，而不是只看应用窗口宽度。
- 四个历史全局视觉覆盖层收敛为一个产品表现层，保留功能专属样式并显著降低 CSS 覆盖债务。
- 升级不改变 schema 8、Markdown 真相源或现有设置字段；首次加载会沿用当前数据和个人 Hero 图片。

## 0.6.1 修复

- schema 8 配置会逐字段验证：设置字段类型损坏时进入非破坏性恢复模式，不会自动覆盖原配置。
- 首次引导被关闭时会释放弹窗锁；未完成设置不会被误标记完成，可再次打开。
- GitHub Release 提供保留 `assets/heroes/` 目录结构的安装 ZIP。

## 0.6.0 重点

- Work 是完整的扩展 Widget 工作台：除明确隐藏的实例外，所有注册 Widget 都可添加和使用；Today、Projects、Calendar、Habits、Review 保留各自的聚焦筛选。
- Personal Home 与 Work 分离，主题 Hero 使用插件内置的 Alpine、Paper、Midnight WebP 场景；默认启动不请求第三方图片。可在设置中选择 Vault 内自己的图片覆盖内置场景。
- 首次运行引导显示已检测的笔记、任务、项目和习惯数量，并让用户确认 Inbox、项目和习惯路径。
- v0.5.6 的明文 AI Key 会迁移到 Obsidian SecretStorage；`data.json` 只保存密钥名称。旧值不符合格式时会被清除并提示重新配置。
- 配置迁移会校验 Dashboard；异常数据进入恢复模式，保留脱敏且有大小上限的恢复快照，不会自动覆盖原文件。
- Widget 删除、Dashboard 删除、布局重置和机会项删除均有二次确认或限时 Undo。

## 数据与隐私边界

DashFlow 不把业务内容复制到第二套数据库。删除插件不会删除 Vault 中的 Markdown。

插件私有 `data.json` 只保存 Dashboard 布局、Widget 配置、工作流偏好、个人主页外观、派生状态、缓存和 SecretStorage 引用。AI 默认关闭；启用后只在你主动执行 AI 规划或已开启晨间简报时发送所需摘要，笔记正文不会被默认发送。微信读书使用官方 Agent Gateway 和 SecretStorage，不使用 Cookie 抓取。

离线行为：核心导航、索引、Markdown 读写、Dashboard、内置 Hero 场景和所有本地 Widget 无需网络。AI、微信读书和 AI News 是可选联网功能；关闭它们即可保持本地运行。Magic Embed 仅在用户点击后加载 HTTPS 或回环地址。

## Markdown 规范

- Task：标准 Markdown checkbox，可附 `#project/<project_id>`、日期和优先级。
- Project：Markdown frontmatter 的 `type: project`，任务关系通过 `#project/<project_id>` 派生。
- Habit：frontmatter 的 `type: habit` 与 `habit_log` 日期列表。
- Daily Progress：仍是 Markdown 字段，不替换 Habit 的长期统计语义。

## 升级与恢复

从 0.5.5 / 0.5.6 升级时，DashFlow 会把旧布局迁移到 schema 8，并规范默认 Dashboard 名称为“默认工作台”；不会移动 Vault 文件。AI 明文 Key 只迁移一次到 SecretStorage。若配置结构损坏，DashFlow 会停留在恢复模式；请在设置 → 高级中导出快照、写回快照或使用二次确认重置。重置只清除 DashFlow 配置，不触碰 Markdown。

## 安装文件

```text
main.js
manifest.json
styles.css
assets/heroes/alpine.webp
assets/heroes/paper.webp
assets/heroes/midnight.webp
```

## 许可证说明

本工作区未替用户做出仓库许可证或版权归属决定。发布前请由仓库所有者明确选择并补充许可证；本文不复制历史仓库中的版权声明。Release 工作流在 `LICENSE` 缺失时会停止，避免无意中公开发布权利边界不明确的仓库。

历史 v0.5.5 文档归档在 [`docs/README-v0.5.5.md`](docs/README-v0.5.5.md)。
