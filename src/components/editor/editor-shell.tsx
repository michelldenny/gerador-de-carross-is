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
  const { projects, updateProject } = useProjectsStore();
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

  // 1. AUTOSAVE DEBOUNCE EFFECT
  // Toda vez que o projeto ou slides mudarem, disparamos a contagem do autosave
  useEffect(() => {
    if (!project) return;

    // Colocar status para não salvo apenas no primeiro digito
    if (autosaveStatus === "saved") {
      setAutosaveStatus("unsaved");
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setAutosaveStatus("saving");
      // Simular gravação no LocalStorage/API
      setTimeout(() => {
        setAutosaveStatus("saved");
      }, 800);
    }, 2000); // 2 segundos de debounce para digitação suave

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [project?.slides, project?.title, project?.caption]);

  // 2. KEYBOARD SHORTCUTS
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar atalhos se o foco estiver em inputs/textareas
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true");

      if (isTyping) {
        // Permitir apenas Escape para fechar foco
        if (e.key === "Escape") {
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      // Atalhos
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          // Redo
          const currentState = JSON.stringify(project);
          const res = redo(currentState);
          if (res.success) updateProject(projectId, JSON.parse(res.restoredState));
        } else {
          // Undo
          const currentState = JSON.stringify(project);
          const res = undo(currentState);
          if (res.success) updateProject(projectId, JSON.parse(res.restoredState));
        }
      } else if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setAutosaveStatus("saving");
        setTimeout(() => {
          setAutosaveStatus("saved");
          addNotification("Salvo Manualmente", "Projeto salvo no armazenamento local.", "success");
        }, 500);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedElementId(null);
      } else if (e.key === "+" || (isCtrl && e.key === "=")) {
        e.preventDefault();
        setZoom(Math.min(150, zoom + 10));
      } else if (e.key === "-" || (isCtrl && e.key === "-")) {
        e.preventDefault();
        setZoom(Math.max(50, zoom - 10));
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        // Navegar entre slides
        e.preventDefault();
        const currentIndex = project.slides.findIndex((s) => s.id === activeSlideId);
        if (e.key === "ArrowUp" && currentIndex > 0) {
          setActiveSlideId(project.slides[currentIndex - 1].id);
        } else if (e.key === "ArrowDown" && currentIndex < project.slides.length - 1) {
          setActiveSlideId(project.slides[currentIndex + 1].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, activeSlideId, zoom]);

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
