import { describe, it, expect, vi, afterEach } from 'vitest';
import { LocalStorageServiceImp } from 'src/core/services/storage/local-storage/local-storage.service.imp';
describe('LocalStorageServiceImp', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });
  it('falls back to memory when browser storage is full', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError');
    });
    const storage = new LocalStorageServiceImp();
    storage.set('key', { value: 42 });
    expect(storage.get('key')).toEqual({ value: 42 });
  });
  it('returns null for corrupt JSON', () => {
    localStorage.setItem('key', '{broken');
    expect(new LocalStorageServiceImp().get('key')).toBeNull();
  });
  it('does not reread removed values if persistence removal fails', () => {
    localStorage.setItem('key', '"secret"');
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const storage = new LocalStorageServiceImp();
    storage.remove('key');
    expect(storage.get('key')).toBeNull();
  });
});
