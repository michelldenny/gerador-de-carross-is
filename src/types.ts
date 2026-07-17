export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  logoText?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  secondaryFontFamily?: string;
  instagramHandle: string;
  website?: string;
  phone?: string;
  defaultCta: string;
  projectCount: number;
}

export interface SlideImage {
  url: string;
  positionX: number; // percentage (e.g. 50)
  positionY: number; // percentage (e.g. 50)
  zoom: number; // e.g. 100 to 200
  brightness: number; // e.g. 100
  contrast: number; // e.g. 100
  overlayOpacity: number; // 0 to 100
  photographerName?: string;
  photographerUrl?: string;
}

export interface SlideStyles {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  titleSize?: number; // rem or px
  bodySize?: number; // rem or px
  alignment?: "left" | "center" | "right";
}

export interface Slide {
  id: string;
  order: number;
  type: "cover" | "content" | "comparison" | "quote" | "cta";
  template: string; // e.g. "cover-image" | "cover-minimal" | "content-highlight" | "content-number" | "content-list" | "content-left-image" | "content-right-image" | "content-quote" | "comparison" | "cta-brand"
  title?: string;
  subtitle?: string;
  body?: string;
  highlight?: string; // used for accenting words/phrases
  cta?: string;
  listItems?: string[];
  image?: SlideImage;
  styles: SlideStyles;
}

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
  format: "vertical" | "square" | "story";
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: string; // "Edit Text" | "Change Template" | "Reorder" | "Style Update"
  description: string;
  projectState: string; // stringified project state for restoring
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}
