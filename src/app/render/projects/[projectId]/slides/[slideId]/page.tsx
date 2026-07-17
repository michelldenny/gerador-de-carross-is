"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjectsStore, useBrandsStore } from "@/stores";
import { SlideCanvas } from "@/components/slides/slide-canvas";
import { SlideRenderer } from "@/components/slides/slide-renderer";
import { CAROUSEL_FORMATS } from "@/constants/formats";

export default function RenderSlidePage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const slideId = params?.slideId as string;

  const { projects, hasHydrated: projectsHydrated } = useProjectsStore();
  const { brands, hasHydrated: brandsHydrated } = useBrandsStore();

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 1. Aguardar carregamento de fontes
  useEffect(() => {
    if (typeof window !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => setFontsLoaded(true));
    } else {
      setFontsLoaded(true);
    }
  }, []);

  const project = projects.find((p) => p.id === projectId);
  const slide = project?.slides.find((s) => s.id === slideId);
  const brand = project ? brands.find((b) => b.id === project.brandId) || brands[0] : undefined;

  const storesHydrated = projectsHydrated && brandsHydrated;

  // 2. Aguardar carregamento de imagens no DOM
  useEffect(() => {
    if (!storesHydrated || !project || !slide) return;

    // Timeout de segurança: libera a renderização após 3.5 segundos em caso de travamentos de rede
    const safetyTimeout = setTimeout(() => {
      setImagesLoaded(true);
    }, 3500);

    const checkImages = () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      if (imgs.length === 0) {
        setImagesLoaded(true);
        clearTimeout(safetyTimeout);
        return;
      }

      const promises = imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      });

      Promise.all(promises).then(() => {
        setImagesLoaded(true);
        clearTimeout(safetyTimeout);
      });
    };

    const tick = setTimeout(checkImages, 150);

    return () => {
      clearTimeout(safetyTimeout);
      clearTimeout(tick);
    };
  }, [storesHydrated, project, slide]);

  const isReady = storesHydrated && !!project && !!slide && fontsLoaded && imagesLoaded;

  if (!isReady || !project || !slide) {
    return null; // Retorna nulo no placeholder inicial para evitar frames brancos na gravação
  }

  const formatConfig = CAROUSEL_FORMATS[project.format];

  return (
    <div
      style={{
        width: formatConfig.width,
        height: formatConfig.height,
        overflow: "hidden",
        position: "relative",
      }}
      data-render-ready="true"
    >
      <SlideCanvas
        width={formatConfig.width}
        height={formatConfig.height}
        scale={1.0} // Escala física real de renderização 1:1
        mode="render"
      >
        <SlideRenderer slide={slide} brand={brand} mode="render" />
      </SlideCanvas>
    </div>
  );
}
