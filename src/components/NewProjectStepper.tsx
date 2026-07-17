import React, { useState } from "react";
import { useStore } from "../store";
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
  Bookmark,
  Smartphone,
  Square,
  RectangleVertical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock
} from "lucide-react";
import { MOCK_UNSPLASH_IMAGES } from "../mocks";

export default function NewProjectStepper() {
  const { 
    brands, 
    generateCarouselWithAI, 
    isGenerating, 
    generationProgress, 
    generationStep, 
    setView,
    addNotification
  } = useStore();

  const [step, setStep] = useState(1);

  // Form states
  const [projectTitle, setProjectTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("educar");
  const [tone, setTone] = useState("profissional");
  const [slideCount, setSlideCount] = useState(7);
  const [cta, setCta] = useState("");
  const [observations, setObservations] = useState("");

  // Style states
  const [selectedBrandId, setSelectedBrandId] = useState(brands[0]?.id || "custom");
  const [format, setFormat] = useState<"vertical" | "square" | "story">("vertical");
  const [styleName, setStyleName] = useState("moderno");
  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#1e293b");

  // Image states
  const [imageFrequency, setImageFrequency] = useState("few");
  const [imageSource, setImageSource] = useState("unsplash");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleBrandChange = (brandId: string) => {
    setSelectedBrandId(brandId);
    if (brandId !== "custom") {
      const b = brands.find(brand => brand.id === brandId);
      if (b) {
        setPrimaryColor(b.primaryColor);
        setSecondaryColor(b.secondaryColor);
        setCta(b.defaultCta);
      }
    }
  };

  const handleImageToggle = (url: string) => {
    if (selectedImages.includes(url)) {
      setSelectedImages(selectedImages.filter(img => img !== url));
    } else {
      setSelectedImages([...selectedImages, url]);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!projectTitle.trim() || !theme.trim())) {
      addNotification("Campo Obrigatório", "Por favor preencha o Título e o Tema principal.", "warning");
      return;
    }
    setStep(step + 1);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const triggerGeneration = () => {
    setStep(5); // Show generation loading screen
    generateCarouselWithAI({
      title: projectTitle,
      theme,
      brandId: selectedBrandId,
      audience,
      goal,
      tone,
      slideCount,
      cta,
      format,
      imageOption: imageFrequency
    });
  };

  const stepsList = [
    { num: 1, label: "Conteúdo" },
    { num: 2, label: "Estilo" },
    { num: 3, label: "Imagens" },
    { num: 4, label: "Revisão" },
    { num: 5, label: "Geração" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      {step < 5 && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Criar Carrossel Inteligente</h2>
          <p className="text-xs text-slate-500 mt-1">Siga as etapas para configurar o tema e a identidade do seu carrossel.</p>
        </div>
      )}

      {/* Stepper Progress Bar */}
      {step < 5 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-violet-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / (stepsList.length - 2)) * 100}%` }}
            />
            {stepsList.slice(0, 4).map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step > s.num 
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-600/10" 
                      : step === s.num
                        ? "bg-violet-50 text-violet-700 ring-4 ring-violet-500/10 border-2 border-violet-600"
                        : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  {step > s.num ? <Check size={14} /> : s.num}
                </div>
                <span className={`text-[10px] font-bold mt-2 tracking-wide uppercase ${step === s.num ? "text-violet-700" : "text-slate-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main step container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* STEP 1: CONTEÚDO FORM */}
        {step === 1 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText size={18} className="text-violet-600" />
                Defina o Tema e o Conteúdo do Carrossel
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Estas informações orientam a IA para rascunhar títulos de alta conversão.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nome do Projeto *</label>
                <input
                  type="text"
                  placeholder="Ex: 5 Dicas para Sorriso Perfeito"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none transition-all text-slate-700"
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Público-Alvo</label>
                <input
                  type="text"
                  placeholder="Ex: Atletas amadores, esportistas"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none transition-all text-slate-700"
                />
              </div>

              {/* Tema Principal */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tema Principal / O que deseja falar? *</label>
                  <span className="text-[10px] text-slate-400 font-medium">{theme.length}/300</span>
                </div>
                <textarea
                  placeholder="Ex: Como cuidar da saúde bucal durante treinos e eventos esportivos de alta intensidade. Mencione hidratação, isotônicos e protetor bucal..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value.slice(0, 300))}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none transition-all text-slate-700 resize-none"
                />
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-[10px]">
                  <Sparkles size={12} className="text-emerald-600 flex-shrink-0" />
                  <span><strong>Sugestão da IA:</strong> Fale sobre como a boca seca reduz a saliva e eleva o risco de cáries em corredores de maratona.</span>
                </div>
              </div>

              {/* Slide Count selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Quantidade de Slides</label>
                  <span className="text-sm font-bold text-violet-700">{slideCount} Slides</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <p className="text-[10px] text-slate-400 italic">"Recomendado: 7 slides garantem excelente retenção sem cansar o leitor."</p>
              </div>

              {/* Primary Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Objetivo do Carrossel</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs outline-none transition-all text-slate-700"
                >
                  <option value="educar">Educar / Ensinar conceito</option>
                  <option value="vender">Vender produto ou serviço</option>
                  <option value="autoridade">Gerar Autoridade técnica</option>
                  <option value="engajamento">Aumentar Engajamento / Viralizar</option>
                </select>
              </div>

              {/* Tone of Communication */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tom da Comunicação</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs outline-none transition-all text-slate-700"
                >
                  <option value="profissional">Profissional & Técnico</option>
                  <option value="educativo">Educativo & Didático</option>
                  <option value="amigavel">Amigável & Próximo</option>
                  <option value="persuasivo">Persuasivo & Marcante</option>
                </select>
              </div>

              {/* Call to Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Chamada para Ação (CTA) final</label>
                <input
                  type="text"
                  placeholder="Ex: Agende um check-up esportivo na bio!"
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl text-xs outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ESTILO VISUAL */}
        {step === 2 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Palette size={18} className="text-violet-600" />
                Escolha a Identidade Visual e Formato
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Aplique as cores de uma marca cadastrada ou customize do zero.</p>
            </div>

            <div className="space-y-4">
              {/* Select Brand */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Selecionar Marca</label>
                <select
                  value={selectedBrandId}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs outline-none transition-all text-slate-700"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.instagramHandle})</option>
                  ))}
                  <option value="custom">Criar Cores Customizadas</option>
                </select>
              </div>

              {/* Quick style color previews */}
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: primaryColor }} />
                  <div className="w-8 h-8 rounded-full border border-slate-200" style={{ backgroundColor: secondaryColor }} />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Cores aplicadas automaticamente para o projeto com base na marca selecionada.
                </div>
              </div>

              {/* Format selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Formato das Imagens / Slides</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Vertical */}
                  <div 
                    onClick={() => setFormat("vertical")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      format === "vertical" ? "border-violet-600 bg-violet-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <RectangleVertical size={20} className={format === "vertical" ? "text-violet-600" : "text-slate-400"} />
                    <div className="text-left">
                      <p className="font-bold text-xs text-slate-800">Vertical (4:5)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">1080 × 1350 px (Instagram)</p>
                    </div>
                  </div>

                  {/* Square */}
                  <div 
                    onClick={() => setFormat("square")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      format === "square" ? "border-violet-600 bg-violet-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Square size={20} className={format === "square" ? "text-violet-600" : "text-slate-400"} />
                    <div className="text-left">
                      <p className="font-bold text-xs text-slate-800">Quadrado (1:1)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">1080 × 1080 px</p>
                    </div>
                  </div>

                  {/* Story */}
                  <div 
                    onClick={() => setFormat("story")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      format === "story" ? "border-violet-600 bg-violet-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Smartphone size={20} className={format === "story" ? "text-violet-600" : "text-slate-400"} />
                    <div className="text-left">
                      <p className="font-bold text-xs text-slate-800">Story / Reels (9:16)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">1080 × 1920 px</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Style Cards selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Estilo Temático</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "minimalista", label: "Minimalista", desc: "Limpo & Focado" },
                    { id: "moderno", label: "Moderno", desc: "SaaS & Tech" },
                    { id: "corporativo", label: "Corporativo", desc: "Sóbrio & Sólido" },
                    { id: "vibrante", label: "Vibrante", desc: "Chamativo & Alto" },
                  ].map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setStyleName(st.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all text-center space-y-1 ${
                        styleName === st.id 
                          ? "border-violet-600 bg-violet-50/10 shadow-xs font-bold" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <p className="text-xs text-slate-800">{st.label}</p>
                      <p className="text-[9px] text-slate-400">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELEÇÃO DE IMAGENS */}
        {step === 3 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <ImageIcon size={18} className="text-violet-600" />
                Como gostaria de utilizar Imagens?
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Defina a densidade e origem das ilustrações e fotos nos slides.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Frequency */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Densidade de Fotos</label>
                <select
                  value={imageFrequency}
                  onChange={(e) => setImageFrequency(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs outline-none transition-all text-slate-700"
                >
                  <option value="none">Sem Imagens (Apenas Texto e Gráficos)</option>
                  <option value="few">Imagens em poucos slides (Capa e CTA)</option>
                  <option value="half">Imagens em metade dos slides</option>
                  <option value="all">Imagens em todos os slides</option>
                </select>
              </div>

              {/* Image Source */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Origem das Imagens</label>
                <select
                  value={imageSource}
                  onChange={(e) => setImageSource(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-xs outline-none transition-all text-slate-700"
                >
                  <option value="unsplash">Banco de Imagens Público (Unsplash)</option>
                  <option value="upload">Upload Próprio</option>
                  <option value="ai">Gerar com Inteligência Artificial (Recurso Premium)</option>
                </select>
              </div>
            </div>

            {/* AI Option Highlight */}
            {imageSource === "ai" && (
              <div className="p-4 bg-violet-50 rounded-2xl border border-violet-200 flex items-start gap-3">
                <Sparkles className="text-violet-700 mt-0.5 flex-shrink-0" size={16} />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-violet-900">IA Premium Image Generation</p>
                  <p className="text-[10px] text-violet-700 leading-relaxed">
                    A geração de imagens sob medida consome 5 créditos adicionais por imagem gerada. Seu saldo atual é suficiente!
                  </p>
                </div>
              </div>
            )}

            {/* Unsplash Mock Grid favorites selection */}
            {imageSource === "unsplash" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Pré-selecionar Imagens de Preferência (Opcional)</label>
                  <span className="text-[10px] text-slate-400 font-semibold">{selectedImages.length} selecionadas</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {MOCK_UNSPLASH_IMAGES.slice(0, 6).map((img, idx) => {
                    const isSelected = selectedImages.includes(img.url);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleImageToggle(img.url)}
                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer relative border-2 transition-all ${
                          isSelected ? "border-violet-600 ring-4 ring-violet-600/10 scale-95" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt="Banco" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-violet-600/20 flex items-center justify-center">
                            <Check className="text-white font-bold" size={16} />
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

        {/* STEP 4: REVISÃO DE DADOS */}
        {step === 4 && (
          <div className="p-6 md:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 size={18} className="text-violet-600" />
                Revise suas Configurações de Geração
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Verifique as informações antes de solicitar a compilação por inteligência artificial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conteúdo & Objetivos</p>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p><strong>Título:</strong> {projectTitle}</p>
                  <p className="truncate"><strong>Tema:</strong> {theme}</p>
                  <p><strong>Público:</strong> {audience || "Geral"}</p>
                  <p><strong>Objetivo:</strong> {goal} | {tone}</p>
                  <p><strong>Nº de Slides:</strong> {slideCount} slides</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl space-y-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identidade Visual & Formato</p>
                <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <p><strong>Marca Aplicada:</strong> {selectedBrandId === "custom" ? "Customizada" : "Dental Clinic HQ"}</p>
                  <p><strong>Formato:</strong> {format.toUpperCase()}</p>
                  <p><strong>Tema Estético:</strong> {styleName.toUpperCase()}</p>
                  <p><strong>Imagens:</strong> {imageFrequency === "none" ? "Sem Imagens" : "Imagens pontuais"}</p>
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-violet-600 text-white rounded-2xl flex items-center justify-between shadow-md shadow-violet-600/10">
                <div className="flex items-center gap-3">
                  <Coins size={20} className="text-violet-200" />
                  <div>
                    <h5 className="font-bold text-xs text-white">Estimativa de Créditos</h5>
                    <p className="text-[10px] text-violet-200 mt-0.5">Consumirá apenas 10 créditos para rascunhar {slideCount} slides com legenda.</p>
                  </div>
                </div>
                <span className="text-lg font-black tracking-tight px-3 py-1 bg-white/20 rounded-lg">10 CR</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 border border-slate-200 leading-relaxed text-center">
              "A IA criará o conteúdo textual completo e escolherá os melhores templates estruturais para cada slide. Você poderá editar textos, imagens, cores e posições livremente depois."
            </div>
          </div>
        )}

        {/* STEP 5: SIMULATED PROCESSING SCREEN */}
        {step === 5 && (
          <div className="p-12 text-center space-y-8 min-h-[400px] flex flex-col justify-center items-center">
            
            {/* Pulsating Processing Rings */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-violet-200 animate-ping opacity-25" />
              <div className="absolute inset-2 rounded-full border-4 border-violet-100 animate-pulse" />
              <div className="w-16 h-16 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg relative z-10 animate-spin">
                <Loader2 size={28} />
              </div>
            </div>

            {/* Stepper Progress Texts */}
            <div className="space-y-2 max-w-sm">
              <h4 className="font-bold text-slate-800 text-sm">Gerando Carrossel Profissional</h4>
              <p className="text-xs text-violet-700 font-semibold animate-pulse">{generationStep}</p>
              <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mx-auto mt-4">
                <div 
                  className="h-full bg-violet-600 transition-all duration-300" 
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-bold block mt-1">{generationProgress}% Completo</span>
            </div>

            <p className="text-[10px] text-slate-400 italic">"Geralmente leva menos de 10 segundos. Por favor, aguarde enquanto alinhamos os pixels."</p>
          </div>
        )}

        {/* Sticky footer navigation wizard */}
        {step < 5 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <ArrowLeft size={14} /> Voltar
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setView("dashboard")}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
              >
                Cancelar
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                >
                  Continuar <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={triggerGeneration}
                  className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-95"
                >
                  <Sparkles size={14} />
                  <span>Gerar meu Carrossel</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
