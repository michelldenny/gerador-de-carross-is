import React, { useState } from "react";
import { useStore } from "../store";
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";

export default function ProjectsView() {
  const { 
    projects, 
    brands, 
    setView, 
    duplicateProject, 
    deleteProject 
  } = useStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "generated" | "published" | "archived">("all");
  const [sortBy, setSortBy] = useState<"updated" | "title" | "slides">("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || "Marca Própria";
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.theme.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? p.status !== "archived" : p.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "slides") {
      return b.slides.length - a.slides.length;
    }
    // Default: "updated" - just maintain chronological listing for mockup purposes
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Meus Projetos</h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie, edite e acompanhe o engajamento de seus carrosséis profissionais.</p>
        </div>
        <button 
          onClick={() => setView("new-project")}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm shadow-violet-600/10"
        >
          <Plus size={14} />
          <span>Criar Carrossel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Left: Search bar */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título ou tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs transition-all outline-none text-slate-700"
          />
        </div>

        {/* Center: Tabs filters */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {(["all", "draft", "generated", "published"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === status
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {status === "all" ? "Todos" : status === "draft" ? "Rascunhos" : status === "generated" ? "Gerados" : "Publicados"}
            </button>
          ))}
        </div>

        {/* Right: Sort and View mode */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-slate-700 font-semibold focus:ring-0 cursor-pointer outline-none text-xs"
            >
              <option value="updated">Mais Recentes</option>
              <option value="title">Ordem Alfabética</option>
              <option value="slides">Nº de Slides</option>
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Toggle between Grid / List */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white text-violet-600 shadow-xs" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white text-violet-600 shadow-xs" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display Content */}
      {sortedProjects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Nenhum projeto encontrado</h4>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Nenhum projeto corresponde à pesquisa ou filtro selecionado. Tente alterar o termo ou crie um novo.
          </p>
          <button 
            onClick={() => setView("new-project")}
            className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={14} /> Criar Novo Carrossel
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProjects.map((p) => {
            const coverSlide = p.slides[0];
            const coverAccent = coverSlide?.styles?.accentColor || "#7c3aed";
            const coverTextColor = coverSlide?.styles?.textColor || "#1e293b";

            return (
              <div 
                key={p.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200 group relative"
              >
                {/* Slide Thumbnail Preview */}
                <div className="aspect-[4/5] bg-slate-50 relative border-b border-slate-100 flex flex-col justify-between p-6 select-none overflow-hidden">
                  {coverSlide?.image?.url ? (
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={coverSlide.image.url} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt="Preview"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                  ) : null}

                  {/* Top line of preview card */}
                  <div className="relative z-10 flex flex-col gap-1">
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
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-sm border border-white/20">
                      Slide 1/{p.slides.length}
                    </span>
                  </div>

                  {/* Badges in preview card */}
                  <div className="absolute top-4 right-4 z-20 flex gap-1">
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-md bg-white text-slate-800 shadow-sm border border-slate-100 uppercase">
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

                {/* Footer and dropdown */}
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <h5 className="font-semibold text-slate-800 text-xs truncate">{p.title}</h5>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <span>{p.slides.length} slides</span>
                      <span>•</span>
                      <span>{p.updatedAt}</span>
                    </div>
                  </div>

                  {/* Actions Dropdown toggle */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenuId === p.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
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
      ) : (
        /* List representation of projects */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {sortedProjects.map((p) => (
            <div 
              key={p.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
              onClick={() => setView("editor", p.id)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden">
                  {p.slides[0]?.image?.url ? (
                    <img src={p.slides[0].image.url} className="w-full h-full object-cover" alt="Thumbnail" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">1/{p.slides.length}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-slate-800 text-xs truncate">{p.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>{getBrandName(p.brandId)}</span>
                    <span>•</span>
                    <span>{p.slides.length} slides</span>
                    <span>•</span>
                    <span>{p.updatedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  {p.format}
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                  p.status === "generated" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                }`}>
                  {p.status === "generated" ? "Gerado" : "Rascunho"}
                </span>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setView("editor", p.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
