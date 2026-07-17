import { create } from "zustand";
import { ActiveTab, SelectedElementId } from "@/types";

interface HistoryState {
  undoStack: string[]; // stringified project states
  redoStack: string[];
}

interface EditorState {
  activeSlideId: string | null;
  selectedElementId: SelectedElementId;
  activeTab: ActiveTab;
  zoom: number;
  autosaveStatus: "saved" | "saving" | "unsaved";
  history: HistoryState;

  // Actions
  setActiveSlideId: (id: string | null) => void;
  setSelectedElementId: (id: SelectedElementId) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setZoom: (zoom: number) => void;
  setAutosaveStatus: (status: "saved" | "saving" | "unsaved") => void;

  // History Actions
  pushHistory: (projectState: string) => void;
  undo: (currentProjectState: string) => { restoredState: string; success: boolean };
  redo: (currentProjectState: string) => { restoredState: string; success: boolean };
  clearHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  activeSlideId: null,
  selectedElementId: null,
  activeTab: "content",
  zoom: 100,
  autosaveStatus: "saved",
  history: {
    undoStack: [],
    redoStack: [],
  },

  setActiveSlideId: (id) => set({ activeSlideId: id, selectedElementId: null }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setZoom: (zoom) => set({ zoom }),
  setAutosaveStatus: (status) => set({ autosaveStatus: status }),

  pushHistory: (projectState) =>
    set((state) => {
      const undoStack = [...state.history.undoStack, projectState];
      // Limitar a pilha a 30 alterações para economizar memória
      if (undoStack.length > 30) undoStack.shift();
      return {
        history: {
          undoStack,
          redoStack: [], // Limpa o redo ao criar nova ação
        },
      };
    }),

  undo: (currentProjectState) => {
    const { history } = get();
    if (history.undoStack.length === 0) {
      return { restoredState: "", success: false };
    }

    const nextUndoStack = [...history.undoStack];
    const previousState = nextUndoStack.pop()!;
    const nextRedoStack = [...history.redoStack, currentProjectState];

    set({
      history: {
        undoStack: nextUndoStack,
        redoStack: nextRedoStack,
      },
    });

    return { restoredState: previousState, success: true };
  },

  redo: (currentProjectState) => {
    const { history } = get();
    if (history.redoStack.length === 0) {
      return { restoredState: "", success: false };
    }

    const nextRedoStack = [...history.redoStack];
    const nextState = nextRedoStack.pop()!;
    const nextUndoStack = [...history.undoStack, currentProjectState];

    set({
      history: {
        undoStack: nextUndoStack,
        redoStack: nextRedoStack,
      },
    });

    return { restoredState: nextState, success: true };
  },

  clearHistory: () =>
    set({
      history: {
        undoStack: [],
        redoStack: [],
      },
    }),
}));
