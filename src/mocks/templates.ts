import { SlideTemplateId, CarouselFormat, SlideType } from "@/types";

export interface TemplateDefinition {
  id: SlideTemplateId;
  name: string;
  description: string;
  category: string;
  supportedFormats: CarouselFormat[];
  supportedSlideTypes: SlideType[];
  premium: boolean;
  thumbnail?: string;
}

export const MOCK_TEMPLATES: TemplateDefinition[] = [
  {
    id: "cover-image",
    name: "Capa com Imagem",
    description: "Ideal para capturar atenção usando uma foto expressiva de fundo.",
    category: "capa",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["cover"],
    premium: false
  },
  {
    id: "cover-minimal",
    name: "Capa Minimalista",
    description: "Design limpo, tipografia elegante e grande contraste.",
    category: "capa",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["cover"],
    premium: false
  },
  {
    id: "content-highlight",
    name: "Conteúdo Destacado",
    description: "Foco em um texto central com parte destacada na cor da marca.",
    category: "educativo",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: false
  },
  {
    id: "content-number",
    name: "Número Gigante",
    description: "Excelente para tópicos, passos ou estatísticas impactantes.",
    category: "lista",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: false
  },
  {
    id: "content-list",
    name: "Lista de Itens",
    description: "Exiba listas organizadas com marcadores de checklist modernos.",
    category: "lista",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: false
  },
  {
    id: "content-left-image",
    name: "Imagem na Esquerda",
    description: "Layout de duas colunas com imagem na esquerda e texto explicativo na direita.",
    category: "criativo",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: true
  },
  {
    id: "content-right-image",
    name: "Imagem na Direita",
    description: "Layout de duas colunas com imagem na direita e texto explicativo na esquerda.",
    category: "criativo",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: true
  },
  {
    id: "content-quote",
    name: "Citação em Foco",
    description: "Destaque frases de impacto ou depoimentos de clientes.",
    category: "citacao",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: false
  },
  {
    id: "comparison",
    name: "Comparação Dupla",
    description: "Duas caixas contrastantes para comparar conceitos, vilões vs. heróis.",
    category: "comparacao",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["content"],
    premium: true
  },
  {
    id: "cta-brand",
    name: "CTA & Marca",
    description: "Slide final focado em conversão e divulgação da marca e rede social.",
    category: "cta",
    supportedFormats: ["vertical", "square", "story"],
    supportedSlideTypes: ["cta"],
    premium: false
  }
];
