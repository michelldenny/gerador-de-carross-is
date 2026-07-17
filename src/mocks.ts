import { Brand, Project, Slide, Notification } from "./types";

export const MOCK_BRANDS: Brand[] = [
  {
    id: "brand-1",
    name: "Dental Clinic HQ",
    logoText: "DentalHQ",
    primaryColor: "#7c3aed", // Violeta profundo
    secondaryColor: "#1e293b", // Cinza-grafite escuro
    accentColor: "#059669", // Verde esmeralda para CTAs
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontFamily: "Inter",
    instagramHandle: "@dentalclinichq",
    website: "www.dentalclinichq.com.br",
    phone: "(11) 99999-8888",
    defaultCta: "Agende uma consulta no link da bio!",
    projectCount: 2
  },
  {
    id: "brand-2",
    name: "Alex Design Co.",
    logoText: "AlexDesign",
    primaryColor: "#2563eb", // Azul royal
    secondaryColor: "#0f172a", // Marinho escuro
    accentColor: "#f59e0b", // Âmbar de destaque
    backgroundColor: "#fafafa",
    textColor: "#0f172a",
    fontFamily: "Inter",
    instagramHandle: "@alexdesign.co",
    website: "www.alexdesign.co",
    defaultCta: "Conheça nosso portfólio no link da bio",
    projectCount: 2
  },
  {
    id: "brand-3",
    name: "GrowthMetric",
    logoText: "GrowthM",
    primaryColor: "#db2777", // Rosa choque / magenta
    secondaryColor: "#111827",
    accentColor: "#10b981", // Verde vivo
    backgroundColor: "#ffffff",
    textColor: "#111827",
    fontFamily: "Inter",
    instagramHandle: "@growthmetric",
    defaultCta: "Baixe nosso E-book gratuito na bio",
    projectCount: 1
  }
];

export const MOCK_TEMPLATES = [
  { id: "cover-image", name: "Capa com Imagem", category: "capa", type: "cover", premium: false },
  { id: "cover-minimal", name: "Capa Minimalista", category: "capa", type: "cover", premium: false },
  { id: "content-highlight", name: "Conteúdo Destacado", category: "educativo", type: "content", premium: false },
  { id: "content-number", name: "Número Gigante", category: "lista", type: "content", premium: false },
  { id: "content-list", name: "Lista de Itens", category: "lista", type: "content", premium: false },
  { id: "content-left-image", name: "Imagem na Esquerda", category: "criativo", type: "content", premium: true },
  { id: "content-right-image", name: "Imagem na Direita", category: "criativo", type: "content", premium: true },
  { id: "content-quote", name: "Citação em Foco", category: "citacao", type: "content", premium: false },
  { id: "comparison", name: "Comparação Dupla", category: "comparacao", type: "content", premium: true },
  { id: "cta-brand", name: "CTA & Marca", category: "cta", type: "cta", premium: false }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Carrossel gerado com sucesso!",
    message: "A IA concluiu a criação de 'Saúde Bucal no Esporte'. Pronto para edição.",
    time: "Há 5 min",
    read: false,
    type: "success"
  },
  {
    id: "notif-2",
    title: "Créditos renovados",
    message: "Seu plano Pro foi renovado. 150 novos créditos disponíveis.",
    time: "Há 1 dia",
    read: true,
    type: "info"
  },
  {
    id: "notif-3",
    title: "Exportação Concluída",
    message: "Seu carrossel 'Design Portfolio 2024' foi exportado em alta resolução PNG.",
    time: "Há 2 dias",
    read: true,
    type: "success"
  }
];

// Complete 7-slide Dental sports carousel project
const DENTAL_SLIDES: Slide[] = [
  {
    id: "dental-slide-1",
    order: 1,
    type: "cover",
    template: "cover-image",
    title: "Sorriso de Campeão: Saúde Bucal & Esporte",
    subtitle: "DENTAL CLINIC HQ",
    body: "Descubra como o cuidado com os dentes influencia diretamente o seu rendimento físico e previne lesões.",
    cta: "Arrasta para o lado ➔",
    image: {
      url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800", // Athletic workout / run context
      positionX: 50,
      positionY: 40,
      zoom: 110,
      brightness: 100,
      contrast: 100,
      overlayOpacity: 45,
      photographerName: "Unsplash Athlete",
    },
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      accentColor: "#7c3aed",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-2",
    order: 2,
    type: "content",
    template: "content-highlight",
    title: "O impacto bucal no seu rendimento físico",
    subtitle: "Dica 1",
    body: "Infecções ou problemas periodontais silenciosos podem reduzir seu rendimento físico em até 15%! Bactérias na boca podem cair na corrente sanguínea, afetando articulações e retardando a recuperação muscular.",
    highlight: "reduzir seu rendimento físico em até 15%",
    styles: {
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      accentColor: "#7c3aed",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-3",
    order: 3,
    type: "content",
    template: "content-number",
    title: "A Respiração Bucal e a Boca Seca nos Treinos",
    subtitle: "Dica 2",
    body: "Respirar muito pela boca durante exercícios intensos seca a saliva. Sem a proteção natural dela, a acidez bucal sobe, facilitando cáries e erosão do esmalte. Beba água constantemente para lavar a boca!",
    highlight: "02",
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      accentColor: "#7c3aed",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-4",
    order: 4,
    type: "content",
    template: "content-list",
    title: "Checklist de Proteção nos Esportes de Impacto",
    subtitle: "Dica 3",
    body: "Seja futebol, basquete ou ciclismo, os dentes estão expostos. Proteja-se de fraturas graves com passos simples:",
    listItems: [
      "Use protetor bucal personalizado feito pelo dentista",
      "Evite usar protetores genéricos (eles machucam e soltam fácil)",
      "Mantenha o protetor higienizado em estojo próprio",
      "Visite o dentista antes do início de temporadas de treinos"
    ],
    styles: {
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      accentColor: "#7c3aed",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-5",
    order: 5,
    type: "content",
    template: "comparison",
    title: "Bebidas Isotônicas vs. Água Mineral nos Treinos",
    subtitle: "Dica 4",
    body: "Isotônicos são ótimos para reposição eletrolítica, mas têm alta acidez e açúcar. Veja a recomendação:",
    listItems: [
      "ISOTÔNICOS: Altamente erosivos se consumidos sem bochechar água depois.",
      "ÁGUA PURA: Hidrata perfeitamente, estimula a saliva e limpa os dentes das impurezas."
    ],
    styles: {
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      accentColor: "#7c3aed",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-6",
    order: 6,
    type: "content",
    template: "content-quote",
    title: "A opinião dos especialistas em Medicina Esportiva",
    subtitle: "Dica 5",
    body: "Atletas de elite dedicam grande parte de seu tempo à saúde bucal. Prevenir dores agudas inesperadas antes de uma competição crucial é a diferença entre o ouro e a desqualificação por desconforto físico.",
    highlight: "Dra. Ana Silveira, Odontopediatra e Odontóloga do Esporte",
    styles: {
      backgroundColor: "#7c3aed",
      textColor: "#ffffff",
      accentColor: "#34d399",
      fontFamily: "Inter"
    }
  },
  {
    id: "dental-slide-7",
    order: 7,
    type: "cta",
    template: "cta-brand",
    title: "Pronto para o Próximo Treino?",
    subtitle: "@dentalclinichq",
    body: "Melhore seu rendimento físico cuidando de quem protege seu corpo. Faça um check-up preventivo completo com nossos especialistas.",
    cta: "Agendar Avaliação de Performance",
    styles: {
      backgroundColor: "#1e293b",
      textColor: "#ffffff",
      accentColor: "#059669",
      fontFamily: "Inter"
    }
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Saúde Bucal & Performance",
    theme: "saude bucal esportiva dental clinic",
    status: "draft",
    width: 1080,
    height: 1350,
    brandId: "brand-1",
    slides: DENTAL_SLIDES,
    caption: `🥇 Você sabia que a sua saúde bucal pode influenciar o seu rendimento físico nos treinos em até 15%? 

Muitos atletas focam apenas na nutrição e no fortalecimento muscular, mas esquecem que infecções silenciosas na gengiva ou dentes desalinhados gastam energia preciosa do corpo e elevam o risco de lesões musculares!

Preparamos esse carrossel completo com 5 dicas essenciais de cuidados bucais para você colocar em prática hoje mesmo e proteger seu sorriso de campeão. 

👉 Ficou com alguma dúvida ou quer agendar seu check-up de performance esportiva? Clique no link da nossa bio e fale diretamente conosco!

#saudebucal #odontologiaesportiva #performance #atleta #sorrisosaudavel #treino #futebol #corrida #dentalclinichq`,
    hashtags: ["saudebucal", "performance", "atleta", "dentalclinichq"],
    updatedAt: "Há 2 horas",
    format: "vertical"
  },
  {
    id: "proj-2",
    title: "Design Portfolio 2026",
    theme: "Minimalismo no design de interfaces",
    status: "generated",
    width: 1080,
    height: 1350,
    brandId: "brand-2",
    slides: [
      {
        id: "p2-s1",
        order: 1,
        type: "cover",
        template: "cover-minimal",
        title: "A Arte do Minimalismo no UI Design moderno",
        subtitle: "ALEX DESIGN CO.",
        body: "Como remover o excesso para criar interfaces elegantes e focadas na conversão do usuário.",
        cta: "Arrastar para o lado ➔",
        styles: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          accentColor: "#2563eb",
          fontFamily: "Inter"
        }
      },
      {
        id: "p2-s2",
        order: 2,
        type: "content",
        template: "content-highlight",
        title: "Espaço em Branco não é espaço desperdiçado",
        subtitle: "Conceito 1",
        body: "Dar espaço para os elementos respirarem guia os olhos do seu cliente para as ações mais importantes. Menos ruído visual significa maior foco no CTA.",
        highlight: "guia os olhos do seu cliente para as ações",
        styles: {
          backgroundColor: "#ffffff",
          textColor: "#0f172a",
          accentColor: "#2563eb",
          fontFamily: "Inter"
        }
      },
      {
        id: "p2-s3",
        order: 3,
        type: "cta",
        template: "cta-brand",
        title: "Crie Projetos Conosco",
        subtitle: "@alexdesign.co",
        body: "Quer transformar sua marca com designs limpos e profissionais? Fale conosco no direct.",
        cta: "Solicitar Orçamento de Design",
        styles: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          accentColor: "#f59e0b",
          fontFamily: "Inter"
        }
      }
    ],
    caption: "O design minimalista não é sobre ter pouco, é sobre ter o essencial. Acesse nosso link e melhore o UI da sua marca! #uidesign #minimalismo #branding #webdesign",
    hashtags: ["uidesign", "minimalismo", "branding"],
    updatedAt: "Ontem",
    format: "vertical"
  },
  {
    id: "proj-3",
    title: "Métricas que Realmente Importam",
    theme: "Marketing Digital no Instagram",
    status: "draft",
    width: 1080,
    height: 1080,
    brandId: "brand-3",
    slides: [
      {
        id: "p3-s1",
        order: 1,
        type: "cover",
        template: "cover-image",
        title: "Parem de olhar apenas para Curtidas!",
        subtitle: "GROWTHMETRIC",
        body: "As métricas de vaidade não enchem o bolso. Veja o que realmente traz conversões de clientes.",
        cta: "Veja as métricas ➔",
        image: {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
          positionX: 50,
          positionY: 50,
          zoom: 100,
          brightness: 100,
          contrast: 100,
          overlayOpacity: 50
        },
        styles: {
          backgroundColor: "#111827",
          textColor: "#ffffff",
          accentColor: "#db2777",
          fontFamily: "Inter"
        }
      },
      {
        id: "p3-s2",
        order: 2,
        type: "cta",
        template: "cta-brand",
        title: "Domine seu Growth",
        subtitle: "@growthmetric",
        body: "Precisa de ajuda para estruturar seus funis de marketing? Acesse nossa bio.",
        cta: "Baixar Manual de Métricas",
        styles: {
          backgroundColor: "#111827",
          textColor: "#ffffff",
          accentColor: "#10b981",
          fontFamily: "Inter"
        }
      }
    ],
    caption: "Curtidas não pagam boletos! Entenda as métricas que realmente geram leads e vendas reais no seu negócio. #growthhacking #leads #vendas #marketingdigital",
    hashtags: ["growthhacking", "marketing", "leads"],
    updatedAt: "Há 3 dias",
    format: "square"
  },
  {
    id: "proj-4",
    title: "5 Regras de Ouro de UI/UX",
    theme: "Dicas de Design para SaaS",
    status: "published",
    width: 1080,
    height: 1920,
    brandId: "brand-2",
    slides: [
      {
        id: "p4-s1",
        order: 1,
        type: "cover",
        template: "cover-minimal",
        title: "5 Regras de Ouro de UI/UX para SaaS",
        subtitle: "ALEX DESIGN CO.",
        body: "Regras simples para aumentar a ativação de usuários na sua plataforma web.",
        cta: "Próximo ➔",
        styles: {
          backgroundColor: "#fafafa",
          textColor: "#0f172a",
          accentColor: "#2563eb",
          fontFamily: "Inter"
        }
      },
      {
        id: "p4-s2",
        order: 2,
        type: "cta",
        template: "cta-brand",
        title: "Acelere seu SaaS",
        subtitle: "@alexdesign.co",
        body: "Quer auditar a experiência do usuário do seu SaaS? Entre em contato agora.",
        cta: "Agendar Auditoria Gratuita",
        styles: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          accentColor: "#2563eb",
          fontFamily: "Inter"
        }
      }
    ],
    caption: "Aumente a retenção e o engajamento dos seus usuários focando no básico bem feito! Confira as 5 regras de UI/UX. #uxdesign #saas #productdesign",
    hashtags: ["uxdesign", "saas", "designsystem"],
    updatedAt: "Há 1 semana",
    format: "story"
  },
  {
    id: "proj-5",
    title: "Hábitos de Performance Bucal",
    theme: "Higiene esportiva",
    status: "archived",
    width: 1080,
    height: 1350,
    brandId: "brand-1",
    slides: [
      {
        id: "p5-s1",
        order: 1,
        type: "cover",
        template: "cover-minimal",
        title: "Hábitos Rápidos para Proteger seu Sorriso",
        subtitle: "DENTAL CLINIC HQ",
        body: "Guia express de rotina bucal para quem tem o dia corrido ou treina em alto nível.",
        cta: "Começar ➔",
        styles: {
          backgroundColor: "#ffffff",
          textColor: "#1e293b",
          accentColor: "#7c3aed",
          fontFamily: "Inter"
        }
      },
      {
        id: "p5-s2",
        order: 2,
        type: "cta",
        template: "cta-brand",
        title: "Agende Conosco",
        subtitle: "@dentalclinichq",
        body: "Cuide da saúde bucal sem perder tempo. Atendimento rápido e focado em bem-estar.",
        cta: "Agendar Consulta Expressa",
        styles: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          accentColor: "#059669",
          fontFamily: "Inter"
        }
      }
    ],
    caption: "Até na correria dá para manter dentes saudáveis. Siga nossa rotina bucal prática de 2 minutos! #dentalclinichq #sorriso #cuidadobucal #habito",
    hashtags: ["saudebucal", "sorrisosaudavel"],
    updatedAt: "Há 2 semanas",
    format: "vertical"
  }
];

export const MOCK_UNSPLASH_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=800",
    photographer: "Jonathan Chng",
    category: "sports"
  },
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    photographer: "Sven Mieke",
    category: "sports"
  },
  {
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    photographer: "Cedric d'Alby",
    category: "dental"
  },
  {
    url: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
    photographer: "Diana Polekhina",
    category: "dental"
  },
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    photographer: "Carlos Muza",
    category: "business"
  },
  {
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    photographer: "Luke Peters",
    category: "design"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    photographer: "Sean Oulashin",
    category: "nature"
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    photographer: "Sujith Devanagari",
    category: "business"
  },
  {
    url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800",
    photographer: "Irene Kredenets",
    category: "objects"
  }
];
