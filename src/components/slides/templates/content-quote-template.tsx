import React from "react";
import { Slide, Brand, SelectedElementId } from "@/types";
import { AutoFitText } from "../auto-fit-text";
import { SlideLogo } from "../slide-logo";

interface TemplateProps {
  slide: Slide;
  brand?: Brand;
  selectedElementId?: SelectedElementId;
  onSelectElement?: (elementId: SelectedElementId) => void;
  mode?: "editor" | "preview" | "thumbnail" | "render";
}

export default function ContentQuoteTemplate({
  slide,
  brand,
  selectedElementId = null,
  onSelectElement,
  mode = "preview",
}: TemplateProps) {
  const isEditor = mode === "editor";
  const bgStyle = {
    backgroundColor: slide.styles.backgroundColor || "#ffffff",
    color: slide.styles.textColor || "#1e293b",
    fontFamily: slide.styles.fontFamily || "Inter",
  };

  const borderClass = (elementId: SelectedElementId) => {
    if (!isEditor || !onSelectElement) return "";
    return `relative group cursor-pointer transition-all duration-150 rounded ${
      selectedElementId === elementId
        ? "ring-2 ring-violet-500 ring-offset-2"
        : "hover:ring-1 hover:ring-slate-300"
    }`;
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-[72px]"
      style={bgStyle}
      onClick={() => isEditor && onSelectElement?.("background")}
    >
      {/* Header */}
      <div className="z-10 flex justify-between items-center w-full">
        <SlideLogo
          brand={brand}
          selected={isEditor && selectedElementId === "logo"}
          onClick={() => onSelectElement?.("logo")}
        />
        {slide.subtitle && (
          <div
            className={borderClass("subtitle")}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("subtitle");
            }}
          >
            <span className="text-xs font-semibold tracking-wider opacity-65 uppercase">
              {slide.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Meio: Citação com aspas gigantes decorativas de fundo */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 relative gap-4 px-6 text-center">
        {/* Aspas gigantes */}
        <div
          className="absolute top-0 left-0 text-[160px] font-serif opacity-10 select-none pointer-events-none leading-none -translate-y-8 -translate-x-4"
          style={{ color: slide.styles.accentColor }}
        >
          “
        </div>

        {slide.body && (
          <div
            className={`h-[55%] ${borderClass("body")} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <AutoFitText showOverflowIndicator={isEditor}
              text={slide.body}
              minSize={16}
              maxSize={26}
              className="italic font-semibold leading-relaxed"
            />
          </div>
        )}

        {/* Linha divisora */}
        <div
          className="w-12 h-1 rounded-full mx-auto my-1"
          style={{ backgroundColor: slide.styles.accentColor }}
        />

        {/* Autor da citação */}
        {slide.highlight && (
          <div
            className={`${borderClass("title")} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <span className="text-xs font-black uppercase tracking-wider block">
              — {slide.highlight}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="z-10 flex justify-between items-center w-full pt-2">
        <span className="text-xs opacity-40 font-bold">
          Slide {slide.order}
        </span>
        {slide.cta && (
          <div
            className={borderClass("cta")}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("cta");
            }}
          >
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: slide.styles.accentColor }}
            >
              {slide.cta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
