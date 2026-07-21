import React from "react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideRenderer } from "../components/slides/slide-renderer";
import { Slide, Brand, SlideTemplateId } from "@/types";

// Mock do ResizeObserver para o ambiente jsdom
beforeAll(() => {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

describe("Componente SlideRenderer - Multi Templates", () => {
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

  const createTestSlide = (template: SlideTemplateId, title: string): Slide => ({
    id: `slide-${template}`,
    order: 1,
    type: "content",
    template,
    title,
    subtitle: "Subtítulo do Slide",
    body: title,
    highlight: title,
    listItems: ["Item 1 do teste", "Item 2 do teste"],
    cta: title,
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#000000",
      accentColor: "#ff0000",
      fontFamily: "Inter",
    },
  });

  const templates: SlideTemplateId[] = [
    "cover-image",
    "cover-minimal",
    "content-highlight",
    "content-number",
    "content-list",
    "content-left-image",
    "content-right-image",
    "content-quote",
    "comparison",
    "cta-brand",
  ];

  templates.forEach((templateId) => {
    it(`deve renderizar o template "${templateId}" sem quebrar`, () => {
      const slide = createTestSlide(templateId, `Slide do template ${templateId}`);
      render(<SlideRenderer slide={slide} brand={mockBrand} mode="preview" />);
      
      expect(screen.getAllByText(`Slide do template ${templateId}`).length).toBeGreaterThan(0);
    });
  });

  it("deve renderizar o template de layout UnsupportedTemplate se o templateId for inválido", () => {
    const invalidSlide: Slide = {
      id: "slide-invalid",
      order: 1,
      type: "content",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template: "template-inexistente" as any,
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

  it("aplica moldura, numeracao e progresso no perfil BrandsDecoded", () => {
    const slide = createTestSlide("content-highlight", "Analise editorial");
    slide.order = 4;
    slide.styles.editorialProfile = true;
    slide.styles.totalSlides = 9;
    render(<SlideRenderer slide={slide} brand={mockBrand} mode="preview" />);
    expect(screen.getByText("BrandsDecoded")).toBeTruthy();
    expect(screen.getByText("04 / 09")).toBeTruthy();
  });
});
