import { create } from "zustand";
import { Notification } from "@/types";
import { MOCK_NOTIFICATIONS } from "@/mocks";

interface UiState {
  // Modals
  isPreviewModalOpen: boolean;
  isExportModalOpen: boolean;
  isShareModalOpen: boolean;
  isImageSearchModalOpen: boolean;
  setPreviewModal: (open: boolean) => void;
  setExportModal: (open: boolean) => void;
  setShareModal: (open: boolean) => void;
  setImageSearchModal: (open: boolean) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (title: string, message: string, type: Notification["type"]) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Generation
  generationProgress: number;
  generationStep: string;
  isGenerating: boolean;
  setGenerationState: (progress: number, step: string, generating: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isPreviewModalOpen: false,
  isExportModalOpen: false,
  isShareModalOpen: false,
  isImageSearchModalOpen: false,
  setPreviewModal: (open) => set({ isPreviewModalOpen: open }),
  setExportModal: (open) => set({ isExportModalOpen: open }),
  setShareModal: (open) => set({ isShareModalOpen: open }),
  setImageSearchModal: (open) => set({ isImageSearchModalOpen: open }),

  notifications: MOCK_NOTIFICATIONS,
  addNotification: (title, message, type) =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title,
          message,
          time: "Agora mesmo",
          read: false,
          type,
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),

  generationProgress: 0,
  generationStep: "",
  isGenerating: false,
  setGenerationState: (progress, step, generating) =>
    set({ generationProgress: progress, generationStep: step, isGenerating: generating }),
}));
