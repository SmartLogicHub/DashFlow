import type { OpportunityItem } from "../services/OpportunityService";

export interface OpportunityRemoval {
  items: OpportunityItem[];
  removed: OpportunityItem | null;
  index: number;
}

export function removeOpportunityItem(items: OpportunityItem[], id: string): OpportunityRemoval {
  const index = items.findIndex((item) => item.id === id);
  if (index < 0) return { items: [...items], removed: null, index: -1 };
  return {
    items: items.filter((item) => item.id !== id),
    removed: items[index] ?? null,
    index,
  };
}

export function restoreOpportunityItem(items: OpportunityItem[], removal: OpportunityRemoval): OpportunityItem[] {
  if (!removal.removed || items.some((item) => item.id === removal.removed?.id)) return [...items];
  const next = [...items];
  next.splice(Math.max(0, Math.min(removal.index, next.length)), 0, removal.removed);
  return next;
}
