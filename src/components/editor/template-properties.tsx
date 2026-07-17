"use client";

import React from "react";
import { useProjectsStore, useEditorStore, useUiStore, useBrandsStore } from "@/stores";
import { MOCK_TEMPLATES } from "@/mocks";
import { SlideTemplateId } from "@/types";
import { SlideCanvas } from "../slides/slide-canvas";
import { SlideRenderer } from "../slides/slide-renderer";
import { CAROUSEL_FORMATS } from "@/constants/formats";

interface TemplatePropertiesProps {
  projectId: string;
}

export function TemplateProperties({ projectId }: TemplatePropertiesProps) {
  const { projects, updateSlide } = useProjectsStore();
  const { activeSlideId, pushHistory } = useEditorStore();
  const { addNotification } = useUiStore();
  const { brands } = useBrandsStore();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) return null;

  const handleTemplateChange = (templateId: SlideTemplateId) => {
    pushHistory(JSON.stringify(project));
    updateSlide(projectId, activeSlide.id, { template: templateId });
    addNotification("Template alterado", "O layout do slide foi reestruturado.", "success");
  };

  const formatConfig = CAROUSEL_FORMATS[project.format];
  const activeBrand = brands.find((b) => b.id === project.brandId) || brands[0];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Layouts Disponíveis</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOCK_TEMPLATES.map((t) => {
          const isSelected = activeSlide.template === t.id;
          const simSlide = {
            ...activeSlide,
            template: t.id as SlideTemplateId,
          };

          return (
            <div
              key={t.id}
              onClick={() => handleTemplateChange(t.id as SlideTemplateId)}
              className={`rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-between p-2.5 gap-2.5 relative overflow-hidden ${
                isSelected
                  ? "border-violet-500 bg-violet-50/20 ring-2 ring-violet-500/20 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              {/* Preview real em miniatura */}
              <div className="w-full aspect-[4/5] bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 scale-95 relative shrink-0">
                <div className="scale-[0.14] origin-center flex items-center justify-center shrink-0">
                  <SlideCanvas
                    width={formatConfig.width}
                    height={formatConfig.height}
                    scale={1.0}
                    mode="thumbnail"
                  >
                    <SlideRenderer
                      slide={simSlide}
                      brand={activeBrand}
                      mode="thumbnail"
                    />
                  </SlideCanvas>
                </div>
              </div>

              {/* Detalhes do Layout */}
              <div className="w-full text-center">
                <h4 className="font-bold text-[11px] text-slate-700 leading-tight truncate">{t.name}</h4>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    {t.category}
                  </span>
                  {t.premium && (
                    <span className="text-[7px] font-black uppercase tracking-widest bg-amber-500 text-white px-1.5 py-0.5 rounded-full shrink-0">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
