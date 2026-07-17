import "server-only";
import { generateCarouselWithAI } from "@/services/mock-ai-service";
import type { AIProvider } from "./types";

export const mockProvider: AIProvider = {
  id: "mock",
  async generateCarousel(input, _context) {
    return generateCarouselWithAI(input);
  },
};
