import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Brand } from "@/types";
import { MOCK_BRANDS } from "@/mocks";
import { safeStorage } from "./storage";

interface BrandsState {
  brands: Brand[];
  addBrand: (brand: Brand) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;
}

export const useBrandsStore = create<BrandsState>()(
  persist(
    (set) => ({
      brands: MOCK_BRANDS,
      addBrand: (brand) =>
        set((state) => ({ brands: [brand, ...state.brands] })),
      updateBrand: (brandId, updates) =>
        set((state) => ({
          brands: state.brands.map((b) =>
            b.id === brandId ? { ...b, ...updates } : b
          ),
        })),
      deleteBrand: (brandId) =>
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== brandId),
        })),
    }),
    {
      name: "carousel_pro_brands",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
