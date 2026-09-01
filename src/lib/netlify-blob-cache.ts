import { getStore } from "@netlify/blobs";

type CacheEntry<T> = {
  cachedAt: number;
  item: T;
};

interface CacheLoader<T> {
  (): Promise<T | null>;
}

type CacheOptions<T> = {
  key: string;
  load: CacheLoader<T>;
  storeName: string;
  timeout: number;
};

/**
 * Returns a fresh cached value or loads and stores a replacement.
 * A stale value is returned when the loader does not return a value.
 */
export async function getCachedValue<T>({
  key,
  load,
  storeName,
  timeout,
}: CacheOptions<T>): Promise<T | null> {
  const store = getStore(storeName);
  let cached: CacheEntry<T> | null = null;

  try {
    cached = (await store.get(key, { type: "json" })) as CacheEntry<T> | null;
  } catch {
    return load();
  }

  if (cached && Date.now() - cached.cachedAt < timeout) {
    return cached.item;
  }

  const value = await load();
  if (value === null) return cached?.item ?? null;

  try {
    await store.setJSON(key, {
      cachedAt: Date.now(),
      item: value,
    } satisfies CacheEntry<T>);
  } catch {
    return value;
  }

  return value;
}
