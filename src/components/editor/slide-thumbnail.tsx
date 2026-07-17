"use client";

import React from "react";
import { Slide, Brand } from "@/types";
import { SlideCanvas } from "../slides/slide-canvas";
import { SlideRenderer } from "../slides/slide-renderer";

interface SlideThumbnailProps {
  slide: Slide;
  brand?: Brand;
  format: "vertical" | "square" | "story";
}

export function SlideThumbnail({ slide, brand, format }: SlideThumbnailProps) {
  // Configuração real de largura e altura
  const width = 1080;
  const height = format === "story" ? 1920 : format === "square" ? 1080 : 1350;

  // Escala para ajustar na barra lateral (largura de ~140px)
  const thumbnailScale = 140 / width;

  return (
    <SlideCanvas
      width={width}
      height={height}
      scale={thumbnailScale}
      mode="thumbnail"
    >
      <SlideRenderer slide={slide} brand={brand} mode="thumbnail" />
    </SlideCanvas>
  );
}
