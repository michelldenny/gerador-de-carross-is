"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProjectsStore, useBrandsStore } from "@/stores";
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
} from "lucide-react";

export default function ProjectsPage() {
  const { projects, duplicateProject, deleteProject } = useProjectsStore();
  const { brands } = useBrandsStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "generated" | "published" | "archived">("all");
  const [sortBy, setSortBy] = useState<"updated" | "title" | "slides">("updated");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const getBrandName = (brandId: string) => {
    return brands.find((b) => b.id === brandId)?.name || "Marca Própria";
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.theme.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? p.status !== "archived" : p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "slides") {
      return b.slides.length - a.slides.length;
    }
    return 0; // Default ordenação cronológica simples
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Meus Projetos</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gerencie, edite e acompanhe o progresso de seus carrosséis profissionais.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm shadow-violet-600/10 active:scale-95"
        >
          <Plus size={14} />
          <span>Criar Carrossel</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título ou tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs transition-all outline-none text-slate-700 font-semibold"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 w-full md:w-auto overflow-x-auto hide-scrollbar">
          {(["all", "draft", "generated", "published"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                filter === status
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {status === "all"
                ? "Todos"
                : status === "draft"
                ? "Rascunhos"
                : status === "generated"
                ? "Gerados"
                : "Publicados"}
            </button>
          ))}
        </div>

        {/* Sorting and view toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-500">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none font-bold text-slate-600 cursor-pointer"
            >
              <option value="updated">Última atualização</option>
              <option value="title">Título (A-Z)</option>
              <option value="slides">Qtd. de Slides</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md ${
                viewMode === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${
                viewMode === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects List/Grid */}
      {sortedProjects.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
            <Search size={28} />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800">Nenhum projeto encontrado</h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Não encontramos projetos correspondentes aos filtros ativos. Crie um novo para começar.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow shadow-violet-600/10 active:scale-95"
          >
            <Plus size={14} /> Criar Carrossel
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm relative group"
            >
              <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10" />
                <div className="scale-[0.25] rotate-3 opacity-90 transition-all duration-300 group-hover:scale-[0.27] origin-center">
                  <div className="w-[1080px] h-[1350px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-16 flex flex-col justify-between">
                    <div className="text-2xl font-bold uppercase tracking-widest text-violet-400">
                      {getBrandName(p.brandId)}
                    </div>
                    <div className="text-5xl font-black leading-tight max-w-[85%]">{p.title}</div>
                    <div className="text-3xl font-bold opacity-60">Arrasta para o lado ➔</div>
                  </div>
                </div>

                <span
                  className={`absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                    p.status === "published"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : p.status === "generated"
                      ? "bg-violet-100 text-violet-800 border border-violet-200"
                      : "bg-slate-100 text-slate-800 border border-slate-200"
                  }`}
                >
                  {p.status === "published"
                    ? "Publicado"
                    : p.status === "generated"
                    ? "IA Gerado"
                    : "Rascunho"}
                </span>

                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all z-20 flex items-center justify-center gap-3">
                  <Link
                    href={`/projects/${p.id}/editor`}
                    className="p-3 bg-white hover:bg-violet-600 hover:text-white rounded-xl text-slate-700 transition-all shadow hover:scale-105 active:scale-95"
                    title="Editar"
                  >
                    <Edit3 size={18} />
                  </Link>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-slate-100">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{p.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {p.slides.length} slides • {getBrandName(p.brandId)}
                  </p>
                </div>
                <div className="relative shrink-0">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeMenuId === p.id && (
                    <div className="absolute right-0 bottom-full mb-2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
                      <button
                        onClick={() => {
                          duplicateProject(p.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy size={12} /> Duplicar
                      </button>
                      <button
                        onClick={() => {
                          deleteProject(p.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <Trash2 size={12} /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-slate-200">
            {sortedProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="min-w-0 flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 font-extrabold text-sm border border-slate-200">
                    {p.slides.length}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                      {p.theme} • {getBrandName(p.brandId)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                      p.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : p.status === "generated"
                        ? "bg-violet-50 text-violet-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {p.status === "published"
                      ? "Publicado"
                      : p.status === "generated"
                      ? "IA Gerado"
                      : "Rascunho"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${p.id}/editor`}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <Edit3 size={16} />
                    </Link>
                    <button
                      onClick={() => duplicateProject(p.id)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => deleteProject(p.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
