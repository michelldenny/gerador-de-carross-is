import React, { useState } from "react";
import { useStore } from "../store";
import { Brand } from "../types";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Check, 
  FileText, 
  Instagram, 
  Globe, 
  PhoneCall
} from "lucide-react";

export default function BrandsView() {
  const { brands, addBrand, deleteBrand, updateBrand, addNotification } = useStore();
  const [isAdding, setIsAdding] = useState(false);

  // Form States for brand creation
  const [name, setName] = useState("");
  const [logoText, setLogoText] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [primary, setPrimary] = useState("#7c3aed");
  const [secondary, setSecondary] = useState("#1e293b");
  const [accent, setAccent] = useState("#059669");
  const [cta, setCta] = useState("Confira no link da bio!");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBrand: Brand = {
      id: `brand-${Date.now()}`,
      name,
      logoText: logoText || name.slice(0, 8),
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent,
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      fontFamily: "Inter",
      instagramHandle: instagram.startsWith("@") ? instagram : `@${instagram}`,
      website,
      defaultCta: cta,
      projectCount: 0
    };

    addBrand(newBrand);
    setIsAdding(false);
    
    // reset form
    setName("");
    setLogoText("");
    setInstagram("");
    setWebsite("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Minhas Marcas</h2>
          <p className="text-xs text-slate-500 mt-1">Configure paletas de cores, logos e arrobas do Instagram para aplicar automaticamente nos slides.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm shadow-violet-600/10"
          >
            <Plus size={14} />
            <span>Cadastrar Nova Marca</span>
          </button>
        )}
      </div>

      {/* Brand Creation Form overlay/panel */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 max-w-2xl">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-violet-600" />
              Configurar Nova Marca
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nome da Marca *</label>
              <input
                type="text"
                placeholder="Ex: Dental Clinic HQ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Logo em Texto (Curto)</label>
              <input
                type="text"
                placeholder="Ex: DentalHQ"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Arroba do Instagram</label>
              <input
                type="text"
                placeholder="Ex: @dentalclinichq"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Endereço Web / Link bio</label>
              <input
                type="text"
                placeholder="Ex: www.dentalhq.com.br"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 transition-all"
              />
            </div>

            {/* Colors picker setup */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 bg-transparent"
                />
                <span className="text-xs font-semibold font-mono text-slate-500">{primary}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Cor Secundária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondary}
                  onChange={(e) => setSecondary(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 bg-transparent"
                />
                <span className="text-xs font-semibold font-mono text-slate-500">{secondary}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Cor de Destaque / CTA</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 bg-transparent"
                />
                <span className="text-xs font-semibold font-mono text-slate-500">{accent}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">CTA Padrão</label>
              <input
                type="text"
                placeholder="Ex: Agende no link da bio!"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Confirmar Cadastro
            </button>
          </div>
        </form>
      )}

      {/* Brands listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div 
            key={b.id}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5 flex flex-col justify-between hover:shadow-md transition-all relative group"
          >
            {/* Swatch color row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                  style={{ backgroundColor: b.primaryColor }}
                >
                  {b.logoText ? b.logoText.substring(0, 2).toUpperCase() : b.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{b.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{b.instagramHandle}</p>
                </div>
              </div>

              {/* Action delete button */}
              <button
                onClick={() => {
                  deleteBrand(b.id);
                }}
                className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Excluir marca"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Colors Guide swatches */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Paleta de Cores</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: b.primaryColor }} />
                  <span>Primária</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: b.secondaryColor }} />
                  <span>Secundária</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-lg text-[10px] font-mono text-slate-500 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-200" style={{ backgroundColor: b.accentColor }} />
                  <span>CTA</span>
                </div>
              </div>
            </div>

            {/* General Metadata Info */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                <Instagram size={12} className="text-slate-400" />
                <span>{b.instagramHandle}</span>
              </div>
              {b.website && (
                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                  <Globe size={12} className="text-slate-400" />
                  <span>{b.website}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                <FileText size={12} className="text-slate-400" />
                <span>Default CTA: <strong className="text-slate-700">{b.defaultCta}</strong></span>
              </div>
            </div>

            {/* Highlighted projects count */}
            <div className="bg-violet-50 text-violet-700 text-[10px] font-semibold p-2 rounded-xl text-center">
              Vinculada a {b.projectCount} carrosséis gerados
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
