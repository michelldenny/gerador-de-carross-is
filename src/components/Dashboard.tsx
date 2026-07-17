import React, { useState } from "react";
import { useStore } from "../store";
import { 
  Plus, 
  FolderHeart, 
  Layers, 
  Share2, 
  Coins, 
  FolderOpen, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  Eye, 
  ExternalLink,
  BookOpen,
  ShoppingBag,
  Megaphone,
  Sparkles
} from "lucide-react";

export default function Dashboard() {
  const { 
    projects, 
    brands, 
    setView, 
    duplicateProject, 
    deleteProject, 
    credits,
    addNotification
  } = useStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Take first 3 projects as "Recent Projects"
  const recentProjects = projects.slice(0, 3);

  // Stats calculation
  const totalProjects = projects.length;
  const totalSlides = projects.reduce((acc, p) => acc + p.slides.length, 0);
  const totalExports = projects.filter(p => p.status === "published").length * 3 + 12; // simulated proportional exports

  const handleCreateCardClick = (type: string) => {
    setView("new-project");
    addNotification(
      "Configuração Rápida", 
      `Iniciando setup rápido de carrossel do tipo '${type}'.`, 
      "info"
    );
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : "Marca Própria";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Bem-vindo de volta, Alex! 👋
          </h2>
          <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
            Seu assistente criativo está pronto. O engajamento das suas publicações subiu 
            <span className="text-emerald-600 font-semibold"> +12.4%</span> esta semana. Vamos gerar algo incrível hoje!
          </p>
        </div>
        <button 
          onClick={() => setView("new-project")}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-violet-600/10 active:scale-95"
        >
          <Plus size={16} />
          <span>Criar Novo Carrossel</span>
        </button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
            <FolderHeart size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total de Projetos</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{totalProjects}</p>
          </div>
        </div>

        {/* Slides Generated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Slides Criados</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{totalSlides}</p>
          </div>
        </div>

        {/* Exports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Share2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Downloads/Exports</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{totalExports}</p>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
            <Coins size={20} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Créditos de IA</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{credits}</p>
          </div>
        </div>
      </section>

      {/* Comece Rapidamente */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Comece Rapidamente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Educativo */}
          <div 
            onClick={() => handleCreateCardClick("Educativo")}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-100/80 transition-colors">
              <BookOpen size={20} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors">Carrossel Educativo</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Dicas de ouro, tutoriais de passo a passo e conteúdos estruturados de autoridade.</p>
          </div>

          {/* Promocional */}
          <div 
            onClick={() => handleCreateCardClick("Promocional")}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-100/80 transition-colors">
              <ShoppingBag size={20} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors">Divulgação de Produto</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Foco em recursos, benefícios, ofertas irresistíveis e conversão em vendas de produtos.</p>
          </div>

          {/* Autoridade */}
          <div 
            onClick={() => handleCreateCardClick("Autoridade")}
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-100/80 transition-colors">
              <Megaphone size={20} />
            </div>
            <h4 className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors">Histórias & Storytelling</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Conecte-se com sua audiência de forma intimista, compartilhando conquistas ou bastidores.</p>
          </div>
        </div>
      </section>

      {/* Recent Projects list */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Projetos Recentes
          </h3>
          <button 
            onClick={() => setView("projects")}
            className="text-xs font-semibold text-violet-600 hover:text-violet-800 hover:underline transition-all"
          >
            Ver todos
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-sm text-slate-400 font-medium">Nenhum projeto encontrado. Comece criando seu primeiro carrossel!</p>
            <button 
              onClick={() => setView("new-project")}
              className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center gap-2"
            >
              <Plus size={14} /> Criar Novo Carrossel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((p) => {
              const coverSlide = p.slides[0];
              const coverBg = coverSlide?.styles?.backgroundColor || "#ffffff";
              const coverTextColor = coverSlide?.styles?.textColor || "#1e293b";
              const coverAccent = coverSlide?.styles?.accentColor || "#7c3aed";
              
              return (
                <div 
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200 relative group"
                >
                  {/* Aspect Ratio slide preview container */}
                  <div className="aspect-[4/5] bg-slate-50 relative border-b border-slate-100 flex flex-col justify-between overflow-hidden p-6 select-none">
                    {/* Render slide mock preview internally */}
                    {coverSlide?.image?.url ? (
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={coverSlide.image.url} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          alt="Capa"
                        />
                        <div 
                          className="absolute inset-0 bg-black"
                          style={{ opacity: `${coverSlide.image.overlayOpacity || 30}%` }}
                        />
                      </div>
                    ) : null}

                    {/* Text overlays */}
                    <div className="relative z-10 flex flex-col gap-1.5">
                      <span 
                        className="text-[10px] font-bold tracking-widest uppercase truncate"
                        style={{ color: coverSlide?.image?.url ? "#ffffff" : coverAccent }}
                      >
                        {getBrandName(p.brandId)}
                      </span>
                      <h4 
                        className="text-base font-extrabold tracking-tight leading-tight line-clamp-3"
                        style={{ color: coverSlide?.image?.url ? "#ffffff" : coverTextColor }}
                      >
                        {coverSlide?.title || p.title}
                      </h4>
                    </div>

                    <div className="relative z-10 mt-auto flex justify-between items-end">
                      <p className="text-[10px] text-white/80 italic font-medium">CarouselPro Studio</p>
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-sm border border-white/20"
                      >
                        Slide 1/{p.slides.length}
                      </span>
                    </div>

                    {/* Format Badge */}
                    <div className="absolute top-4 right-4 z-20 flex gap-1">
                      <span className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-white/90 text-slate-800 shadow-sm border border-slate-100 uppercase">
                        {p.format === "story" ? "Story" : p.format === "square" ? "Quadrado" : "Vertical"}
                      </span>
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md shadow-sm border uppercase ${
                        p.status === "generated" 
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                          : p.status === "published"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}>
                        {p.status === "generated" ? "Gerado" : p.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <h5 className="font-semibold text-slate-800 text-xs truncate">{p.title}</h5>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                        <span>{p.slides.length} slides</span>
                        <span>•</span>
                        <span>{p.updatedAt}</span>
                      </div>
                    </div>

                    {/* Quick Edit Action Dropdown toggle */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === p.id ? null : p.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Box */}
                      {activeMenuId === p.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-30" 
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-0 bottom-8 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1 overflow-hidden">
                            <button
                              onClick={() => {
                                setView("editor", p.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit3 size={14} className="text-slate-400" />
                              <span>Editar Projeto</span>
                            </button>
                            <button
                              onClick={() => {
                                duplicateProject(p.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Copy size={14} className="text-slate-400" />
                              <span>Duplicar</span>
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => {
                                deleteProject(p.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 size={14} className="text-rose-400" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Templates horizontal banner list */}
      <section className="space-y-4 pb-12">
        <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
          Templates Recomendados
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="aspect-[4/3] rounded-xl bg-violet-900/10 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Pulse" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">Tech Pulse</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Clean & Modern • Cyberpunk</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="aspect-[4/3] rounded-xl bg-amber-900/10 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Flow" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">Organic Flow</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Serene & Warm • Minimalist</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="aspect-[4/3] rounded-xl bg-rose-900/10 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Velocity" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">Velocity</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Energetic & Bold • High-key</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="aspect-[4/3] rounded-xl bg-blue-900/10 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Executive" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-800">Executive Suite</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Professional & Reliable</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
