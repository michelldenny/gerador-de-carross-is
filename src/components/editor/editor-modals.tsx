"use client";

import React, { useState } from "react";
import { useUiStore, useProjectsStore, useBrandsStore } from "@/stores";
import { SlideCanvas } from "../slides/slide-canvas";
import { SlideRenderer } from "../slides/slide-renderer";
import { CAROUSEL_FORMATS } from "@/constants/formats";
import { shareProject } from "@/services/mock-share-service";
import { exportProjectSlides } from "@/services/mock-export-service";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Download,
  Share2,
  Lock,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";

interface EditorModalsProps {
  projectId: string;
}

export function EditorModals({ projectId }: EditorModalsProps) {
  const {
    isPreviewModalOpen,
    isExportModalOpen,
    isShareModalOpen,
    setPreviewModal,
    setExportModal,
    setShareModal,
    addNotification,
  } = useUiStore();

  const { projects } = useProjectsStore();
  const { brands } = useBrandsStore();

  const project = projects.find((p) => p.id === projectId);
  const brand = project ? brands.find((b) => b.id === project.brandId) || brands[0] : undefined;

  // Preview States
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  // Share States
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  // Export States
  const [exportFormat, setExportFormat] = useState<"png" | "jpg" | "pdf" | "zip">("zip");
  const [exportQuality, setExportQuality] = useState(100);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState("");

  if (!project) return null;

  const handleShare = async () => {
    setIsSharing(true);
    const res = await shareProject({
      projectId,
      allowComments: true,
      allowEditing: false,
      passwordProtected: false,
    });
    setShareUrl(res.shareUrl);
    setIsSharing(false);
    addNotification("Link gerado", "Link de visualização pública gerado com sucesso.", "success");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText("Iniciando renderização de slides...");

    const res = await exportProjectSlides(
      projectId,
      {
        format: exportFormat,
        quality: exportQuality,
        resolution: "2x",
        fileName: project.title.toLowerCase().replace(/\s+/g, "-"),
        includeWatermark: false,
        transparentBackground: false,
      },
      (prog) => {
        setExportProgress(prog.progress);
        setExportStatusText(prog.status);
      }
    );

    setIsExporting(false);
    setExportModal(false);
    addNotification("Exportado com sucesso", `Seu carrossel foi empacotado em formato ${exportFormat.toUpperCase()}.`, "success");
  };

  const currentPreviewSlide = project.slides[activePreviewIdx] || project.slides[0];

  return (
    <>
      {/* 1. PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row w-full max-w-5xl h-[85vh] relative text-white">
            <button
              onClick={() => setPreviewModal(false)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2 z-30 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Left Column: Interactive Slide view */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center p-6 relative">
              <button
                disabled={activePreviewIdx === 0}
                onClick={() => setActivePreviewIdx((prev) => Math.max(0, prev - 1))}
                className="absolute left-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2.5 disabled:opacity-30 disabled:cursor-not-allowed z-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="scale-[0.8] origin-center">
                <SlideCanvas
                  width={CAROUSEL_FORMATS[project.format].width}
                  height={CAROUSEL_FORMATS[project.format].height}
                  scale={0.4}
                  mode="preview"
                >
                  <SlideRenderer slide={currentPreviewSlide} brand={brand} mode="preview" />
                </SlideCanvas>
              </div>

              <button
                disabled={activePreviewIdx === project.slides.length - 1}
                onClick={() => setActivePreviewIdx((prev) => Math.min(project.slides.length - 1, prev + 1))}
                className="absolute right-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2.5 disabled:opacity-30 disabled:cursor-not-allowed z-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>

              {/* Progress counter */}
              <span className="absolute bottom-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Slide {activePreviewIdx + 1} de {project.slides.length}
              </span>
            </div>

            {/* Right Column: Legenda Preview & Instagram lookalike */}
            <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{brand?.name || "DentalHQ"}</h4>
                    <span className="text-[9px] text-slate-400">Simulação de Post</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-h-80 overflow-y-auto text-xs leading-relaxed text-slate-300 custom-scrollbar select-text">
                  <p className="whitespace-pre-line">{project.caption}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    setPreviewModal(false);
                    setExportModal(true);
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Download size={14} /> Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHARE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Share2 size={16} className="text-violet-600" />
              <h3 className="font-black text-sm text-slate-800">Compartilhar Rascunho</h3>
            </div>

            {!shareUrl ? (
              <div className="space-y-4 text-center py-4">
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Gere um link temporário para que clientes ou parceiros de equipe revisem o carrossel sem precisar fazer login.
                </p>
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md inline-flex items-center gap-1.5 active:scale-95"
                >
                  {isSharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                  <span>Gerar Link de Compartilhamento</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 rounded-xl flex items-center gap-1.5 active:scale-95"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>Copiar</span>
                  </button>
                </div>

                {/* Protections options mock */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-slate-400" />
                    <span>Proteção por senha ativa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Expira em 7 dias</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. EXPORT MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-200 shadow-2xl relative space-y-4">
            <button
              onClick={() => setExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
            >
              <X size={16} />
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Download size={16} className="text-violet-600" />
              <h3 className="font-black text-sm text-slate-800">Opções de Exportação</h3>
            </div>

            {!isExporting ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Formato de Saída</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["zip", "png", "jpg", "pdf"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`py-2 rounded-xl border text-xs font-bold uppercase transition-all ${
                          exportFormat === fmt
                            ? "border-violet-600 bg-violet-50 text-violet-700 font-black"
                            : "border-slate-200 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Qualidade da Exportação</span>
                    <span>{exportQuality}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={exportQuality}
                    onChange={(e) => setExportQuality(Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Badge features */}
                <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-2xl space-y-1.5 text-[10px] font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5 text-violet-700">
                    <Sparkles size={12} strokeWidth={3} />
                    <span className="font-black uppercase tracking-wider">Recursos Pro Ativos</span>
                  </div>
                  <p>• Resolução Premium duplicada (2160px de largura).</p>
                  <p>{"• Sem marca d'água no rodapé dos slides."}</p>
                </div>

                <button
                  onClick={handleExport}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-colors active:scale-98"
                >
                  <Download size={14} /> Exportar Agora
                </button>
              </div>
            ) : (
              /* Export Progress status loader */
              <div className="space-y-4 text-center py-6">
                <div className="relative w-12 h-12 mx-auto">
                  <div className="w-12 h-12 border-4 border-slate-100 rounded-full" />
                  <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">{exportStatusText}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{exportProgress}% concluído</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
