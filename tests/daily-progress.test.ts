import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const models = readFileSync("src/models.ts", "utf8");
const parser = readFileSync("src/parsers/habitParser.ts", "utf8");
const service = readFileSync("src/services/HabitService.ts", "utf8");
const editor = readFileSync("src/ui/HabitEditorModal.ts", "utf8");
const noteModal = readFileSync("src/ui/DailyProgressNoteModal.ts", "utf8");
const widget = readFileSync("src/services/HabitWidgetInteractionService.ts", "utf8");
const quickAdd = readFileSync("src/ui/QuickAddModal.ts", "utf8");

test("daily progress extends Habit without replacing legacy habit semantics", () => {
  assert.ok(models.includes('export type HabitKind = "habit" | "daily-progress"'));
  assert.ok(models.includes("kind?: HabitKind"));
  assert.ok(models.includes("dailyNotes?: Record<string, string>"));
  assert.ok(models.includes("linkedProjectId?: string"));
  assert.ok(parser.includes('frontmatter.habit_kind ?? frontmatter.kind ?? "habit"'));
  assert.ok(parser.includes('rawKind === "daily-progress" ? "daily-progress" : "habit"'));
});

test("daily progress completion and notes remain separate Markdown fields", () => {
  assert.ok(service.includes("frontmatter.habit_log = dates"));
  assert.ok(service.includes("async setDailyNote"));
  assert.ok(service.includes("frontmatter.daily_notes = notes"));
  assert.ok(service.includes("daily_notes: {}"));
  assert.ok(parser.includes("normalizeDailyNotes(frontmatter.daily_notes)"));
});

test("daily progress editor fixes cadence to daily and can link a project", () => {
  assert.ok(editor.includes('"daily-progress", "长期任务（日更）"'));
  assert.ok(editor.includes('draft.kind === "daily-progress"'));
  assert.ok(editor.includes('draft.frequency = "daily"'));
  assert.ok(editor.includes("linkedProjectId"));
  assert.ok(editor.includes("不关联项目"));
});

test("daily progress widget supports history backfill today check-in and notes", () => {
  assert.ok(widget.includes('habit.kind === "daily-progress"'));
  assert.ok(widget.includes("point.date <= today"));
  assert.ok(widget.includes("toggleDate(habit, point.date)"));
  assert.ok(widget.includes("DailyProgressNoteModal"));
  assert.ok(widget.includes("今日已推进"));
  assert.ok(widget.includes("has-note"));
});

test("daily note modal writes through HabitService instead of plugin private state", () => {
  assert.ok(noteModal.includes("habitService.setDailyNote"));
  assert.ok(noteModal.includes("daily_notes"));
  assert.equal(noteModal.includes("saveData("), false);
});

test("Quick Add exposes the combined habit and daily-progress editor", () => {
  assert.ok(quickAdd.includes("习惯 / 日更"));
  assert.ok(quickAdd.includes("HabitEditorModal"));
});
