import React from "react";
import { Slide, Brand, SelectedElementId } from "@/types";
import CoverImageTemplate from "./templates/cover-image-template";
import CoverMinimalTemplate from "./templates/cover-minimal-template";
import ContentHighlightTemplate from "./templates/content-highlight-template";
import ContentNumberTemplate from "./templates/content-number-template";
import ContentListTemplate from "./templates/content-list-template";
import ContentLeftImageTemplate from "./templates/content-left-image-template";
import ContentRightImageTemplate from "./templates/content-right-image-template";
import ContentQuoteTemplate from "./templates/content-quote-template";
import ComparisonTemplate from "./templates/comparison-template";
import CtaBrandTemplate from "./templates/cta-brand-template";

interface SlideRendererProps {
  slide: Slide;
  brand?: Brand;
  selectedElementId?: SelectedElementId;
  onSelectElement?: (elementId: SelectedElementId) => void;
  mode?: "editor" | "preview" | "thumbnail" | "render";
}

export function SlideRenderer({
  slide,
  brand,
  selectedElementId = null,
  onSelectElement,
  mode = "preview",
}: SlideRendererProps) {
  // Chavear os templates com base no slide.template
  switch (slide.template) {
    case "cover-image":
      return (
        <CoverImageTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "cover-minimal":
      return (
        <CoverMinimalTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-highlight":
      return (
        <ContentHighlightTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-number":
      return (
        <ContentNumberTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-list":
      return (
        <ContentListTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-left-image":
      return (
        <ContentLeftImageTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-right-image":
      return (
        <ContentRightImageTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "content-quote":
      return (
        <ContentQuoteTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "comparison":
      return (
        <ComparisonTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    case "cta-brand":
      return (
        <CtaBrandTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
    default:
      // Fallback
      return (
        <ContentHighlightTemplate
          slide={slide}
          brand={brand}
          selectedElementId={selectedElementId}
          onSelectElement={onSelectElement}
          mode={mode}
        />
      );
  }
}
