import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../stores/use-editor-store";

describe("Testes de Zustand Editor History (Undo e Redo Real)", () => {
  beforeEach(() => {
    // Resetar o estado da store antes de cada teste
    useEditorStore.setState({
      history: {
        undoStack: [],
        redoStack: [],
      },
    });
  });

  it("deve gerenciar a pilha de undo e redo na store real", () => {
    const store = useEditorStore.getState();
    
    const stateA = '{"title":"Projeto A"}';
    const stateB = '{"title":"Projeto B"}';
    
    // Empilhar histórico
    store.pushHistory(stateA);
    expect(useEditorStore.getState().history.undoStack).toContain(stateA);

    store.pushHistory(stateB);
    expect(useEditorStore.getState().history.undoStack).toHaveLength(2);

    // Desfazer (Undo)
    const currentState = '{"title":"Projeto C"}';
    const undoRes = useEditorStore.getState().undo(currentState);
    
    expect(undoRes.success).toBe(true);
    expect(undoRes.restoredState).toBe(stateB);
    expect(useEditorStore.getState().history.redoStack).toContain(currentState);

    // Refazer (Redo)
    const redoRes = useEditorStore.getState().redo(undoRes.restoredState);
    expect(redoRes.success).toBe(true);
    expect(redoRes.restoredState).toBe(currentState);
  });
});
