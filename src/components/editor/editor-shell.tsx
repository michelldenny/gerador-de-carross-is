"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import { useAutosave } from "@/hooks/use-autosave";
import { EditorHeader } from "./editor-header";
import { SlidesSidebar } from "./slides-sidebar";
import { CanvasWorkspace } from "./canvas-workspace";
import { PropertiesPanel } from "./properties-panel";
import { EditorModals } from "./editor-modals";
import { X, Layers, Palette } from "lucide-react";

interface EditorShellProps {
  projectId: string;
}

export function EditorShell({ projectId }: EditorShellProps) {
  const router = useRouter();
  const { projects, updateProject, deleteSlide, hasHydrated } = useProjectsStore();
  const {
    activeSlideId,
    setActiveSlideId,
    setSelectedElementId,
    zoom,
    setZoom,
    setAutosaveStatus,
    undo,
    redo,
    pushHistory,
  } = useEditorStore();

  const { addNotification } = useUiStore();

  const project = projects.find((p) => p.id === projectId);
  const isFirstRender = useRef(true);

  // Estados responsivos para mobile/tablet
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  // Instanciar o hook de Autosave dedicado
  const { saveStatus, markDirty, saveNow } = useAutosave({
    onSave: () => {
      // Opcional: Aqui poderíamos disparar gravação remota na API
    },
  });

  // Sincronizar o status do hook local com o Zustand (Header consome do Zustand)
  useEffect(() => {
    setAutosaveStatus(saveStatus);
  }, [saveStatus, setAutosaveStatus]);

  // Referências estáveis para variáveis de estado
  const projectRef = useRef(project);
  const activeSlideIdRef = useRef(activeSlideId);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    projectRef.current = project;
    activeSlideIdRef.current = activeSlideId;
    zoomRef.current = zoom;
  });

  // Referências estáveis para actions e callbacks da store (previne closures obsoletas)
  const actionsRef = useRef({
    undo,
    redo,
    updateProject,
    deleteSlide,
    pushHistory,
    setActiveSlideId,
    setSelectedElementId,
    setZoom,
    addNotification,
    saveNow,
  });

  useEffect(() => {
    actionsRef.current = {
      undo,
      redo,
      updateProject,
      deleteSlide,
      pushHistory,
      setActiveSlideId,
      setSelectedElementId,
      setZoom,
      addNotification,
      saveNow,
    };
  });

  // 1. AUTOSAVE TRIGGER EFFECT
  useEffect(() => {
    if (!project || !hasHydrated) return;

    // Se for renderização de montagem/hidratação inicial, ignoramos
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    markDirty();
  }, [project?.slides, project?.title, project?.caption, hasHydrated, markDirty, project]);

  // 2. KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      if (isTyping) {
        if (e.key === "Escape") {
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      const currentProject = projectRef.current;
      const currentActiveSlideId = activeSlideIdRef.current;
      const currentZoom = zoomRef.current;

      if (!currentProject) return;

      const isCtrl = e.ctrlKey || e.metaKey;

      // Undo & Redo
      if (isCtrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          const currentState = JSON.stringify(currentProject);
          const res = actionsRef.current.redo(currentState);
          if (res.success) actionsRef.current.updateProject(projectId, JSON.parse(res.restoredState));
        } else {
          const currentState = JSON.stringify(currentProject);
          const res = actionsRef.current.undo(currentState);
          if (res.success) actionsRef.current.updateProject(projectId, JSON.parse(res.restoredState));
        }
      }
      // Save manual
      else if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        actionsRef.current.saveNow();
        actionsRef.current.addNotification("Salvo Manualmente", "Projeto salvo no armazenamento local.", "success");
      }
      // Escape selection
      else if (e.key === "Escape") {
        e.preventDefault();
        actionsRef.current.setSelectedElementId(null);
      }
      // Zoom
      else if (e.key === "+" || (isCtrl && e.key === "=")) {
        e.preventDefault();
        actionsRef.current.setZoom(Math.min(150, currentZoom + 10));
      } else if (e.key === "-" || (isCtrl && e.key === "-")) {
        e.preventDefault();
        actionsRef.current.setZoom(Math.max(50, currentZoom - 10));
      }
      // Navegação por setas
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = currentProject.slides.findIndex((s) => s.id === currentActiveSlideId);
        if (e.key === "ArrowUp" && currentIndex > 0) {
          actionsRef.current.setActiveSlideId(currentProject.slides[currentIndex - 1].id);
        } else if (e.key === "ArrowDown" && currentIndex < currentProject.slides.length - 1) {
          actionsRef.current.setActiveSlideId(currentProject.slides[currentIndex + 1].id);
        }
      }
      // Exclusão de slide por atalho (Delete ou Backspace)
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (currentActiveSlideId && currentProject.slides.length > 1) {
          e.preventDefault();
          if (confirm("Deseja realmente excluir o slide ativo?")) {
            actionsRef.current.pushHistory(JSON.stringify(currentProject));
            actionsRef.current.deleteSlide(projectId, currentActiveSlideId);
            
            const remaining = currentProject.slides.filter((s) => s.id !== currentActiveSlideId);
            actionsRef.current.setActiveSlideId(remaining[0]?.id || null);
            actionsRef.current.addNotification("Slide excluído", "Slide removido através do atalho de teclado.", "info");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [projectId]);

  if (!hasHydrated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500 font-sans gap-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider">Carregando editor visual...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 font-sans p-6 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shrink-0">
          <X size={24} />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-sm text-slate-800">Projeto Não Encontrado</h3>
          <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
            O carrossel especificado não pôde ser localizado ou foi excluído permanentemente do seu histórico.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow active:scale-95 mt-2"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden select-none relative">
      <EditorHeader projectId={projectId} />

      {/* Botões de controle flutuantes de painéis no mobile/tablet */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-5 py-3 rounded-full border border-slate-200 shadow-xl flex items-center gap-6">
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            setPropertiesOpen(false);
          }}
          className={`flex flex-col items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
            sidebarOpen ? "text-violet-600" : "text-slate-500"
          }`}
        >
          <Layers size={18} />
          <span>Slides</span>
        </button>
        <div className="w-px h-6 bg-slate-200" />
        <button
          onClick={() => {
            setPropertiesOpen(!propertiesOpen);
            setSidebarOpen(false);
          }}
          className={`flex flex-col items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
            propertiesOpen ? "text-violet-600" : "text-slate-500"
          }`}
        >
          <Palette size={18} />
          <span>Propriedades</span>
        </button>
      </div>

      {/* Overlay de fechar drawers */}
      {(sidebarOpen || propertiesOpen) && (
        <div
          onClick={() => {
            setSidebarOpen(false);
            setPropertiesOpen(false);
          }}
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs z-35 md:hidden"
        />
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar com classes responsivas em Drawer */}
        <div
          className={`fixed md:relative top-16 md:top-0 bottom-0 md:bottom-auto left-0 z-40 transition-transform duration-300 md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <SlidesSidebar projectId={projectId} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <CanvasWorkspace projectId={projectId} />
        </div>

        {/* PropertiesPanel com classes responsivas em Drawer */}
        <div
          className={`fixed md:relative top-16 md:top-0 bottom-0 md:bottom-auto right-0 z-40 transition-transform duration-300 md:translate-x-0 ${
            propertiesOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
        >
          <PropertiesPanel projectId={projectId} />
        </div>
      </div>

      <EditorModals projectId={projectId} />
    </div>
  );
}
