import React from "react";
import { Slide, Brand, SelectedElementId } from "@/types";
import { AutoFitText } from "../auto-fit-text";
import { SlideLogo } from "../slide-logo";
import { SlideImage } from "../slide-image";

interface TemplateProps {
  slide: Slide;
  brand?: Brand;
  selectedElementId?: SelectedElementId;
  onSelectElement?: (elementId: SelectedElementId) => void;
  mode?: "editor" | "preview" | "thumbnail" | "render";
}

export default function CoverImageTemplate({
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
      {/* Imagem de Fundo Completa */}
      {slide.image && (
        <SlideImage
          image={slide.image}
          selected={isEditor && selectedElementId === "image"}
          onClick={() => onSelectElement?.("image")}
        />
      )}

      {/* Header com Logotipo da Marca */}
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
              className="text-xs uppercase tracking-widest font-semibold px-2 py-1 rounded bg-black/10 backdrop-blur-sm text-white"
              style={{ color: slide.styles.accentColor }}
            >
              {slide.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Título Principal e Corpo */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 gap-4">
        {slide.title && (
          <div
            className={`h-[40%] ${borderClass("title")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <AutoFitText showOverflowIndicator={isEditor}
              text={slide.title}
              minSize={24}
              maxSize={52}
              className="font-extrabold tracking-tight leading-tight text-white drop-shadow-md"
            />
          </div>
        )}

        {slide.body && (
          <div
            className={`h-[25%] ${borderClass("body")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <AutoFitText showOverflowIndicator={isEditor}
              text={slide.body}
              minSize={14}
              maxSize={20}
              className="text-white/90 leading-relaxed font-medium drop-shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Footer com CTA */}
      {slide.cta && (
        <div className="z-10 flex justify-center w-full">
          <div
            className={`${borderClass("cta")} w-full max-w-[80%]`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("cta");
            }}
          >
            <div
              className="py-3 px-6 rounded-full text-center text-sm font-bold text-white shadow-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: slide.styles.accentColor }}
            >
              {slide.cta}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
