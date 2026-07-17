import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center antialiased font-sans">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md max-w-sm w-full space-y-6">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-black text-slate-800">Página Não Encontrada</h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            O endereço que você tentou acessar não existe ou foi removido permanentemente.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow shadow-violet-600/10 inline-block"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
