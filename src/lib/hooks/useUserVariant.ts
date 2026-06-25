type Variant = {
  header: string;
};

const STORAGE_KEY = "user-variant";
const VARIANT_MAP: Array<Variant> = [{ header: "ascii" }, { header: "handwriting" }];

/**
 * This creates a seperate experience for each user.
 *
 * Returns a stored variant or sets a new one.
 * Falls back to a random value in SSR / non-browser environments.
 */
export function useUserVariant() {
  if (typeof localStorage === "undefined") {
    return VARIANT_MAP[0];
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) {
    return JSON.parse(stored) as Variant;
  }

  const index = Math.floor(Math.random() * VARIANT_MAP.length);
  const variant = VARIANT_MAP[index];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(variant));
  return variant;
}
