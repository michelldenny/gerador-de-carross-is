export interface SlideImage {
  id?: string;
  url: string;
  alt?: string;
  photographer?: string;
  source?: string;
  sourceUrl?: string;
  positionX: number; // percentage (e.g. 50)
  positionY: number; // percentage (e.g. 50)
  zoom: number; // percentage (e.g. 100)
  brightness: number; // e.g. 100
  contrast: number; // e.g. 100
  saturation: number; // e.g. 100
  overlayColor?: string;
  overlayOpacity: number; // 0 to 100
  photographerName?: string;
  photographerUrl?: string;
}

export interface SlideStyles {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  titleSize?: number;
  bodySize?: number;
  alignment?: "left" | "center" | "right";
}

export type SlideType = "cover" | "content" | "comparison" | "quote" | "cta";

export type SlideTemplateId =
  | "cover-image"
  | "cover-minimal"
  | "content-highlight"
  | "content-number"
  | "content-list"
  | "content-left-image"
  | "content-right-image"
  | "content-quote"
  | "comparison"
  | "cta-brand";

export interface Slide {
  id: string;
  order: number;
  type: SlideType;
  template: SlideTemplateId;
  title?: string;
  subtitle?: string;
  body?: string;
  highlight?: string; // used for accenting words/phrases
  cta?: string;
  listItems?: string[];
  image?: SlideImage;
  styles: SlideStyles;
}
