# DashFlow v0.1.0

一个可直接安装的 Obsidian 个人工作台第一版。v0.1 的重点是把 **Task / Project / Widget / Dashboard** 四层模型真正跑通，而不是先堆几十个功能。

## 已实现

- 独立 Dashboard View
- Widget Registry：同一种 Widget 可创建多个实例
- 12 列桌面布局
- 编辑模式：拖动、调整尺寸、移除、添加、重置布局
- 布局自动保存到插件 `data.json`
- Vault 增量索引
- Markdown Task 解析
- 在 Dashboard 直接勾选/取消任务
- Project frontmatter 解析
- 根据关联任务自动计算 Project 进度
- Quick Capture 写入 Inbox
- 今日任务
- 今日进度
- 项目列表
- 未来 7 天
- Vault Pulse
- 倒计时
- 响应式移动端单列布局
- 设置页

## 安装

建议先用一个测试 Vault。

1. 创建目录：

   `<你的 Vault>/.obsidian/plugins/dashflow/`

2. 把下面三个文件放进去：

   - `manifest.json`
   - `main.js`
   - `styles.css`

3. Obsidian → 设置 → 第三方插件 → 启用 **DashFlow**。
4. 点击左侧 Dashboard 图标，或命令面板搜索 `DashFlow: 打开 Dashboard`。

## Task 格式

基础任务：

```md
- [ ] 写 DashFlow 第一版
- [x] 设计数据模型
```

到期日期：

```md
- [ ] 完成布局引擎 📅 2026-08-20
```

优先级：

```md
- [ ] 紧急任务 ⏫ 📅 2026-08-18
- [ ] 高优先级 🔼
- [ ] 低优先级 🔽
```

关联项目：

```md
- [ ] 完成 Widget Registry #project/dashflow 📅 2026-08-20
```

## Project 格式

```yaml
---
type: project
project_id: dashflow
name: DashFlow Plugin
status: active
deadline: 2026-09-30
progress_mode: tasks
---
```

`project_id` 与任务中的 `#project/dashflow` 对应。

支持状态：

- `planned`
- `active`
- `paused`
- `completed`
- `archived`

手工进度：

```yaml
---
type: project
project_id: launch
status: active
progress_mode: manual
progress: 65
---
```

## Quick Capture

默认写入：

`DashFlow/Inbox.md`

可以在 DashFlow 设置页修改。

## 四个核心模型

完整 TypeScript 契约见：

`src/models.ts`

架构说明见：

`ARCHITECTURE.md`

存储原则：

| 数据 | Source of truth |
|---|---|
| Task | Markdown checkbox |
| Project | Markdown / frontmatter |
| WidgetDefinition | 插件代码 |
| WidgetInstance | 插件 `data.json` |
| Dashboard | 插件 `data.json` |

因此卸载插件不会带走用户的任务和项目。

## v0.1 为什么没有第三方运行依赖

当前安装包使用 Obsidian API + 原生 DOM 渲染，不依赖 React、Dataview、Tasks 或其他插件。这样第一版可以直接复制进测试 Vault 运行，也更容易先验证核心模型、索引、写回和布局是否正确。

Presentation 层与 Domain / Service / Widget Registry 分离；以后换成 React 不需要推翻四个核心模型。

## 当前限制

- Task ID v0.1 由来源路径、行号和内容 hash 组成；移动大量任务后会重新索引。
- 移动端 v0.1 使用单列布局，暂不支持自由 resize。
- Project v0.1 使用 `#project/<id>` 关联任务。
- 布局引擎 v0.1 允许自由放置，暂未做自动碰撞避让。
- v0.1 尚未加入 Habit、Heatmap、Calendar、Task 编辑 Modal 和多 Dashboard UI。

## v0.2 计划

- Task 编辑 Modal
- Widget 配置面板
- Layout 自动碰撞与压缩
- Heatmap / Activity Tracker
- Habit / 长周期任务
- Calendar
- 移动端排序模式
- 多 Dashboard UI

## 校验

此交付版本已执行：

```text
node --check main.js
```

通过 JavaScript 语法检查。真正写入 Vault 的功能请先在测试 Vault 验证。
