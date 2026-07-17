"use client";

import React from "react";
import { useEditorStore } from "@/stores";
import { ContentProperties } from "./content-properties";
import { DesignProperties } from "./design-properties";
import { ImageProperties } from "./image-properties";
import { TemplateProperties } from "./template-properties";
import { CaptionPanel } from "./caption-panel";
import { Type, Palette, Image, Layers, FileText } from "lucide-react";
import { ActiveTab } from "@/types";

interface PropertiesPanelProps {
  projectId: string;
}

export function PropertiesPanel({ projectId }: PropertiesPanelProps) {
  const { activeTab, setActiveTab } = useEditorStore();

  const tabs = [
    { id: "content", label: "Texto", icon: Type },
    { id: "design", label: "Estilo", icon: Palette },
    { id: "image", label: "Imagem", icon: Image },
    { id: "template", label: "Layout", icon: Layers },
  ] as const;

  return (
    <aside className="w-[320px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden z-10">
      {/* Abas Superiores */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? "bg-white text-violet-700 border-b-2 border-violet-600"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo da Aba Ativa */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {activeTab === "content" && <ContentProperties projectId={projectId} />}
        {activeTab === "design" && <DesignProperties projectId={projectId} />}
        {activeTab === "image" && <ImageProperties projectId={projectId} />}
        {activeTab === "template" && <TemplateProperties projectId={projectId} />}
      </div>

      {/* Bottom extra action: Legenda editor shortcut */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={() => {
            // Se estiver em outra aba, chaveamos para design ou criamos um toggle
            // mas podemos abrir um modal ou simplesmente disponibilizar a aba no switch
            // Para manter simples, fornecemos uma gaveta de legenda
            setActiveTab("content");
          }}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider"
        >
          <FileText size={12} /> Editar Legenda do Post
        </button>
      </div>
    </aside>
  );
}
