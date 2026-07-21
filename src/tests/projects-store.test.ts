import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProjectsStore } from "../stores/use-projects-store";
import { Project } from "@/types";
import { projectsService } from "@/services/projects";

vi.mock("@/services/projects", () => ({
  projectsService: {
    createProject: vi.fn(),
    deleteProject: vi.fn(),
    reorderSlides: vi.fn(),
  },
}));

describe("Testes da Store de Projetos (useProjectsStore)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Resetar estado da store de projetos
    useProjectsStore.setState({
      projects: [],
      hasHydrated: true,
    });
  });

  const mockProject: Project = {
    id: "proj-1",
    title: "Projeto de Teste",
    theme: "Marketing Digital",
    format: "square",
    brandId: "brand-1",
    width: 1080,
    height: 1080,
    caption: "",
    hashtags: [],
    updatedAt: "Hoje",
    status: "draft",
    slides: [
      {
        id: "slide-1",
        order: 1,
        type: "content",
        template: "cover-minimal",
        title: "Slide 1",
        styles: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          accentColor: "#ff0000",
          fontFamily: "Inter",
        },
      },
      {
        id: "slide-2",
        order: 2,
        type: "content",
        template: "content-list",
        title: "Slide 2",
        styles: {
          backgroundColor: "#ffffff",
          textColor: "#000000",
          accentColor: "#ff0000",
          fontFamily: "Inter",
        },
      },
    ],
  };

  it("deve adicionar e deletar projetos com sucesso", async () => {
    const store = useProjectsStore.getState();
    vi.mocked(projectsService.createProject).mockResolvedValue(mockProject);
    vi.mocked(projectsService.deleteProject).mockResolvedValue();
    
    // Adicionar projeto
    await store.addProject(mockProject);
    expect(useProjectsStore.getState().projects).toHaveLength(1);
    expect(useProjectsStore.getState().projects[0].id).toBe("proj-1");

    // Deletar projeto
    await useProjectsStore.getState().deleteProject("proj-1");
    expect(useProjectsStore.getState().projects).toHaveLength(0);
  });

  it("deve reordenar slides de um projeto com sucesso", async () => {
    const store = useProjectsStore.getState();
    vi.mocked(projectsService.createProject).mockResolvedValue(mockProject);
    vi.mocked(projectsService.reorderSlides).mockResolvedValue();
    await store.addProject(mockProject);

    const reversedSlides = [...mockProject.slides].reverse();
    
    await useProjectsStore.getState().reorderSlides("proj-1", reversedSlides);
    
    const updatedProject = useProjectsStore.getState().projects.find(p => p.id === "proj-1");
    expect(updatedProject).toBeTruthy();
    expect(updatedProject?.slides[0].id).toBe("slide-2");
    expect(updatedProject?.slides[0].order).toBe(1); // deve ter atualizado a ordem física
  });

  it("deve duplicar um projeto alterando seu id", async () => {
    const store = useProjectsStore.getState();
    const duplicate = { ...mockProject, id: "proj-2", title: "Projeto de Teste (Copia)" };
    vi.mocked(projectsService.createProject)
      .mockResolvedValueOnce(mockProject)
      .mockResolvedValueOnce(duplicate);
    await store.addProject(mockProject);

    const newId = await useProjectsStore.getState().duplicateProject("proj-1");
    expect(newId).toBeTruthy();
    expect(newId).not.toBe("proj-1");

    expect(useProjectsStore.getState().projects).toHaveLength(2);
  });
});
