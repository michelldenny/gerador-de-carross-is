"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProjectsStore, useBrandsStore, useUiStore, useCreditsStore } from "@/stores";
import { createProjectSchema } from "@/schemas";
import { z } from "zod";

type CreateProjectFormData = z.infer<typeof createProjectSchema>;
import { generateCarouselWithAI } from "@/services/mock-ai-service";
import { Project, Slide, SlideTemplateId } from "@/types";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Coins,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Palette,
  FileText,
  Smartphone,
  Square,
  RectangleVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { MOCK_UNSPLASH_IMAGES } from "@/mocks";

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useProjectsStore();
  const { brands } = useBrandsStore();
  const { addNotification, generationProgress, generationStep, isGenerating, setGenerationState } = useUiStore();
  const { consumeCredits } = useCreditsStore();

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{
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
  }>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
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
    },
  });

  const selectedFormat = watch("format");
  const selectedBrandId = watch("brandId");
  const selectedSlideCount = watch("slideCount");
  const selectedImageOption = watch("imageOption");

  const handleBrandChange = (brandId: string) => {
    setValue("brandId", brandId);
    const selectedBrand = brands.find((b) => b.id === brandId);
    if (selectedBrand) {
      setValue("cta", selectedBrand.defaultCta);
    }
  };

  const handleNextStep = () => {
    // Validar manualmente os campos da etapa 1 antes de prosseguir
    const titleVal = watch("title");
    const themeVal = watch("theme");
    const audienceVal = watch("audience");
    const goalVal = watch("goal");

    if (step === 1) {
      if (!titleVal || titleVal.length < 3) {
        addNotification("Erro", "Nome do projeto deve ter no mínimo 3 letras.", "warning");
        return;
      }
      if (!themeVal || themeVal.length < 3) {
        addNotification("Erro", "Tema do carrossel é obrigatório.", "warning");
        return;
      }
      if (!audienceVal || !goalVal) {
        addNotification("Erro", "Por favor, complete as opções de Conteúdo.", "warning");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const executeGeneration = async (formData: CreateProjectFormData) => {
    setStep(5); // Ir para tela de Geração IA
    setGenerationState(0, "Iniciando inteligência artificial...", true);

    const hasCredits = consumeCredits(10);
    if (!hasCredits) {
      addNotification("Créditos Insuficientes", "Você não possui créditos para esta geração. Renove seu plano.", "warning");
      setGenerationState(0, "", false);
      setStep(4);
      return;
    }

    try {
      // Simulação das etapas com progresso progressivo
      const stepsSim = [
        { progress: 15, msg: "Analisando o tema estratégico..." },
        { progress: 35, msg: "Estruturando roteiro pedagógico de slides..." },
        { progress: 55, msg: "Redigindo títulos de alto impacto..." },
        { progress: 75, msg: "Selecionando imagens de alta conversão..." },
        { progress: 90, msg: "Aplicando estilo da identidade de marca..." },
        { progress: 100, msg: "Finalizando formatação real do carrossel..." },
      ];

      // Disparar chamada de IA mockada em paralelo
      const aiResponsePromise = generateCarouselWithAI({
        title: formData.title,
        theme: formData.theme,
        brandId: formData.brandId,
        audience: formData.audience,
        goal: formData.goal,
        tone: formData.tone,
        slideCount: formData.slideCount,
        cta: formData.cta,
        format: formData.format,
        imageOption: formData.imageOption,
      });

      for (const s of stepsSim) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setGenerationState(s.progress, s.msg, true);
      }

      const aiResponse = await aiResponsePromise;

      // Converter o retorno da IA no modelo de dados do Projeto
      const brand = brands.find((b) => b.id === formData.brandId) || brands[0];
      const newProjectId = `proj-${Date.now()}`;

      const generatedSlides: Slide[] = aiResponse.slides.map((slideSim) => {
        // Encontrar uma imagem correspondente no mock do Unsplash se necessário
        let slideImg = undefined;
        if (slideSim.image?.required) {
          const matchingImgs = MOCK_UNSPLASH_IMAGES.filter(
            (img) => img.category === "dental" || img.category === "sports" || img.category === "business"
          );
          const randomImg = matchingImgs[Math.floor(Math.random() * matchingImgs.length)] || MOCK_UNSPLASH_IMAGES[0];
          slideImg = {
            url: randomImg.url,
            alt: slideSim.title || "Imagem decorativa",
            photographer: randomImg.photographer,
            positionX: 50,
            positionY: 50,
            zoom: 100,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            overlayOpacity: slideSim.image.overlay === "dark" ? 40 : 0,
          };
        }

        return {
          id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          order: slideSim.order,
          type: slideSim.type,
          template: slideSim.template as SlideTemplateId,
          title: slideSim.title,
          subtitle: slideSim.subtitle,
          body: slideSim.body,
          highlight: slideSim.highlight,
          cta: slideSim.cta,
          listItems: slideSim.listItems,
          image: slideImg,
          styles: {
            backgroundColor: brand?.backgroundColor || "#ffffff",
            textColor: brand?.textColor || "#1e293b",
            accentColor: brand?.primaryColor || "#7c3aed",
            fontFamily: brand?.fontFamily || "Inter",
          },
        };
      });

      const newProject: Project = {
        id: newProjectId,
        title: aiResponse.projectTitle,
        theme: formData.theme,
        status: "generated",
        width: formData.format === "vertical" ? 1080 : 1080,
        height: formData.format === "vertical" ? 1350 : formData.format === "square" ? 1080 : 1920,
        brandId: formData.brandId,
        slides: generatedSlides,
        caption: aiResponse.caption.text,
        hashtags: aiResponse.caption.hashtags,
        updatedAt: "Agora mesmo",
        format: formData.format,
      };

      addProject(newProject);
      setGenerationState(100, "Concluído!", false);
      addNotification("Carrossel gerado", `'${newProject.title}' está pronto no editor!`, "success");

      // Redireciona imediatamente para o editor físico do projeto criado
      router.push(`/projects/${newProjectId}/editor`);
    } catch (err) {
      console.error(err);
      addNotification("Falha na Geração", "Houve um erro simulado ao processar os dados.", "warning");
      setGenerationState(0, "", false);
      setStep(4);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      {step < 5 && (
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Criar Novo Carrossel</h2>
            <p className="text-xs text-slate-500 mt-1">Configuração orientada para geração automática por Inteligência Artificial.</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Etapa {step} de 4</span>
        </div>
      )}

      {/* Progress Steps header */}
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
                  {isCompleted ? <Check size={14} /> : s.stepNum}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${isActive ? "text-slate-800" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Step Contents */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <FileText size={16} className="text-violet-600" /> Detalhes de Conteúdo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Projeto *</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. 5 Regras de UI/UX"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tema do Carrossel *</label>
              <input
                type="text"
                {...register("theme")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold"
                placeholder="Ex. Odontologia esportiva para atletas de alto impacto"
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
                <option value="vender">Conversão direta de Leads / Vendas</option>
                <option value="autoridade">Fortalecer Autoridade de Marca</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tom de Voz *</label>
              <select
                {...register("tone")}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none text-slate-700 font-semibold cursor-pointer"
              >
                <option value="profissional">Profissional & Técnico</option>
                <option value="descontraido">Inspirador & Acessível</option>
                <option value="autoritario">Direto & Incisivo</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quantidade de Slides ({selectedSlideCount})</label>
              <input
                type="range"
                min="3"
                max="10"
                {...register("slideCount", { valueAsNumber: true })}
                className="w-full accent-violet-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
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

      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Palette size={16} className="text-violet-600" /> Identidade Visual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Selecionar Marca</label>
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

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Formato do Carrossel</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setValue("format", "vertical")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[10px] font-bold ${
                    selectedFormat === "vertical"
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  <RectangleVertical size={18} />
                  <span>Vertical (1080x1350)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("format", "square")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[10px] font-bold ${
                    selectedFormat === "square"
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  <Square size={16} />
                  <span>Quadrado (1080x1080)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setValue("format", "story")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[10px] font-bold ${
                    selectedFormat === "story"
                      ? "border-violet-600 bg-violet-50 text-violet-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-500"
                  }`}
                >
                  <Smartphone size={18} />
                  <span>Story (1080x1920)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Texto de Call to Action (CTA) Padrão</label>
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
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <ImageIcon size={16} className="text-violet-600" /> Utilização de Imagens
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Frequência de Imagens</label>
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
                <option value="unsplash">Pesquisa Automática no Unsplash</option>
                <option value="generation">Gerar imagens por IA (+1 crédito por imagem)</option>
                <option value="upload">Efetuar upload depois no Editor</option>
              </select>
            </div>
          </div>

          {selectedImageOption !== "none" && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-800 text-xs font-semibold">
              <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p>Otimização Inteligente</p>
                <p className="text-[10px] text-amber-700 font-normal mt-0.5 leading-relaxed">
                  Nossa IA buscará imagens condizentes com os termos do tema para preencher o fundo dos slides automaticamente.
                </p>
              </div>
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

      {step === 4 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-3">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h3 className="font-bold text-sm">Revisão de Configuração</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-slate-600">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Tema Estratégico</span>
              <span className="text-slate-800 font-bold text-sm block">{watch("theme")}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Formato</span>
                <span className="text-slate-800 font-bold uppercase">{selectedFormat}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">Total de Slides</span>
                <span className="text-slate-800 font-bold">{selectedSlideCount} slides</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 block uppercase">Identidade da Marca</span>
              <span className="text-slate-800 font-bold">
                {brands.find((b) => b.id === selectedBrandId)?.name || "Marca Própria"}
              </span>
            </div>

            {/* Estimated Custo */}
            <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-violet-400 uppercase font-black block">Custo Estimado</span>
                <span className="text-sm font-black text-violet-700 block mt-0.5">10 Créditos</span>
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
              <span>Gerar Carrossel de IA</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: IA Generation Loader overlay screen */}
      {step === 5 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-md flex flex-col items-center justify-center text-center gap-6 min-h-[420px] max-w-xl mx-auto animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-violet-100 rounded-full" />
            <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
            <Sparkles className="text-violet-600 w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-800">Gerando seu Carrossel Profissional...</h3>
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
