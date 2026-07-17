import { create } from "zustand";
import { Brand, Project, Slide, Notification, HistoryItem } from "./types";
import { MOCK_BRANDS, MOCK_PROJECTS, MOCK_NOTIFICATIONS } from "./mocks";

interface AppState {
  // Navigation
  currentView: "dashboard" | "projects" | "new-project" | "editor" | "brands" | "templates" | "settings";
  currentProjectId: string | null;
  activeSlideId: string | null;
  selectedElementId: string | null; // "title" | "subtitle" | "body" | "cta" | "image" | null
  activeTab: "content" | "design" | "image" | "template";

  // Data
  projects: Project[];
  brands: Brand[];
  notifications: Notification[];
  credits: number;
  autosaveStatus: "saved" | "saving" | "unsaved";

  // Modals
  isPreviewModalOpen: boolean;
  isExportModalOpen: boolean;
  isShareModalOpen: boolean;
  isImageSearchModalOpen: boolean;

  // History Stack
  undoStack: string[]; // stringified project states
  redoStack: string[];

  // Generation Screen Simulation State
  generationProgress: number;
  generationStep: string;
  isGenerating: boolean;

  // Actions
  setView: (view: AppState["currentView"], projectId?: string | null) => void;
  setActiveSlide: (slideId: string | null) => void;
  setSelectedElement: (elementId: AppState["selectedElementId"]) => void;
  setActiveTab: (tab: AppState["activeTab"]) => void;

  // Project Actions
  addProject: (project: Project) => void;
  updateProject: (project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  renameProject: (id: string, title: string) => void;

  // Slide Actions
  addSlide: () => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  deleteSlide: (slideId: string) => void;
  duplicateSlide: (slideId: string) => void;
  reorderSlides: (startIndex: number, endIndex: number) => void;

  // Brand Actions
  addBrand: (brand: Brand) => void;
  updateBrand: (brandId: string, updates: Partial<Brand>) => void;
  deleteBrand: (brandId: string) => void;

  // History Actions
  pushHistoryState: () => void;
  undo: () => void;
  redo: () => void;

  // Simulated Services
  triggerAutosave: () => void;
  generateCarouselWithAI: (setupData: {
    title: string;
    theme: string;
    brandId: string;
    audience: string;
    goal: string;
    tone: string;
    slideCount: number;
    cta: string;
    format: "vertical" | "square" | "story";
    imageOption: string;
  }) => Promise<void>;

  // Notification Actions
  addNotification: (title: string, message: string, type: Notification["type"]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Modal Actions
  setPreviewModal: (open: boolean) => void;
  setExportModal: (open: boolean) => void;
  setShareModal: (open: boolean) => void;
  setImageSearchModal: (open: boolean) => void;
}

// Helper to load state from localStorage or use defaults
const getInitialProjects = (): Project[] => {
  const saved = localStorage.getItem("carousel_pro_projects");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading projects from localstorage", e);
    }
  }
  return MOCK_PROJECTS;
};

const getInitialBrands = (): Brand[] => {
  const saved = localStorage.getItem("carousel_pro_brands");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading brands from localstorage", e);
    }
  }
  return MOCK_BRANDS;
};

export const useStore = create<AppState>((set, get) => ({
  // Navigation & UI state
  currentView: "dashboard",
  currentProjectId: null,
  activeSlideId: null,
  selectedElementId: null,
  activeTab: "content",

  // Data state
  projects: getInitialProjects(),
  brands: getInitialBrands(),
  notifications: MOCK_NOTIFICATIONS,
  credits: 150,
  autosaveStatus: "saved",

  // Modals state
  isPreviewModalOpen: false,
  isExportModalOpen: false,
  isShareModalOpen: false,
  isImageSearchModalOpen: false,

  // History state
  undoStack: [],
  redoStack: [],

  // Generation progress
  generationProgress: 0,
  generationStep: "",
  isGenerating: false,

  // Set navigation view
  setView: (view, projectId = null) => {
    const updates: Partial<AppState> = { currentView: view };
    if (projectId !== undefined) {
      updates.currentProjectId = projectId;
      // Set active slide to first slide of selected project
      if (projectId) {
        const project = get().projects.find(p => p.id === projectId);
        if (project && project.slides.length > 0) {
          updates.activeSlideId = project.slides[0].id;
        }
      }
    }
    set(updates);
  },

  setActiveSlide: (slideId) => set({ activeSlideId: slideId, selectedElementId: null }),
  setSelectedElement: (elementId) => set({ selectedElementId: elementId }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Project Actions
  addProject: (project) => {
    set((state) => {
      const newProjects = [project, ...state.projects];
      localStorage.setItem("carousel_pro_projects", JSON.stringify(newProjects));
      return { projects: newProjects };
    });
    get().triggerAutosave();
  },

  updateProject: (updates) => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    get().pushHistoryState(); // record history for undo

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        return { ...p, ...updates, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    set({ projects: updatedProjects });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  deleteProject: (id) => {
    set((state) => {
      const filtered = state.projects.filter(p => p.id !== id);
      localStorage.setItem("carousel_pro_projects", JSON.stringify(filtered));
      const nextView = state.currentProjectId === id ? "dashboard" : state.currentView;
      return {
        projects: filtered,
        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        currentView: nextView as any
      };
    });
    get().addNotification("Projeto excluído", "O projeto foi removido permanentemente.", "info");
  },

  duplicateProject: (id) => {
    const projectToCopy = get().projects.find(p => p.id === id);
    if (!projectToCopy) return;

    const newProject: Project = {
      ...projectToCopy,
      id: `proj-${Date.now()}`,
      title: `${projectToCopy.title} (Cópia)`,
      updatedAt: "Agora mesmo",
      slides: projectToCopy.slides.map(s => ({
        ...s,
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      }))
    };

    set((state) => {
      const list = [newProject, ...state.projects];
      localStorage.setItem("carousel_pro_projects", JSON.stringify(list));
      return { projects: list };
    });
    get().addNotification("Projeto duplicado", `Cópia de '${projectToCopy.title}' criada com sucesso.`, "success");
  },

  renameProject: (id, title) => {
    set((state) => {
      const list = state.projects.map(p => p.id === id ? { ...p, title, updatedAt: "Agora mesmo" } : p);
      localStorage.setItem("carousel_pro_projects", JSON.stringify(list));
      return { projects: list };
    });
    get().triggerAutosave();
  },

  // Slide Actions
  addSlide: () => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    get().pushHistoryState();

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        const order = p.slides.length + 1;
        const brand = get().brands.find(b => b.id === p.brandId) || get().brands[0];
        
        const newSlide: Slide = {
          id: `slide-${Date.now()}`,
          order,
          type: "content",
          template: "content-highlight",
          title: "Novo Slide de Conteúdo",
          subtitle: `Ponto ${order - 1}`,
          body: "Clique duas vezes para editar o texto deste slide ou utilize o painel lateral de propriedades.",
          styles: {
            backgroundColor: brand?.backgroundColor || "#ffffff",
            textColor: brand?.textColor || "#1e293b",
            accentColor: brand?.primaryColor || "#7c3aed",
            fontFamily: brand?.fontFamily || "Inter"
          }
        };

        // If inserting a slide, make sure it stays before the final CTA slide if possible
        const slides = [...p.slides];
        const lastSlide = slides[slides.length - 1];
        if (lastSlide && lastSlide.type === "cta") {
          // insert before CTA
          newSlide.order = lastSlide.order;
          lastSlide.order = lastSlide.order + 1;
          slides.splice(slides.length - 1, 0, newSlide);
        } else {
          slides.push(newSlide);
        }

        return { ...p, slides, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    set({ projects: updatedProjects });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  updateSlide: (slideId, updates) => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        const slides = p.slides.map((s) => {
          if (s.id === slideId) {
            return { ...s, ...updates };
          }
          return s;
        });
        return { ...p, slides, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    set({ projects: updatedProjects });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  deleteSlide: (slideId) => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    const project = projects.find(p => p.id === currentProjectId);
    if (!project || project.slides.length <= 1) {
      get().addNotification("Aviso", "O carrossel deve conter pelo menos 1 slide.", "warning");
      return;
    }

    get().pushHistoryState();

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        const remainingSlides = p.slides
          .filter(s => s.id !== slideId)
          .map((s, index) => ({ ...s, order: index + 1 }));
        return { ...p, slides: remainingSlides, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    // select another slide if active was deleted
    let newActiveSlideId = get().activeSlideId;
    if (get().activeSlideId === slideId) {
      const activeProj = updatedProjects.find(p => p.id === currentProjectId);
      if (activeProj && activeProj.slides.length > 0) {
        newActiveSlideId = activeProj.slides[0].id;
      }
    }

    set({ projects: updatedProjects, activeSlideId: newActiveSlideId });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  duplicateSlide: (slideId) => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const slideToCopy = project.slides.find(s => s.id === slideId);
    if (!slideToCopy) return;

    get().pushHistoryState();

    const newSlide: Slide = {
      ...slideToCopy,
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      order: slideToCopy.order + 1
    };

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        const index = p.slides.findIndex(s => s.id === slideId);
        const slides = [...p.slides];
        slides.splice(index + 1, 0, newSlide);
        // reorder all
        const reordered = slides.map((s, idx) => ({ ...s, order: idx + 1 }));
        return { ...p, slides: reordered, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    set({ projects: updatedProjects, activeSlideId: newSlide.id });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  reorderSlides: (startIndex, endIndex) => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;

    get().pushHistoryState();

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProjectId) {
        const slides = [...p.slides];
        const [removed] = slides.splice(startIndex, 1);
        slides.splice(endIndex, 0, removed);
        
        const reordered = slides.map((s, idx) => ({ ...s, order: idx + 1 }));
        return { ...p, slides: reordered, updatedAt: "Agora mesmo" };
      }
      return p;
    });

    set({ projects: updatedProjects });
    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
    get().triggerAutosave();
  },

  // Brand Actions
  addBrand: (brand) => {
    set((state) => {
      const updated = [...state.brands, brand];
      localStorage.setItem("carousel_pro_brands", JSON.stringify(updated));
      return { brands: updated };
    });
    get().addNotification("Marca Cadastrada", `A marca '${brand.name}' foi adicionada.`, "success");
  },

  updateBrand: (brandId, updates) => {
    set((state) => {
      const updated = state.brands.map(b => b.id === brandId ? { ...b, ...updates } : b);
      localStorage.setItem("carousel_pro_brands", JSON.stringify(updated));
      return { brands: updated };
    });
    get().addNotification("Marca Atualizada", "As configurações da marca foram salvas.", "success");
  },

  deleteBrand: (brandId) => {
    set((state) => {
      const filtered = state.brands.filter(b => b.id !== brandId);
      localStorage.setItem("carousel_pro_brands", JSON.stringify(filtered));
      return { brands: filtered };
    });
    get().addNotification("Marca Removida", "A marca foi excluída.", "info");
  },

  // Undo/Redo Engine
  pushHistoryState: () => {
    const { currentProjectId, projects } = get();
    if (!currentProjectId) return;
    const project = projects.find(p => p.id === currentProjectId);
    if (!project) return;

    const stateStr = JSON.stringify(project);
    set((state) => ({
      undoStack: [...state.undoStack, stateStr],
      redoStack: [] // clear redo stack on new action
    }));
  },

  undo: () => {
    const { undoStack, currentProjectId, projects } = get();
    if (undoStack.length === 0 || !currentProjectId) return;

    const previousStateStr = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!currentProject) return;

    const redoStateStr = JSON.stringify(currentProject);

    const parsedProject = JSON.parse(previousStateStr);
    const updatedProjects = projects.map(p => p.id === currentProjectId ? parsedProject : p);

    set({
      projects: updatedProjects,
      undoStack: newUndoStack,
      redoStack: [...get().redoStack, redoStateStr],
      activeSlideId: parsedProject.slides[0]?.id || null
    });

    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
  },

  redo: () => {
    const { redoStack, currentProjectId, projects } = get();
    if (redoStack.length === 0 || !currentProjectId) return;

    const nextStateStr = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    const currentProject = projects.find(p => p.id === currentProjectId);
    if (!currentProject) return;

    const undoStateStr = JSON.stringify(currentProject);

    const parsedProject = JSON.parse(nextStateStr);
    const updatedProjects = projects.map(p => p.id === currentProjectId ? parsedProject : p);

    set({
      projects: updatedProjects,
      redoStack: newRedoStack,
      undoStack: [...get().undoStack, undoStateStr],
      activeSlideId: parsedProject.slides[0]?.id || null
    });

    localStorage.setItem("carousel_pro_projects", JSON.stringify(updatedProjects));
  },

  // Simulated Autosave Service
  triggerAutosave: () => {
    set({ autosaveStatus: "saving" });
    setTimeout(() => {
      set({ autosaveStatus: "saved" });
    }, 1500);
  },

  // Notification Actions
  addNotification: (title, message, type) => {
    const notif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: "Agora",
      read: false,
      type
    };
    set((state) => ({ notifications: [notif, ...state.notifications] }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Modal controls
  setPreviewModal: (open) => set({ isPreviewModalOpen: open }),
  setExportModal: (open) => set({ isExportModalOpen: open }),
  setShareModal: (open) => set({ isShareModalOpen: open }),
  setImageSearchModal: (open) => set({ isImageSearchModalOpen: open }),

  // Simulated AI Generation Loop
  generateCarouselWithAI: async (setupData) => {
    set({ isGenerating: true, generationProgress: 5, generationStep: "Analisando tema e público-alvo..." });
    
    const steps = [
      { progress: 15, step: "Definindo a estrutura lógica e número de slides..." },
      { progress: 30, step: "Escrevendo o conteúdo textual dos slides com IA..." },
      { progress: 50, step: "Selecionando templates visuais compatíveis..." },
      { progress: 70, step: "Aplicando paleta de cores e identidade de marca..." },
      { progress: 85, step: "Buscando imagens representativas no banco..." },
      { progress: 95, step: "Finalizando o carrossel e compilando no editor..." },
      { progress: 100, step: "Processamento completo! Redirecionando..." }
    ];

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const item of steps) {
      await sleep(1000);
      set({ generationProgress: item.progress, generationStep: item.step });
    }

    // Now construct the simulated AI generated project
    const projectId = `proj-${Date.now()}`;
    const brand = get().brands.find(b => b.id === setupData.brandId) || get().brands[0];

    // Generate slides based on selected count
    const generatedSlides: Slide[] = [];
    
    // Cover Slide
    generatedSlides.push({
      id: `slide-gen-1`,
      order: 1,
      type: "cover",
      template: "cover-image",
      title: setupData.title || `O Guia Definitivo: ${setupData.theme}`,
      subtitle: brand.name.toUpperCase(),
      body: `Como aplicar as melhores estratégias de ${setupData.theme} focando em ${setupData.audience}.`,
      cta: "Arrastar para o lado ➔",
      image: setupData.imageOption !== "none" ? {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
        positionX: 50,
        positionY: 50,
        zoom: 100,
        brightness: 100,
        contrast: 100,
        overlayOpacity: 45
      } : undefined,
      styles: {
        backgroundColor: brand.backgroundColor,
        textColor: brand.textColor,
        accentColor: brand.primaryColor,
        fontFamily: brand.fontFamily
      }
    });

    // Content Slides
    for (let i = 2; i < setupData.slideCount; i++) {
      generatedSlides.push({
        id: `slide-gen-${i}`,
        order: i,
        type: "content",
        template: i % 2 === 0 ? "content-highlight" : "content-number",
        title: `Pilar ${i - 1}: O Segredo do Sucesso`,
        subtitle: `Dica número ${i - 1}`,
        body: `Descubra como o tom de comunicação ${setupData.tone} ajuda a engajar seu público e alcançar o objetivo de '${setupData.goal}' com eficácia.`,
        highlight: "engajar seu público",
        styles: {
          backgroundColor: i % 2 === 0 ? "#fafafa" : brand.backgroundColor,
          textColor: brand.textColor,
          accentColor: brand.primaryColor,
          fontFamily: brand.fontFamily
        }
      });
    }

    // CTA Slide
    generatedSlides.push({
      id: `slide-gen-${setupData.slideCount}`,
      order: setupData.slideCount,
      type: "cta",
      template: "cta-brand",
      title: "Pronto para Dar o Próximo Passo?",
      subtitle: brand.instagramHandle,
      body: `Gostou deste conteúdo preparado para você? Deixe seu feedback ou faça uma pergunta nos comentários.`,
      cta: setupData.cta || brand.defaultCta,
      styles: {
        backgroundColor: brand.secondaryColor,
        textColor: "#ffffff",
        accentColor: brand.accentColor,
        fontFamily: brand.fontFamily
      }
    });

    const newProject: Project = {
      id: projectId,
      title: setupData.title || `Carrossel AI - ${setupData.theme}`,
      theme: setupData.theme,
      status: "generated",
      width: setupData.format === "story" ? 1080 : 1080,
      height: setupData.format === "story" ? 1920 : setupData.format === "square" ? 1080 : 1350,
      brandId: setupData.brandId,
      slides: generatedSlides,
      caption: `🚀 Novo Carrossel Inteligente criado com o CarouselPro!\n\nTema: ${setupData.theme}\nPúblico-alvo: ${setupData.audience}\n\n👉 Curta, comente e compartilhe se este conteúdo agregou valor para você!\n\n#ia #carrossel #marketingdigital #design`,
      hashtags: ["marketing", "ia", "carouselpro"],
      updatedAt: "Agora mesmo",
      format: setupData.format
    };

    set((state) => {
      const list = [newProject, ...state.projects];
      localStorage.setItem("carousel_pro_projects", JSON.stringify(list));
      return {
        projects: list,
        currentProjectId: projectId,
        activeSlideId: generatedSlides[0].id,
        isGenerating: false,
        currentView: "editor",
        credits: Math.max(0, state.credits - 10) // simulated credit consumption
      };
    });

    get().addNotification("Carrossel Criado", `Seu carrossel de tema '${setupData.theme}' foi gerado pela IA.`, "success");
  }
}));
