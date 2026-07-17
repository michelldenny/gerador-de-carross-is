"use client";

import React from "react";
import { useProjectsStore, useEditorStore, useUiStore, useBrandsStore } from "@/stores";
import { RefreshCw, Palette } from "lucide-react";

interface DesignPropertiesProps {
  projectId: string;
}

export function DesignProperties({ projectId }: DesignPropertiesProps) {
  const { projects, updateSlide, updateProject } = useProjectsStore();
  const { activeSlideId, pushHistory } = useEditorStore();
  const { addNotification } = useUiStore();
  const { brands } = useBrandsStore();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) return null;

  const brand = brands.find((b) => b.id === project.brandId) || brands[0];

  const handleColorChange = (key: string, value: string) => {
    pushHistory(JSON.stringify(project));
    updateSlide(projectId, activeSlide.id, {
      styles: {
        ...activeSlide.styles,
        [key]: value,
      },
    });
  };

  const handleFontChange = (font: string) => {
    pushHistory(JSON.stringify(project));
    updateSlide(projectId, activeSlide.id, {
      styles: {
        ...activeSlide.styles,
        fontFamily: font,
      },
    });
  };

  const applyToAllSlides = () => {
    if (confirm("Deseja aplicar as cores e fontes deste slide em todos os slides do carrossel?")) {
      pushHistory(JSON.stringify(project));
      const updatedSlides = project.slides.map((s) => ({
        ...s,
        styles: {
          ...s.styles,
          backgroundColor: activeSlide.styles.backgroundColor,
          textColor: activeSlide.styles.textColor,
          accentColor: activeSlide.styles.accentColor,
          fontFamily: activeSlide.styles.fontFamily,
        },
      }));
      updateProject(projectId, { slides: updatedSlides });
      addNotification("Visual Aplicado", "Estilo unificado em todo o projeto.", "success");
    }
  };

  const resetToBrandDefault = () => {
    if (brand) {
      pushHistory(JSON.stringify(project));
      updateSlide(projectId, activeSlide.id, {
        styles: {
          backgroundColor: brand.backgroundColor || "#ffffff",
          textColor: brand.textColor || "#1e293b",
          accentColor: brand.primaryColor || "#7c3aed",
          fontFamily: brand.fontFamily || "Inter",
        },
      });
      addNotification("Restaurado", "Cores restauradas para o padrão da marca.", "info");
    }
  };

  const fonts = [
    "Inter",
    "Plus Jakarta Sans",
    "Manrope",
    "Poppins",
    "Montserrat",
    "DM Sans",
    "Lato",
    "Space Grotesk",
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Identidade Visual</h3>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Paleta do Slide</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500">Cor do Fundo</span>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={activeSlide.styles.backgroundColor}
                onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-500 uppercase">{activeSlide.styles.backgroundColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500">Cor do Texto</span>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={activeSlide.styles.textColor}
                onChange={(e) => handleColorChange("textColor", e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-500 uppercase">{activeSlide.styles.textColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500">Destaque (CTA/Accent)</span>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={activeSlide.styles.accentColor}
                onChange={(e) => handleColorChange("accentColor", e.target.value)}
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-500 uppercase">{activeSlide.styles.accentColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Font Family selection */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tipografia do Texto</h4>
        <select
          value={activeSlide.styles.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer font-sans"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Global application Actions */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100">
        <button
          onClick={applyToAllSlides}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98"
        >
          <Palette size={14} /> Aplicar a todos os slides
        </button>

        <button
          onClick={resetToBrandDefault}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 active:scale-98"
        >
          <RefreshCw size={14} /> Resetar para padrão da marca
        </button>
      </div>
    </div>
  );
}
