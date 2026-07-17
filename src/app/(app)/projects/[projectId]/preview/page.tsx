"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectsStore, useBrandsStore, useUiStore } from "@/stores";
import { SlideCanvas } from "@/components/slides/slide-canvas";
import { SlideRenderer } from "@/components/slides/slide-renderer";
import { CAROUSEL_FORMATS } from "@/constants/formats";
import { ArrowLeft, ChevronLeft, ChevronRight, Edit3, Download } from "lucide-react";
import { EditorModals } from "@/components/editor/editor-modals";

export default function ProjectPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const { projects } = useProjectsStore();
  const { brands } = useBrandsStore();
  const { setExportModal } = useUiStore();

  const [activeIdx, setActiveIdx] = useState(0);

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold text-xs uppercase font-sans">
        Projeto não encontrado.
      </div>
    );
  }

  const brand = brands.find((b) => b.id === project.brandId) || brands[0];
  const currentSlide = project.slides[activeIdx] || project.slides[0];

  const handlePrev = () => {
    setActiveIdx((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => Math.min(project.slides.length - 1, prev + 1));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/projects/${projectId}/editor`)}
            className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors"
            title="Voltar ao Editor"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Preview: {project.title}</h2>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Modo de Apresentação</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/projects/${projectId}/editor`)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            <Edit3 size={14} /> Editar
          </button>
          <button
            onClick={() => setExportModal(true)}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow active:scale-95"
          >
            <Download size={14} /> Exportar
          </button>
        </div>
      </div>

      {/* Main presentation workarea */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left/Middle Column: Slide Visualizer */}
        <div className="md:col-span-2 bg-slate-950 rounded-3xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden border border-slate-800">
          <button
            disabled={activeIdx === 0}
            onClick={handlePrev}
            className="absolute left-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full disabled:opacity-30 transition-all z-20"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="scale-[0.8] sm:scale-[0.9] md:scale-100 transition-transform origin-center">
            <SlideCanvas
              width={CAROUSEL_FORMATS[project.format].width}
              height={CAROUSEL_FORMATS[project.format].height}
              scale={0.4}
              mode="preview"
            >
              <SlideRenderer slide={currentSlide} brand={brand} mode="preview" />
            </SlideCanvas>
          </div>

          <button
            disabled={activeIdx === project.slides.length - 1}
            onClick={handleNext}
            className="absolute right-4 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full disabled:opacity-30 transition-all z-20"
          >
            <ChevronRight size={20} />
          </button>

          <span className="absolute bottom-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
            Slide {activeIdx + 1} de {project.slides.length}
          </span>
        </div>

        {/* Right Column: Instagram Context */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-black text-xs border border-violet-200">
              {brand?.logoText?.substring(0, 1) || "D"}
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800">{brand?.name || "DentalHQ"}</h4>
              <span className="text-[9px] text-slate-400 font-semibold">{brand?.instagramHandle}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 max-h-72 overflow-y-auto text-xs leading-relaxed text-slate-600 custom-scrollbar select-text">
            <p className="whitespace-pre-line">{project.caption}</p>
          </div>
        </div>
      </div>
      <EditorModals projectId={projectId} />
    </div>
  );
}
