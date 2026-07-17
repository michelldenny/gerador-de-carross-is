import type { StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const safeStorage =
  typeof window !== "undefined"
    ? window.localStorage
    : noopStorage;
