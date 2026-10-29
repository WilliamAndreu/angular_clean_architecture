export abstract class StorageSource {
  abstract get<T>(key: string): T | null;
  abstract set<T>(key: string, value: T): void;
  abstract remove(key: string): void;
  abstract clear(): void;
  abstract has(key: string): boolean;
}
