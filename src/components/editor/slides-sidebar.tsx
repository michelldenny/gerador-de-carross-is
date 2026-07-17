"use client";

import React from "react";
import { useProjectsStore, useEditorStore, useBrandsStore } from "@/stores";
import { Slide, Brand } from "@/types";
import { SlideThumbnail } from "./slide-thumbnail";
import { Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SlidesSidebarProps {
  projectId: string;
}

// Sortable Slide Item Component
function SortableSlideItem({
  slide,
  brand,
  format,
  idx,
  totalSlides,
  isActive,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  slide: Slide;
  brand?: Brand;
  format: "vertical" | "square" | "story";
  idx: number;
  totalSlides: number;
  isActive: boolean;
  onSelect: () => void;
  onMoveUp: (e: React.MouseEvent) => void;
  onMoveDown: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative rounded-2xl p-2.5 cursor-pointer border-2 transition-all select-none ${
        isActive
          ? "border-violet-500 bg-violet-950/20 shadow-md ring-2 ring-violet-500/10"
          : "border-slate-800 bg-slate-950 hover:border-slate-700"
      }`}
    >
      {/* Drag handle area overlay */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute inset-0 bg-transparent pointer-events-auto"
        style={{ cursor: "grab" }}
      />

      <div className="relative pointer-events-none z-10">
        <SlideThumbnail slide={slide} brand={brand} format={format} />
      </div>

      {/* Slide metadata */}
      <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold z-10 relative pointer-events-none">
        <span>#{idx + 1}</span>
        <span>
          {slide.type === "cover" ? "Capa" : slide.type === "cta" ? "CTA" : "Conteúdo"}
        </span>
      </div>

      {/* Manual Accessible Reordering Controls (Only hover or visible on focus) */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        {idx > 0 && (
          <button
            onClick={onMoveUp}
            className="bg-slate-900 border border-slate-700 p-1 rounded-md text-slate-400 hover:text-white"
            title="Mover para Cima"
          >
            <ChevronUp size={10} />
          </button>
        )}
        {idx < totalSlides - 1 && (
          <button
            onClick={onMoveDown}
            className="bg-slate-900 border border-slate-700 p-1 rounded-md text-slate-400 hover:text-white"
            title="Mover para Baixo"
          >
            <ChevronDown size={10} />
          </button>
        )}
        <button
          onClick={onDelete}
          className="bg-rose-950 border border-rose-900 p-1 rounded-md text-rose-300 hover:text-rose-100"
          title="Excluir Slide"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  );
}

export function SlidesSidebar({ projectId }: SlidesSidebarProps) {
  const { projects, reorderSlides, addSlide, deleteSlide, updateProject } = useProjectsStore();
  const { activeSlideId, setActiveSlideId, pushHistory } = useEditorStore();
  const { brands } = useBrandsStore();

  // Drag Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // evita arrastar ao clicar simples
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  const brand = brands.find((b) => b.id === project.brandId) || brands[0];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    pushHistory(JSON.stringify(project));

    const oldIndex = project.slides.findIndex((s) => s.id === active.id);
    const newIndex = project.slides.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(project.slides, oldIndex, newIndex);
    reorderSlides(projectId, reordered);
  };

  const handleAddSlide = () => {
    pushHistory(JSON.stringify(project));

    const newOrder = project.slides.length + 1;
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      order: newOrder,
      type: "content",
      template: "content-highlight",
      title: "Novo Título de Slide",
      subtitle: `Tópico ${newOrder - 1}`,
      body: "Clique no elemento para editar seu texto correspondente aqui no editor controlado.",
      styles: {
        backgroundColor: brand?.backgroundColor || "#ffffff",
        textColor: brand?.textColor || "#1e293b",
        accentColor: brand?.primaryColor || "#7c3aed",
        fontFamily: brand?.fontFamily || "Inter",
      },
    };

    addSlide(projectId, newSlide);
    setActiveSlideId(newSlide.id);
  };

  const handleMoveUp = (idx: number) => {
    pushHistory(JSON.stringify(project));
    const slides = [...project.slides];
    const temp = slides[idx];
    slides[idx] = slides[idx - 1];
    slides[idx - 1] = temp;
    reorderSlides(projectId, slides);
  };

  const handleMoveDown = (idx: number) => {
    pushHistory(JSON.stringify(project));
    const slides = [...project.slides];
    const temp = slides[idx];
    slides[idx] = slides[idx + 1];
    slides[idx + 1] = temp;
    reorderSlides(projectId, slides);
  };

  const handleDelete = (slideId: string) => {
    if (project.slides.length <= 1) return;
    pushHistory(JSON.stringify(project));
    deleteSlide(projectId, slideId);
    if (activeSlideId === slideId) {
      const remaining = project.slides.filter((s) => s.id !== slideId);
      setActiveSlideId(remaining[0]?.id || null);
    }
  };

  return (
    <aside className="w-[184px] bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none z-10">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Navegador</span>
        <button
          onClick={handleAddSlide}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Adicionar slide"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={project.slides.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {project.slides.map((s, idx) => (
              <SortableSlideItem
                key={s.id}
                slide={s}
                brand={brand}
                format={project.format}
                idx={idx}
                totalSlides={project.slides.length}
                isActive={activeSlideId === s.id}
                onSelect={() => setActiveSlideId(s.id)}
                onMoveUp={(e) => {
                  e.stopPropagation();
                  handleMoveUp(idx);
                }}
                onMoveDown={(e) => {
                  e.stopPropagation();
                  handleMoveDown(idx);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDelete(s.id);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={handleAddSlide}
          className="w-full py-4 border border-dashed border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 rounded-2xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-4"
        >
          <Plus size={14} />
          <span>Novo Slide</span>
        </button>
      </div>
    </aside>
  );
}
