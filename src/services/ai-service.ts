import type { GenerateCarouselInput, GenerateCarouselResult, Project } from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";
import { projectsService } from "@/services/projects";
import { useProjectsStore } from "@/stores/use-projects-store";

export async function generateCarouselWithAI(
  input: GenerateCarouselInput
): Promise<GenerateCarouselResult> {
  const response = await fetch("/api/ai/carousels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as Partial<GenerateCarouselResult> & {
    error?: string;
  };

  if (!response.ok || !payload.carousel) {
    throw new Error(payload.error ?? "Falha ao gerar carrossel");
  }

  const carousel = aiCarouselResponseSchema.parse(payload.carousel);

  let projectId: string | undefined = payload.projectId;

  if (!projectId) {
    const formattedSlides = carousel.slides.map((s) => ({
      id: `slide-${s.order}`,
      order: s.order,
      type: s.type,
      template: s.template,
      title: s.title,
      subtitle: s.subtitle,
      body: s.body,
      highlight: s.highlight,
      cta: s.cta,
      image: s.image
        ? {
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80",
            alt: s.image.searchTermPt || s.title || "Imagem do carrossel",
            positionX: 50,
            positionY: 50,
            zoom: 100,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            overlayOpacity: s.image.overlay === "dark" ? 50 : 0,
          }
        : undefined,
      styles: {
        backgroundColor: input.backgroundColor || "#ffffff",
        textColor: input.primaryColor || "#000000",
        accentColor: input.accentColor || "#ff0000",
        fontFamily: input.fontFamily || "Inter",
      },
    }));

    const genMetadata = {
      trace: payload.trace!,
      validation: payload.validation!,
      review: payload.review!,
      corrections: payload.corrections ?? [],
      approval: payload.approval!,
      generatedAt: new Date().toISOString(),
    };

    try {
      const newProject = await projectsService.createProject({
        title: carousel.projectTitle || input.title,
        theme: input.theme,
        status: "generated",
        creationMode: input.editorialMode,
        format: input.format,
        width: input.format === "vertical" ? 1080 : 1080,
        height: input.format === "vertical" ? 1350 : 1080,
        brandId: input.brandId,
        caption: carousel.caption?.text || "",
        hashtags: carousel.caption?.hashtags || [],
        slides: formattedSlides,
        generationMetadata: genMetadata,
      });
      projectId = newProject.id;
    } catch (err) {
      console.warn("[ai-service] Não foi possível persistir no Supabase, adicionando na store local:", err);
      const localId = `proj-${Date.now()}`;
      const localProject: Project = {
        id: localId,
        title: carousel.projectTitle || input.title,
        theme: input.theme,
        status: "generated",
        creationMode: input.editorialMode,
        format: input.format,
        width: input.format === "vertical" ? 1080 : 1080,
        height: input.format === "vertical" ? 1350 : 1080,
        brandId: input.brandId,
        caption: carousel.caption?.text || "",
        hashtags: carousel.caption?.hashtags || [],
        updatedAt: new Date().toISOString(),
        slides: formattedSlides,
        generationMetadata: genMetadata,
      };

      useProjectsStore.setState((state) => ({
        projects: [localProject, ...state.projects],
      }));
      projectId = localId;
    }
  }

  return {
    projectId,
    carousel,
    validation: payload.validation!,
    review: payload.review!,
    corrections: payload.corrections ?? [],
    approval: payload.approval!,
    trace: payload.trace!,
  };
}
