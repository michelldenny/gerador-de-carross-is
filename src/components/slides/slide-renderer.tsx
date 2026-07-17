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
      return <UnsupportedTemplate templateId={slide.template} />;
  }
}

function UnsupportedTemplate({ templateId }: { templateId: string }) {
  return (
    <div className="w-full h-full bg-rose-50 border-4 border-dashed border-rose-400 p-8 flex flex-col items-center justify-center text-center gap-2">
      <div className="bg-rose-500 text-white rounded-full p-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h3 className="font-bold text-rose-800 text-sm">Layout Não Suportado</h3>
      <p className="text-xs text-rose-600 max-w-[240px]">
        O template <code className="bg-rose-100 px-1 py-0.5 rounded font-mono font-bold">{templateId}</code> não foi encontrado ou não está mapeado.
      </p>
    </div>
  );
}
