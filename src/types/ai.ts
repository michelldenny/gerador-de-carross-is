import { SlideTemplateId, SlideType } from "./slide";

export type EditorialMode = "quick" | "custom" | "editorial";

export interface GenerateCarouselInput {
  editorialMode: EditorialMode;
  title: string;
  theme: string;
  brandId: string;
  audience: string;
  goal: string;
  tone: string;
  slideCount: number;
  cta: string;
  format: "vertical" | "square" | "story";
  imageOption: string;
}

export interface GenerationTrace {
  schemaVersion: string;
  rulesetVersion: string;
  validatorVersion: string;
  provider: string;
  retrievedChunkIds: string[];
}

export interface AICarouselResponse {
  projectTitle: string;
  strategy: {
    objective: string;
    targetAudience: string;
    tone: string;
    mainMessage: string;
  };
  caption: {
    text: string;
    hashtags: string[];
  };
  slides: Array<{
    order: number;
    type: SlideType;
    template: SlideTemplateId;
    title?: string;
    subtitle?: string;
    body?: string;
    highlight?: string;
    cta?: string;
    listItems?: string[];
    image?: {
      required: boolean;
      searchTermPt?: string;
      searchTermEn?: string;
      description?: string;
      position?: "background" | "left" | "right";
      overlay?: "none" | "light" | "dark";
    };
  }>;
}
