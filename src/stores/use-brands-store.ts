import { create } from "zustand";
import { Brand } from "@/types";
import { brandsService } from "@/services/brands";

interface BrandsState {
  brands: Brand[];
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setHasHydrated: (state: boolean) => void;
  fetchBrands: () => Promise<void>;
  addBrand: (brand: Omit<Brand, "id" | "projectCount">) => Promise<Brand>;
  updateBrand: (brandId: string, updates: Partial<Omit<Brand, "id" | "projectCount">>) => Promise<void>;
  deleteBrand: (brandId: string) => Promise<void>;
}

export const useBrandsStore = create<BrandsState>((set, get) => ({
  brands: [],
  hasHydrated: false,
  isLoading: false,
  error: null,

  setHasHydrated: (state) => set({ hasHydrated: state }),

  fetchBrands: async () => {
    set({ isLoading: true, error: null });
    try {
      const brands = await brandsService.getBrands();
      set({ brands, isLoading: false, hasHydrated: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar marcas";
      set({ error: message, isLoading: false, hasHydrated: true });
    }
  },

  addBrand: async (brandData) => {
    set({ isLoading: true, error: null });
    try {
      const newBrand = await brandsService.createBrand(brandData);
      set((state) => ({
        brands: [newBrand, ...state.brands],
        isLoading: false,
      }));
      return newBrand;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar marca";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateBrand: async (brandId, updates) => {
    const previousBrands = get().brands;
    
    // Atualização otimista
    set((state) => ({
      brands: state.brands.map((b) =>
        b.id === brandId ? { ...b, ...updates } : b
      ),
    }));

    try {
      await brandsService.updateBrand(brandId, updates);
    } catch (err: unknown) {
      // Reverter em caso de erro
      const message = err instanceof Error ? err.message : "Erro ao atualizar marca";
      set({ brands: previousBrands, error: message });
      throw err;
    }
  },

  deleteBrand: async (brandId) => {
    const previousBrands = get().brands;

    // Atualização otimista
    set((state) => ({
      brands: state.brands.filter((b) => b.id !== brandId),
    }));

    try {
      await brandsService.deleteBrand(brandId);
    } catch (err: unknown) {
      // Reverter em caso de erro
      const message = err instanceof Error ? err.message : "Erro ao excluir marca";
      set({ brands: previousBrands, error: message });
      throw err;
    }
  },
}));
