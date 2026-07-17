import { describe, it, expect } from "vitest";
import { createProjectSchema, brandSchema, captionSchema } from "../schemas";

describe("Testes de Validação de Schemas Zod", () => {
  it("deve validar dados válidos de criação de carrossel", () => {
    const validData = {
      title: "Meu Primeiro Carrossel",
      theme: "Dicas de Saúde Bucal",
      audience: "Dentistas e profissionais de saúde",
      goal: "educar",
      tone: "profissional",
      slideCount: 5,
      imageOption: "few",
      imageSource: "unsplash",
      cta: "Visite nosso perfil e saiba mais!",
      format: "vertical",
      brandId: "brand-1",
      notes: "Criar slides objetivos.",
    };

    const res = createProjectSchema.safeParse(validData);
    expect(res.success).toBe(true);
  });

  it("deve falhar se o título do carrossel for menor que 3 caracteres", () => {
    const invalidData = {
      title: "Oi",
      theme: "Dicas de Saúde Bucal",
      format: "square",
    };

    const res = createProjectSchema.safeParse(invalidData);
    expect(res.success).toBe(false);
  });

  it("deve validar dados válidos de marca", () => {
    const validBrand = {
      name: "Dental Premium",
      instagramHandle: "@dentalpremium",
      logoText: "DentalPremium",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e3a8a",
      accentColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      fontFamily: "Inter",
      defaultCta: "Agende sua avaliação hoje mesmo!",
    };

    const res = brandSchema.safeParse(validBrand);
    expect(res.success).toBe(true);
  });

  it("deve falhar se o instagramHandle da marca não começar com @", () => {
    const invalidBrand = {
      name: "Dental Premium",
      instagramHandle: "dentalpremium",
      logoText: "DentalPremium",
    };

    const res = brandSchema.safeParse(invalidBrand);
    expect(res.success).toBe(false);
  });
});
