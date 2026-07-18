import { Slide } from "./slide";
import type {
  CarouselValidationResult,
  EditorialMode,
  EditorialReview,
  GenerationTrace,
  AppliedCorrection,
} from "./ai";

export type CarouselFormat = "vertical" | "square" | "story";

export interface Project {
  id: string;
  title: string;
  theme: string;
  status: "draft" | "generated" | "published" | "archived";
  width: number; // e.g. 1080
  height: number; // e.g. 1350
  brandId: string;
  slides: Slide[];
  caption: string;
  hashtags: string[];
  updatedAt: string;
  format: CarouselFormat;
  creationMode?: EditorialMode;
  generationMetadata?: {
    trace: GenerationTrace;
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
    generatedAt: string;
  };
}
