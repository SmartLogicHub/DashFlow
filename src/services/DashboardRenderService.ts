export interface DashboardRenderEvent {
  root: HTMLElement;
  sequence: number;
}

export interface DashboardRenderMetrics {
  requests: number;
  commits: number;
  coalesced: number;
  lastMs: number;
  averageMs: number;
  maxMs: number;
}

type DashboardRenderListener = (event: DashboardRenderEvent) => void;

/**
 * Explicit render lifecycle for DashFlow views.
 *
 * Decorator services subscribe here instead of observing document.body. The renderer is the
 * source of truth for when a DashFlow DOM tree has been rebuilt, so downstream work stays
 * scoped to the view that actually changed.
 *
 * Metrics are in-memory diagnostics only. They are deliberately not persisted into plugin data.
 */
export class DashboardRenderService {
  private readonly listeners = new Set<DashboardRenderListener>();
  private readonly roots = new Set<HTMLElement>();
  private sequence = 0;
  private renderRequests = 0;
  private renderCommits = 0;
  private coalescedRequests = 0;
  private totalMs = 0;
  private lastMs = 0;
  private maxMs = 0;

  requested(coalesced: boolean): void {
    this.renderRequests += 1;
    if (coalesced) this.coalescedRequests += 1;
  }

  committed(durationMs: number): void {
    const safeDuration = Number.isFinite(durationMs) ? Math.max(0, durationMs) : 0;
    this.renderCommits += 1;
    this.lastMs = safeDuration;
    this.totalMs += safeDuration;
    this.maxMs = Math.max(this.maxMs, safeDuration);
  }

  metrics(): DashboardRenderMetrics {
    return {
      requests: this.renderRequests,
      commits: this.renderCommits,
      coalesced: this.coalescedRequests,
      lastMs: this.lastMs,
      averageMs: this.renderCommits === 0 ? 0 : this.totalMs / this.renderCommits,
      maxMs: this.maxMs,
    };
  }

  rendered(root: HTMLElement): void {
    this.roots.add(root);
    const event = { root, sequence: this.sequence += 1 };
    for (const listener of this.listeners) listener(event);
  }

  unmount(root: HTMLElement): void {
    this.roots.delete(root);
  }

  subscribe(listener: DashboardRenderListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  forEachRoot(visitor: (root: HTMLElement) => void): void {
    for (const root of this.roots) {
      if (!root.isConnected) {
        this.roots.delete(root);
        continue;
      }
      visitor(root);
    }
  }

  rootCount(): number {
    let count = 0;
    this.forEachRoot(() => { count += 1; });
    return count;
  }
}
