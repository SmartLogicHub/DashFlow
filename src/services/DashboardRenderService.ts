export interface DashboardRenderEvent {
  root: HTMLElement;
  sequence: number;
}

type DashboardRenderListener = (event: DashboardRenderEvent) => void;

/**
 * Explicit render lifecycle for DashFlow views.
 *
 * Decorator services subscribe here instead of observing document.body. The renderer is the
 * source of truth for when a DashFlow DOM tree has been rebuilt, so downstream work stays
 * scoped to the view that actually changed.
 */
export class DashboardRenderService {
  private readonly listeners = new Set<DashboardRenderListener>();
  private readonly roots = new Set<HTMLElement>();
  private sequence = 0;

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
