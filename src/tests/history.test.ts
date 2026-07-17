import { describe, it, expect } from "vitest";

// Algoritmo simples de Undo/Redo similar ao da nossa Zustand store
class EditorHistory {
  undoStack: string[] = [];
  redoStack: string[] = [];
  maxSize = 30;

  pushHistory(state: string) {
    if (this.undoStack.length >= this.maxSize) {
      this.undoStack.shift();
    }
    this.undoStack.push(state);
    this.redoStack = []; // limpa redo ao efetuar nova mutação
  }

  undo(currentState: string): { success: boolean; restoredState: string } {
    if (this.undoStack.length === 0) {
      return { success: false, restoredState: currentState };
    }
    const previous = this.undoStack.pop()!;
    this.redoStack.push(currentState);
    return { success: true, restoredState: previous };
  }

  redo(currentState: string): { success: boolean; restoredState: string } {
    if (this.redoStack.length === 0) {
      return { success: false, restoredState: currentState };
    }
    const next = this.redoStack.pop()!;
    this.undoStack.push(currentState);
    return { success: true, restoredState: next };
  }
}

describe("Testes de Histórico (Undo e Redo)", () => {
  it("deve desfazer e refazer estados do projeto corretamente", () => {
    const history = new EditorHistory();

    const state1 = "Projeto Versão 1";
    const state2 = "Projeto Versão 2";
    const state3 = "Projeto Versão 3";

    // Modificações consecutivas
    history.pushHistory(state1);
    history.pushHistory(state2);

    // Estado atual é o state3
    let current = state3;

    // Primeiro Undo -> Deve voltar para o estado 2
    let res = history.undo(current);
    expect(res.success).toBe(true);
    expect(res.restoredState).toBe(state2);
    current = res.restoredState; // atualiza o estado corrente

    // Segundo Undo -> Deve voltar para o estado 1
    res = history.undo(current);
    expect(res.success).toBe(true);
    expect(res.restoredState).toBe(state1);
    current = res.restoredState;

    // Terceiro Undo -> Deve falhar pois a pilha esvaziou
    res = history.undo(current);
    expect(res.success).toBe(false);
    expect(res.restoredState).toBe(state1);

    // Redo -> Deve voltar para o estado 2
    res = history.redo(current);
    expect(res.success).toBe(true);
    expect(res.restoredState).toBe(state2);
    current = res.restoredState;

    // Nova modificação limpa a pilha de Redo
    history.pushHistory(current);
    current = "Projeto Alteração Nova";
    
    // Tentativa de Redo deve falhar
    res = history.redo(current);
    expect(res.success).toBe(false);
  });
});
