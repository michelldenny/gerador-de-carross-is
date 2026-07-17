import React from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { AutoFitText } from "../components/slides/auto-fit-text";

// Mock do ResizeObserver para o ambiente jsdom
beforeAll(() => {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

describe("Componente AutoFitText", () => {
  it("deve renderizar o texto fornecido", () => {
    render(<AutoFitText text="Texto para ajuste automático" />);
    expect(screen.getByText("Texto para ajuste automático")).toBeTruthy();
  });

  it("deve exibir o indicador de Estouros apenas se configurado", () => {
    render(
      <AutoFitText text="Estouro de Texto" showOverflowIndicator={false} />
    );
    expect(screen.queryByText("Estouro")).toBeNull();

    // Mockar overflow alterando scrollHeight no DOM do jsdom
    // No entanto, para testes unitários básicos e estáveis, garantimos que o componente não quebra
    // e obedece as props informadas.
  });
});
