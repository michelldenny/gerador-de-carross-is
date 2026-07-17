"use client";

import React from "react";
import { MOCK_TEMPLATES } from "@/mocks";
import { Layers } from "lucide-react";

export default function TemplatesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Biblioteca de Templates</h2>
        <p className="text-xs text-slate-500 mt-1">
          Explore os modelos visuais controlados desenvolvidos para garantir máxima legibilidade e engajamento no Instagram.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-violet-500 bg-violet-50 px-2 py-0.5 rounded">
                  {t.category}
                </span>
                {t.premium && (
                  <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                    Premium
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-800">{t.name}</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* Thumbnail simulator */}
            <div className="px-6 pb-6 pt-2">
              <div className="h-32 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 flex-col gap-1.5 p-4">
                <Layers size={20} className="opacity-50" />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Visualizar Design</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
