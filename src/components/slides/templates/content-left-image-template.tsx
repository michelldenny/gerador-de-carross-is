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

export default function ContentLeftImageTemplate({
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

      {/* Meio: Duas Colunas - Coluna Esquerda: Imagem, Coluna Direita: Texto */}
      <div className="z-10 flex-1 flex gap-6 items-center my-6 overflow-hidden">
        {/* Coluna Imagem */}
        <div className="w-1/2 h-full relative rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-md">
          {slide.image ? (
            <SlideImage
              image={slide.image}
              selected={isEditor && selectedElementId === "image"}
              onClick={() => onSelectElement?.("image")}
            />
          ) : (
            <div 
              className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold opacity-50 cursor-pointer"
              onClick={() => onSelectElement?.("image")}
            >
              Sem Imagem
            </div>
          )}
        </div>

        {/* Coluna Texto */}
        <div className="w-1/2 h-full flex flex-col justify-center gap-4">
          {slide.title && (
            <div
              className={`h-[40%] ${borderClass("title")}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement?.("title");
              }}
            >
              <AutoFitText
                text={slide.title}
                minSize={18}
                maxSize={30}
                className="font-extrabold tracking-tight leading-tight"
              />
            </div>
          )}

          {slide.body && (
            <div
              className={`h-[50%] ${borderClass("body")}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement?.("body");
              }}
            >
              <AutoFitText
                text={slide.body}
                minSize={12}
                maxSize={16}
                className="opacity-90 leading-relaxed font-semibold"
              />
            </div>
          )}
        </div>
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
