import { TFile, type App, type Plugin } from "obsidian";
import type { ActivityStore, DailyActivity, Task, VaultSnapshot } from "../models";
import { emptyDailyActivity } from "../activity/activityMath";
import { localDate } from "../utils/date";
import { stableHash } from "../utils/hash";
import type { VaultIndexService } from "./VaultIndexService";

const MAX_ACTIVITY_DAYS = 400;

export class ActivityService {
  private readonly listeners = new Set<() => void>();
  private unsubscribeIndex: (() => void) | null = null;
  private previousTaskStates = new Map<string, boolean>();
  private previousHabitStates = new Map<string, boolean>();
  private hasTaskBaseline = false;
  private hasHabitBaseline = false;
  private saveTimer: number | null = null;
  private started = false;

  constructor(
    private readonly app: App,
    private readonly plugin: Plugin,
    private readonly index: VaultIndexService,
    private readonly storeProvider: () => ActivityStore,
    private readonly save: () => Promise<void>,
  ) {}

  start(): void {
    if (this.started) return;
    this.started = true;

    this.unsubscribeIndex = this.index.subscribe((snapshot) => this.handleSnapshot(snapshot));

    this.plugin.registerEvent(this.app.vault.on("create", (file) => {
      if (file instanceof TFile && file.extension === "md") this.recordNoteCreated(file.path);
    }));

    this.plugin.registerEvent(this.app.vault.on("modify", (file) => {
      if (file instanceof TFile && file.extension === "md") this.recordNoteModified(file.path);
    }));
  }

  stop(): void {
    this.unsubscribeIndex?.();
    this.unsubscribeIndex = null;
    this.started = false;
    if (this.saveTimer !== null) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = null;
      void this.save();
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getStore(): ActivityStore {
    return this.getStoreValue();
  }

  recordTaskCreated(text: string, sourcePath = ""): void {
    const day = this.ensureToday();
    const key = stableHash(`${sourcePath}|${text}|${Date.now()}|${day.tasksCreated}`);
    day.createdTaskKeys.push(key);
    day.tasksCreated += 1;
    this.changed();
  }

  recordTaskCompleted(task: Task): void {
    const day = this.ensureToday();
    const key = this.taskKey(task);
    if (day.completedTaskKeys.includes(key)) return;
    day.completedTaskKeys.push(key);
    day.tasksCompleted += 1;
    this.changed();
  }

  setHabitCompleted(habitId: string, date: string, completed: boolean): void {
    const day = this.ensureDate(date);
    const key = stableHash(habitId);
    const index = day.completedHabitKeys.indexOf(key);

    if (completed) {
      if (index >= 0) return;
      day.completedHabitKeys.push(key);
      day.habitsCompleted += 1;
      this.changed();
      return;
    }

    if (index < 0) return;
    day.completedHabitKeys.splice(index, 1);
    day.habitsCompleted = Math.max(0, day.habitsCompleted - 1);
    this.changed();
  }

  private recordNoteCreated(path: string): void {
    const day = this.ensureToday();
    const key = stableHash(path);
    if (day.createdNoteKeys.includes(key)) return;
    day.createdNoteKeys.push(key);
    day.notesCreated += 1;
    this.changed();
  }

  private recordNoteModified(path: string): void {
    const day = this.ensureToday();
    const key = stableHash(path);
    if (day.createdNoteKeys.includes(key) || day.modifiedNoteKeys.includes(key)) return;
    day.modifiedNoteKeys.push(key);
    day.notesModified += 1;
    this.changed();
  }

  private handleSnapshot(snapshot: VaultSnapshot): void {
    const nextTasks = new Map<string, boolean>();
    for (const task of snapshot.tasks) {
      const key = this.taskKey(task);
      nextTasks.set(key, task.completed);
      if (this.hasTaskBaseline && this.previousTaskStates.get(key) === false && task.completed) {
        this.recordTaskCompleted(task);
      }
    }
    this.previousTaskStates = nextTasks;
    this.hasTaskBaseline = true;

    const today = localDate();
    const nextHabits = new Map<string, boolean>();
    for (const habit of snapshot.habits) {
      const key = stableHash(habit.id);
      const completed = habit.completedDates.includes(today);
      nextHabits.set(key, completed);
      if (this.hasHabitBaseline) {
        const previous = this.previousHabitStates.get(key) ?? false;
        if (previous !== completed) this.setHabitCompleted(habit.id, today, completed);
      }
    }
    this.previousHabitStates = nextHabits;
    this.hasHabitBaseline = true;
  }

  private taskKey(task: Task): string {
    return stableHash(`${task.source.path}|${task.text}|${task.projectId ?? ""}`);
  }

  private ensureToday(): DailyActivity {
    return this.ensureDate(localDate());
  }

  private ensureDate(date: string): DailyActivity {
    const store = this.getStoreValue();
    const existing = store.days[date];
    if (existing) return this.normalizeDay(existing, date);
    const created = emptyDailyActivity(date);
    store.days[date] = created;
    return created;
  }

  private normalizeDay(day: DailyActivity, date: string): DailyActivity {
    day.date ||= date;
    day.notesCreated ??= 0;
    day.notesModified ??= 0;
    day.tasksCreated ??= 0;
    day.tasksCompleted ??= 0;
    day.habitsCompleted ??= 0;
    day.createdNoteKeys ??= [];
    day.modifiedNoteKeys ??= [];
    day.createdTaskKeys ??= [];
    day.completedTaskKeys ??= [];
    day.completedHabitKeys ??= [];
    return day;
  }

  private getStoreValue(): ActivityStore {
    const store = this.storeProvider();
    store.startedAt ||= localDate();
    store.days ??= {};
    return store;
  }

  private changed(): void {
    this.prune();
    this.scheduleSave();
    for (const listener of this.listeners) listener();
  }

  private prune(): void {
    const store = this.getStoreValue();
    const dates = Object.keys(store.days).sort();
    const overflow = dates.length - MAX_ACTIVITY_DAYS;
    if (overflow <= 0) return;
    for (const date of dates.slice(0, overflow)) delete store.days[date];
  }

  private scheduleSave(): void {
    if (this.saveTimer !== null) window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = null;
      void this.save();
    }, 400);
  }
}
