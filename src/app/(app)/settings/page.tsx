"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useUiStore } from "@/stores";
import { User, Shield, CreditCard, Bell } from "lucide-react";

export default function SettingsPage() {
  const { addNotification } = useUiStore();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "Alex Rivera",
      email: "alex.rivera@design.co",
      autosave: true,
      notifications: true,
    },
  });

  const onSubmit = (data: any) => {
    addNotification("Configurações salvas", "Suas preferências foram atualizadas com sucesso.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Configurações</h2>
        <p className="text-xs text-slate-500 mt-1">Gerencie sua conta, planos, créditos e preferências de sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left tabs menu */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-1 h-fit">
          <button className="w-full flex items-center gap-3 p-3 rounded-xl font-bold text-xs bg-violet-50 text-violet-700 shadow-sm">
            <User size={16} /> Perfil do Usuário
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Shield size={16} /> Segurança
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CreditCard size={16} /> Faturamento & Plano
          </button>
        </div>

        {/* Right content panel */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">Editar Perfil</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome Completo</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Endereço de E-mail</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-not-allowed"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Preferências do Sistema</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register("autosave")} className="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  Salvar rascunhos automaticamente na nuvem (Autosave)
                </label>
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register("notifications")} className="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                  Receber alertas de exportação finalizada por e-mail
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow active:scale-98"
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
