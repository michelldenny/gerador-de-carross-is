"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectsStore, useBrandsStore, useUiStore } from "@/stores";
import { createProjectSchema } from "@/schemas";
import { z } from "zod";
import { generateCarouselWithAI } from "@/services/ai-service";
import { Slide } from "@/types";
import { SlideCanvas } from "@/components/slides/slide-canvas";
import { SlideRenderer } from "@/components/slides/slide-renderer";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Coins,
  Sparkles,
  Image as ImageIcon,
  Palette,
  FileText,
  Smartphone,
  Square,
  RectangleVertical,
  CheckCircle2,
  Upload,
} from "lucide-react";

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

const ESTILOS_PRESETS = [
  {
    id: "minimalista",
    name: "Minimalista",
    description: "Linhas limpas, muito espaço em branco, foco em tipografia.",
    primaryColor: "#0f172a",
    secondaryColor: "#64748b",
    accentColor: "#334155",
    backgroundColor: "#f8fafc",
    fontFamily: "Inter",
  },
  {
    id: "moderno",
    name: "Moderno",
    description: "Gradients sutis, contraste elegante e cores contemporâneas.",
    primaryColor: "#6d28d9",
    secondaryColor: "#4f46e5",
    accentColor: "#db2777",
    backgroundColor: "#ffffff",
    fontFamily: "Outfit",
  },
  {
    id: "corporativo",
    name: "Corporativo",
    description: "Sério, confiável e profissional. Ideal para negócios e B2B.",
    primaryColor: "#1e3a8a",
    secondaryColor: "#0284c7",
    accentColor: "#0f172a",
    backgroundColor: "#f0f9ff",
    fontFamily: "Roboto",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Inspirado em revistas de alto padrão. Sofisticado.",
    primaryColor: "#1c1917",
    secondaryColor: "#78716c",
    accentColor: "#78350f",
    backgroundColor: "#fafaf9",
    fontFamily: "Lora",
  },
  {
    id: "vibrante",
    name: "Vibrante",
    description: "Cores de alta energia, alto contraste e elements marcantes.",
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b",
    backgroundColor: "#faf5ff",
    fontFamily: "Outfit",
  },
  {
    id: "elegante",
    name: "Elegante",
    description: "Cores suaves e luxuosas, contraste sutil e ar Premium.",
    primaryColor: "#78350f",
    secondaryColor: "#9a3412",
    accentColor: "#d97706",
    backgroundColor: "#fffbeb",
    fontFamily: "Lora",
  },
  {
    id: "tecnológico",
    name: "Tecnológico",
    description: "Neo-futurista, tons escuros e acentos brilhantes.",
    primaryColor: "#10b981",
    secondaryColor: "#06b6d4",
    accentColor: "#0f172a",
    backgroundColor: "#f0fdf4",
    fontFamily: "JetBrains Mono",
  },
  {
    id: "descontraido",
    name: "Descontraído",
    description: "Amigável, dinâmico e convidativo para comunidades online.",
    primaryColor: "#f97316",
    secondaryColor: "#ea580c",
    accentColor: "#10b981",
    backgroundColor: "#fff7ed",
    fontFamily: "Outfit",
  },
];

const MOCK_GALLERY_IMAGES = [
  { url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80", alt: "Clínico Geral" },
  { url: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&auto=format&fit=crop&q=80", alt: "Odonto Foco" },
  { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80", alt: "Negócios / Escritório" },
  { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80", alt: "Análise de Métricas" },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80", alt: "Praia e Natureza" },
  { url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80", alt: "Modelo Sorrindo" },
];

function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchProjects } = useProjectsStore();
  const { brands, addBrand } = useBrandsStore();
  const { addNotification, generationProgress, generationStep, setGenerationState } = useUiStore();

  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<{
    editorialMode: "quick" | "custom" | "editorial";
    title: string;
    theme: string;
    audience: string;
    goal: string;
    tone: string;
    slideCount: number;
    imageOption: string;
    imageSource: string;
    cta: string;
    format: "vertical" | "square" | "story";
    brandId: string;
    notes?: string;
    niche?: string;
    visualStyle?: string;
    customColors?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    logoUrl?: string;
    saveAsBrand?: boolean;
    newBrandName?: string;
    imageCount?: number;
    favoriteImages?: string[];
    decideLater?: boolean;
  }>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      editorialMode: "custom",
      title: "",
      theme: "",
      audience: "Empreendedores e profissionais de marketing",
      goal: "educar",
      tone: "profissional",
      slideCount: 5,
      imageOption: "few",
      imageSource: "unsplash",
      cta: "Acesse o link na bio para saber mais!",
      format: "vertical",
      brandId: brands[0]?.id || "brand-1",
      notes: "",
      niche: "Geral",
      visualStyle: "minimalista",
      customColors: false,
      primaryColor: "#0f172a",
      secondaryColor: "#64748b",
      accentColor: "#334155",
      backgroundColor: "#f8fafc",
      fontFamily: "Inter",
      logoUrl: "",
      saveAsBrand: false,
      newBrandName: "",
      imageCount: 3,
      favoriteImages: [],
      decideLater: false,
    },
  });

  // Ler Query Params na inicialização
  useEffect(() => {
    const goalParam = searchParams?.get("goal");
    const toneParam = searchParams?.get("tone");
    const themeParam = searchParams?.get("theme");

    if (goalParam || toneParam || themeParam) {
      reset({
        editorialMode: "custom",
        title: themeParam ? `Carrossel: ${themeParam}` : "",
        theme: themeParam || "",
        audience: "Público geral do Instagram",
        goal: goalParam || "educar",
        tone: toneParam || "profissional",
        slideCount: 5,
        imageOption: "few",
        imageSource: "unsplash",
        cta: "Acesse o link na bio para saber mais!",
        format: "vertical",
        brandId: brands[0]?.id || "brand-1",
        notes: "",
        niche: "Geral",
        visualStyle: "minimalista",
        customColors: false,
        primaryColor: "#0f172a",
        secondaryColor: "#64748b",
        accentColor: "#334155",
        backgroundColor: "#f8fafc",
        fontFamily: "Inter",
        logoUrl: "",
        saveAsBrand: false,
        newBrandName: "",
        imageCount: 3,
        favoriteImages: [],
        decideLater: false,
      });
    }
  }, [searchParams, reset, brands]);

  const selectedFormat = watch("format");
  const selectedEditorialMode = watch("editorialMode");
  const selectedBrandId = watch("brandId");
  const selectedSlideCount = watch("slideCount");
  const selectedImageOption = watch("imageOption");
  const selectedImageSource = watch("imageSource");
  const selectedVisualStyle = watch("visualStyle");
  const isCustomColors = watch("customColors");
  const isDecideLater = watch("decideLater");
  const selectedImages = watch("favoriteImages") || [];

  const handleBrandChange = (brandId: string) => {
    setValue("brandId", brandId);
    const selectedBrand = brands.find((b) => b.id === brandId);
    if (selectedBrand) {
      setValue("cta", selectedBrand.defaultCta);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = ESTILOS_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setValue("visualStyle", presetId);
      setValue("primaryColor", preset.primaryColor);
      setValue("secondaryColor", preset.secondaryColor);
      setValue("accentColor", preset.accentColor);
      setValue("backgroundColor", preset.backgroundColor);
      setValue("fontFamily", preset.fontFamily);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue("logoUrl", url);
      setLogoPreview(url);
    }
  };

  const handleImageToggle = (url: string) => {
    const current = watch("favoriteImages") || [];
    if (current.includes(url)) {
      setValue("favoriteImages", current.filter((u) => u !== url));
    } else {
      const limit = watch("imageCount") || 3;
      if (current.length >= limit) {
        addNotification("Limite Atingido", `Você escolheu selecionar ${limit} imagens.`, "info");
        return;
      }
      setValue("favoriteImages", [...current, url]);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      const titleVal = watch("title");
      const themeVal = watch("theme");
      if (!titleVal || titleVal.length < 3) {
        addNotification("Erro", "Nome do projeto deve ter no mínimo 3 letras.", "warning");
        return;
      }
      if (!themeVal || themeVal.length < 3) {
        addNotification("Erro", "Tema do carrossel é obrigatório.", "warning");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  // Custo dinâmico em créditos
  const calculatedCredits = () => {
    const isAiImage = selectedImageSource === "generation";
    const imageOpt = selectedImageOption;
    const count = watch("imageCount") || 3;
    if (isAiImage && imageOpt !== "none") {
      return 10 + count;
    }
    return 10;
  };

  const executeGeneration = async (formData: CreateProjectFormData) => {
    setStep(5);
    setGenerationState(0, "Iniciando inteligência artificial...", true);

    try {
      const stepsSim = [
        { progress: 15, msg: "Analisando nicho e segmento de marca..." },
        { progress: 35, msg: "Estruturando roteiro estratégico dos slides..." },
        { progress: 55, msg: "Redigindo textos e chamadas com base no tom..." },
        { progress: 75, msg: "Compondo identidades visuais rápidas e fontes..." },
        { progress: 95, msg: "Alocando imagens preferenciais do carrossel..." },
        { progress: 100, msg: "Finalizando formatação real do carrossel..." },
      ];

      let generationBrandId = formData.brandId;
      if (formData.saveAsBrand && formData.newBrandName) {
        const newBrand = await addBrand({
          name: formData.newBrandName,
          logoText: formData.newBrandName.substring(0, 12),
          instagramHandle: "@nova_marca",
          primaryColor: formData.primaryColor || "#0f172a",
          secondaryColor: formData.secondaryColor || "#64748b",
          accentColor: formData.accentColor || "#334155",
          backgroundColor: formData.backgroundColor || "#ffffff",
          textColor: formData.primaryColor || "#0f172a",
          fontFamily: formData.fontFamily || "Inter",
          defaultCta: formData.cta,
        });
        generationBrandId = newBrand.id;
      }

      const aiResponsePromise = generateCarouselWithAI({
        editorialMode: formData.editorialMode,
        title: formData.title,
        theme: formData.theme,
        brandId: generationBrandId,
        audience: formData.audience,
        goal: formData.goal,
        tone: formData.tone,
        slideCount: formData.slideCount,
        cta: formData.cta,
        format: formData.format,
        imageOption: formData.imageOption,
        niche: formData.niche,
        notes: formData.notes,
        visualStyle: formData.visualStyle,
        imageSource: formData.imageSource,
        imageCount: formData.imageCount,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        backgroundColor: formData.backgroundColor,
        fontFamily: formData.fontFamily,
      });

      for (const s of stepsSim) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setGenerationState(s.progress, s.msg, true);
      }

      const generationResult = await aiResponsePromise;
      if (!generationResult.projectId) throw new Error("A geração não retornou o projeto persistido");
      await fetchProjects();
      setGenerationState(100, "Concluído!", false);
      addNotification("Carrossel gerado", `'${generationResult.carousel.projectTitle}' está pronto no editor!`, "success");
      router.push(`/projects/${generationResult.projectId}/editor`);
    } catch (err) {
      console.error(err);
      addNotification("Falha na Geração", "Erro ao processar criação.", "warning");
      setGenerationState(0, "", false);
      setStep(4);
    }
  };

  // Preview dinâmico para a Etapa 2
  const previewSlide: Slide = {
    id: "preview-slide",
    order: 1,
    type: "cover",
    template: "cover-minimal",
    title: watch("title") || "Título de Exemplo",
    subtitle: watch("theme") || "Subtítulo do Slide",
    body: "Aqui está o visual em tempo real do estilo selecionado.",
    styles: {
      backgroundColor: isCustomColors ? (watch("backgroundColor") || "#ffffff") : (brands.find((b) => b.id === selectedBrandId)?.backgroundColor || "#ffffff"),
      textColor: isCustomColors ? (watch("primaryColor") || "#1e293b") : (brands.find((b) => b.id === selectedBrandId)?.textColor || "#1e293b"),
      accentColor: isCustomColors ? (watch("accentColor") || "#7c3aed") : (brands.find((b) => b.id === selectedBrandId)?.primaryColor || "#7c3aed"),
      fontFamily: isCustomColors ? (watch("fontFamily") || "Inter") : (brands.find((b) => b.id === selectedBrandId)?.fontFamily || "Inter"),
    },
  };

  const previewBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      {step < 5 && (
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Criar Novo Carrossel</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Configure as instruções para nossa IA criar a melhor estrutura.</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Etapa {step} de 4</span>
        </div>
      )}

      {/* Progress Steps Header */}
      {step < 5 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          {[
            { label: "Conteúdo", icon: FileText, stepNum: 1 },
            { label: "Estilo", icon: Palette, stepNum: 2 },
            { label: "Imagens", icon: ImageIcon, stepNum: 3 },
            { label: "Revisão", icon: Coins, stepNum: 4 },
          ].map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.stepNum;
            const isActive = step === s.stepNum;
            return (
              <div key={s.stepNum} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-violet-600 text-white shadow shadow-violet-600/10"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${isActive ? "text-slate-800" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 1: Conteúdo */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText size={16} className="text-violet-600" /> Detalhes Estratégicos
          </h3>

          <input type="hidden" {...register("editorialMode")} />
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Método de criação
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { id: "quick", title: "Carrossel rápido", description: "Cinco slides e validações essenciais." },
                { id: "custom", title: "Personalizado", description: "Respeita suas escolhas de formato e quantidade." },
                { id: "editorial", title: "Editorial aprofundado", description: "Método BrandsDecoded: nove slides verticais." },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    const id = mode.id as "quick" | "custom" | "editorial";
                    setValue("editorialMode", id, { shouldValidate: true });
                    if (id === "quick") setValue("slideCount", 5);
                    if (id === "editorial") {
                      setValue("slideCount", 9);
                      setValue("format", "vertical");
                    }
                  }}
                  className={`rounded-2xl border p-3 text-left transition-colors ${
                    selectedEditorialMode === mode.id
                      ? "border-violet-500 bg-violet-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-800">{mode.title}</span>
                  <span className="mt-1 block text-[10px] leading-relaxed text-slate-500">{mode.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Projeto *</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. Como fidelizar pacientes"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tema Estratégico *</label>
              <input
                type="text"
                {...register("theme")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. 5 Passos para ter dentes mais brancos"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nicho / Segmento</label>
              <input
                type="text"
                {...register("niche")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. Saúde / Odontologia / Marketing"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Público-Alvo *</label>
              <input
                type="text"
                {...register("audience")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Objetivo Principal *</label>
              <select
                {...register("goal")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
              >
                <option value="educar">Educar e Reter Engajamento</option>
                <option value="informar">Informar notícias ou atualizações</option>
                <option value="vender">Vender diretamente (Conversão/CTA)</option>
                <option value="autoridade">Gerar Autoridade técnica</option>
                <option value="aumentar engajamento">Aumentar Interação / Curtidas</option>
                <option value="captar leads">Capturar contatos ou leads</option>
                <option value="divulgar produto">Lançar ou Divulgar Produto</option>
                <option value="divulgar serviço">Apresentar Serviço profissional</option>
                <option value="contar uma história">Storytelling envolvente</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tom de Voz *</label>
              <select
                {...register("tone")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
              >
                <option value="profissional">Profissional & Técnico</option>
                <option value="descontraido">Descontraído & Divertido</option>
                <option value="autoritario">Autoritário & Convincente</option>
                <option value="inspirador">Inspirador & Acessível</option>
                <option value="persuasivo">Persuasivo & Assertivo</option>
                <option value="educativo">Educativo & Detalhado</option>
                <option value="humorístico">Humorístico & Informal</option>
                <option value="técnico">Altamente Técnico / Acadêmico</option>
                <option value="emocional">Emocional & Empático</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantidade de Slides ({selectedSlideCount})</label>
              <input
                type="range"
                min="3"
                max="10"
                disabled={selectedEditorialMode !== "custom"}
                {...register("slideCount", { valueAsNumber: true })}
                className="w-full accent-violet-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer mt-2"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Observações Adicionais para a IA</label>
            <textarea
              {...register("notes")}
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold resize-none"
              placeholder="Descreva detalhes específicos que a IA deve respeitar ou introduzir no carrossel..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow active:scale-95"
            >
              Próximo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Estilos e Identidade */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Lado Esquerdo: Formulário de Identidade e Preset */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Palette size={16} className="text-violet-600" /> Identidade Visual e Preset
            </h3>

            {/* Presets de Estilo Visual */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escolha um Estilo Visual Preset</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ESTILOS_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePresetSelect(p.id)}
                    className={`p-2.5 rounded-xl border flex flex-col text-left transition-all ${
                      selectedVisualStyle === p.id && !isCustomColors
                        ? "border-violet-600 bg-violet-50/50 ring-2 ring-violet-500/20"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[10px] font-extrabold text-slate-800">{p.name}</span>
                    <span className="text-[8px] text-slate-400 font-semibold mt-0.5 leading-tight line-clamp-2">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch de Identidade Personalizada Rápida */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Criar Identidade Rápida</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Customize suas próprias cores e fontes independentemente.</p>
              </div>
              <input
                type="checkbox"
                {...register("customColors")}
                className="w-4 h-4 text-violet-600 accent-violet-600 rounded cursor-pointer"
              />
            </div>

            {isCustomColors ? (
              <div className="grid grid-cols-2 gap-4 p-4 border border-violet-100 bg-violet-50/10 rounded-2xl animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cor Primária (Textos)</label>
                  <input type="color" {...register("primaryColor")} className="w-full h-8 cursor-pointer rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Cor Secundária</label>
                  <input type="color" {...register("secondaryColor")} className="w-full h-8 cursor-pointer rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Acento / Detalhes</label>
                  <input type="color" {...register("accentColor")} className="w-full h-8 cursor-pointer rounded-lg outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Fundo do Slide</label>
                  <input type="color" {...register("backgroundColor")} className="w-full h-8 cursor-pointer rounded-lg outline-none" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tipografia / Fonte</label>
                  <select {...register("fontFamily")} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none font-bold">
                    <option value="Inter">Inter (Limpa & Moderna)</option>
                    <option value="Roboto">Roboto (Séria & Funcional)</option>
                    <option value="Lora">Lora (Elegante & Serifada)</option>
                    <option value="Outfit">Outfit (Moderna & Arredondada)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Tecnológica)</option>
                  </select>
                </div>

                {/* Upload de Logo */}
                <div className="col-span-2 space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Logotipo Corporativo</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-600 cursor-pointer shadow-xs">
                      <Upload size={12} />
                      Carregar Logo
                      <input type="file" onChange={handleLogoUpload} accept="image/*" className="hidden" />
                    </label>
                    {logoPreview && (
                      <img src={logoPreview} alt="Logo Preview" className="h-8 w-auto rounded border p-1 object-contain" />
                    )}
                  </div>
                </div>

                {/* Salvar como marca */}
                <div className="col-span-2 pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" {...register("saveAsBrand")} className="w-4 h-4 accent-violet-600" />
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Salvar como Nova Marca na Conta</label>
                  </div>
                  {watch("saveAsBrand") && (
                    <input
                      type="text"
                      {...register("newBrandName")}
                      placeholder="Nome da Nova Marca (Ex: Marca Alex)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Selecionar Marca Existente</label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.instagramHandle})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Formato */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Formato do Carrossel</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "vertical", label: "Vertical (1080x1350)", icon: RectangleVertical },
                  { id: "square", label: "Quadrado (1080x1080)", icon: Square },
                  { id: "story", label: "Story (1080x1920)", icon: Smartphone },
                ].map((f) => {
                  const Icon = f.icon;
                  const isActive = selectedFormat === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setValue("format", f.id as "vertical" | "square" | "story")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[10px] font-bold ${
                        isActive
                          ? "border-violet-600 bg-violet-50 text-violet-700 shadow-xs"
                          : "border-slate-200 hover:bg-slate-50 text-slate-500"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chamada para Ação (CTA) Padrão</label>
              <input
                type="text"
                {...register("cta")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95"
              >
                <ArrowLeft size={14} /> Voltar
              </button>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow active:scale-95"
              >
                Próximo <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Lado Direito: Preview da Identidade em Tempo Real */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between items-center text-center gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Preview da Identidade Visual</h3>
              <p className="text-[9px] text-slate-400 mt-0.5">Primeiro slide (Capa) em tempo real</p>
            </div>

            <div className="w-full aspect-[4/5] bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 scale-95 relative">
              <div className="scale-[0.25] origin-center flex items-center justify-center shrink-0">
                <SlideCanvas
                  width={1080}
                  height={selectedFormat === "story" ? 1920 : selectedFormat === "square" ? 1080 : 1350}
                  scale={1.0}
                  mode="thumbnail"
                >
                  <SlideRenderer
                    slide={previewSlide}
                    brand={isCustomColors ? undefined : previewBrand}
                    mode="thumbnail"
                  />
                </SlideCanvas>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-medium">
              O layout final e elementos serão gerados automaticamente pela IA seguindo estas cores e estilos.
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Imagens */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <ImageIcon size={16} className="text-violet-600" /> Estratégia de Imagens e Mídias
          </h3>

          {/* Decidir Depois */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Decidir e alocar imagens depois</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Não insere imagens mockadas agora, permitindo que você as edite de forma limpa.</p>
            </div>
            <input
              type="checkbox"
              {...register("decideLater")}
              className="w-4 h-4 text-violet-600 accent-violet-600 rounded cursor-pointer"
            />
          </div>

          {!isDecideLater && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Opção de Imagens</label>
                  <select
                    {...register("imageOption")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
                  >
                    <option value="none">Sem imagens (Somente texto e design clean)</option>
                    <option value="few">Poucas imagens (Capa e CTA final)</option>
                    <option value="half">Metade dos slides com imagem</option>
                    <option value="all">Todos os slides com imagem</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Origem das Imagens</label>
                  <select
                    {...register("imageSource")}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
                  >
                    <option value="unsplash">Pesquisa no Unsplash</option>
                    <option value="generation">Geração por IA (+1 crédito/imagem)</option>
                    <option value="upload">Upload manual posterior</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Qtd. Máxima de Imagens</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedSlideCount}
                    {...register("imageCount", { valueAsNumber: true })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                  />
                </div>
              </div>

              {/* Galeria de Escolha Antecipada */}
              {selectedImageOption !== "none" && (
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Escolha Antecipada de Fotos (Galeria Recomendada)</label>
                    <span className="text-[9px] text-slate-400 font-medium">Selecione até {watch("imageCount") || 3} fotos favoritas para incluir nos slides</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {MOCK_GALLERY_IMAGES.map((img, idx) => {
                      const isSelected = selectedImages.includes(img.url);
                      return (
                        <div
                          key={idx}
                          onClick={() => handleImageToggle(img.url)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected ? "border-violet-600 ring-2 ring-violet-500/20" : "border-slate-100 hover:opacity-85"
                          }`}
                        >
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-violet-600 text-white rounded-full p-0.5">
                              <Check size={8} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
            <button
              onClick={handleNextStep}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow active:scale-95"
            >
              Próximo <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Revisão */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h3 className="font-bold text-sm">Revisão do Setup do Carrossel</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-slate-600">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Tema do Carrossel</span>
              <span className="text-slate-800 font-bold text-sm block">{watch("theme")}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Formato</span>
                <span className="text-slate-800 font-bold uppercase">{selectedFormat}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Slides Totais</span>
                <span className="text-slate-800 font-bold">{selectedSlideCount} slides</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Identidade de Marca</span>
              <span className="text-slate-800 font-bold">
                {isCustomColors
                  ? `Identidade Rápida (${watch("fontFamily")})`
                  : (brands.find((b) => b.id === selectedBrandId)?.name || "Marca Padrão")}
              </span>
            </div>

            {/* Custo recalculado de verdade */}
            <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-violet-400 uppercase font-black block">Custo de Geração</span>
                <span className="text-sm font-black text-violet-700 block mt-0.5">
                  {calculatedCredits()} Créditos
                </span>
                {selectedImageSource === "generation" && selectedImageOption !== "none" && (
                  <span className="text-[8px] text-slate-400 font-normal">
                    (Base: 10 + {watch("imageCount") || 3} por imagens de IA)
                  </span>
                )}
              </div>
              <Coins className="text-violet-600 w-8 h-8 opacity-45" />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft size={14} /> Voltar
            </button>
            <button
              onClick={handleSubmit(executeGeneration)}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-violet-600/10 active:scale-95"
            >
              <Sparkles size={14} />
              <span>Gerar Carrossel com Inteligência Artificial</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Loader */}
      {step === 5 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-md flex flex-col items-center justify-center text-center gap-6 min-h-[420px] max-w-xl mx-auto animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-100 rounded-full" />
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            <Sparkles className="text-violet-600 w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-800">Criando a estrutura dos slides...</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">{generationStep}</p>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs">
            <div
              className="bg-violet-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{generationProgress}%</span>
        </div>
      )}
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 font-bold">Carregando formulário de geração...</div>}>
      <NewProjectForm />
    </Suspense>
  );
}
