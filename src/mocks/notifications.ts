import { Notification } from "@/types";

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
