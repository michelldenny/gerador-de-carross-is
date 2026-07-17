import React, { useState } from "react";
import { useStore } from "../store";
import { Slide, SlideImage } from "../types";
import { MOCK_BRANDS, MOCK_TEMPLATES } from "../mocks";
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  Eye, 
  Share2, 
  Download, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Copy, 
  Plus, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Smile,
  AlertCircle,
  FolderSync
} from "lucide-react";

export default function EditorView() {
  const {
    projects,
    brands,
    currentProjectId,
    activeSlideId,
    selectedElementId,
    activeTab,
    autosaveStatus,
    setView,
    setActiveSlide,
    setSelectedElement,
    setActiveTab,
    updateProject,
    updateSlide,
    addSlide,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
    undo,
    redo,
    undoStack,
    redoStack,
    setPreviewModal,
    setExportModal,
    setShareModal,
    setImageSearchModal,
    addNotification
  } = useStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Get active project
  const project = projects.find(p => p.id === currentProjectId);
  if (!project) {
    return (
      <div className="p-12 text-center text-slate-500">
        Nenhum projeto selecionado. Volte ao <button onClick={() => setView("dashboard")} className="text-violet-600 font-bold hover:underline">Dashboard</button>.
      </div>
    );
  }

  // Get active slide
  const activeSlide = project.slides.find(s => s.id === activeSlideId) || project.slides[0];

  const getBrand = () => {
    return brands.find(b => b.id === project.brandId) || brands[0];
  };

  const handleTextChange = (field: "title" | "subtitle" | "body" | "cta" | "highlight", val: string) => {
    if (!activeSlide) return;
    updateSlide(activeSlide.id, { [field]: val });
  };

  const handleStyleChange = (key: string, val: any) => {
    if (!activeSlide) return;
    updateSlide(activeSlide.id, {
      styles: {
        ...activeSlide.styles,
        [key]: val
      }
    });
  };

  const handleImageChange = (key: keyof SlideImage, val: any) => {
    if (!activeSlide) return;
    const currentImg = activeSlide.image || {
      url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800",
      positionX: 50,
      positionY: 50,
      zoom: 100,
      brightness: 100,
      contrast: 100,
      overlayOpacity: 30
    };
    updateSlide(activeSlide.id, {
      image: {
        ...currentImg,
        [key]: val
      }
    });
  };

  const handleListItemChange = (idx: number, val: string) => {
    if (!activeSlide) return;
    const items = [...(activeSlide.listItems || [])];
    items[idx] = val;
    updateSlide(activeSlide.id, { listItems: items });
  };

  const applyStyleToAllSlides = () => {
    if (!activeSlide) return;
    const slides = project.slides.map(s => ({
      ...s,
      styles: { ...activeSlide.styles }
    }));
    updateProject({ slides });
    addNotification("Estilo Aplicado", "A identidade visual deste slide foi replicada em todo o carrossel.", "success");
  };

  // Quick AI rewrite simulation
  const simulateAiTextImprovement = (field: "title" | "subtitle" | "body") => {
    if (!activeSlide) return;
    const text = activeSlide[field] || "";
    if (!text) return;
    
    // Simple mock translations/rewrites based on dentists/marketing
    const rewrites: Record<string, string> = {
      "5 Dicas para um Sorriso Perfeito": "Descubra 5 Hábitos Diários para Conquistar o Sorriso dos Sonhos 💎",
      "O impacto bucal no seu rendimento": "Seu rendimento físico depende do seu sorriso! Veja a relação direta ⚡",
      "O impacto bucal no seu rendimento físico": "A sua performance física começa pela saúde da sua boca! Entenda 💎",
      "A Respiração Bucal e a Boca Seca nos Treinos": "O perigo oculto da respiração bucal durante exercícios intensos 🏃‍♂️",
      "Checklist de Proteção nos Esportes de Impacto": "Guia de Sobrevivência para proteger seus dentes em quadra 🛡️",
      "Bebidas Isotônicas vs. Água Mineral nos Treinos": "O segredo ácido dos isotônicos: vilões do esmalte dentário?",
      "A opinião dos especialistas em Medicina Esportiva": "Dica de Ouro: o que os médicos de atletas profissionais recomendam 🥇",
      "Pronto para o Próximo Treino?": "Alcance seu próximo nível com saúde bucal completa! Agende agora 👇"
    };

    const improved = rewrites[text] || `${text} de Alta Performance ✨`;
    updateSlide(activeSlide.id, { [field]: improved });
    addNotification("AI Copymaker", `Texto otimizado para o Instagram com sucesso!`, "success");
  };

  const isUndoEnabled = undoStack.length > 0;
  const isRedoEnabled = redoStack.length > 0;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-100 overflow-hidden select-none -mx-6 -my-8">
      
      {/* Editor Subheader / Controls */}
      <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
        
        {/* Left Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView("projects")}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            title="Voltar aos Projetos"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-col">
            <input
              type="text"
              value={project.title}
              onChange={(e) => updateProject({ title: e.target.value })}
              className="font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-600 focus:outline-none py-0.5 max-w-[200px] truncate"
            />
            {/* Autosave badge indicator */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${autosaveStatus === "saved" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {autosaveStatus === "saved" ? "Nuvem Sincronizada" : "Salvando alterações..."}
              </span>
            </div>
          </div>
        </div>

        {/* Center Controls (Undo/Redo) */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl shadow-inner">
          <button
            onClick={undo}
            disabled={!isUndoEnabled}
            className={`p-2 rounded-lg transition-all ${isUndoEnabled ? "text-slate-600 hover:bg-white hover:text-slate-800" : "text-slate-300 cursor-not-allowed"}`}
            title="Desfazer"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={redo}
            disabled={!isRedoEnabled}
            className={`p-2 rounded-lg transition-all ${isRedoEnabled ? "text-slate-600 hover:bg-white hover:text-slate-800" : "text-slate-300 cursor-not-allowed"}`}
            title="Refazer"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-[11px] font-semibold"
          >
            <Eye size={14} />
            <span>Visualizar</span>
          </button>
          <button
            onClick={() => setShareModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-[11px] font-semibold"
          >
            <Share2 size={14} />
            <span>Compartilhar</span>
          </button>
          <button
            onClick={() => setExportModal(true)}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm"
          >
            <Download size={14} />
            <span>Exportar Carrossel</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Slide navigator list */}
        <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navegador</span>
            <button 
              onClick={addSlide}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              title="Adicionar slide"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
            {project.slides.map((s, idx) => {
              const isActive = activeSlide?.id === s.id;
              return (
                <div 
                  key={s.id}
                  onClick={() => setActiveSlide(s.id)}
                  className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                    isActive 
                      ? "border-violet-500 ring-4 ring-violet-500/20 scale-95" 
                      : "border-slate-800 hover:border-slate-700 bg-slate-950"
                  }`}
                >
                  {/* Aspect Ratio box */}
                  <div className="aspect-[4/5] p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[7px] text-violet-400 font-bold uppercase">{getBrand().name}</span>
                      <p className="text-[9px] text-white/90 font-bold line-clamp-3 mt-1 leading-tight">{s.title || "Slide sem título"}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-[8px] font-semibold text-slate-400">
                        {s.type === "cover" ? "Capa" : s.type === "cta" ? "CTA" : `Slide ${s.order}`}
                      </span>
                    </div>
                  </div>

                  {/* Reorder and Delete Controls overlay */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); reorderSlides(idx, idx - 1); }}
                        className="bg-slate-900/95 border border-slate-800 p-1 rounded-md text-slate-400 hover:text-white"
                      >
                        <ChevronUp size={10} />
                      </button>
                    )}
                    {idx < project.slides.length - 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); reorderSlides(idx, idx + 1); }}
                        className="bg-slate-900/95 border border-slate-800 p-1 rounded-md text-slate-400 hover:text-white"
                      >
                        <ChevronDown size={10} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSlide(s.id); }}
                      className="bg-rose-950/95 border border-rose-900 p-1 rounded-md text-rose-300 hover:text-rose-100"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bottom Add Slide Shortcut */}
            <button
              onClick={addSlide}
              className="w-full py-3.5 border border-dashed border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-4"
            >
              <Plus size={14} />
              <span>Adicionar Slide</span>
            </button>
          </div>
        </aside>

        {/* Central interactive slide canvas */}
        <main className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-8 custom-scrollbar">
          {activeSlide ? (
            <div 
              className={`bg-white shadow-2xl relative select-none shrink-0 transition-all border border-slate-200/50 flex flex-col justify-between p-12 overflow-hidden`}
              style={{
                width: "420px",
                height: project.format === "story" ? "746px" : project.format === "square" ? "420px" : "525px",
                backgroundColor: activeSlide.styles?.backgroundColor || "#ffffff",
                fontFamily: activeSlide.styles?.fontFamily || "Inter"
              }}
            >
              {/* Optional Background image with overlays */}
              {activeSlide.image?.url && (
                <div className="absolute inset-0 z-0">
                  <img 
                    src={activeSlide.image.url} 
                    className="w-full h-full object-cover" 
                    style={{
                      filter: `brightness(${activeSlide.image.brightness || 100}%) contrast(${activeSlide.image.contrast || 100}%)`,
                      transform: `scale(${(activeSlide.image.zoom || 100) / 100})`
                    }}
                    alt="Slide"
                  />
                  <div 
                    className="absolute inset-0 bg-black"
                    style={{ opacity: `${activeSlide.image.overlayOpacity || 30}%` }}
                  />
                </div>
              )}

              {/* SLIDE TOP ROW (Brand Header) */}
              <div className="relative z-10 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs shadow-md shadow-black/10"
                  style={{ backgroundColor: activeSlide.styles?.accentColor || "#7c3aed" }}
                >
                  {getBrand()?.logoText?.substring(0, 1) || "D"}
                </div>
                <span 
                  className="font-bold text-xs tracking-tight uppercase"
                  style={{ color: activeSlide.image?.url ? "#ffffff" : activeSlide.styles?.textColor }}
                >
                  {getBrand()?.name || "Dental Clinic HQ"}
                </span>
              </div>

              {/* SLIDE MID AREA (Dynamic templates layout) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center my-6 space-y-4">
                {activeSlide.template === "cover-image" || activeSlide.template === "cover-minimal" ? (
                  <div className="space-y-3">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-violet-600/10 text-violet-700"
                      style={{ 
                        color: activeSlide.image?.url ? "#ffffff" : activeSlide.styles?.accentColor,
                        backgroundColor: activeSlide.image?.url ? "rgba(255,255,255,0.2)" : undefined
                      }}
                    >
                      {activeSlide.subtitle || "DICA DO DIA"}
                    </span>
                    <h3 
                      className="text-2xl font-extrabold tracking-tight leading-tight"
                      style={{ color: activeSlide.image?.url ? "#ffffff" : activeSlide.styles?.textColor }}
                    >
                      {activeSlide.title}
                    </h3>
                    <p 
                      className="text-xs leading-relaxed font-medium opacity-90"
                      style={{ color: activeSlide.image?.url ? "#f1f5f9" : "#64748b" }}
                    >
                      {activeSlide.body}
                    </p>
                  </div>
                ) : activeSlide.template === "content-number" ? (
                  <div className="space-y-4">
                    <span 
                      className="text-5xl font-black tracking-tighter"
                      style={{ color: activeSlide.styles?.accentColor }}
                    >
                      {activeSlide.subtitle?.replace(/\D/g, '') || "01"}
                    </span>
                    <h3 className="text-xl font-bold leading-tight" style={{ color: activeSlide.styles?.textColor }}>
                      {activeSlide.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 font-medium">
                      {activeSlide.body}
                    </p>
                  </div>
                ) : activeSlide.template === "content-list" || activeSlide.template === "comparison" ? (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{activeSlide.title}</h3>
                    <div className="space-y-2">
                      {(activeSlide.listItems || ["Item de lista 1", "Item de lista 2"]).slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                          <span 
                            className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0 mt-0.5"
                            style={{ backgroundColor: activeSlide.styles?.accentColor }}
                          >
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : activeSlide.template === "content-quote" ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative">
                    <span className="text-4xl text-slate-300 absolute left-2.5 top-0 font-serif">“</span>
                    <p className="text-xs font-semibold text-slate-700 italic leading-relaxed relative z-10 pl-4">{activeSlide.body}</p>
                    <p className="text-[10px] font-bold text-violet-700 mt-3 text-right">- {activeSlide.highlight}</p>
                  </div>
                ) : (
                  /* Standard informative card fallback template */
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold leading-tight" style={{ color: activeSlide.styles?.textColor }}>{activeSlide.title}</h3>
                    <p className="text-xs leading-relaxed text-slate-500 font-medium">{activeSlide.body}</p>
                  </div>
                )}
              </div>

              {/* SLIDE FOOTER ROW (CTA) */}
              <div className="relative z-10 flex justify-between items-center border-t border-slate-100/40 pt-4 mt-2">
                <span className="text-[9px] text-slate-400 font-semibold">{getBrand()?.instagramHandle || "@dentalclinichq"}</span>
                <span 
                  className="text-[9px] font-bold flex items-center gap-1 uppercase"
                  style={{ color: activeSlide.styles?.accentColor }}
                >
                  <span>{activeSlide.cta || "Arrasta para o lado"}</span>
                  <span>➔</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 font-medium text-xs">Selecione ou crie um slide no painel da esquerda.</div>
          )}
        </main>

        {/* Right Sidebar properties inspector panel */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0">
          
          {/* Header Tabs switcher */}
          <div className="flex border-b border-slate-100 shrink-0">
            {(["content", "design", "image", "template"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 text-center transition-all ${
                  activeTab === tab 
                    ? "border-violet-600 text-violet-700" 
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "content" ? "Conteúdo" : tab === "design" ? "Design" : tab === "image" ? "Imagem" : "Template"}
              </button>
            ))}
          </div>

          {/* Active Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
            
            {/* TAB CONTENT: EDIT TEXT VALUES */}
            {activeTab === "content" && activeSlide && (
              <div className="space-y-4">
                
                {/* Title element editing */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Título Principal</label>
                    <button 
                      onClick={() => simulateAiTextImprovement("title")}
                      className="text-[9px] font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                    >
                      <Sparkles size={10} /> Melhorar IA
                    </button>
                  </div>
                  <input
                    type="text"
                    value={activeSlide.title || ""}
                    onChange={(e) => handleTextChange("title", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg text-xs outline-none text-slate-700 transition-all font-semibold"
                  />
                </div>

                {/* Subtitle element editing */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Subtítulo / Etiqueta</label>
                  <input
                    type="text"
                    value={activeSlide.subtitle || ""}
                    onChange={(e) => handleTextChange("subtitle", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg text-xs outline-none text-slate-700 transition-all"
                  />
                </div>

                {/* Body element editing */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Corpo do Texto</label>
                    <button 
                      onClick={() => simulateAiTextImprovement("body")}
                      className="text-[9px] font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                    >
                      <Sparkles size={10} /> Encurtar IA
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={activeSlide.body || ""}
                    onChange={(e) => handleTextChange("body", e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg text-xs outline-none text-slate-700 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* List Items editing if list template selected */}
                {(activeSlide.template === "content-list" || activeSlide.template === "comparison") && (
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Itens do Checklist</label>
                    {(activeSlide.listItems || ["", ""]).map((item, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="w-5 h-5 bg-slate-100 border border-slate-200 rounded flex items-center justify-center font-bold text-[10px] text-slate-500 shrink-0 mt-2">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleListItemChange(idx, e.target.value)}
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg text-xs outline-none text-slate-700 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlight field editing */}
                {activeSlide.template === "content-quote" && (
                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Autor da Citação</label>
                    <input
                      type="text"
                      value={activeSlide.highlight || ""}
                      onChange={(e) => handleTextChange("highlight", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none text-slate-700"
                    />
                  </div>
                )}

                {/* CTA final element editing */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Chamada para Ação (CTA)</label>
                  <input
                    type="text"
                    value={activeSlide.cta || ""}
                    onChange={(e) => handleTextChange("cta", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg text-xs outline-none text-slate-700 transition-all font-semibold"
                  />
                </div>

              </div>
            )}

            {/* TAB DESIGN: THEMES AND SHAPES */}
            {activeTab === "design" && activeSlide && (
              <div className="space-y-4">
                
                {/* Background Color preset selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cor do Fundo</label>
                  <div className="flex flex-wrap gap-2">
                    {["#ffffff", "#f8fafc", "#1e293b", "#0f172a", "#7c3aed"].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange("backgroundColor", color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          activeSlide.styles?.backgroundColor === color 
                            ? "border-violet-600 ring-2 ring-violet-300" 
                            : "border-slate-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Text Color preset selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cor Principal do Texto</label>
                  <div className="flex flex-wrap gap-2">
                    {["#1e293b", "#0f172a", "#ffffff", "#475569", "#7c3aed"].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange("textColor", color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          activeSlide.styles?.textColor === color 
                            ? "border-violet-600 ring-2 ring-violet-300" 
                            : "border-slate-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Brand Accent Color preset selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cor de Destaque / Botão</label>
                  <div className="flex flex-wrap gap-2">
                    {["#7c3aed", "#2563eb", "#db2777", "#059669", "#f59e0b"].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleStyleChange("accentColor", color)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          activeSlide.styles?.accentColor === color 
                            ? "border-violet-600 ring-2 ring-violet-300" 
                            : "border-slate-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Global Apply styling CTA */}
                <button
                  type="button"
                  onClick={applyStyleToAllSlides}
                  className="w-full py-2.5 mt-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  Aplicar estilo a todos os slides
                </button>

              </div>
            )}

            {/* TAB IMAGES PANEL */}
            {activeTab === "image" && activeSlide && (
              <div className="space-y-4">
                
                {/* Search Image button trigger */}
                <button
                  type="button"
                  onClick={() => setImageSearchModal(true)}
                  className="w-full py-3 border border-dashed border-violet-300 hover:border-violet-500 text-violet-600 hover:text-violet-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-violet-50/20 transition-all"
                >
                  <ImageIcon size={14} />
                  <span>Substituir do Banco</span>
                </button>

                {/* Mock SlideImage Adjusters */}
                {activeSlide.image ? (
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ajustes da Imagem</p>
                    
                    {/* Zoom Adjustment */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Zoom</span>
                        <span className="text-slate-700 font-bold">{activeSlide.image.zoom || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={100}
                        max={200}
                        value={activeSlide.image.zoom || 100}
                        onChange={(e) => handleImageChange("zoom", parseInt(e.target.value))}
                        className="w-full accent-violet-600"
                      />
                    </div>

                    {/* Overlay Transparency */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Opacidade do Filtro Escuro</span>
                        <span className="text-slate-700 font-bold">{activeSlide.image.overlayOpacity || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={90}
                        value={activeSlide.image.overlayOpacity || 0}
                        onChange={(e) => handleImageChange("overlayOpacity", parseInt(e.target.value))}
                        className="w-full accent-violet-600"
                      />
                    </div>

                    {/* Brightness Adjuster */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Brilho</span>
                        <span className="text-slate-700 font-bold">{activeSlide.image.brightness || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={activeSlide.image.brightness || 100}
                        onChange={(e) => handleImageChange("brightness", parseInt(e.target.value))}
                        className="w-full accent-violet-600"
                      />
                    </div>

                    {/* Contrast Adjuster */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Contraste</span>
                        <span className="text-slate-700 font-bold">{activeSlide.image.contrast || 100}%</span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={150}
                        value={activeSlide.image.contrast || 100}
                        onChange={(e) => handleImageChange("contrast", parseInt(e.target.value))}
                        className="w-full accent-violet-600"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs py-4">Este slide não possui imagem de plano de fundo selecionada. Clique no botão acima para adicionar uma do banco de imagens.</div>
                )}

              </div>
            )}

            {/* TAB TEMPLATES SWITCHER */}
            {activeTab === "template" && activeSlide && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trocar Template do Slide</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {MOCK_TEMPLATES.map((t) => {
                    const isSelected = activeSlide.template === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => updateSlide(activeSlide.id, { template: t.id })}
                        className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                          isSelected 
                            ? "border-violet-600 bg-violet-50/10 font-semibold text-violet-700 shadow-xs" 
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-xs text-slate-800">{t.name}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">{t.category}</p>
                        </div>
                        {isSelected && <Check size={14} className="text-violet-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}
