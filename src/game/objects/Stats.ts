import { Database } from "../management/Database";

export class Stats {
  private registry: Map<string, number>;

  constructor() {
    const entries = Object.entries(Database.$dataPlayer.stats);
    this.registry = new Map(entries);
  }

  public restoreStats(obj: Object) {
    this.registry = new Map(Object.entries(obj));
  }
  public stringifyStats(): Object {
    return Object.entries(this.registry);
  }

  public get(name: string): number | undefined {
    if (!this.registry.has(name))
      throw new Error(`the stat ${name} doesn't exist`);
    return this.registry.get(name);
  }

  public set(name: string, value: number) {
    if (!this.registry.has(name))
      throw new Error(`the stat ${name} doesn't exist`);
    this.registry.set(name, value);
  }
}
