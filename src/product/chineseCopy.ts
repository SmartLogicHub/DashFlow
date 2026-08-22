const LEGACY_PRODUCT_COPY: Readonly<Record<string, string>> = Object.freeze({
  "Daily Focus": "今日专注",
  "Project Management": "项目管理",
  "Habit Tracker": "习惯追踪",
  "Weekly Review": "每周复盘",
  Minimal: "极简模式",
  "Vault Pulse": "知识库概览",
  "Visual Data Filter": "数据筛选",
  "Magic Embed": "网页嵌入",
  Focus: "专注计时",
  TODAY: "今日任务",
  FOCUS: "专注",
  "YEAR END": "今年结束",
  COUNTDOWN: "倒计时",
  MILESTONE: "里程碑",
  Home: "默认工作台",
  "Custom Dashboard": "自定义工作台",
  "Imported Dashboard": "导入的工作台",
});

/** Keeps legacy default values readable without rewriting user-owned dashboard data. */
export function chineseProductText(value: string): string {
  return LEGACY_PRODUCT_COPY[value] ?? value;
}

