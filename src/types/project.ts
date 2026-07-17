import { Slide } from "./slide";

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
}
