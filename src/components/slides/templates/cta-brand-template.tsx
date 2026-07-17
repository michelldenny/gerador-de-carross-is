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

export default function CtaBrandTemplate({
  slide,
  brand,
  selectedElementId = null,
  onSelectElement,
  mode = "preview",
}: TemplateProps) {
  const isEditor = mode === "editor";
  const bgStyle = {
    backgroundColor: slide.styles.backgroundColor || "#1e293b",
    color: slide.styles.textColor || "#ffffff",
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
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-[72px] items-center text-center"
      style={bgStyle}
      onClick={() => isEditor && onSelectElement?.("background")}
    >
      {/* Topo: Logo e Handle Centralizados */}
      <div className="z-10 flex flex-col items-center gap-1.5 pt-4">
        <SlideLogo
          brand={brand}
          selected={isEditor && selectedElementId === "logo"}
          onClick={() => onSelectElement?.("logo")}
          className="flex-col scale-110"
        />
      </div>

      {/* Meio: Título Forte, Corpo/Explicação */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 gap-5 max-w-[85%]">
        {slide.title && (
          <div
            className={`h-[35%] ${borderClass("title")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <AutoFitText
              text={slide.title}
              minSize={22}
              maxSize={42}
              className="font-black tracking-tight leading-tight"
            />
          </div>
        )}

        {slide.body && (
          <div
            className={`h-[40%] ${borderClass("body")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <AutoFitText
              text={slide.body}
              minSize={13}
              maxSize={18}
              className="opacity-85 leading-relaxed font-semibold"
            />
          </div>
        )}
      </div>

      {/* Botão de Chamada para Ação */}
      {slide.cta && (
        <div className="z-10 w-full flex justify-center pb-4">
          <div
            className={`${borderClass("cta")} w-full max-w-[85%]`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("cta");
            }}
          >
            <button
              className="py-4 px-8 w-full rounded-2xl font-black text-base shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              style={{
                backgroundColor: slide.styles.accentColor || "#10b981",
                color: "#ffffff",
              }}
            >
              {slide.cta}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
