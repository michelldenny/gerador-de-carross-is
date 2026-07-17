import React from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideRenderer } from "../components/slides/slide-renderer";
import { Slide, Brand } from "@/types";

// Mock do ResizeObserver para o ambiente jsdom
beforeAll(() => {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
});

describe("Componente SlideRenderer", () => {
  const mockBrand: Brand = {
    id: "brand-1",
    name: "Dental Premium",
    logoText: "DentalPremium",
    instagramHandle: "@dentalpremium",
    primaryColor: "#3b82f6",
    secondaryColor: "#1e3a8a",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontFamily: "Inter",
    defaultCta: "Agende sua avaliação",
    projectCount: 0,
  };

  it("deve renderizar o template de layout UnsupportedTemplate se o templateId for inválido", () => {
    const invalidSlide: Slide = {
      id: "slide-1",
      order: 1,
      type: "content",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template: "template-inexistente" as any, // força tipo incorreto
      title: "Título de Teste",
      body: "Corpo do slide de teste",
      styles: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        accentColor: "#ff0000",
        fontFamily: "Inter",
      },
    };

    render(<SlideRenderer slide={invalidSlide} brand={mockBrand} mode="preview" />);
    
    expect(screen.getByText("Layout Não Suportado")).toBeTruthy();
    expect(screen.getByText("template-inexistente")).toBeTruthy();
  });
});
