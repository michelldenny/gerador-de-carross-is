import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectPreviewPage from "@/app/(app)/projects/[projectId]/preview/page";
import { useBrandsStore, useProjectsStore } from "@/stores";

vi.mock("next/navigation", () => ({
  useParams: () => ({ projectId: "persisted-project" }),
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/slides/slide-canvas", () => ({
  SlideCanvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/slides/slide-renderer", () => ({
  SlideRenderer: () => <div>Slide renderizado</div>,
}));

vi.mock("@/components/editor/editor-modals", () => ({
  EditorModals: () => null,
}));

describe("Preview durante a hidratação das stores", () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: [], hasHydrated: false });
    useBrandsStore.setState({ brands: [], hasHydrated: false });
  });

  it("exibe carregamento em vez de informar que o projeto não existe", () => {
    render(<ProjectPreviewPage />);

    expect(screen.getByRole("status").textContent).toContain("Carregando preview");
    expect(screen.queryByText("Projeto não encontrado.")).toBeNull();
  });

  it("informa projeto inexistente somente após as stores hidratarem", () => {
    useProjectsStore.setState({ hasHydrated: true });
    useBrandsStore.setState({ hasHydrated: true });

    render(<ProjectPreviewPage />);

    expect(screen.getByText("Projeto não encontrado.")).toBeTruthy();
  });
});
