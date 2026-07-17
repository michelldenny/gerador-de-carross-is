"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjectsStore, useBrandsStore } from "@/stores";
import { SlideCanvas } from "@/components/slides/slide-canvas";
import { SlideRenderer } from "@/components/slides/slide-renderer";

export default function RenderSlidePage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const slideId = params?.slideId as string;

  const { projects } = useProjectsStore();
  const { brands } = useBrandsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const slide = project.slides.find((s) => s.id === slideId);
  if (!slide) return null;

  const brand = brands.find((b) => b.id === project.brandId) || brands[0];

  if (!mounted) return null;

  return (
    <div
      className="w-fit h-fit overflow-hidden bg-slate-900 flex items-center justify-center min-h-screen"
      data-render-ready="true"
    >
      <SlideCanvas
        width={1080}
        height={project.format === "story" ? 1920 : project.format === "square" ? 1080 : 1350}
        scale={1.0} // Escala física real de renderização 1:1
        mode="render"
      >
        <SlideRenderer slide={slide} brand={brand} mode="render" />
      </SlideCanvas>
    </div>
  );
}
