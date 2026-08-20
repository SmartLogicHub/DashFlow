# DashFlow v0.6.1

DashFlow 是建立在 Obsidian Vault 之上的 Personal OS。Task、Project、Habit 和 Daily Progress 的 Markdown / frontmatter 是唯一业务真相；DashFlow 负责索引、聚合、筛选、展示和直接操作。

## 快速开始

1. 从 GitHub Release 下载 `DashFlow-v0.6.1.zip`，解压其内容到 `<Vault>/.obsidian/plugins/dashflow/`；不要扁平化其中的 `assets/heroes/` 目录。
2. 在 Obsidian 设置 → 社区插件中启用 DashFlow。
3. 首次打开时选择 Minimal、Daily Focus 或 Project Management 起始布局，也可以跳过；以后可在 DashFlow 设置 → 高级 → 首次引导重新打开。
4. 在工作台中使用 Quick Add、Inbox、Today、Projects、Calendar、Habits 和 Review。所有内容仍写回 Vault Markdown。

开发环境使用可复现命令：

```bash
npm ci
npm test
npm run build
```

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

本工作区未替用户做出仓库许可证或版权归属决定。发布前请由仓库所有者明确选择并补充许可证；本文不复制历史仓库中的版权声明。

历史 v0.5.5 文档归档在 [`docs/README-v0.5.5.md`](docs/README-v0.5.5.md)。
