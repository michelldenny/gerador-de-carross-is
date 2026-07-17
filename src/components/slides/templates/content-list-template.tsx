import React from "react";
import { Slide, Brand, SelectedElementId } from "@/types";
import { AutoFitText } from "../auto-fit-text";
import { SlideLogo } from "../slide-logo";
import { Check } from "lucide-react";

interface TemplateProps {
  slide: Slide;
  brand?: Brand;
  selectedElementId?: SelectedElementId;
  onSelectElement?: (elementId: SelectedElementId) => void;
  mode?: "editor" | "preview" | "thumbnail" | "render";
}

export default function ContentListTemplate({
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

  const items = slide.listItems || [
    "Item de demonstração 1",
    "Item de demonstração 2",
    "Item de demonstração 3",
  ];

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

      {/* Meio: Título + Checklist de Itens */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 gap-4">
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
              minSize={18}
              maxSize={32}
              className="font-extrabold tracking-tight leading-tight"
            />
          </div>
        )}

        {/* Lista */}
        <div className="flex-1 flex flex-col justify-center gap-3 overflow-hidden">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-2.5 rounded bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.03] dark:border-white/[0.03] ${borderClass(
                "body"
              )}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectElement?.("body");
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: slide.styles.accentColor }}
              >
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-sm font-semibold opacity-90 leading-snug">
                {item}
              </span>
            </div>
          ))}
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
