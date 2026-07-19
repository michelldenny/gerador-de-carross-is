"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBrandsStore, useUiStore } from "@/stores";
import { brandSchema } from "@/schemas";
import { Brand } from "@/types";
import {
  Plus,
  Sparkles,
  Trash2,
  Instagram,
  Globe,
} from "lucide-react";

export default function BrandsPage() {
  const { brands, addBrand, deleteBrand } = useBrandsStore();
  const { addNotification } = useUiStore();
  const [isAdding, setIsAdding] = useState(false);

  // Schema resolver via React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Brand>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      primaryColor: "#7c3aed",
      secondaryColor: "#1e293b",
      accentColor: "#059669",
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      fontFamily: "Inter",
      defaultCta: "Confira no link da bio!",
    },
  });
  const onSubmitForm = async (data: Brand) => {
    try {
      const newBrand = await addBrand({
        name: data.name,
        logoUrl: data.logoUrl || undefined,
        logoText: data.logoText || data.name.slice(0, 8),
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        fontFamily: data.fontFamily,
        secondaryFontFamily: data.secondaryFontFamily || undefined,
        instagramHandle: data.instagramHandle || "",
        website: data.website || undefined,
        phone: data.phone || undefined,
        defaultCta: data.defaultCta || "",
      });
      setIsAdding(false);
      reset();
      addNotification(
        "Marca cadastrada",
        `A identidade visual de '${newBrand.name}' está disponível.`,
        "success"
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar marca";
      addNotification("Erro ao cadastrar", message, "warning");
    }
  };
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Marcas</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure paletas de cores, logos e arrobas do Instagram para aplicar automaticamente nos slides.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm shadow-violet-600/10 active:scale-95"
          >
            <Plus size={14} />
            <span>Cadastrar Nova Marca</span>
          </button>
        )}
      </div>

      {/* Brand Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 max-w-2xl animate-fade-in"
        >
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-violet-600" />
              Configurar Nova Marca
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nome da Marca *</label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. Dental Clinic HQ"
              />
              {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Texto do Logo (opcional)</label>
              <input
                type="text"
                {...register("logoText")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. DentalHQ"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Instagram Handle *</label>
              <input
                type="text"
                {...register("instagramHandle")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. @dentalclinichq"
              />
              {errors.instagramHandle && (
                <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.instagramHandle.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Website (opcional)</label>
              <input
                type="text"
                {...register("website")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. www.dentalclinichq.com"
              />
            </div>
          </div>

          {/* Color palette selections */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Paleta de Cores da Identidade</h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Primária</span>
                <div className="flex gap-2 items-center">
                  <input type="color" {...register("primaryColor")} className="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Secundária</span>
                <div className="flex gap-2 items-center">
                  <input type="color" {...register("secondaryColor")} className="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Destaque</span>
                <div className="flex gap-2 items-center">
                  <input type="color" {...register("accentColor")} className="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Fundo</span>
                <div className="flex gap-2 items-center">
                  <input type="color" {...register("backgroundColor")} className="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500">Texto</span>
                <div className="flex gap-2 items-center">
                  <input type="color" {...register("textColor")} className="w-8 h-8 rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CTA Padrão *</label>
            <input
              type="text"
              {...register("defaultCta")}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 font-semibold"
              placeholder="Ex. Agende uma consulta preventiva pelo link na bio!"
            />
            {errors.defaultCta && <p className="text-rose-500 text-[10px] font-bold mt-1">{errors.defaultCta.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow shadow-violet-600/10 active:scale-98"
          >
            Cadastrar Identidade de Marca
          </button>
        </form>
      )}

      {/* Brands list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div key={b.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-slate-800">{b.name}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{b.projectCount} projetos vinculados</span>
              </div>
              <button
                onClick={() => {
                  if (confirm(`Deseja realmente excluir a marca '${b.name}'?`)) {
                    deleteBrand(b.id);
                    addNotification("Marca excluída", `Identidade visual de '${b.name}' foi removida.`, "info");
                  }
                }}
                className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                title="Excluir Marca"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Colors Preview */}
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.primaryColor }} title="Primária" />
              <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.secondaryColor }} title="Secundária" />
              <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.accentColor }} title="Destaque" />
              <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.backgroundColor }} title="Fundo" />
              <div className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: b.textColor }} title="Texto" />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Instagram size={14} className="text-slate-400" />
                <span>{b.instagramHandle}</span>
              </div>
              {b.website && (
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-slate-400" />
                  <span>{b.website}</span>
                </div>
              )}
            </div>

            {/* Card Footer CTA banner */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">CTA Padrão</p>
              <p className="text-[10px] text-slate-700 font-bold mt-1 italic">{`"${b.defaultCta}"`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
