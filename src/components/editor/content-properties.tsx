"use client";

import React, { useState } from "react";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import { Sparkles, RefreshCw, ChevronRight, AlertTriangle } from "lucide-react";

interface ContentPropertiesProps {
  projectId: string;
}

export function ContentProperties({ projectId }: ContentPropertiesProps) {
  const { projects, updateSlide } = useProjectsStore();
  const { activeSlideId, selectedElementId, pushHistory } = useEditorStore();
  const { addNotification } = useUiStore();

  const [loadingField, setLoadingField] = useState<string | null>(null);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) return null;

  const handleTextChange = (field: string, value: string) => {
    pushHistory(JSON.stringify(project));
    updateSlide(projectId, activeSlide.id, { [field]: value });
  };

  const getCharLimit = (field: string) => {
    switch (field) {
      case "title":
        return 65;
      case "subtitle":
        return 100;
      case "body":
        return 250;
      case "highlight":
        return 100;
      case "cta":
        return 80;
      default:
        return 200;
    }
  };

  const getQualityIndicator = (text: string, limit: number) => {
    const len = text.length;
    if (len === 0) return { label: "Vazio", color: "text-slate-400 bg-slate-100" };
    if (len <= limit * 0.7) return { label: "Ideal", color: "text-emerald-700 bg-emerald-50 border-emerald-100" };
    if (len <= limit) return { label: "Próximo do limite", color: "text-amber-700 bg-amber-50 border-amber-100" };
    return { label: "Muito Longo (Estouros)", color: "text-rose-700 bg-rose-50 border-rose-100 border animate-pulse" };
  };

  const simulateAiAction = async (field: "title" | "subtitle" | "body", action: "improve" | "shorten" | "regenerate") => {
    const originalText = activeSlide[field] || "";
    if (!originalText && action !== "regenerate") return;

    setLoadingField(`${field}-${action}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    pushHistory(JSON.stringify(project));

    let resultText = originalText;
    if (action === "improve") {
      resultText = `${originalText} de Alta Performance ✨`;
    } else if (action === "shorten") {
      resultText = originalText.slice(0, Math.floor(originalText.length * 0.7)) + "...";
    } else if (action === "regenerate") {
      resultText = field === "title" 
        ? "Novo Título Estratégico e Engajador 💡" 
        : "Novo texto de apoio reescrito com gatilhos de atenção focados na audiência.";
    }

    updateSlide(projectId, activeSlide.id, { [field]: resultText });
    setLoadingField(null);
    addNotification("AI Copymaker", "Texto atualizado estrategicamente.", "success");
  };

  const textFields = [
    { key: "title", label: "Título Principal" },
    { key: "subtitle", label: "Subtítulo / Dica" },
    { key: "body", label: "Corpo do Slide" },
    { key: "highlight", label: "Destaque / Autor / Número" },
    { key: "cta", label: "Chamada para Ação (CTA)" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Propriedades de Conteúdo</h3>
      </div>

      <div className="space-y-5">
        {textFields.map((f) => {
          const value = (activeSlide[f.key] as string) || "";
          const limit = getCharLimit(f.key);
          const quality = getQualityIndicator(value, limit);
          const isSelected = selectedElementId === f.key;

          return (
            <div
              key={f.key}
              className={`p-3 rounded-2xl border transition-all ${
                isSelected ? "border-violet-500 bg-violet-50/20" : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">
                  {f.label}
                </span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${quality.color}`}>
                  {quality.label} ({value.length}/{limit})
                </span>
              </div>

              <textarea
                value={value}
                onChange={(e) => handleTextChange(f.key, e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold font-sans min-h-[56px] resize-y custom-scrollbar"
                placeholder={`Escreva o ${f.label.toLowerCase()}...`}
              />

              {/* Botões de Ações de IA */}
              {(f.key === "title" || f.key === "subtitle" || f.key === "body") && (
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => simulateAiAction(f.key, "improve")}
                    disabled={loadingField !== null}
                    className="text-[9px] font-bold text-slate-500 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    {loadingField === `${f.key}-improve` ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
                    )}
                    Melhorar
                  </button>
                  <button
                    onClick={() => simulateAiAction(f.key, "shorten")}
                    disabled={loadingField !== null}
                    className="text-[9px] font-bold text-slate-500 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    {loadingField === `${f.key}-shorten` ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <ChevronRight size={10} />
                    )}
                    Encurtar
                  </button>
                  <button
                    onClick={() => simulateAiAction(f.key, "regenerate")}
                    disabled={loadingField !== null}
                    className="text-[9px] font-bold text-slate-500 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
                  >
                    {loadingField === `${f.key}-regenerate` ? (
                      <RefreshCw size={10} className="animate-spin" />
                    ) : (
                      <RefreshCw size={10} />
                    )}
                    Regenerar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
