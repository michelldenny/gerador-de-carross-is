import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { MOCK_UNSPLASH_IMAGES } from "../mocks";
import { 
  X, 
  Copy, 
  Download, 
  Share2, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Smartphone,
  Instagram
} from "lucide-react";

export default function Modals() {
  const {
    projects,
    currentProjectId,
    activeSlideId,
    isPreviewModalOpen,
    isExportModalOpen,
    isShareModalOpen,
    isImageSearchModalOpen,
    setPreviewModal,
    setExportModal,
    setShareModal,
    setImageSearchModal,
    updateSlide,
    updateProject,
    addNotification
  } = useStore();

  const project = projects.find(p => p.id === currentProjectId);

  // States
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStep, setExportStep] = useState("");
  const [imageCategory, setImageCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyCaption = () => {
    if (!project) return;
    navigator.clipboard.writeText(project.caption || "");
    setCopiedCaption(true);
    addNotification("Legenda Copiada", "A legenda e as hashtags foram copiadas para a sua área de transferência.", "success");
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyLink = () => {
    if (!project) return;
    navigator.clipboard.writeText(`https://carouselpro.app/share/${project.id}`);
    setCopiedLink(true);
    addNotification("Link Copiado", "O link de visualização compartilhável foi copiado.", "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const startExportSimulation = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStep("Renderizando pixels em alta fidelidade...");

    const intervals = [
      { progress: 25, step: "Otimizando imagens e compactando assets...", delay: 600 },
      { progress: 60, step: "Convertendo layouts para Instagram PNG de alta resolução...", delay: 1200 },
      { progress: 90, step: "Gerando arquivo compactado ZIP...", delay: 1800 },
      { progress: 100, step: "Download concluído com sucesso!", delay: 2400 }
    ];

    intervals.forEach((item) => {
      setTimeout(() => {
        setExportProgress(item.progress);
        setExportStep(item.step);
        if (item.progress === 100) {
          setTimeout(() => {
            setIsExporting(false);
            setExportModal(false);
            // Mark project as published
            updateProject({ status: "published" });
            addNotification(
              "Download Concluído", 
              "Seu arquivo ZIP com os slides numerados e prontos para postar foi baixado.", 
              "success"
            );
          }, 800);
        }
      }, item.delay);
    });
  };

  const handleSelectImage = (url: string) => {
    if (!activeSlideId) return;
    updateSlide(activeSlideId, {
      image: {
        url,
        positionX: 50,
        positionY: 50,
        zoom: 100,
        brightness: 100,
        contrast: 100,
        overlayOpacity: 35
      }
    });
    setImageSearchModal(false);
    addNotification("Imagem Alterada", "O plano de fundo do slide foi atualizado com sucesso.", "success");
  };

  // Filter images in catalog modal
  const filteredImages = MOCK_UNSPLASH_IMAGES.filter((img) => {
    const matchesCategory = imageCategory === "all" || img.category === imageCategory;
    const matchesSearch = searchQuery === "" || 
      img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!project) return null;

  return (
    <>
      {/* 1. PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl relative animate-fade-in">
            {/* Close button */}
            <button 
              onClick={() => setPreviewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1.5 z-50 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Left side: Instagram feed slides preview */}
            <div className="flex-1 bg-slate-50 p-6 flex flex-col justify-center items-center border-r border-slate-100 overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1">
                <Smartphone size={14} /> Feed Feed do Instagram (Simulação)
              </span>

              {/* Slider list of pages */}
              <div className="w-full flex gap-4 overflow-x-auto py-4 px-2 snap-x snap-mandatory">
                {project.slides.map((s, idx) => (
                  <div 
                    key={s.id}
                    className="snap-center shrink-0 w-[280px] aspect-[4/5] bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col justify-between overflow-hidden relative select-none"
                    style={{
                      backgroundColor: s.styles?.backgroundColor || "#ffffff",
                      fontFamily: s.styles?.fontFamily || "Inter"
                    }}
                  >
                    {s.image?.url && (
                      <div className="absolute inset-0 z-0">
                        <img src={s.image.url} className="w-full h-full object-cover" alt="slide" />
                        <div className="absolute inset-0 bg-black/35" />
                      </div>
                    )}
                    
                    {/* Header */}
                    <div className="relative z-10 flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <span style={{ color: s.image?.url ? "#ffffff" : s.styles?.accentColor }}>CarouselPro</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Slide {idx + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center my-4 space-y-2">
                      <h4 className="text-sm font-extrabold tracking-tight leading-snug" style={{ color: s.image?.url ? "#ffffff" : s.styles?.textColor }}>
                        {s.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-4" style={{ color: s.image?.url ? "#e2e8f0" : undefined }}>
                        {s.body}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 flex justify-between items-center text-[8px] font-bold text-slate-400 border-t border-slate-100/30 pt-2">
                      <span>@instagram</span>
                      <span style={{ color: s.styles?.accentColor }}>{s.cta || "Arrastar"} ➔</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 font-bold mt-4">
                ◀ Use a barra de rolagem lateral ou arraste para visualizar todos os {project.slides.length} slides ▶
              </p>
            </div>

            {/* Right side: generated Copy Caption */}
            <div className="w-full md:w-[360px] bg-white p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Instagram className="text-violet-600" size={18} />
                  <h4 className="font-bold text-slate-800 text-sm">Legenda Otimizada IA</h4>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 h-64 overflow-y-auto text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {project.caption}
                </div>
              </div>

              <button
                onClick={handleCopyCaption}
                className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCaption ? "Copiado!" : "Copiar Legenda Instagram"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPORT MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-fade-in">
            {/* Close button */}
            <button 
              onClick={() => setExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Exportar Carrossel de Alta Qualidade</h3>
              <p className="text-xs text-slate-400">Gere imagens numeradas perfeitas para publicação manual ou agendamento direto.</p>
            </div>

            {!isExporting ? (
              <div className="space-y-3">
                <button
                  onClick={startExportSimulation}
                  className="w-full p-4 border border-slate-200 hover:border-violet-300 rounded-2xl text-left flex items-center gap-4 hover:bg-violet-50/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-100 transition-colors shrink-0">
                    <Download size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Baixar Imagens em ZIP</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Arquivos .PNG numerados prontos para upload (Recomendado).</p>
                  </div>
                </button>

                <button
                  onClick={startExportSimulation}
                  className="w-full p-4 border border-slate-200 hover:border-violet-300 rounded-2xl text-left flex items-center gap-4 hover:bg-violet-50/10 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Exportar documento PDF</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Perfeito para apresentações, e-books ou portfólios LinkedIn.</p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <Loader2 className="animate-spin text-violet-600 mx-auto" size={32} />
                <div className="space-y-2 max-w-xs mx-auto">
                  <p className="text-xs text-slate-800 font-bold">{exportStep}</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-600 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{exportProgress}% completo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SHARE LINK MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-fade-in">
            {/* Close button */}
            <button 
              onClick={() => setShareModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Compartilhar Rascunho com o Cliente</h3>
              <p className="text-xs text-slate-400">Gere um link público interativo para aprovação de textos e layouts em tempo real.</p>
            </div>

            {/* Simulated link copy block */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="truncate pr-4">https://carouselpro.app/share/{project.id}</span>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-violet-700 rounded-lg transition-colors shrink-0"
                  title="Copiar Link"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Permitir que o cliente deixe comentários</span>
                  <input type="checkbox" defaultChecked className="accent-violet-600" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-semibold">Exibir branding discreto CarouselPro</span>
                  <input type="checkbox" defaultChecked className="accent-violet-600" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShareModal(false)}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-all"
            >
              Fechar Painel de Compartilhamento
            </button>
          </div>
        </div>
      )}

      {/* 4. IMAGE SEARCH / BROWSE MODAL */}
      {isImageSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl relative animate-fade-in flex flex-col max-h-[85vh]">
            {/* Close button */}
            <button 
              onClick={() => setImageSearchModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">Banco de Imagens Alta Qualidade</h3>
              <p className="text-xs text-slate-400">Escolha fotos em alta resolução para ilustrar o plano de fundo do slide ativo.</p>
            </div>

            {/* Categories filter row */}
            <div className="flex gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
              {["all", "dental", "lifestyle", "fitness", "finance"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setImageCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                    imageCategory === cat
                      ? "bg-violet-600 text-white"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {cat === "all" ? "Todas" : cat === "dental" ? "Dentistas" : cat === "lifestyle" ? "Estilo de Vida" : cat === "fitness" ? "Fitness" : "Negócios"}
                </button>
              ))}
            </div>

            {/* Search Query bar */}
            <div className="relative">
              <ImageIcon size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar imagens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl outline-none transition-all text-slate-700"
              />
            </div>

            {/* Images Grid Scrollbox */}
            <div className="flex-1 overflow-y-auto min-h-[300px] grid grid-cols-2 sm:grid-cols-4 gap-3 scrollbar-none">
              {filteredImages.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400 text-xs">Nenhuma imagem correspondente. Tente outra categoria.</div>
              ) : (
                filteredImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectImage(img.url)}
                    className="aspect-[4/5] rounded-xl overflow-hidden cursor-pointer relative group border border-slate-100 shadow-xs"
                  >
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt="Unsplash" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] font-bold text-white bg-violet-600 px-2.5 py-1 rounded-full shadow-sm">Aplicar no slide</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
