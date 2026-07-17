"use client";

import React from "react";
import { useProjectsStore, useEditorStore, useBrandsStore } from "@/stores";
import { SlideCanvas } from "../slides/slide-canvas";
import { SlideRenderer } from "../slides/slide-renderer";
import { SelectedElementId } from "@/types";
import { CAROUSEL_FORMATS } from "@/constants/formats";

interface CanvasWorkspaceProps {
  projectId: string;
}

export function CanvasWorkspace({ projectId }: CanvasWorkspaceProps) {
  const { projects } = useProjectsStore();
  const { activeSlideId, zoom, selectedElementId, setSelectedElementId, setActiveTab } = useEditorStore();
  const { brands } = useBrandsStore();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) {
    return (
      <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 text-slate-400 font-bold text-xs uppercase">
        Nenhum slide disponível. Adicione um slide para começar.
      </div>
    );
  }

  const brand = brands.find((b) => b.id === project.brandId) || brands[0];
  const scale = (zoom / 100) * (420 / 1080); // Ajustar escala para caber na tela mantendo zoom proporcional

  const handleSelectElement = (elementId: SelectedElementId) => {
    setSelectedElementId(elementId);
    if (elementId === "title" || elementId === "subtitle" || elementId === "body" || elementId === "cta") {
      setActiveTab("content");
    } else if (elementId === "image") {
      setActiveTab("image");
    } else if (elementId === "background" || elementId === "logo") {
      setActiveTab("design");
    }
  };

  return (
    <main className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-auto custom-scrollbar relative">
      <div className="transition-all duration-300 ease-out transform">
        <SlideCanvas
          width={CAROUSEL_FORMATS[project.format].width}
          height={CAROUSEL_FORMATS[project.format].height}
          scale={scale}
          mode="editor"
          showSafeArea={true}
        >
          <SlideRenderer
            slide={activeSlide}
            brand={brand}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            mode="editor"
          />
        </SlideCanvas>
      </div>
    </main>
  );
}
