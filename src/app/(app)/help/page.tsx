"use client";

import React from "react";
import { HelpCircle, FileText, Video, MessageSquare } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "O que são os créditos e como eles são consumidos?",
      a: "Os créditos são usados para gerar conteúdo baseado em Inteligência Artificial. Cada carrossel completo gerado consome 10 créditos. A edição manual dos templates é totalmente gratuita e ilimitada.",
    },
    {
      q: "Como funciona o editor controlado por templates?",
      a: "Diferente de editores livres como o Canva, o CarouselPro trabalha com estruturas controladas para assegurar a consistência visual, proporções de área segura do Instagram e evitar corte acidental de textos em resoluções reais de exportação.",
    },
    {
      q: "Como exportar meus carrosséis criados?",
      a: "Após finalizar a edição no painel, clique no botão 'Exportar' localizado no cabeçalho do Editor. Você poderá selecionar formatos como ZIP (contendo imagens individuais de alta resolução PNG/JPG) ou PDF para apresentação rápida.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight font-sans">Central de Ajuda</h2>
        <p className="text-xs text-slate-500 mt-1">Dúvidas frequentes, guias em vídeo e suporte ao cliente.</p>
      </div>

      {/* Support cards shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 border border-violet-100 shrink-0">
            <FileText size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">Manuais Escritos</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Guias detalhados de uso.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
            <Video size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">Tutoriais em Vídeo</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Aprenda na prática em 2 min.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100 shrink-0">
            <MessageSquare size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">Suporte Humano</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Fale com um especialista.</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">Perguntas Frequentes (FAQ)</h3>
        <div className="divide-y divide-slate-100 space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`pt-4 ${idx === 0 ? "pt-0" : ""}`}>
              <h4 className="font-bold text-xs text-slate-800">{faq.q}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
