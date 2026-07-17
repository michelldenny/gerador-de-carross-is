import React, { useState } from "react";
import { MOCK_TEMPLATES } from "../mocks";
import { Search, Sparkles, LayoutGrid, CheckCircle } from "lucide-react";

export default function TemplatesView() {
  const [filter, setFilter] = useState<"all" | "cover" | "content" | "cta">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : t.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Biblioteca de Templates</h2>
        <p className="text-xs text-slate-500 mt-1">Conheça nossa galeria de layouts focados em retenção de público, projetados especificamente para o Instagram.</p>
      </div>

      {/* Search and filter controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar template..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs transition-all outline-none text-slate-700"
          />
        </div>

        {/* Categories switcher tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto">
          {(["all", "cover", "content", "cta"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filter === cat
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {cat === "all" ? "Todos" : cat === "cover" ? "Capas" : cat === "content" ? "Conteúdo" : "CTA / Fechamento"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid gallery display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div 
            key={t.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all duration-200"
          >
            {/* Visual template mock placeholder card */}
            <div className="aspect-[4/5] bg-slate-950 p-6 flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-violet-600/20 blur-2xl" />
              
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[8px] font-bold tracking-widest uppercase text-violet-400 bg-violet-600/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  {t.category.toUpperCase()}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">CarouselPro Visuals</span>
              </div>

              <div className="space-y-2 relative z-10">
                <h4 className="text-sm font-extrabold tracking-tight leading-tight uppercase text-slate-100">{t.name}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Layout otimizado para preterição rápida, perfeito para converter visitantes desatentos em seguidores.</p>
              </div>

              <div className="relative z-10 flex justify-between items-end mt-4">
                <span className="text-[8px] text-slate-500 font-bold uppercase">Pre-styled template</span>
                <span className="text-[9px] font-bold px-2 py-0.5 bg-white/10 text-white rounded-full border border-white/10">Compatible</span>
              </div>
            </div>

            {/* Info panel */}
            <div className="p-4 space-y-1">
              <h5 className="font-bold text-slate-800 text-xs">{t.name}</h5>
              <p className="text-[10px] text-slate-400 leading-relaxed">Design moderno e clean compatível com qualquer formato (vertical, quadrado ou story).</p>
              <div className="pt-3 flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-100 mt-2">
                <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> Conversão Otimizada</span>
                <span className="text-violet-600 uppercase tracking-wide">Pronto para usar</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
