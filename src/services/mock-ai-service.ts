import { GenerateCarouselInput, AICarouselResponse } from "@/types";
import { aiCarouselResponseSchema } from "@/schemas";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateCarouselWithAI(
  input: GenerateCarouselInput
): Promise<AICarouselResponse> {
  // Simular delay de processamento da rede/IA
  await delay(3000);

  const isDental =
    input.theme.toLowerCase().includes("odonto") ||
    input.theme.toLowerCase().includes("dente") ||
    input.theme.toLowerCase().includes("bucal") ||
    input.theme.toLowerCase().includes("sorriso");

  let mockResponse: AICarouselResponse;

  if (isDental) {
    mockResponse = {
      projectTitle: `Carrossel: ${input.title}`,
      strategy: {
        objective: input.goal,
        targetAudience: input.audience,
        tone: input.tone,
        mainMessage: "Sua saúde bucal impacta diretamente sua saúde sistêmica e performance física.",
      },
      caption: {
        text: `Você sabia que a saúde da sua boca está diretamente ligada ao seu bem-estar geral? 🦷\n\nNegligenciar pequenos problemas bucais pode resultar em dores crônicas, baixa imunidade e queda no rendimento diário. Fique atento a estes sinais e proteja seu maior patrimônio.\n\nFale conosco no link da bio!`,
        hashtags: ["saudebucal", "prevencao", "qualidadedevida", "odonto"],
      },
      slides: [
        {
          order: 1,
          type: "cover",
          template: "cover-image",
          title: "Os Perigos Ocultos de Ignorar a Saúde Bucal",
          subtitle: "Cuidado Essencial",
          body: "Entenda como problemas nos dentes e gengivas afetam o restante do seu corpo sem você perceber.",
          cta: "Arrasta para o lado ➔",
          image: {
            required: true,
            searchTermPt: "dentista cuidados bucais",
            searchTermEn: "dentist dental care",
            description: "Cuidado bucal clínico",
            position: "background",
            overlay: "dark"
          }
        },
        {
          order: 2,
          type: "content",
          template: "content-highlight",
          title: "Bactérias Bucais e o Coração",
          subtitle: "Fato Científico",
          body: "Problemas periodontais graves (inflamações de gengiva) facilitam a entrada de bactérias na corrente sanguínea. Isso pode sobrecarregar seu sistema cardiovascular.",
          highlight: "sobrecarregar seu sistema cardiovascular"
        },
        {
          order: 3,
          type: "content",
          template: "content-number",
          title: "Queda na Imunidade Corporal",
          subtitle: "Sinal de Alerta",
          body: "O corpo gasta energia preciosa combatendo infecções bucais contínuas. Isso reduz as defesas naturais contra resfriados e infecções externas.",
          highlight: "02"
        },
        {
          order: 4,
          type: "content",
          template: "content-list",
          title: "Checklist de Prevenção Diária",
          subtitle: "Dicas de Ouro",
          body: "Siga estes passos simples para blindar sua saúde bucal e fortalecer seu corpo:",
          listItems: [
            "Escove os dentes pelo menos três vezes ao dia",
            "Use fio dental diariamente sem falta",
            "Beba água frequentemente para manter a salivação",
            "Consulte seu dentista regularmente a cada 6 meses"
          ]
        },
        {
          order: 5,
          type: "cta",
          template: "cta-brand",
          title: "Cuide do seu Sorriso Hoje",
          subtitle: "Dental Clinic",
          body: "Não espere a dor aparecer para marcar sua consulta preventiva. Nós cuidamos do seu sorriso com foco em saúde integral.",
          cta: input.cta || "Agendar Consulta Preventiva"
        }
      ]
    };
  } else {
    // Tema Genérico / Negócios / Marketing
    mockResponse = {
      projectTitle: `Carrossel: ${input.title}`,
      strategy: {
        objective: input.goal,
        targetAudience: input.audience,
        tone: input.tone,
        mainMessage: `Como dominar ${input.theme} de forma simples e pragmática.`,
      },
      caption: {
        text: `Quer aprender como dominar ${input.theme}? 📈\n\nEstruturamos este carrossel prático com os passos fundamentais para você aplicar agora e ter resultados consistentes. Não perca tempo e salve para consultar depois!\n\nLink na bio para mais informações.`,
        hashtags: ["sucesso", "marketing", "produtividade", "negocios"],
      },
      slides: [
        {
          order: 1,
          type: "cover",
          template: "cover-minimal",
          title: `Como Dominar ${input.theme} Sem Complicação`,
          subtitle: "Guia Prático",
          body: "O passo a passo estratégico e direto ao ponto para alavancar seus resultados e evitar erros comuns.",
          cta: "Arrasta para o lado ➔"
        },
        {
          order: 2,
          type: "content",
          template: "content-highlight",
          title: "O Primeiro Grande Erro",
          subtitle: "Passo 1",
          body: "Focar em técnicas avançadas antes de consolidar os fundamentos básicos. Sem uma base firme, seus resultados serão temporários e instáveis.",
          highlight: "consolidar os fundamentos básicos"
        },
        {
          order: 3,
          type: "content",
          template: "content-number",
          title: "Consistência Acima de Intensidade",
          subtitle: "Passo 2",
          body: "Fazer um pouco de forma consistente todos os dias gera resultados compostos absurdamente maiores do que picos curtos de esforço.",
          highlight: "02"
        },
        {
          order: 4,
          type: "content",
          template: "content-list",
          title: "Plano de Ação Imediato",
          subtitle: "Resumo",
          body: "Aqui está o que você precisa começar a fazer hoje mesmo:",
          listItems: [
            "Defina uma meta clara e mensurável para a semana",
            "Bloqueie 30 minutos diários sem distrações",
            "Monitore e meça os resultados obtidos",
            "Ajuste a rota com base nos dados, não em achismos"
          ]
        },
        {
          order: 5,
          type: "cta",
          template: "cta-brand",
          title: "Quer Ir Mais Longe?",
          subtitle: "Mais Detalhes",
          body: "Acelere seus resultados aplicando nossa metodologia completa e comprovada pelo mercado.",
          cta: input.cta || "Falar com Especialista"
        }
      ]
    };
  }

  // Validar a resposta com o schema Zod para garantir que obedece estritamente
  const parsed = aiCarouselResponseSchema.parse(mockResponse);
  return parsed;
}
