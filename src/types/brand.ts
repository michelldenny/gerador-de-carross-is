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
