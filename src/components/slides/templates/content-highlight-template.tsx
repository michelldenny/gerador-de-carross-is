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

export default function ContentHighlightTemplate({
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

  // Lógica para destacar palavra
  const renderHighlightedBody = () => {
    const text = slide.body || "";
    const highlight = slide.highlight || "";

    if (!highlight || !text.toLowerCase().includes(highlight.toLowerCase())) {
      return text;
    }

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span
              key={idx}
              className="font-bold underline px-1 rounded bg-violet-50 dark:bg-violet-950/40"
              style={{ color: slide.styles.accentColor }}
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
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
            <span className="text-xs font-semibold tracking-wider opacity-65 uppercase">
              {slide.subtitle}
            </span>
          </div>
        )}
      </div>

      {/* Meio: Título e Corpo com Destaque */}
      <div className="z-10 flex-1 flex flex-col justify-center my-6 gap-4">
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
              maxSize={44}
              className="font-extrabold tracking-tight leading-tight"
            />
          </div>
        )}

        {slide.body && (
          <div
            className={`h-[45%] ${borderClass("body")} overflow-hidden`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement?.("body");
            }}
          >
            <div className="w-full h-full flex items-center text-base md:text-lg leading-relaxed font-medium opacity-90">
              <p>{renderHighlightedBody()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer com paginação discreta (ordem) */}
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
