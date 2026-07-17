"use client";

import React from "react";
import { Slide, Brand } from "@/types";
import { SlideCanvas } from "../slides/slide-canvas";
import { SlideRenderer } from "../slides/slide-renderer";
import { CAROUSEL_FORMATS } from "@/constants/formats";

interface SlideThumbnailProps {
  slide: Slide;
  brand?: Brand;
  format: keyof typeof CAROUSEL_FORMATS;
}

export function SlideThumbnail({ slide, brand, format }: SlideThumbnailProps) {
  const formatConfig = CAROUSEL_FORMATS[format];
  const width = formatConfig.width;
  const height = formatConfig.height;

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
