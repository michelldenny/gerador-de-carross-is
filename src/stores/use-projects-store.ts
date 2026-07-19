import { create } from "zustand";
import { Project, Slide } from "@/types";
import { projectsService } from "@/services/projects";

interface ProjectsState {
  projects: Project[];
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setHasHydrated: (state: boolean) => void;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, "id" | "updatedAt">) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Omit<Project, "id" | "slides" | "updatedAt">>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (projectId: string) => Promise<string | null>;
  renameProject: (projectId: string, title: string) => Promise<void>;
  updateSlide: (projectId: string, slideId: string, updates: Partial<Omit<Slide, "id" | "order">>) => Promise<void>;
  addSlide: (projectId: string, slide: Omit<Slide, "id">) => Promise<Slide>;
  deleteSlide: (projectId: string, slideId: string) => Promise<void>;
  reorderSlides: (projectId: string, slides: Slide[]) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  hasHydrated: false,
  isLoading: false,
  error: null,

  setHasHydrated: (state) => set({ hasHydrated: state }),

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectsService.getProjects();
      set({ projects, isLoading: false, hasHydrated: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao carregar projetos";
      set({ error: message, isLoading: false, hasHydrated: true });
    }
  },

  addProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProj = await projectsService.createProject(projectData);
      set((state) => ({
        projects: [newProj, ...state.projects],
        isLoading: false,
      }));
      return newProj;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao criar projeto";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  updateProject: async (projectId, updates) => {
    const previousProjects = get().projects;

    // Atualização otimista
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates, updatedAt: "Agora mesmo" } : p
      ),
    }));

    try {
      await projectsService.updateProject(projectId, updates);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar projeto";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },

  deleteProject: async (projectId) => {
    const previousProjects = get().projects;

    // Atualização otimista
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
    }));

    try {
      await projectsService.deleteProject(projectId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao excluir projeto";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },

  duplicateProject: async (projectId) => {
    const projects = get().projects;
    const projectToCopy = projects.find((p) => p.id === projectId);
    if (!projectToCopy) return null;

    set({ isLoading: true, error: null });
    try {
      const duplicatedProj = await projectsService.createProject({
        title: `${projectToCopy.title} (Cópia)`,
        theme: projectToCopy.theme,
        status: projectToCopy.status,
        width: projectToCopy.width,
        height: projectToCopy.height,
        brandId: projectToCopy.brandId,
        caption: projectToCopy.caption,
        hashtags: projectToCopy.hashtags,
        format: projectToCopy.format,
        creationMode: projectToCopy.creationMode,
        generationMetadata: projectToCopy.generationMetadata,
        slides: projectToCopy.slides.map((s) => ({
          ...s,
          id: "", // Deixa o banco gerar novos IDs para os slides duplicados
        })),
      });

      set((state) => ({
        projects: [duplicatedProj, ...state.projects],
        isLoading: false,
      }));

      return duplicatedProj.id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao duplicar projeto";
      set({ error: message, isLoading: false });
      return null;
    }
  },

  renameProject: async (projectId, title) => {
    const previousProjects = get().projects;

    // Atualização otimista
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, title, updatedAt: "Agora mesmo" } : p
      ),
    }));

    try {
      await projectsService.updateProject(projectId, { title });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao renomear projeto";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },

  updateSlide: async (projectId, slideId, updates) => {
    const previousProjects = get().projects;

    // Atualização otimista
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
    }));

    try {
      await projectsService.updateSlide(slideId, updates);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar slide";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },

  addSlide: async (projectId, slide) => {
    set({ isLoading: true, error: null });
    try {
      const newSlide = await projectsService.addSlide(projectId, slide);
      set((state) => ({
        projects: state.projects.map((p) => {
          if (p.id !== projectId) return p;
          return {
            ...p,
            updatedAt: "Agora mesmo",
            slides: [...p.slides, newSlide],
          };
        }),
        isLoading: false,
      }));
      return newSlide;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar slide";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  deleteSlide: async (projectId, slideId) => {
    const previousProjects = get().projects;

    // Otimista: remove o slide localmente e recalcula a ordem
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p;
        const remaining = p.slides.filter((s) => s.id !== slideId);
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
    }));

    try {
      await projectsService.deleteSlide(projectId, slideId);
      
      const updatedProject = get().projects.find((p) => p.id === projectId);
      if (updatedProject) {
        await projectsService.reorderSlides(projectId, updatedProject.slides);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao deletar slide";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },

  reorderSlides: async (projectId, slides) => {
    const previousProjects = get().projects;

    // Atualização otimista
    const reordered = slides.map((s, idx) => ({ ...s, order: idx + 1 }));
    set((state) => ({
      projects: state.projects.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          updatedAt: "Agora mesmo",
          slides: reordered,
        };
      }),
    }));

    try {
      await projectsService.reorderSlides(projectId, reordered);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao reordenar slides";
      set({ projects: previousProjects, error: message });
      throw err;
    }
  },
}));
