"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProjectsStore, useBrandsStore, useUiStore, useCreditsStore } from "@/stores";
import { SlideCanvas } from "@/components/slides/slide-canvas";
import { SlideRenderer } from "@/components/slides/slide-renderer";
import {
  Plus,
  FolderHeart,
  Layers,
  Share2,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Eye,
  ExternalLink,
  BookOpen,
  ShoppingBag,
  Megaphone,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { projects, duplicateProject, deleteProject } = useProjectsStore();
  const { brands } = useBrandsStore();
  const { addNotification } = useUiStore();
  const { credits } = useCreditsStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Primeiros 3 projetos como "Recentes"
  const recentProjects = projects.slice(0, 3);

  // Estatísticas
  const totalProjects = projects.length;
  const totalSlides = projects.reduce((acc, p) => acc + p.slides.length, 0);
  const totalExports = projects.filter((p) => p.status === "published").length;

  const handleCreateCardClick = (goal: string, tone: string, theme: string) => {
    addNotification(
      "Configuração Rápida",
      `Iniciando setup rápido de carrossel com objetivo de '${goal}'.`,
      "info"
    );
    router.push(`/projects/new?goal=${goal}&tone=${tone}&theme=${encodeURIComponent(theme)}`);
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "Marca Própria";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Bem-vindo de volta, Alex! 👋
          </h2>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed font-semibold">
            Seu assistente criativo está pronto. A estimativa simulada de alcance das suas publicações subiu
            <span className="text-emerald-600 font-bold"> +12.4%</span> esta semana baseada no histórico local.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md shadow-violet-600/10 active:scale-95 text-center"
        >
          <Plus size={16} />
          <span>Criar Novo Carrossel</span>
        </Link>
      </section>

      {/* Stats Section with Demo Badge */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Resumo da Conta</h3>
        <span className="text-[8px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full border border-slate-200">
          Dados de Demonstração
        </span>
      </div>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100 shrink-0">
            <FolderHeart size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Projetos</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{totalProjects}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slides Criados</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{totalSlides}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
            <Share2 size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Publicados / Exportados</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{totalExports}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Créditos de IA</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5">{credits}</p>
          </div>
        </div>
      </section>

      {/* Quick Ideas Grid */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">O que deseja criar hoje?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => handleCreateCardClick("educar", "profissional", "5 Regras de Ouro de UI/UX")}
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all">
              <BookOpen size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-violet-600 transition-colors">Educativo / Tutorial</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Ideal para checklists, guias passo a passo ou dicas rápidas de negócios.</p>
            </div>
          </div>

          <div
            onClick={() => handleCreateCardClick("vender", "persuasivo", "Oferta Exclusiva Imperdível")}
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center transition-all">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-violet-600 transition-colors">Oferta / Lançamento</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Estruturas focadas em venda, quebra de objeções e chamadas para ação (CTA).</p>
            </div>
          </div>

          <div
            onClick={() => handleCreateCardClick("autoridade", "inspirador", "Como Venci o Medo de Falhar")}
            className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all">
              <Megaphone size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-800 group-hover:text-violet-600 transition-colors">Branding / Autoridade</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Opiniões de especialistas, histórias de sucesso e conceitos inspiradores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">Projetos Recentes</h3>
          <Link
            href="/projects"
            className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline flex items-center gap-1 transition-colors"
          >
            Ver todos <ExternalLink size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm relative group"
            >
              <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <div className="scale-[0.24] origin-center rotate-2 opacity-95 transition-all duration-300 group-hover:scale-[0.26] group-hover:rotate-0 flex items-center justify-center shrink-0">
                  {p.slides && p.slides.length > 0 ? (
                    <SlideCanvas
                      width={1080}
                      height={p.format === "story" ? 1920 : p.format === "square" ? 1080 : 1350}
                      scale={1.0}
                      mode="thumbnail"
                    >
                      <SlideRenderer
                        slide={p.slides[0]}
                        brand={brands.find((b) => b.id === p.brandId) || brands[0]}
                        mode="thumbnail"
                      />
                    </SlideCanvas>
                  ) : (
                    <div className="w-[1080px] h-[1350px] bg-slate-900 text-white rounded-[40px] shadow-2xl p-16 flex flex-col justify-between">
                      <div className="text-5xl font-black leading-tight">{p.title}</div>
                    </div>
                  )}
                </div>

                {/* Badge do Status */}
                <span
                  className={`absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
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
                    ? "Gerado pela IA"
                    : "Rascunho"}
                </span>

                {/* Opções de Ação Rápidas no Hover */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all z-20 flex items-center justify-center gap-3">
                  <Link
                    href={`/projects/${p.id}/editor`}
                    className="p-3 bg-white hover:bg-violet-600 hover:text-white rounded-xl text-slate-700 transition-all shadow shadow-black/10 hover:scale-105 active:scale-95"
                    title="Editar Carrossel"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <Link
                    href={`/projects/${p.id}/preview`}
                    className="p-3 bg-white hover:bg-violet-600 hover:text-white rounded-xl text-slate-700 transition-all shadow shadow-black/10 hover:scale-105 active:scale-95"
                    title="Preview do Post"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>

              {/* Detalhes do rodapé */}
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
                    <div className="absolute right-0 bottom-full mb-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
                      <button
                        onClick={() => {
                          duplicateProject(p.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy size={12} /> Duplicar
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja realmente excluir o projeto '${p.title}'?`)) {
                            deleteProject(p.id);
                          }
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
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
      </section>
    </div>
  );
}
