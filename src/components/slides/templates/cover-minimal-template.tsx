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

export default function CoverMinimalTemplate({
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
      {/* Header com Logotipo */}
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
            <span
              className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded"
              style={{ color: slide.styles.accentColor }}
            >
              {slide.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Meio: Título Gigante e Corpo */}
      <div className="z-10 flex-1 flex flex-col justify-center my-8 gap-6">
        {slide.title && (
          <div
            className={`h-[45%] ${borderClass("title")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <AutoFitText
              text={slide.title}
              minSize={26}
              maxSize={56}
              className="font-black tracking-tight leading-none"
              style={{ color: slide.styles.textColor }}
            />
          </div>
        )}

        {/* Linha decorativa minimalista */}
        <div
          className="w-16 h-1.5 rounded-full"
          style={{ backgroundColor: slide.styles.accentColor }}
        />

        {slide.body && (
          <div
            className={`h-[25%] ${borderClass("body")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <AutoFitText
              text={slide.body}
              minSize={14}
              maxSize={20}
              className="opacity-80 leading-relaxed font-normal"
            />
          </div>
        )}
      </div>

      {/* Footer com CTA de seta */}
      {slide.cta && (
        <div className="z-10 flex justify-between items-center w-full border-t border-slate-100 dark:border-slate-800 pt-4">
          <div
            className={`${borderClass("cta")} w-full`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("cta");
            }}
          >
            <div className="flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase">
              <span style={{ color: slide.styles.accentColor }}>{slide.cta}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
