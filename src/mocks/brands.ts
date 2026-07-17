import { Brand } from "@/types";

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
