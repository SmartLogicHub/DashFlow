import { setIcon } from "obsidian";
import type DashFlowPlugin from "../main";
import type { LearningEvidence, LearningGoal, LearningMistake, LearningSession } from "./models";
import { learningMistakePatterns, sessionsSince } from "./learningMath";
import { LearningGoalEditorModal } from "../ui/LearningGoalEditorModal";
import { LearningSessionEditorModal } from "../ui/LearningSessionEditorModal";

function localDateOffset(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const KIND_LABEL: Record<LearningSession["kind"], string> = {
  baseline: "基线",
  practice: "练习",
  assessment: "复测",
  review: "复习",
};
const ASSISTANCE_LABEL: Record<LearningSession["assistance"], string> = {
  none: "独立",
  ai: "AI 辅助",
  human: "人工反馈",
  mixed: "混合辅助",
};

export class LearningWorkspace {
  constructor(private readonly plugin: DashFlowPlugin) {}

  render(): HTMLElement {
    const snapshot = this.plugin.vaultIndex.getSnapshot();
    const goals = snapshot.learningGoals ?? [];
    const sessions = snapshot.learningSessions ?? [];
    const evidence = snapshot.learningEvidence ?? [];
    const mistakes = snapshot.learningMistakes ?? [];
    const activeGoals = goals.filter((goal) => goal.status === "active");
    const recentWeek = sessionsSince(sessions, localDateOffset(-6));

    const page = document.createElement("section");
    page.className = "dashflow-learning-page";

    const header = document.createElement("header");
    header.className = "dashflow-learning-head";
    const copy = document.createElement("div");
    copy.className = "dashflow-learning-head-copy";
    copy.append(
      this.text("span", "LEARNING & GROWTH", "dashflow-learning-eyebrow"),
      this.text("h2", "学习系统"),
      this.text("p", "目标 → 基线 → 主动练习 → 证据 → 错误 → 下一步。学习效果以留下的能力证据为准。"),
    );
    const actions = document.createElement("div");
    actions.className = "dashflow-learning-actions";
    actions.append(
      this.actionButton("target", "新建目标", () => new LearningGoalEditorModal(this.plugin).open()),
      this.actionButton("book-open-check", "记录学习", () => new LearningSessionEditorModal(this.plugin).open(), true),
    );
    header.append(copy, actions);
    page.appendChild(header);

    const metrics = document.createElement("div");
    metrics.className = "dashflow-learning-metrics";
    metrics.append(
      this.metric("进行目标", activeGoals.length, "不是收藏主题，而是真实结果"),
      this.metric("近 7 天训练", recentWeek.length, "一次可检查的主动练习"),
      this.metric("证据", evidence.length, "作品、测试、录音或真实输出"),
      this.metric("错误记录", mistakes.length, "用错误决定下一次练什么"),
    );
    page.appendChild(metrics);

    page.appendChild(this.renderGoals(activeGoals, sessions));

    const lower = document.createElement("div");
    lower.className = "dashflow-learning-lower";
    lower.append(this.renderRecentSessions(sessions), this.renderMistakes(mistakes));
    page.appendChild(lower);
    page.appendChild(this.renderEvidence(evidence, sessions));
    return page;
  }

  private renderGoals(goals: LearningGoal[], sessions: LearningSession[]): HTMLElement {
    const section = this.section("当前学习目标", "先保持少量真正推进的目标。 ");
    const body = document.createElement("div");
    body.className = "dashflow-learning-goals";
    if (goals.length === 0) {
      body.appendChild(this.empty("还没有进行中的学习目标。先定义一个真实结果和当前基线。", "建立第一个目标", () => new LearningGoalEditorModal(this.plugin).open()));
      section.appendChild(body);
      return section;
    }

    for (const goal of goals) {
      const goalSessions = sessions.filter((session) => session.goalId === goal.id);
      const goalEvidence = goalSessions.reduce((sum, session) => sum + session.evidence.length, 0);
      const goalMistakes = goalSessions.reduce((sum, session) => sum + session.mistakes.length, 0);
      const card = document.createElement("article");
      card.className = "dashflow-learning-goal";

      const top = document.createElement("div");
      top.className = "dashflow-learning-goal-top";
      const titleWrap = document.createElement("div");
      const meta = goal.domain ? `${goal.domain}${goal.targetDate ? ` · ${goal.targetDate}` : ""}` : (goal.targetDate ?? "进行中");
      titleWrap.append(this.text("small", meta), this.text("strong", goal.name));
      const edit = this.iconButton("pencil", "编辑学习目标", () => new LearningGoalEditorModal(this.plugin, goal).open());
      top.append(titleWrap, edit);

      const outcome = this.text("p", goal.outcome, "dashflow-learning-goal-outcome");
      const next = document.createElement("div");
      next.className = "dashflow-learning-next";
      next.append(this.text("span", "NEXT"), this.text("strong", goal.nextStep || "还没有写下一项最小任务"));

      const stats = document.createElement("div");
      stats.className = "dashflow-learning-goal-stats";
      stats.append(
        this.text("span", `${goalSessions.length} 次训练`),
        this.text("span", `${goalEvidence} 条证据`),
        this.text("span", `${goalMistakes} 个错误记录`),
      );

      const actions = document.createElement("div");
      actions.className = "dashflow-learning-goal-actions";
      actions.append(
        this.actionButton("play", "开始下一次练习", () => new LearningSessionEditorModal(this.plugin, undefined, {
          goalId: goal.id,
          task: goal.nextStep ?? "",
        }).open(), true),
        this.actionButton("file-text", "打开目标笔记", () => void this.plugin.app.workspace.openLinkText(goal.source.path, "", false)),
      );
      card.append(top, outcome, next, stats, actions);
      body.appendChild(card);
    }
    section.appendChild(body);
    return section;
  }

  private renderRecentSessions(sessions: LearningSession[]): HTMLElement {
    const section = this.section("最近训练", "看做过什么，不用学习时长制造进步感。 ");
    const list = document.createElement("div");
    list.className = "dashflow-learning-session-list";
    const recent = [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 8);
    if (recent.length === 0) {
      list.appendChild(this.empty("还没有学习记录。完成一次真实尝试后再记。"));
    } else {
      for (const session of recent) {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "dashflow-learning-session-row";
        row.addEventListener("click", () => new LearningSessionEditorModal(this.plugin, session).open());
        const marker = this.text("span", KIND_LABEL[session.kind], `dashflow-learning-kind is-${session.kind}`);
        const copy = document.createElement("span");
        copy.className = "dashflow-learning-session-copy";
        copy.append(this.text("strong", session.task), this.text("small", `${session.date} · ${ASSISTANCE_LABEL[session.assistance]}`));
        const result = document.createElement("span");
        result.className = "dashflow-learning-session-result";
        result.append(this.text("strong", `${session.evidence.length}`), this.text("small", "证据"));
        if (session.mistakes.length > 0) result.append(this.text("em", `${session.mistakes.length} 错误`));
        row.append(marker, copy, result);
        list.appendChild(row);
      }
    }
    section.appendChild(list);
    return section;
  }

  private renderMistakes(mistakes: LearningMistake[]): HTMLElement {
    const section = this.section("错误模式", "重复出现的缺口，比一次性的低分更值得优先处理。 ");
    const list = document.createElement("div");
    list.className = "dashflow-learning-mistakes";
    const patterns = learningMistakePatterns(mistakes).slice(0, 7);
    if (patterns.length === 0) {
      list.appendChild(this.empty("还没有错误记录。错误不是负面数据，而是下一步练习的输入。"));
    } else {
      for (const pattern of patterns) {
        const row = document.createElement("div");
        row.className = `dashflow-learning-mistake${pattern.count > 1 ? " is-repeated" : ""}`;
        row.append(
          this.text("strong", pattern.text),
          this.text("span", pattern.count > 1 ? `重复 ${pattern.count} 次` : "出现 1 次"),
          this.text("small", `最近 ${pattern.lastDate}`),
        );
        list.appendChild(row);
      }
    }
    section.appendChild(list);
    return section;
  }

  private renderEvidence(evidence: LearningEvidence[], sessions: LearningSession[]): HTMLElement {
    const section = this.section("最近证据", "能被自己、测试或真实受众重新检查的输出才算证据。 ");
    const list = document.createElement("div");
    list.className = "dashflow-learning-evidence";
    const recent = [...evidence].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, 8);
    if (recent.length === 0) {
      list.appendChild(this.empty("还没有证据。下一次练习至少留下一个作品、测试、录音或可复现结果。"));
    } else {
      for (const item of recent) {
        const session = sessions.find((candidate) => candidate.id === item.sessionId);
        const row = document.createElement("button");
        row.type = "button";
        row.className = "dashflow-learning-evidence-row";
        row.addEventListener("click", () => {
          if (session) new LearningSessionEditorModal(this.plugin, session).open();
          else void this.plugin.app.workspace.openLinkText(item.source.path, "", false);
        });
        const icon = document.createElement("span");
        setIcon(icon, "paperclip");
        row.append(icon, this.text("strong", item.ref), this.text("small", item.date));
        list.appendChild(row);
      }
    }
    section.appendChild(list);
    return section;
  }

  private section(title: string, description: string): HTMLElement {
    const section = document.createElement("section");
    section.className = "dashflow-learning-section";
    const head = document.createElement("header");
    head.append(this.text("h3", title), this.text("p", description));
    section.appendChild(head);
    return section;
  }

  private metric(label: string, value: number, hint: string): HTMLElement {
    const node = document.createElement("div");
    node.className = "dashflow-learning-metric";
    node.append(this.text("small", label), this.text("strong", String(value)), this.text("span", hint));
    return node;
  }

  private empty(message: string, actionLabel?: string, action?: () => void): HTMLElement {
    const node = document.createElement("div");
    node.className = "dashflow-learning-empty";
    node.appendChild(this.text("p", message));
    if (actionLabel && action) node.appendChild(this.actionButton("plus", actionLabel, action, true));
    return node;
  }

  private actionButton(iconName: string, label: string, action: () => void, primary = false): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dashflow-learning-button${primary ? " is-primary" : ""}`;
    const icon = document.createElement("span");
    setIcon(icon, iconName);
    button.append(icon, this.text("span", label));
    button.addEventListener("click", action);
    return button;
  }

  private iconButton(iconName: string, label: string, action: () => void): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashflow-learning-icon-button";
    button.title = label;
    button.setAttribute("aria-label", label);
    setIcon(button, iconName);
    button.addEventListener("click", action);
    return button;
  }

  private text<K extends keyof HTMLElementTagNameMap>(tag: K, text: string, className?: string): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
}
