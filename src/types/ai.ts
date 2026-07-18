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
  status: "approved" | "approved_with_warnings" | "rejected";
  violations: ValidationViolation[];
}

export interface EditorialReview {
  approved: boolean;
  scores: {
    grammar: number;
    fluency: number;
    antiAiSlop: number;
    facts: number;
    structure: number;
    density: number;
    editorialTone: number;
  };
  notes: string[];
}

export interface AppliedCorrection {
  attempt: number;
  slide?: number;
  field: string;
  codes: string[];
  previousValueHash: string;
  newValueHash: string;
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
  retrieval: {
    version: string;
    operation: string;
    tokenBudget: number;
    selectedTokenEstimate: number;
    selectedCount: number;
  };
}

export interface GenerateCarouselResult {
  carousel: AICarouselResponse;
  validation: CarouselValidationResult;
  review: EditorialReview;
  corrections: AppliedCorrection[];
  approval: {
    schemaValid: boolean;
    deterministicallyValid: boolean;
    factuallyVerified: boolean;
    editoriallyApproved: boolean;
    visuallyApproved: boolean;
  };
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
    evidenceIds?: string[];
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
