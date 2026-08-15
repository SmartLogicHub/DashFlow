import type { CalendarEvent, CalendarWidgetConfig, Habit, Project, Task } from "../models";
import { habitCompletedOn, habitScheduledOn } from "../habits/habitMath";
import { addDays } from "../utils/date";
import type { VaultIndexService } from "./VaultIndexService";

const KIND_ORDER: Record<CalendarEvent["kind"], number> = {
  "task-due": 0,
  "task-scheduled": 1,
  habit: 2,
  "project-deadline": 3,
};

export class CalendarService {
  constructor(private readonly index: VaultIndexService) {}

  eventsBetween(start: string, end: string, config: CalendarWidgetConfig): CalendarEvent[] {
    const snapshot = this.index.getSnapshot();
    const events: CalendarEvent[] = [];

    if (config.showTasks !== false) {
      for (const task of snapshot.tasks) this.addTaskEvents(events, task, start, end, config.showCompletedTasks === true);
    }

    if (config.showProjects !== false) {
      for (const project of snapshot.projects) this.addProjectEvent(events, project, start, end);
    }

    if (config.showHabits !== false) {
      for (const habit of snapshot.habits) this.addHabitEvents(events, habit, start, end);
    }

    return events.sort((a, b) => a.date.localeCompare(b.date)
      || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]
      || a.title.localeCompare(b.title));
  }

  private addTaskEvents(
    target: CalendarEvent[],
    task: Task,
    start: string,
    end: string,
    showCompleted: boolean,
  ): void {
    if (task.completed && !showCompleted) return;

    if (task.due && this.inRange(task.due, start, end)) {
      target.push({
        id: `${task.id}:due`,
        date: task.due,
        kind: "task-due",
        title: task.text,
        entityId: task.id,
        source: task.source,
        completed: task.completed,
        priority: task.priority,
      });
    }

    if (task.scheduled && task.scheduled !== task.due && this.inRange(task.scheduled, start, end)) {
      target.push({
        id: `${task.id}:scheduled`,
        date: task.scheduled,
        kind: "task-scheduled",
        title: task.text,
        entityId: task.id,
        source: task.source,
        completed: task.completed,
        priority: task.priority,
      });
    }
  }

  private addProjectEvent(target: CalendarEvent[], project: Project, start: string, end: string): void {
    if (!project.deadline || project.status === "archived" || !this.inRange(project.deadline, start, end)) return;
    target.push({
      id: `${project.id}:deadline`,
      date: project.deadline,
      kind: "project-deadline",
      title: project.name,
      entityId: project.id,
      source: project.source,
      completed: project.status === "completed",
    });
  }

  private addHabitEvents(target: CalendarEvent[], habit: Habit, start: string, end: string): void {
    if (habit.status !== "active") return;
    let cursor = start;
    for (let guard = 0; guard < 370 && cursor <= end; guard += 1) {
      if (habitScheduledOn(habit, cursor)) {
        target.push({
          id: `${habit.id}:${cursor}:habit`,
          date: cursor,
          kind: "habit",
          title: habit.name,
          entityId: habit.id,
          source: habit.source,
          completed: habitCompletedOn(habit, cursor),
        });
      }
      cursor = addDays(cursor, 1);
    }
  }

  private inRange(date: string, start: string, end: string): boolean {
    return date >= start && date <= end;
  }
}
