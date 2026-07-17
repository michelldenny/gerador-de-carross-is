"use client";

import React, { useEffect, useRef } from "react";
import { useProjectsStore, useEditorStore, useUiStore } from "@/stores";
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
    selectedElementId,
    setSelectedElementId,
    zoom,
    setZoom,
    autosaveStatus,
    setAutosaveStatus,
    undo,
    redo,
    pushHistory,
  } = useEditorStore();

  const { addNotification } = useUiStore();

  const project = projects.find((p) => p.id === projectId);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  // Referências estáveis para atalhos de teclado (evita reinicializar event listener)
  const projectRef = useRef(project);
  const activeSlideIdRef = useRef(activeSlideId);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    projectRef.current = project;
    activeSlideIdRef.current = activeSlideId;
    zoomRef.current = zoom;
  });

  // 1. AUTOSAVE DEBOUNCE EFFECT
  useEffect(() => {
    if (!project || !hasHydrated) return;

    // Se for renderização de montagem/hidratação inicial, ignoramos
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (autosaveStatus === "saved") {
      setAutosaveStatus("unsaved");
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setAutosaveStatus("saving");
      setTimeout(() => {
        setAutosaveStatus("saved");
      }, 800);
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [project?.slides, project?.title, project?.caption, hasHydrated]);

  // 2. KEYBOARD SHORTCUTS (Estável, registrado apenas uma vez)
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
          const res = redo(currentState);
          if (res.success) updateProject(projectId, JSON.parse(res.restoredState));
        } else {
          const currentState = JSON.stringify(currentProject);
          const res = undo(currentState);
          if (res.success) updateProject(projectId, JSON.parse(res.restoredState));
        }
      }
      // Save manual
      else if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setAutosaveStatus("saving");
        setTimeout(() => {
          setAutosaveStatus("saved");
          addNotification("Salvo Manualmente", "Projeto salvo no armazenamento local.", "success");
        }, 500);
      }
      // Escape selection
      else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedElementId(null);
      }
      // Zoom
      else if (e.key === "+" || (isCtrl && e.key === "=")) {
        e.preventDefault();
        setZoom(Math.min(150, currentZoom + 10));
      } else if (e.key === "-" || (isCtrl && e.key === "-")) {
        e.preventDefault();
        setZoom(Math.max(50, currentZoom - 10));
      }
      // Navegação por setas
      else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = currentProject.slides.findIndex((s) => s.id === currentActiveSlideId);
        if (e.key === "ArrowUp" && currentIndex > 0) {
          setActiveSlideId(currentProject.slides[currentIndex - 1].id);
        } else if (e.key === "ArrowDown" && currentIndex < currentProject.slides.length - 1) {
          setActiveSlideId(currentProject.slides[currentIndex + 1].id);
        }
      }
      // Exclusão de slide por atalho (Delete ou Backspace)
      else if (e.key === "Delete" || e.key === "Backspace") {
        if (currentActiveSlideId && currentProject.slides.length > 1) {
          e.preventDefault();
          if (confirm("Deseja realmente excluir o slide ativo?")) {
            pushHistory(JSON.stringify(currentProject));
            deleteSlide(projectId, currentActiveSlideId);
            
            const remaining = currentProject.slides.filter((s) => s.id !== currentActiveSlideId);
            setActiveSlideId(remaining[0]?.id || null);
            addNotification("Slide excluído", "Slide removido através do atalho de teclado.", "info");
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
