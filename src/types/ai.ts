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
  niche?: string;
  notes?: string;
  visualStyle?: string;
  imageSource?: string;
  imageCount?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
}

export interface ValidationViolation {
  code: string;
  severity: "error" | "warning";
  slide?: number;
  field?: string;
  message: string;
  kind: "deterministic" | "heuristic";
}

export interface CarouselValidationResult {
  valid: boolean;
  violations: ValidationViolation[];
}

export interface GenerationTrace {
  schemaVersion: string;
  rulesetVersion: string;
  validatorVersion: string;
  provider: string;
  promptHashes: Record<string, string>;
  retrievedChunkIds: string[];
  retrievedChunks: Array<{
    id: string;
    documentId: string;
    section: string;
    contentHash: string;
    tokenEstimate: number;
  }>;
}

export interface GenerateCarouselResult {
  carousel: AICarouselResponse;
  validation: CarouselValidationResult;
  trace: GenerationTrace;
}

export interface AICarouselResponse {
  projectTitle: string;
  strategy: {
    objective: string;
    targetAudience: string;
    tone: string;
    mainMessage: string;
    promise?: string;
  };
  caption: {
    text: string;
    hashtags: string[];
  };
  evidence?: Array<{
    id: string;
    claim: string;
    status: "verified" | "unverified" | "user-provided";
    sourceTitle?: string;
    sourceUrl?: string;
    publisher?: string;
    publicationDate?: string;
    accessedAt?: string;
  }>;
  slides: Array<{
    order: number;
    type: SlideType;
    template: SlideTemplateId;
    role?: "hook" | "mechanism" | "evidence" | "expansion" | "application" | "direction" | "closing" | "cta";
    blocks?: Array<{
      id: string;
      role: "label" | "headline" | "body" | "evidence" | "bridge" | "cta";
      text: string;
      evidenceIds?: string[];
    }>;
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
