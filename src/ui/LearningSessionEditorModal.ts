import { Modal, Setting } from "obsidian";
import type DashFlowPlugin from "../main";
import type {
  LearningAssistance,
  LearningSession,
  LearningSessionEditInput,
  LearningSessionKind,
  LearningSessionOutcome,
} from "../learning/models";

const KIND_OPTIONS: Array<[LearningSessionKind, string]> = [
  ["baseline", "基线测试"],
  ["practice", "主动练习"],
  ["assessment", "复测 / 验收"],
  ["review", "复习"],
];
const OUTCOME_OPTIONS: Array<[LearningSessionOutcome, string]> = [
  ["completed", "完成"],
  ["partial", "部分完成"],
  ["blocked", "卡住"],
];
const ASSISTANCE_OPTIONS: Array<[LearningAssistance, string]> = [
  ["none", "无辅助"],
  ["ai", "AI 辅助"],
  ["human", "人工反馈"],
  ["mixed", "混合辅助"],
];

function todayLocal(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function splitLines(value: string): string[] {
  return value.split(/\n/).map((item) => item.trim()).filter(Boolean);
}

export class LearningSessionEditorModal extends Modal {
  constructor(
    private readonly plugin: DashFlowPlugin,
    private readonly session?: LearningSession,
    private readonly initial: Partial<LearningSessionEditInput> = {},
  ) {
    super(plugin.app);
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("dashflow-editor-modal", "dashflow-learning-session-editor");

    const goals = this.plugin.learningService.activeGoals();
    const fallbackGoalId = this.session?.goalId ?? this.initial.goalId ?? goals[0]?.id ?? "";
    const draft: LearningSessionEditInput = {
      id: this.session?.id ?? this.initial.id,
      goalId: fallbackGoalId,
      date: this.session?.date ?? this.initial.date ?? todayLocal(),
      kind: this.session?.kind ?? this.initial.kind ?? "practice",
      task: this.session?.task ?? this.initial.task ?? "",
      firstAttempt: this.session?.firstAttempt ?? this.initial.firstAttempt,
      sources: this.session?.sources ?? this.initial.sources ?? [],
      activeOutput: this.session?.activeOutput ?? this.initial.activeOutput,
      outcome: this.session?.outcome ?? this.initial.outcome ?? "completed",
      assistance: this.session?.assistance ?? this.initial.assistance ?? "none",
      durationMinutes: this.session?.durationMinutes ?? this.initial.durationMinutes,
      evidence: this.session?.evidence ?? this.initial.evidence ?? [],
      mistakes: this.session?.mistakes ?? this.initial.mistakes ?? [],
      feedback: this.session?.feedback ?? this.initial.feedback,
      nextStep: this.session?.nextStep ?? this.initial.nextStep,
      tags: this.session?.tags ?? this.initial.tags ?? [],
    };

    contentEl.createEl("div", { cls: "dashflow-modal-eyebrow", text: this.session ? "LEARNING SESSION · EDIT" : "LEARNING SESSION · NEW" });
    contentEl.createEl("h2", { text: this.session ? "编辑学习记录" : "记录一次学习" });
    contentEl.createEl("p", {
      cls: "setting-item-description dashflow-modal-lead",
      text: "先独立尝试，再查看来源或使用辅助；最后合上材料主动输出。把“看过答案”和“已经会了”分开记录。",
    });

    new Setting(contentEl).setName("学习目标").addDropdown((c) => {
      if (goals.length === 0) c.addOption("", "先创建学习目标");
      for (const goal of goals) c.addOption(goal.id, goal.name);
      if (this.session && !goals.some((goal) => goal.id === this.session?.goalId)) {
        c.addOption(this.session.goalId, this.session.goalId);
      }
      c.setValue(draft.goalId);
      c.onChange((value) => { draft.goalId = value; });
    });

    new Setting(contentEl).setName("日期").addText((c) => {
      c.inputEl.type = "date";
      c.setValue(draft.date);
      c.onChange((value) => { draft.date = value || todayLocal(); });
    });

    new Setting(contentEl).setName("类型").addDropdown((c) => {
      for (const [value, label] of KIND_OPTIONS) c.addOption(value, label);
      c.setValue(draft.kind);
      c.onChange((value) => { draft.kind = value as LearningSessionKind; });
    });

    new Setting(contentEl).setName("本次任务").setDesc("写成一个可完成、可检查的动作。 ").addTextArea((c) => {
      c.setPlaceholder("例如：不用 AI，从零写出一个 Obsidian command 并运行。 ");
      c.setValue(draft.task);
      c.onChange((value) => { draft.task = value; });
      window.setTimeout(() => c.inputEl.focus(), 0);
    });

    new Setting(contentEl)
      .setName("第一次尝试")
      .setDesc("查看答案、资料或请求帮助前，你独立做到了什么？失败也要保留，它是最有价值的基线证据。")
      .addTextArea((c) => {
        c.setPlaceholder("例如：能注册 command，但忘记生命周期清理；第一次运行报错。 ");
        c.setValue(draft.firstAttempt ?? "");
        c.onChange((value) => { draft.firstAttempt = value || undefined; });
      });

    new Setting(contentEl)
      .setName("使用的来源 / 帮助")
      .setDesc("每行一个：官方文档、教材、论文、真实案例、老师或 AI 对话。记录来源，不把输入误算成能力。")
      .addTextArea((c) => {
        c.setPlaceholder("Obsidian Plugin API docs\n[[我的异步生命周期笔记]]\nAI：只询问错误原因");
        c.setValue(draft.sources.join("\n"));
        c.onChange((value) => { draft.sources = splitLines(value); });
      });

    new Setting(contentEl)
      .setName("主动输出")
      .setDesc("合上材料后，你实际说、写、做、计算、编码或演示出了什么？这是判断是否真的学会的核心。")
      .addTextArea((c) => {
        c.setPlaceholder("例如：重新从空文件独立实现 command 注册与卸载清理，并能解释为什么。 ");
        c.setValue(draft.activeOutput ?? "");
        c.onChange((value) => { draft.activeOutput = value || undefined; });
      });

    new Setting(contentEl).setName("辅助方式").setDesc("独立完成与辅助完成必须区分。 ").addDropdown((c) => {
      for (const [value, label] of ASSISTANCE_OPTIONS) c.addOption(value, label);
      c.setValue(draft.assistance);
      c.onChange((value) => { draft.assistance = value as LearningAssistance; });
    });

    new Setting(contentEl).setName("结果").addDropdown((c) => {
      for (const [value, label] of OUTCOME_OPTIONS) c.addOption(value, label);
      c.setValue(draft.outcome);
      c.onChange((value) => { draft.outcome = value as LearningSessionOutcome; });
    });

    new Setting(contentEl).setName("时长（分钟）").setDesc("可选；时长不是学习效果本身。 ").addText((c) => {
      c.inputEl.type = "number";
      c.inputEl.min = "1";
      c.inputEl.max = "1440";
      c.setValue(draft.durationMinutes ? String(draft.durationMinutes) : "");
      c.onChange((value) => {
        const number = Number(value);
        draft.durationMinutes = Number.isFinite(number) && number > 0 ? Math.round(number) : undefined;
      });
    });

    new Setting(contentEl).setName("证据").setDesc("每行一个：笔记、文件、录音、Git commit、测试结果或其他可检查输出。 ").addTextArea((c) => {
      c.setPlaceholder("[[Plugins/my-first-plugin]]\nhttps://github.com/.../commit/...\n通过 12/12 tests");
      c.setValue(draft.evidence.join("\n"));
      c.onChange((value) => { draft.evidence = splitLines(value); });
    });

    new Setting(contentEl).setName("错误 / 缺口").setDesc("每行一个具体错误。重复出现的错误会在 Learning Workspace 聚合。 ").addTextArea((c) => {
      c.setPlaceholder("忘记 unregister event\n不能独立解释 async 生命周期");
      c.setValue(draft.mistakes.join("\n"));
      c.onChange((value) => { draft.mistakes = splitLines(value); });
    });

    new Setting(contentEl).setName("反馈").setDesc("记录最影响结果的 1–3 条反馈，不追求一次修完所有问题。 ").addTextArea((c) => {
      c.setValue(draft.feedback ?? "");
      c.onChange((value) => { draft.feedback = value || undefined; });
    });

    new Setting(contentEl).setName("下一步").setDesc("下一项最小练习，下一次打开就能开始。 ").addTextArea((c) => {
      c.setValue(draft.nextStep ?? "");
      c.onChange((value) => { draft.nextStep = value || undefined; });
    });

    const actions = new Setting(contentEl);
    actions.settingEl.addClass("dashflow-task-editor-actions");
    if (this.session) {
      actions.addExtraButton((button) => button.setIcon("file-text").setTooltip("打开学习记录笔记").onClick(() => {
        void this.plugin.app.workspace.openLinkText(this.session?.source.path ?? "", "", false);
        this.close();
      }));
    }
    actions.addButton((button) => button.setButtonText("取消").onClick(() => this.close()));
    actions.addButton((button) => button.setCta().setButtonText(this.session ? "保存记录" : "记录学习").onClick(() => void this.save(draft)));
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private async save(draft: LearningSessionEditInput): Promise<void> {
    if (!draft.goalId || !draft.task.trim()) return;
    if (this.session) {
      if (await this.plugin.learningService.updateSession(this.session, draft)) this.close();
      return;
    }
    if (await this.plugin.learningService.createSession(draft)) this.close();
  }
}
