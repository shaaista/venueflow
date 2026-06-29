const ACCESS_KEY = "vf_access_token";

let memoryToken: string | null = null;

/** Access-token store. Kept in memory + localStorage so it survives reloads. */
export const tokenStore = {
  get(): string | null {
    if (memoryToken) return memoryToken;
    if (typeof window === "undefined") return null;
    memoryToken = window.localStorage.getItem(ACCESS_KEY);
    return memoryToken;
  },
  set(token: string) {
    memoryToken = token;
    if (typeof window !== "undefined") window.localStorage.setItem(ACCESS_KEY, token);
  },
  clear() {
    memoryToken = null;
    if (typeof window !== "undefined") window.localStorage.removeItem(ACCESS_KEY);
  },
};
