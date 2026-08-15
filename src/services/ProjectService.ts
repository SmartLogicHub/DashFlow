import type { Project, Task } from "../models";
import type { VaultIndexService } from "./VaultIndexService";

export class ProjectService {
  constructor(private readonly index: VaultIndexService) {}

  active(): Project[] {
    return this.index.getSnapshot().projects
      .filter((project) => project.status === "active")
      .sort((a, b) => (a.deadline ?? "9999").localeCompare(b.deadline ?? "9999"));
  }

  tasks(project: Project): Task[] {
    return this.index.getSnapshot().tasks.filter((task) => task.projectId === project.id);
  }

  progress(project: Project): number {
    if (project.progressMode === "manual" && project.manualProgress !== undefined) {
      return project.manualProgress;
    }
    const tasks = this.tasks(project);
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter((task) => task.completed).length / tasks.length) * 100);
  }
}
