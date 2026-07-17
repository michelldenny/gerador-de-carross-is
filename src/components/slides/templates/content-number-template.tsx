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

export default function ContentNumberTemplate({
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

  // Obter o número gigante
  const numberText = slide.highlight || String(slide.order).padStart(2, "0");

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

      {/* Meio: Número gigante flutuando na lateral direita, Título e Corpo */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 relative gap-4">
        {/* Número Gigante decorativo */}
        <div
          className="absolute -right-8 bottom-4 text-[180px] font-black opacity-10 select-none pointer-events-none leading-none"
          style={{ color: slide.styles.accentColor }}
        >
          {numberText}
        </div>

        {/* Título de Tópico */}
        {slide.title && (
          <div
            className={`h-[35%] ${borderClass("title")} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <div className="flex gap-4 items-start">
              <span
                className="text-3xl font-black"
                style={{ color: slide.styles.accentColor }}
              >
                {numberText}.
              </span>
              <div className="flex-1 h-full">
                <AutoFitText showOverflowIndicator={isEditor}
                  text={slide.title}
                  minSize={20}
                  maxSize={38}
                  className="font-extrabold tracking-tight leading-tight"
                />
              </div>
            </div>
          </div>
        )}

        {/* Corpo explicativo */}
        {slide.body && (
          <div
            className={`h-[40%] ${borderClass("body")} z-10`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <AutoFitText showOverflowIndicator={isEditor}
              text={slide.body}
              minSize={13}
              maxSize={18}
              className="opacity-95 leading-relaxed font-medium"
            />
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
