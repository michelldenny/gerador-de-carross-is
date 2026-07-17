import React, { useState } from "react";
import { useStore } from "../store";
import { 
  User, 
  CreditCard, 
  Instagram, 
  HelpCircle, 
  Coins, 
  Sparkles, 
  BellRing, 
  ShieldCheck,
  Check
} from "lucide-react";

export default function SettingsView() {
  const { credits, addNotification } = useStore();
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyGenerations, setNotifyGenerations] = useState(true);
  const [autoSaveOn, setAutoSaveOn] = useState(true);

  const handleBuyCredits = () => {
    addNotification("Créditos Adquiridos", "Sua transação mockada de recarga de créditos foi efetuada! +100 créditos.", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Configurações da Conta</h2>
        <p className="text-xs text-slate-500 mt-1">Gerencie suas preferências de workspace, faturamento e integrações com redes sociais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Category Links */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1 h-fit">
          <button className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold bg-violet-50 text-violet-700 text-left">
            <User size={16} />
            <span>Perfil & Organização</span>
          </button>
          <button className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left">
            <CreditCard size={16} />
            <span>Planos & Faturamento</span>
          </button>
          <button className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left">
            <Instagram size={16} />
            <span>Integrações</span>
          </button>
          <button className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 text-left">
            <BellRing size={16} />
            <span>Notificações</span>
          </button>
        </div>

        {/* Right Side: Configuration panels */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Panel 1: User profile mock */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <User size={16} className="text-violet-600" />
                Dados do Usuário
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">Nome Completo</label>
                <input type="text" value="Alex Rivera" readOnly className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none text-slate-600" />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-500">E-mail de Trabalho</label>
                <input type="text" value="alex@rivera.design" readOnly className="w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 outline-none text-slate-600" />
              </div>
            </div>
          </div>

          {/* Panel 2: Billing and current plan */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <CreditCard size={16} className="text-violet-600" />
                Plano de Assinatura
              </h3>
              <span className="text-[9px] font-bold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full border border-violet-200">
                PRO ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Créditos Atuais</p>
                <div className="flex items-center gap-2">
                  <Coins size={18} className="text-amber-500" />
                  <span className="text-xl font-bold text-slate-800">{credits}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">disponíveis</span>
                </div>
                <button
                  type="button"
                  onClick={handleBuyCredits}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors mt-2"
                >
                  Recarregar +100 créditos (R$ 19,90)
                </button>
              </div>

              <div className="p-4 bg-violet-950 text-white rounded-xl space-y-2 relative overflow-hidden">
                <Sparkles size={16} className="text-violet-300 absolute top-4 right-4" />
                <p className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">Upgrade do Plano</p>
                <p className="font-bold text-xs">Acesso à Agência Ilimitada</p>
                <p className="text-[9px] text-violet-200 leading-relaxed">Gere imagens ilimitadas, relatórios de engajamento automático e agendamento direto de posts.</p>
                <button className="w-full py-1.5 bg-white text-violet-950 font-bold text-[10px] uppercase tracking-wider rounded-lg hover:bg-slate-100 transition-colors mt-2">
                  Ver planos premium
                </button>
              </div>
            </div>
          </div>

          {/* Panel 3: Notifications preference toggle switches */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <BellRing size={16} className="text-violet-600" />
                Preferências de Workspace
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700">Salvamento Automático em Tempo Real</p>
                  <p className="text-[10px] text-slate-400">Guarda suas alterações locais a cada modificação nos slides.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSaveOn}
                  onChange={(e) => setAutoSaveOn(e.target.checked)}
                  className="w-8 h-4 bg-slate-200 checked:bg-violet-600 rounded-full appearance-none relative cursor-pointer outline-none before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-4 border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700">Notificações por E-mail</p>
                  <p className="text-[10px] text-slate-400">Receba resumos semanais de engajamento de seus carrosséis publicados.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-8 h-4 bg-slate-200 checked:bg-violet-600 rounded-full appearance-none relative cursor-pointer outline-none before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-4 border border-slate-300"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
