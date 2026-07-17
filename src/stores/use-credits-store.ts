import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "./storage";

interface CreditsState {
  credits: number;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      credits: 150,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      consumeCredits: (amount) => {
        const { credits } = get();
        if (credits >= amount) {
          set({ credits: credits - amount });
          return true;
        }
        return false;
      },
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
    }),
    {
      name: "carousel_pro_credits",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
