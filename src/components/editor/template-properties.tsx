"use client";

import React from "react";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import { MOCK_TEMPLATES } from "@/mocks";
import { SlideTemplateId } from "@/types";
import { Layers } from "lucide-react";

interface TemplatePropertiesProps {
  projectId: string;
}

export function TemplateProperties({ projectId }: TemplatePropertiesProps) {
  const { projects, updateSlide } = useProjectsStore();
  const { activeSlideId, pushHistory } = useEditorStore();
  const { addNotification } = useUiStore();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) return null;

  const handleTemplateChange = (templateId: SlideTemplateId) => {
    pushHistory(JSON.stringify(project));
    updateSlide(projectId, activeSlide.id, { template: templateId });
    addNotification("Template alterado", "O layout do slide foi reestruturado.", "success");
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Layouts Disponíveis</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOCK_TEMPLATES.map((t) => {
          const isSelected = activeSlide.template === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleTemplateChange(t.id as SlideTemplateId)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-24 ${
                isSelected
                  ? "border-violet-500 bg-violet-50/20 shadow-xs"
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                  {t.category}
                </span>
                {t.premium && (
                  <span className="text-[7px] font-black uppercase tracking-widest bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                    PRO
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs text-slate-700 leading-tight truncate">{t.name}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
