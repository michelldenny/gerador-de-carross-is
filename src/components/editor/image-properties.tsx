"use client";

import React, { useState, useRef } from "react";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import { searchImages } from "@/services/mock-image-service";
import { Image as ImageIcon, Search, UploadCloud, Trash2, Sliders, RefreshCw } from "lucide-react";
import { SlideImage } from "@/types";

type EditableImageProperty = keyof Omit<SlideImage, "id" | "source" | "sourceUrl" | "photographerUrl">;

interface SearchImageResult {
  url: string;
  photographer: string;
}

interface ImagePropertiesProps {
  projectId: string;
}

export function ImageProperties({ projectId }: ImagePropertiesProps) {
  const { projects, updateSlide } = useProjectsStore();
  const { activeSlideId, pushHistory } = useEditorStore();
  const { addNotification } = useUiStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchImageResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const activeSlide = project.slides.find((s) => s.id === activeSlideId) || project.slides[0];
  if (!activeSlide) return null;

  const handleImageChange = (key: EditableImageProperty, value: string | number) => {
    pushHistory(JSON.stringify(project));
    const currentImg = activeSlide.image || {
      url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800",
      alt: "Imagem do slide",
      positionX: 50,
      positionY: 50,
      zoom: 100,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      overlayOpacity: 30,
    };

    updateSlide(projectId, activeSlide.id, {
      image: {
        ...currentImg,
        [key]: value,
      },
    });
  };

  const removeImage = () => {
    pushHistory(JSON.stringify(project));
    
    // Revogar se for blob local
    if (activeSlide.image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(activeSlide.image.url);
    }
    
    updateSlide(projectId, activeSlide.id, { image: undefined });
    addNotification("Imagem removida", "A foto foi retirada deste slide.", "info");
  };

  const triggerSearch = async () => {
    setIsSearching(true);
    const res = await searchImages(searchQuery);
    setSearchResults(res);
    setIsSearching(false);
  };

  const selectSearchImage = (url: string) => {
    handleImageChange("url", url);
    setShowSearchPanel(false);
    addNotification("Imagem atualizada", "Nova foto aplicada com sucesso.", "success");
  };

  const processFile = (file: File) => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      addNotification("Arquivo muito grande", "A imagem deve ter no máximo 5MB.", "warning");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      addNotification("Formato inválido", "Apenas imagens JPG, PNG ou WebP são permitidas.", "warning");
      return;
    }

    if (activeSlide.image?.url.startsWith("blob:")) {
      URL.revokeObjectURL(activeSlide.image.url);
    }

    const objectUrl = URL.createObjectURL(file);
    handleImageChange("url", objectUrl);
    addNotification("Upload realizado", "Sua foto local foi importada.", "success");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const img = activeSlide.image;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Ajuste de Imagem</h3>
        {img && (
          <button
            onClick={removeImage}
            className="text-[10px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 size={12} /> Remover
          </button>
        )}
      </div>

      {!img ? (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 cursor-pointer transition-all ${
              isDraggingOver
                ? "border-violet-500 bg-violet-50/40"
                : "border-slate-200 hover:border-violet-500/30 hover:bg-slate-50/50"
            }`}
          >
            <UploadCloud size={28} className={isDraggingOver ? "text-violet-500" : "text-slate-400"} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {isDraggingOver ? "Solte para importar!" : "Arraste ou clique para enviar"}
            </span>
          </div>

          <button
            onClick={() => setShowSearchPanel(true)}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-98"
          >
            <Search size={14} /> Pesquisar no Banco de Imagens
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Preview miniaturizado */}
          <div className="relative h-28 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
            <img src={img.url} alt="Slide Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setShowSearchPanel(true)}
              className="absolute bottom-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1"
            >
              <Search size={10} /> Trocar foto
            </button>
          </div>

          {/* Control sliders */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Zoom da Imagem</span>
                <span>{img.zoom ?? 100}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="200"
                value={img.zoom ?? 100}
                onChange={(e) => handleImageChange("zoom", Number(e.target.value))}
                className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Posição X</span>
                  <span>{img.positionX ?? 50}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={img.positionX ?? 50}
                  onChange={(e) => handleImageChange("positionX", Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                  <span>Posição Y</span>
                  <span>{img.positionY ?? 50}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={img.positionY ?? 50}
                  onChange={(e) => handleImageChange("positionY", Number(e.target.value))}
                  className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="border-t border-slate-100 pt-3 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Sliders size={12} /> Filtros de Imagem
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Brilho</span>
                    <span>{img.brightness ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={img.brightness ?? 100}
                    onChange={(e) => handleImageChange("brightness", Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Contraste</span>
                    <span>{img.contrast ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={img.contrast ?? 100}
                    onChange={(e) => handleImageChange("contrast", Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>Overlay Opacidade</span>
                    <span>{img.overlayOpacity ?? 30}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={img.overlayOpacity ?? 30}
                    onChange={(e) => handleImageChange("overlayOpacity", Number(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal/Panel de Busca de Imagens */}
      {showSearchPanel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl border border-slate-200/80 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-800">Pesquisar Banco de Imagens</h3>
              <button
                onClick={() => setShowSearchPanel(false)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Fechar
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex. athlete fitness, dentist clinic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
              />
              <button
                onClick={triggerSearch}
                className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 rounded-xl flex items-center gap-1 shadow-sm active:scale-95"
              >
                {isSearching ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                Buscar
              </button>
            </div>

            {/* List of results */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1 custom-scrollbar">
              {searchResults.map((imgRes, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSearchImage(imgRes.url)}
                  className="group relative h-24 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <img src={imgRes.url} alt="Result" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[7px] px-1 py-0.5 rounded backdrop-blur-xs font-medium truncate max-w-[90%] opacity-0 group-hover:opacity-100 transition-opacity">
                    © {imgRes.photographer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
