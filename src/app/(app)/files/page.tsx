"use client";

import React, { useState } from "react";
import { FolderSync, Image as ImageIcon, Plus, Trash2, UploadCloud } from "lucide-react";
import { useUiStore } from "@/stores";

export default function FilesPage() {
  const { addNotification } = useUiStore();
  const [files, setFiles] = useState<Array<{ name: string; size: string; url: string }>>([
    { name: "clinica-dental-logo.png", size: "240 KB", url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=150" },
    { name: "atleta-corrida-banner.jpg", size: "1.2 MB", url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=150" },
  ]);

  const handleUploadClick = () => {
    addNotification("Upload Simulado", "O upload de arquivos foi simulado com sucesso.", "success");
    setFiles([
      ...files,
      {
        name: `upload-${Date.now().toString().slice(-4)}.png`,
        size: "180 KB",
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=150",
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gerenciador de Arquivos</h2>
        <p className="text-xs text-slate-500 mt-1">Efetue o upload de logos da marca, banners ou fotos personalizadas para aplicar nos slides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Box card */}
        <div
          onClick={handleUploadClick}
          className="bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-violet-500/40 p-6 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:shadow-sm transition-all h-64"
        >
          <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800">Arraste seus arquivos aqui</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Suporta PNG, JPG, JPEG ou WebP (Máx. 5MB)</p>
          </div>
        </div>

        {/* Existing files list */}
        {files.map((file, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 p-5 flex flex-col justify-between h-64 shadow-sm">
            <div className="flex gap-4">
              <img src={file.url} alt={file.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-800 truncate" title={file.name}>
                  {file.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{file.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <FolderSync size={12} /> Sincronizado
              </span>
              <button
                onClick={() => {
                  setFiles(files.filter((_, i) => i !== idx));
                  addNotification("Arquivo removido", "Arquivo deletado do armazenamento local.", "info");
                }}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
