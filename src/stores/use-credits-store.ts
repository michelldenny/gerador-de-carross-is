import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CreditsState {
  credits: number;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    (set, get) => ({
      credits: 150,
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
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (null as any)
      ),
    }
  )
);
