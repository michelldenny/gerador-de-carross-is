"use client";

import React, { useState } from "react";
import { useProjectsStore, useUiStore } from "@/stores";
import { Sparkles, Copy, Check, Hash, RefreshCw } from "lucide-react";

interface CaptionPanelProps {
  projectId: string;
}

export function CaptionPanel({ projectId }: CaptionPanelProps) {
  const { projects, updateProject } = useProjectsStore();
  const { addNotification } = useUiStore();

  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [loading, setLoading] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(project.caption);
    setCopiedCaption(true);
    addNotification("Legenda copiada", "Texto da legenda copiado para a área de transferência.", "success");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyHashtags = () => {
    const hashText = project.hashtags.map((h) => `#${h}`).join(" ");
    navigator.clipboard.writeText(hashText);
    setCopiedHashtags(true);
    addNotification("Hashtags copiadas", "Lista de hashtags copiada com sucesso.", "success");
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCaptionChange = (val: string) => {
    updateProject(projectId, { caption: val });
  };

  const simulateAiCaption = async (action: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let newCaption = project.caption;
    if (action === "improve") {
      newCaption = `${project.caption}\n\nGaranta sua vaga hoje mesmo! 👇✨`;
    } else if (action === "shorten") {
      newCaption = "Resumo prático das dicas de saúde bucal e esporte para você não perder rendimento nos seus treinos. Acesse a bio!";
    }

    updateProject(projectId, { caption: newCaption });
    setLoading(false);
    addNotification("AI Copymaker", "Legenda otimizada com sucesso.", "success");
  };

  const charLimit = 2200;
  const isOverLimit = project.caption.length > charLimit;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Legenda do Instagram</h3>
        <span
          className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
            isOverLimit ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-500"
          }`}
        >
          {project.caption.length} / {charLimit} caracteres
        </span>
      </div>

      <div className="space-y-4">
        <textarea
          value={project.caption}
          onChange={(e) => handleCaptionChange(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold font-sans min-h-[160px] resize-y custom-scrollbar"
          placeholder="Escreva a legenda do post..."
        />

        {/* Copy actions */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyCaption}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            {copiedCaption ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>Copiar Legenda</span>
          </button>
          <button
            onClick={handleCopyHashtags}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            {copiedHashtags ? <Check size={12} className="text-emerald-500" /> : <Hash size={12} />}
            <span>Copiar Hashtags</span>
          </button>
        </div>

        {/* AI optimizations */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Otimizar Legenda por IA</h4>
          <div className="flex gap-2">
            <button
              onClick={() => simulateAiCaption("improve")}
              disabled={loading}
              className="flex-1 text-[9px] font-bold text-slate-500 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-2 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              {loading ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} />}
              Melhorar Tom
            </button>
            <button
              onClick={() => simulateAiCaption("shorten")}
              disabled={loading}
              className="flex-1 text-[9px] font-bold text-slate-500 hover:text-violet-700 bg-slate-100 hover:bg-violet-50 px-2 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              {loading ? <RefreshCw size={10} className="animate-spin" /> : <RefreshCw size={10} />}
              Encurtar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
