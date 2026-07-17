import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Project, Slide } from "@/types";
import { MOCK_PROJECTS } from "@/mocks";
import { safeStorage } from "./storage";

interface ProjectsState {
  projects: Project[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => string | null;
  renameProject: (projectId: string, title: string) => void;
  updateSlide: (projectId: string, slideId: string, updates: Partial<Slide>) => void;
  addSlide: (projectId: string, slide: Slide) => void;
  deleteSlide: (projectId: string, slideId: string) => void;
  reorderSlides: (projectId: string, slides: Slide[]) => void;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      projects: MOCK_PROJECTS,
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      addProject: (project) =>
        set((state) => ({ projects: [project, ...state.projects] })),
      updateProject: (projectId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, ...updates, updatedAt: "Agora mesmo" }
              : p
          ),
        })),
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),
      duplicateProject: (projectId) => {
        let newId: string | null = null;
        set((state) => {
          const projectToCopy = state.projects.find((p) => p.id === projectId);
          if (!projectToCopy) return {};

          newId = `proj-${Date.now()}`;
          const newProject: Project = {
            ...projectToCopy,
            id: newId,
            title: `${projectToCopy.title} (Cópia)`,
            updatedAt: "Agora mesmo",
            slides: projectToCopy.slides.map((s, idx) => ({
              ...s,
              id: `slide-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
            })),
          };

          return { projects: [newProject, ...state.projects] };
        });
        return newId;
      },
      renameProject: (projectId, title) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, title, updatedAt: "Agora mesmo" } : p
          ),
        })),
      updateSlide: (projectId, slideId, updates) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              updatedAt: "Agora mesmo",
              slides: p.slides.map((s) =>
                s.id === slideId ? { ...s, ...updates } : s
              ),
            };
          }),
        })),
      addSlide: (projectId, slide) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              updatedAt: "Agora mesmo",
              slides: [...p.slides, slide],
            };
          }),
        })),
      deleteSlide: (projectId, slideId) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            const remaining = p.slides.filter((s) => s.id !== slideId);
            // Reordenar slides restantes
            const updated = remaining.map((s, index) => ({
              ...s,
              order: index + 1,
            }));
            return {
              ...p,
              updatedAt: "Agora mesmo",
              slides: updated,
            };
          }),
        })),
      reorderSlides: (projectId, slides) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              updatedAt: "Agora mesmo",
              slides: slides.map((s, idx) => ({ ...s, order: idx + 1 })),
            };
          }),
        })),
    }),
    {
      name: "carousel_pro_projects",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
