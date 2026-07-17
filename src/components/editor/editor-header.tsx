"use client";

import React from "react";
import Link from "next/link";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Eye,
  Share2,
  Download,
  Plus,
  Minus,
} from "lucide-react";

interface EditorHeaderProps {
  projectId: string;
}

export function EditorHeader({ projectId }: EditorHeaderProps) {
  const { projects, updateProject } = useProjectsStore();
  const {
    zoom,
    setZoom,
    autosaveStatus,
    undo,
    redo,
    history,
  } = useEditorStore();

  const {
    setPreviewModal,
    setShareModal,
    setExportModal,
  } = useUiStore();

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const isUndoEnabled = history.undoStack.length > 0;
  const isRedoEnabled = history.redoStack.length > 0;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProject(projectId, { title: e.target.value });
  };

  const handleUndo = () => {
    const currentState = JSON.stringify(project);
    const res = undo(currentState);
    if (res.success) {
      const restored = JSON.parse(res.restoredState);
      updateProject(projectId, restored);
    }
  };

  const handleRedo = () => {
    const currentState = JSON.stringify(project);
    const res = redo(currentState);
    if (res.success) {
      const restored = JSON.parse(res.restoredState);
      updateProject(projectId, restored);
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
      {/* Left controls */}
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          title="Voltar aos Projetos"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex flex-col">
          <input
            type="text"
            value={project.title}
            onChange={handleTitleChange}
            className="font-bold text-xs text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-violet-600 focus:outline-none py-0.5 max-w-[200px] truncate font-sans"
          />
          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                autosaveStatus === "saved" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
              }`}
            />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              {autosaveStatus === "saved" ? "Nuvem Sincronizada" : "Salvando alterações..."}
            </span>
          </div>
        </div>
      </div>

      {/* Center Controls (Undo/Redo & Zoom) */}
      <div className="flex items-center gap-4">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl shadow-inner">
          <button
            onClick={handleUndo}
            disabled={!isUndoEnabled}
            className={`p-2 rounded-lg transition-all ${
              isUndoEnabled
                ? "text-slate-600 hover:bg-white hover:text-slate-800"
                : "text-slate-300 cursor-not-allowed"
            }`}
            title="Desfazer (Ctrl+Z)"
          >
            <Undo2 size={14} />
          </button>
          <button
            onClick={handleRedo}
            disabled={!isRedoEnabled}
            className={`p-2 rounded-lg transition-all ${
              isRedoEnabled
                ? "text-slate-600 hover:bg-white hover:text-slate-800"
                : "text-slate-300 cursor-not-allowed"
            }`}
            title="Refazer (Ctrl+Shift+Z)"
          >
            <Redo2 size={14} />
          </button>
        </div>

        {/* Zoom Workspace */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-700 transition-all"
            title="Diminuir Zoom (-)"
          >
            <Minus size={12} />
          </button>
          <span className="text-[10px] font-black text-slate-600 px-1">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(150, zoom + 10))}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white hover:text-slate-700 transition-all"
            title="Aumentar Zoom (+)"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPreviewModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-[11px] font-bold"
        >
          <Eye size={14} />
          <span>Visualizar</span>
        </button>
        <button
          onClick={() => setShareModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors text-[11px] font-bold"
        >
          <Share2 size={14} />
          <span>Compartilhar</span>
        </button>
        <button
          onClick={() => setExportModal(true)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-lg text-[11px] font-black transition-all shadow-sm active:scale-95"
        >
          <Download size={14} />
          <span>Exportar Carrossel</span>
        </button>
      </div>
    </header>
  );
}
