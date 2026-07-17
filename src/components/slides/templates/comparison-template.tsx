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

export default function ComparisonTemplate({
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

  // Comparação de duas caixas baseada em listItems ou body dividido
  const items = slide.listItems || [
    "VILÃO: Descrição do item negativo que deve ser evitado pelo público.",
    "HERÓI: Descrição do item positivo recomendado que resolve o problema.",
  ];

  const leftItem = items[0] || "";
  const rightItem = items[1] || "";

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

      {/* Meio: Título + 2 Caixas de Comparação */}
      <div className="z-10 flex-1 flex flex-col justify-center my-4 gap-4">
        {slide.title && (
          <div
            className={`h-[25%] ${borderClass("title")}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("title");
            }}
          >
            <AutoFitText
              text={slide.title}
              minSize={16}
              maxSize={28}
              className="font-extrabold tracking-tight leading-tight text-center"
            />
          </div>
        )}

        <div className="flex-1 flex gap-4 overflow-hidden py-1">
          {/* Caixa de Erro / Evitar */}
          <div
            className={`w-1/2 rounded-2xl p-5 border border-red-500/10 bg-red-500/[0.02] flex flex-col justify-center gap-2 ${borderClass(
              "body"
            )}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Evite
            </span>
            <div className="flex-1 h-full">
              <AutoFitText
                text={leftItem}
                minSize={11}
                maxSize={15}
                className="opacity-90 leading-relaxed font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Caixa de Sucesso / Fazer */}
          <div
            className={`w-1/2 rounded-2xl p-5 border border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col justify-center gap-2 ${borderClass(
              "body"
            )}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
              Faça
            </span>
            <div className="flex-1 h-full">
              <AutoFitText
                text={rightItem}
                minSize={11}
                maxSize={15}
                className="opacity-90 leading-relaxed font-semibold text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
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
