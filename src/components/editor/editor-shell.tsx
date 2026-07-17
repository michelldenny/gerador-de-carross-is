"use client";

import React, { useEffect, useRef } from "react";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
import { useAutosave } from "@/hooks/use-autosave";
import { EditorHeader } from "./editor-header";
import { SlidesSidebar } from "./slides-sidebar";
import { CanvasWorkspace } from "./canvas-workspace";
import { PropertiesPanel } from "./properties-panel";
import { EditorModals } from "./editor-modals";

interface EditorShellProps {
  projectId: string;
}

export function EditorShell({ projectId }: EditorShellProps) {
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

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      <EditorHeader projectId={projectId} />

      <div className="flex-1 flex overflow-hidden">
        <SlidesSidebar projectId={projectId} />
        <CanvasWorkspace projectId={projectId} />
        <PropertiesPanel projectId={projectId} />
      </div>

      <EditorModals projectId={projectId} />
    </div>
  );
}
