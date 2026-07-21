import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";

interface CreditsState {
  credits: number;
  hasHydrated: boolean;
  isLoading: boolean;
  fetchCredits: () => Promise<void>;
}

export const useCreditsStore = create<CreditsState>((set) => ({
  credits: 0,
  hasHydrated: false,
  isLoading: false,
  fetchCredits: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return set({ credits: 0, isLoading: false, hasHydrated: true });
    const { data, error } = await supabase.from("profiles").select("credit_balance").eq("id", user.id).single();
    set({ credits: error ? 0 : data.credit_balance, isLoading: false, hasHydrated: true });
  },
}));
