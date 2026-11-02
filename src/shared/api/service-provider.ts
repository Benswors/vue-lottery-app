export interface ServiceKey<T> { readonly name: string; readonly type?: T }
export function createServiceKey<T>(name: string): ServiceKey<T> { return Object.freeze({ name }) }

export class ServiceProvider {
  private static factories = new Map<string, () => unknown>()
  private static instances = new Map<string, unknown>()
  static register<T>(key: ServiceKey<T>, factory: () => T): void {
    this.factories.set(key.name, factory)
    this.instances.delete(key.name)
  }
  static get<T>(key: ServiceKey<T>): T {
    if (!this.instances.has(key.name)) {
      const factory = this.factories.get(key.name)
      if (!factory) throw new Error(`Service "${key.name}" is not registered`)
      this.instances.set(key.name, factory())
    }
    return this.instances.get(key.name) as T
  }
}
