import type { WidgetDefinition } from "../models";

export class WidgetRegistry {
  private readonly definitions = new Map<string, WidgetDefinition>();

  register(definition: WidgetDefinition): void {
    if (this.definitions.has(definition.type)) {
      throw new Error(`Widget type "${definition.type}" is already registered.`);
    }
    this.definitions.set(definition.type, definition);
  }

  get(type: string): WidgetDefinition | undefined {
    return this.definitions.get(type);
  }

  list(): WidgetDefinition[] {
    return [...this.definitions.values()];
  }
}
