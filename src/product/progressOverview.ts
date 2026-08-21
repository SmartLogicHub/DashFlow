export interface CompletionItem {
  completed: boolean;
}

export interface TaskOverviewMetric {
  label: "今日任务" | "全部任务";
  completed: number;
  total: number;
  percentage: number;
}

export interface TaskOverview {
  title: "任务概览";
  today: TaskOverviewMetric;
  all: TaskOverviewMetric;
}

function metric(label: TaskOverviewMetric["label"], items: readonly CompletionItem[]): TaskOverviewMetric {
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  return { label, completed, total, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

export function taskOverview(todayItems: readonly CompletionItem[], allItems: readonly CompletionItem[]): TaskOverview {
  const today = metric("今日任务", todayItems);
  const all = metric("全部任务", allItems);
  return {
    title: "任务概览",
    today,
    all,
  };
}
