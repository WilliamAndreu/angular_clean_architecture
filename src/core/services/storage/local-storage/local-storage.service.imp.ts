import { Injectable } from '@angular/core';
import { StorageSource } from 'src/core/services/storage/source/storage.source';

@Injectable()
export class LocalStorageServiceImp extends StorageSource {
  // Keep the app usable when browser persistence is unavailable or full.
  private readonly memory = new Map<string, string | null>();
  private ignorePersistence = false;
  get<T>(key: string): T | null {
    try {
      const item = this.memory.has(key)
        ? this.memory.get(key)
        : this.ignorePersistence
          ? null
          : localStorage.getItem(key);
      return item == null ? null : (JSON.parse(item) as T);
    } catch {
      return null;
    }
  }
  set<T>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    this.memory.set(key, serialized);
    try {
      localStorage.setItem(key, serialized);
    } catch {
      /* In-memory fallback. */
    }
  }
  remove(key: string): void {
    this.memory.set(key, null);
    try {
      localStorage.removeItem(key);
    } catch {
      /* Tombstone prevents stale reads. */
    }
  }
  clear(): void {
    this.memory.clear();
    try {
      localStorage.clear();
    } catch {
      this.ignorePersistence = true;
    }
  }
  has(key: string): boolean {
    return this.get<unknown>(key) !== null;
  }
}
